import { describe, expect, it } from "vitest";
import { comparisonSchema } from "@fieldissue/shared";
const output = {
  summary: "The views are not comparable due to different subject matter.",
  removed: [],
  added: ["scattered litter"],
  unchanged: [],
  recommendedStatus: "OPEN",
  confidence: 0.9,
  model: "gemma",
  modelVersion: "001",
  outcome: "NOT_COMPARABLE",
  comparabilityReason: "Different trees",
  sameSubjectEvidence: [],
};
describe("comparison evidence integrity", () => {
  it("rejects the real contradictory not-comparable result", () => {
    expect(comparisonSchema.safeParse(output).success).toBe(false);
  });
  it("requires explicit subject evidence before claiming an unchanged result", () => {
    expect(
      comparisonSchema.safeParse({
        ...output,
        outcome: "UNCHANGED",
        added: [],
        unchanged: ["branches remain"],
      }).success,
    ).toBe(false);
  });
  it("accepts a conservative not-comparable result without change claims", () => {
    expect(
      comparisonSchema.safeParse({ ...output, added: [], confidence: 0 })
        .success,
    ).toBe(true);
  });
  it("rejects a comparable outcome whose reason disclaims comparability", () => {
    expect(
      comparisonSchema.safeParse({
        ...output,
        outcome: "CHANGED",
        summary: "Litter appeared",
        sameSubjectEvidence: ["tree"],
        comparabilityReason: "These views are not comparable",
      }).success,
    ).toBe(false);
  });
  it("rejects legacy output without a comparability assessment", () => {
    const { outcome, comparabilityReason, sameSubjectEvidence, ...legacy } =
      output;
    expect(comparisonSchema.safeParse(legacy).success).toBe(false);
  });
});
