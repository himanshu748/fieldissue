// Publish only the already-reviewed synthetic evaluation, never database notes.
import { readFileSync, writeFileSync } from "node:fs";
const source = "docs/verification/tinker-evaluation-2026-10-09.json";
const evaluation = JSON.parse(readFileSync(source, "utf8"));
const examples = {
  recordedAt: evaluation.createdAt,
  model: evaluation.provenance.baseModel,
  modelVersion: evaluation.provenance.checkpoint,
  evidenceUrl: `https://github.com/himanshu748/fieldissue/blob/main/${source}`,
  samples: evaluation.samples.map(({ id, note, target, basePrediction, fineTunedPrediction }) =>
    ({ id, note, target, basePrediction, fineTunedPrediction })),
};
writeFileSync("apps/api/src/tinker-examples.ts",
  "// Generated from the public synthetic evaluation by scripts/generate-tinker-examples.mjs.\n" +
  "export const tinkerExamples = " + JSON.stringify(examples, null, 2) + ";\n");
