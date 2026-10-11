import { readFileSync } from "node:fs";
import { expect, test } from "vitest";
import { tabpfnLearningCurve } from "../src/tabpfn-demo.js";

test("recorded TabPFN curve includes every baseline and preserves the failed decision", () => {
  const source = JSON.parse(
    readFileSync(
      new URL(
        "../../../docs/verification/tabpfn-learning-curve-2026-10-11.json",
        import.meta.url,
      ),
      "utf8",
    ),
  );
  expect(tabpfnLearningCurve.points).toEqual(
    source.points.map(
      ({ trainRows, summary, pairedAucDifferenceVsLogistic }: any) => ({
        trainRows,
        summary,
        pairedAucDifferenceVsLogistic,
      }),
    ),
  );
  expect(tabpfnLearningCurve.useful).toBe(false);
  expect(tabpfnLearningCurve.decisionRule).toBe(source.decisionRule);
  expect(tabpfnLearningCurve.recordedAt).toBe(source.createdAt);
  expect(tabpfnLearningCurve.points.map((p) => p.trainRows)).toEqual([
    32, 64, 128, 256, 512, 1024,
  ]);
  for (const point of source.points) {
    expect(point.runs).toHaveLength(5);
    expect(Object.keys(point.summary).sort()).toEqual([
      "hist_gradient_boosting",
      "logistic_regression",
      "majority",
      "oracle",
      "tabpfn",
    ]);
    for (const run of point.runs) {
      expect(run.probabilities.tabpfn).toHaveLength(500);
      expect(run.provider.providerMetadata.classes).toEqual([0, 1]);
    }
  }
});
