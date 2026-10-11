// Recorded synthetic measurements. No provider call is made here.
import { readFileSync, writeFileSync } from "node:fs";
const source = "docs/verification/tabpfn-learning-curve-2026-10-11.json";
const data = JSON.parse(readFileSync(source, "utf8"));
const curve = {
  recordedAt: data.createdAt,
  decisionRule: data.decisionRule,
  decisionImplementation: data.decisionImplementation,
  useful: data.tabpfnUsefulUnderRule,
  evidenceUrl: `https://github.com/himanshu748/fieldissue/blob/main/${source}`,
  chartUrl: "/assets/evaluation/tabpfn-learning-curve-2026-10-11.svg",
  confidenceIntervalMethod: data.confidenceIntervalMethod,
  points: data.points.map(({ trainRows, summary, pairedAucDifferenceVsLogistic }) =>
    ({ trainRows, summary, pairedAucDifferenceVsLogistic })),
};
writeFileSync("apps/api/src/tabpfn-curve.ts",
  "// Generated from reviewed evidence by scripts/generate-tabpfn-curve.mjs.\n" +
  "export const tabpfnLearningCurve = " + JSON.stringify(curve, null, 2) + ";\n");
