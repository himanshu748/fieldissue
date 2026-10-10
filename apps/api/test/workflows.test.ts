import { expect, it } from "vitest";
import { runCreateWorkflow, runRevisitWorkflow } from "../src/workflows.js";
const analysis = {
  objects: ["bench"],
  conditions: ["broken slat"],
  suggestedCategory: "INFRASTRUCTURE" as const,
  suggestedSeverity: "MEDIUM" as const,
  evidence: ["slat detached"],
  confidence: 0.9,
  model: "fixture",
  modelVersion: "1",
};
const comparison = {
  outcome: "CHANGED" as const,
  comparabilityReason: "Same synthetic bench fixture",
  sameSubjectEvidence: ["matching synthetic frame"],
  summary: "repaired",
  removed: ["broken slat"],
  added: ["new slat"],
  unchanged: ["frame"],
  recommendedStatus: "RESOLVED" as const,
  confidence: 0.8,
  model: "fixture",
  modelVersion: "1",
};
it("orchestrates analysis, nearby lookup and deterministic persistence in order", async () => {
  const calls: string[] = [];
  const result = await runCreateWorkflow(
    {
      title: "Bench",
      description: "",
      note: "broken",
      latitude: 12,
      longitude: 77,
    },
    {
      analyze: async () => {
        calls.push("analyze");
        return analysis;
      },
      nearby: async () => {
        calls.push("nearby");
        return [];
      },
      persist: async () => {
        calls.push("persist");
        return "00000000-0000-4000-8000-000000000001";
      },
      metadata: async () => {
        calls.push("metadata");
        return { available: false };
      },
    },
  );
  expect(calls).toEqual(["analyze", "nearby", "persist", "metadata"]);
  expect(result.issueId).toBe("00000000-0000-4000-8000-000000000001");
});
it("never persists malformed model output", async () => {
  let persisted = false;
  await expect(
    runCreateWorkflow(
      { description: "", note: "", latitude: 12, longitude: 77 },
      {
        analyze: async () => ({ bad: true }) as never,
        nearby: async () => [],
        persist: async () => {
          persisted = true;
          return "";
        },
        metadata: async () => ({}),
      },
    ),
  ).rejects.toThrow();
  expect(persisted).toBe(false);
});
it("revisit returns status recommendation without performing status mutation", async () => {
  const calls: string[] = [];
  const output = await runRevisitWorkflow(
    {
      issueId: "00000000-0000-4000-8000-000000000001",
      beforeObservationId: "00000000-0000-4000-8000-000000000002",
      afterObservationId: "00000000-0000-4000-8000-000000000003",
    },
    {
      load: async () => {
        calls.push("load");
      },
      compare: async () => {
        calls.push("compare");
        return comparison;
      },
      persist: async (result) => {
        calls.push("persist");
        return { ...result, id: "diff" };
      },
      metadata: async () => {
        calls.push("metadata");
        return { available: false };
      },
    },
  );
  expect(calls).toEqual(["load", "compare", "persist", "metadata"]);
  expect(output.diff.recommendedStatus).toBe("RESOLVED");
});
