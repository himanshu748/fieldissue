import { readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { expect, test, vi } from "vitest";
import { tinkerSystemPromptV3 } from "../src/tinker-prompt.js";
import { tinkerExamples } from "../src/tinker-examples.js";
import { createApp } from "../src/app.js";

test("public Tinker examples preserve all four recorded outputs and both source slices", () => {
  const source = JSON.parse(
    readFileSync(
      new URL(
        "../../../docs/verification/tinker-evaluation-2026-10-11.json",
        import.meta.url,
      ),
      "utf8",
    ),
  );
  expect(tinkerExamples.modelVersion).toBe(source.provenance.checkpoint);
  expect(tinkerExamples.recordedAt).toBe(source.createdAt);
  expect(tinkerExamples.samples).toEqual(
    source.samples.map(
      ({ id, note, target, language, source, provenance, outputs }: any) => ({
        id,
        note,
        target,
        language,
        source,
        ...(provenance.sourceUrl ? { sourceUrl: provenance.sourceUrl } : {}),
        basePrediction: outputs.zero_shot.prediction,
        fewShotPrediction: outputs.few_shot.prediction,
        fineTunedPrediction: outputs.fine_tuned_seed42.prediction,
        secondSeedPrediction: outputs.fine_tuned_seed1729.prediction,
        rawOutputs: Object.fromEntries(
          [
            "zero_shot",
            "few_shot",
            "fine_tuned_seed42",
            "fine_tuned_seed1729",
          ].map((name) => [name, outputs[name].raw]),
        ),
      }),
    ),
  );
  expect(tinkerExamples.samples).toHaveLength(234);
  expect(
    tinkerExamples.samples.filter((s) => s.source === "public-source"),
  ).toHaveLength(30);
  expect(tinkerExamples.samples.some((s) => s.basePrediction === null)).toBe(
    true,
  );
  expect(
    tinkerExamples.samples.some((s) => s.secondSeedPrediction === null),
  ).toBe(true);
  expect(tinkerExamples.summary).toHaveLength(8);
  for (const summary of tinkerExamples.summary) {
    const metric = source.metrics[summary.slice][summary.model].overall;
    expect(summary.categoryAccuracy).toBe(metric.values.categoryAccuracy);
    expect(summary.schemaRate).toBe(metric.values.schemaRate);
    expect(summary.costlyErrorRate).toBe(
      metric.values.severityOffByMoreThanOneRate,
    );
  }
});

test("the production v3 prompt exactly matches the evaluated prompt", () => {
  const source = JSON.parse(
    readFileSync(
      new URL(
        "../../../docs/verification/tinker-evaluation-2026-10-11.json",
        import.meta.url,
      ),
      "utf8",
    ),
  );
  expect(tinkerSystemPromptV3).toBe(source.provenance.systemPrompt);
});

test("a fresh public visitor can read recorded examples without a provider or private database query", async () => {
  const query = vi.fn(() => {
    throw new Error("No private query allowed for recorded examples");
  });
  const app = createApp({
    repository: { pool: { query } } as any,
    service: {} as any,
    storage: {} as any,
    accessToken: randomUUID(),
    publicAccess: true,
    maxUploadBytes: 1024,
  });
  const response = await app.request("/v1/model-lab/evaluations");
  expect(response.status).toBe(200);
  const body = await response.json();
  expect(body.tinkerExamples).toEqual(tinkerExamples);
  expect(body.evaluations.every((e: { serving: boolean }) => !e.serving)).toBe(
    true,
  );
  expect(query).not.toHaveBeenCalled();
});
