import { reserveModelAllowance } from "./model-allowance.js";
import { createHash, randomUUID } from "node:crypto";
import { z } from "zod";
import type { Pool } from "pg";
import { AppError } from "./errors.js";
import { trace } from "./telemetry.js";

export const demoFeaturesSchema = z
  .object({
    days_since_last_observation: z.number().int().min(1).max(30),
    previous_observation_count: z.number().int().min(1).max(8),
    issue_age_days: z.number().int().min(1).max(120),
    severity: z.number().int().min(0).max(3),
    category: z.number().int().min(0).max(8),
    nearby_issue_count: z.number().int().min(0).max(14),
    previous_change_count: z.number().int().min(0).max(7),
    status: z.number().int().min(0).max(2),
  })
  .strict()
  .refine(
    (x) =>
      x.issue_age_days >= x.days_since_last_observation &&
      x.previous_change_count < x.previous_observation_count,
    "Scenario chronology is invalid",
  );
export type DemoFeatures = z.infer<typeof demoFeaturesSchema>;
export const demoFeatureNames = [
  "days_since_last_observation",
  "previous_observation_count",
  "issue_age_days",
  "severity",
  "category",
  "nearby_issue_count",
  "previous_change_count",
  "status",
] as const;

export class TabPFNDemoProvider {
  constructor(
    private key: string,
    readonly fittedModelId: string,
    private fetcher: typeof fetch = fetch,
  ) {}
  async predict(input: DemoFeatures) {
    const features = demoFeaturesSchema.parse(input);
    const started = Date.now();
    const signal = AbortSignal.timeout(45000);
    const post = async (path: string, data: unknown) => {
      const r = await this.fetcher(`https://api.priorlabs.ai/tabpfn/${path}`, {
        method: "POST",
        signal,
        redirect: "error",
        headers: {
          Authorization: `Bearer ${this.key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!r.ok)
        throw new AppError(
          "TABPFN_UNAVAILABLE",
          503,
          "TabPFN's free API is unavailable or its quota is exhausted.",
        );
      return r.json();
    };
    const quote = await post("estimate_cost", {
      model_version: "v3.5",
      operation: "predict",
      train_rows: 96,
      test_rows: 1,
      raw_columns: 8,
      n_estimators: 8,
    });
    if (
      !Number.isFinite(quote.estimated_cost) ||
      quote.estimated_cost < 0 ||
      quote.estimated_cost > 50000
    )
      throw new AppError(
        "TABPFN_QUOTA_BOUND",
        503,
        "The prediction exceeds the free demo's token allowance.",
      );
    const prep = await post("prepare_test_set_upload", {
      fitted_train_set_id: this.fittedModelId,
      x_test_info: { format: "csv" },
    });
    const info = prep.x_test_info;
    const url = new URL(info?.signed_urls?.[0]);
    if (
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      !(
        url.hostname === "storage.googleapis.com" ||
        url.hostname.endsWith(".storage.googleapis.com")
      )
    )
      throw new AppError(
        "INVALID_PROVIDER_RESPONSE",
        502,
        "TabPFN returned an unexpected upload destination.",
      );
    // Credentials stay on api.priorlabs.ai; signed storage receives only numeric synthetic scenario features.
    const uploaded = await this.fetcher(url, {
      method: "PUT",
      signal,
      redirect: "error",
      headers: info.required_headers ?? {},
      body:
        demoFeatureNames.join(",") +
        "\n" +
        demoFeatureNames.map((k) => features[k]).join(",") +
        "\n",
    });
    if (!uploaded.ok)
      throw new AppError(
        "TABPFN_UNAVAILABLE",
        503,
        "The scenario could not be uploaded.",
      );
    const body = await post("predict", {
      test_set_upload_id: prep.test_set_upload_id,
      fitted_train_set_id: this.fittedModelId,
      task_config: {
        task: "classification",
        tabpfn_config: { model_path: "v3.5_default", n_estimators: 8 },
        predict_params: { output_type: "probas" },
      },
    });
    if (
      body.metadata?.billing_model_version !== "v3.5" ||
      body.metadata?.n_estimators !== 8 ||
      JSON.stringify(body.metadata?.classes) !== "[0,1]"
    )
      throw new AppError(
        "INVALID_PROVIDER_RESPONSE",
        502,
        "TabPFN returned unexpected model or class provenance.",
      );
    const probabilities = z
      .array(z.tuple([z.number().min(0).max(1), z.number().min(0).max(1)]))
      .length(1)
      .parse(body.prediction)[0]!;
    if (Math.abs(probabilities[0] + probabilities[1] - 1) > 0.001)
      throw new AppError(
        "INVALID_MODEL_OUTPUT",
        502,
        "The scenario probabilities were invalid.",
      );
    return {
      probability: probabilities[1],
      model: "TabPFN-3.5",
      provider: "Prior Labs",
      trainingData: "synthetic",
      trainingRows: 96,
      datasetVersion: "fieldissue-synthetic-revisit-v1",
      features,
      changesIssueStatus: false,
      usedForWalkRanking: false,
      latencyMs: Date.now() - started,
      createdAt: new Date().toISOString(),
      estimatedTokens: quote.estimated_cost,
    };
  }
}
export class TabPFNDemoService {
  constructor(
    private pool: Pool,
    private provider: TabPFNDemoProvider,
  ) {}
  async predict(input: DemoFeatures, guestId?: string) {
    const features = demoFeaturesSchema.parse(input);
    const key = createHash("sha256")
      .update(
        JSON.stringify([
          this.provider.fittedModelId,
          demoFeatureNames.map((k) => features[k]),
        ]),
      )
      .digest("hex");
    const cached = (
      await this.pool.query(
        "SELECT result FROM prediction_demo_cache WHERE cache_key=$1 AND status='complete'",
        [key],
      )
    ).rows[0];
    if (cached) return { ...cached.result, cached: true };
    const token = randomUUID();
    const claimed = await this.pool.query(
      `INSERT INTO prediction_demo_cache(cache_key,status,lease_token) VALUES($1,'pending',$2)
      ON CONFLICT(cache_key) DO UPDATE SET status='pending',lease_token=$2,updated_at=now()
      WHERE (prediction_demo_cache.status='failed' AND prediction_demo_cache.updated_at<now()-interval '1 minute') OR (prediction_demo_cache.status='pending' AND prediction_demo_cache.updated_at<now()-interval '3 minutes') RETURNING cache_key`,
      [key, token],
    );
    if (!claimed.rowCount)
      throw new AppError(
        "TABPFN_BUSY",
        409,
        "This scenario is pending or recently failed. Retry in a minute.",
      );
    try {
      await reserveModelAllowance(this.pool, "tabpfn-demo", 100, guestId);
      const result = await trace("TabPFN revisit prediction", "ai.tabpfn", () =>
        this.provider.predict(features),
      );
      const saved = await this.pool.query(
        "UPDATE prediction_demo_cache SET status='complete',result=$3,updated_at=now() WHERE cache_key=$1 AND lease_token=$2 RETURNING cache_key",
        [key, token, JSON.stringify(result)],
      );
      if (!saved.rowCount)
        throw new AppError(
          "TABPFN_BUSY",
          409,
          "A newer request owns this scenario.",
        );
      return { ...result, cached: false };
    } catch (error) {
      await this.pool.query(
        "UPDATE prediction_demo_cache SET status='failed',updated_at=now() WHERE cache_key=$1 AND lease_token=$2",
        [key, token],
      );
      throw error instanceof AppError
        ? error
        : new AppError(
            "TABPFN_UNAVAILABLE",
            503,
            "The synthetic scenario model is temporarily unavailable.",
          );
    }
  }
}
