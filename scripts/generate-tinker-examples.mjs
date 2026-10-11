// Publish reviewed evaluation records only. Never fetch database notes.
import { readFileSync, writeFileSync } from "node:fs";
const source = "docs/verification/tinker-evaluation-2026-10-11.json";
const evaluation = JSON.parse(readFileSync(source, "utf8"));
const names = [
  "zero_shot",
  "few_shot",
  "fine_tuned_seed42",
  "fine_tuned_seed1729",
];
const examples = {
  recordedAt: evaluation.createdAt,
  model: evaluation.provenance.baseModel,
  modelVersion: evaluation.provenance.checkpoint,
  evidenceUrl: `https://github.com/himanshu748/fieldissue/blob/main/${source}`,
  summary: Object.entries(evaluation.metrics).flatMap(([slice, models]) =>
    Object.entries(models).map(([model, metrics]) => ({
      slice,
      model,
      n: metrics.overall.n,
      severityAccuracy: metrics.overall.values.severityAccuracy,
      schemaRate: metrics.overall.values.schemaRate,
      categoryAccuracy: metrics.overall.values.categoryAccuracy,
      costlyErrorRate: metrics.overall.values.severityOffByMoreThanOneRate,
      ci95: metrics.overall.bootstrap95.severityAccuracy,
      macroF1: metrics.overall.values.severityMacroF1,
    })),
  ),
  samples: evaluation.samples.map(
    ({ id, note, target, language, source, provenance, outputs }) => {
      if (
        !names.every(
          (name) => outputs[name] && Object.hasOwn(outputs[name], "prediction"),
        )
      )
        throw new Error("An evaluation model output is missing");
      return {
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
          names.map((name) => [name, outputs[name].raw]),
        ),
      };
    },
  ),
};
writeFileSync(
  "apps/api/src/tinker-examples.ts",
  "// Generated from reviewed evaluation evidence by scripts/generate-tinker-examples.mjs.\n" +
    "export const tinkerExamples = " +
    JSON.stringify(examples, null, 2) +
    ";\n",
);
