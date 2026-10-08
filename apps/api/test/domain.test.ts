import { describe, expect, it } from "vitest";
import { canTransition } from "../src/domain.js";
import {
  observationAnalysisSchema,
  comparisonSchema,
} from "@fieldissue/shared";

describe("deterministic issue state", () => {
  it("allows explicit resolution and reopening but prevents invalid status changes", () => {
    expect(canTransition("OPEN", "RESOLVED")).toBe(true);
    expect(canTransition("RESOLVED", "OPEN")).toBe(true);
    expect(canTransition("REJECTED", "IN_PROGRESS")).toBe(false);
    expect(canTransition("IN_PROGRESS", "ACKNOWLEDGED")).toBe(false);
  });
  it("rejects malformed model output", () => {
    expect(
      observationAnalysisSchema.safeParse({ suggestedCategory: "MAGIC" })
        .success,
    ).toBe(false);
    expect(
      comparisonSchema.safeParse({ summary: "fixed", confidence: 2 }).success,
    ).toBe(false);
  });
});
