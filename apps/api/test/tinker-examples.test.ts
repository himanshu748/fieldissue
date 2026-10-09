import { readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { expect, test, vi } from "vitest";
import { tinkerExamples } from "../src/tinker-examples.js";
import { createApp } from "../src/app.js";

test("public Tinker examples preserve all recorded synthetic outputs including errors", () => {
  const source = JSON.parse(
    readFileSync(
      new URL(
        "../../../docs/verification/tinker-evaluation-2026-10-09.json",
        import.meta.url,
      ),
      "utf8",
    ),
  );
  expect(tinkerExamples.modelVersion).toBe(source.provenance.checkpoint);
  expect(tinkerExamples.recordedAt).toBe(source.createdAt);
  expect(tinkerExamples.samples).toEqual(
    source.samples.map(
      ({ id, note, target, basePrediction, fineTunedPrediction }: any) => ({
        id,
        note,
        target,
        basePrediction,
        fineTunedPrediction,
      }),
    ),
  );
  expect(tinkerExamples.samples).toHaveLength(18);
  expect(
    tinkerExamples.samples.some(
      (s) => s.fineTunedPrediction.category !== s.target.category,
    ),
  ).toBe(true);
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
