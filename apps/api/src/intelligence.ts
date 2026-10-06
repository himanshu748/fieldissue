import {
  observationAnalysisSchema,
  comparisonSchema,
  predictionSchema,
  type Analysis,
  type Comparison,
  type Prediction,
} from "@fieldissue/shared";
import type { z } from "zod";
import { AppError } from "./errors.js";
import { trace } from "./telemetry.js";
export interface EvidenceInput {
  image_base64: string;
  mime_type: string;
  note: string;
  evidence?: Analysis;
}
export interface IntelligenceProvider {
  analyze(input: EvidenceInput): Promise<Analysis>;
  compare(input: {
    before: EvidenceInput;
    after: EvidenceInput;
  }): Promise<Comparison>;
  predict(features: Record<string, string | number>): Promise<Prediction>;
}
export class IntelligenceClient implements IntelligenceProvider {
  constructor(
    private readonly baseUrl: string,
    private readonly token: string,
    private readonly timeoutMs = 15000,
    private readonly retries = 1,
    private readonly fetcher: typeof fetch = fetch,
  ) {}
  private async call<T>(
    path: string,
    input: unknown,
    schema: z.ZodType<T>,
  ): Promise<T> {
    for (let attempt = 0; attempt <= this.retries; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.timeoutMs);
      try {
        const response = await this.fetcher(new URL(path, this.baseUrl), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Internal-Token": this.token,
          },
          body: JSON.stringify(input),
          signal: controller.signal,
        });
        if (!response.ok) {
          const error = new AppError(
            "PROVIDER_UNAVAILABLE",
            503,
            "Intelligence provider unavailable",
          );
          if (response.status !== 429 && response.status < 500) throw error;
          if (attempt === this.retries) throw error;
        } else {
          let json: unknown;
          try {
            json = await response.json();
          } catch {
            throw new AppError(
              "INVALID_MODEL_OUTPUT",
              502,
              "Intelligence returned malformed JSON",
            );
          }
          const parsed = schema.safeParse(json);
          if (!parsed.success)
            throw new AppError(
              "INVALID_MODEL_OUTPUT",
              502,
              "Intelligence returned malformed structured output",
            );
          return parsed.data;
        }
      } catch (error) {
        if (error instanceof AppError) throw error;
        if (attempt === this.retries)
          throw new AppError(
            controller.signal.aborted
              ? "PROVIDER_TIMEOUT"
              : "PROVIDER_UNAVAILABLE",
            503,
            controller.signal.aborted
              ? "Intelligence request timed out"
              : "Intelligence provider unavailable",
          );
      } finally {
        clearTimeout(timer);
      }
      await new Promise((r) => setTimeout(r, 100 * 2 ** attempt));
    }
    throw new AppError(
      "PROVIDER_UNAVAILABLE",
      503,
      "Intelligence provider unavailable",
    );
  }
  analyze(input: EvidenceInput) {
    return trace("Gemma evidence analysis", "ai.gemma", () =>
      this.call("/internal/analyze", input, observationAnalysisSchema),
    );
  }
  compare(input: { before: EvidenceInput; after: EvidenceInput }) {
    return trace("Gemma evidence comparison", "ai.gemma", () =>
      this.call("/internal/compare", input, comparisonSchema),
    );
  }
  predict(features: Record<string, string | number>) {
    return trace("TabPFN revisit prediction", "ai.tabpfn", () =>
      this.call("/internal/predict/revisit", features, predictionSchema),
    );
  }
  async ready() {
    try {
      const r = await this.fetcher(new URL("/ready", this.baseUrl), {
        signal: AbortSignal.timeout(this.timeoutMs),
      });
      return r.ok;
    } catch {
      return false;
    }
  }
}
