import { createStep, createWorkflow } from "@mastra/core/workflows";
import { z } from "zod";
import {
  createIssueSchema,
  observationAnalysisSchema,
  comparisonSchema,
  type CreateIssueInput,
  type Analysis,
  type Comparison,
} from "@fieldissue/shared";
import { AppError } from "./errors.js";
import { trace } from "./telemetry.js";

export function validatedAnalysis(value: unknown) {
  const parsed = observationAnalysisSchema.safeParse(value);
  if (!parsed.success)
    throw new AppError(
      "INVALID_MODEL_OUTPUT",
      502,
      "Evidence provider returned malformed structured output",
    );
  return parsed.data;
}
function validatedComparison(value: unknown) {
  const parsed = comparisonSchema.safeParse(value);
  if (!parsed.success)
    throw new AppError(
      "INVALID_MODEL_OUTPUT",
      502,
      "Evidence provider returned malformed structured output",
    );
  return parsed.data;
}
type Metadata = Record<string, unknown>;
type Nearby = Record<string, unknown>[];
interface CreateCallbacks {
  analyze(input: CreateIssueInput): Promise<Analysis>;
  nearby(input: CreateIssueInput, analysis: Analysis): Promise<Nearby>;
  persist(
    input: CreateIssueInput,
    analysis: Analysis,
    nearby: Nearby,
  ): Promise<string>;
  metadata(
    issueId: string,
    input: CreateIssueInput,
    analysis: Analysis,
    nearby: Nearby,
  ): Promise<Metadata>;
}
const nearbySchema = z.array(z.record(z.string(), z.unknown()));
const analyzedSchema = z.object({
  input: createIssueSchema,
  analysis: observationAnalysisSchema,
});
const locatedSchema = analyzedSchema.extend({ nearbyIssues: nearbySchema });
const persistedSchema = locatedSchema.extend({ issueId: z.uuid() });
const createOutputSchema = z.object({
  issueId: z.uuid(),
  nearbyIssues: nearbySchema,
  revisitMetadata: z.record(z.string(), z.unknown()),
});

/** Only metadata crosses workflow steps. Image bytes remain in the caller's closure. */
export async function runCreateWorkflow(
  input: CreateIssueInput,
  callbacks: CreateCallbacks,
) {
  let failure: unknown;
  const guarded = <T>(fn: () => Promise<T>) =>
    fn().catch((error) => {
      failure = error;
      throw new Error("Field observation workflow step failed");
    });
  const validate = createStep({
    id: "validate-observation",
    inputSchema: createIssueSchema,
    outputSchema: createIssueSchema,
    execute: async ({ inputData }) => createIssueSchema.parse(inputData),
  });
  const analyze = createStep({
    id: "gemma-evidence-analysis",
    inputSchema: createIssueSchema,
    outputSchema: analyzedSchema,
    execute: async ({ inputData }) =>
      guarded(async () => ({
        input: inputData,
        analysis: validatedAnalysis(await callbacks.analyze(inputData)),
      })),
  });
  const normalize = createStep({
    id: "normalize-classification",
    inputSchema: analyzedSchema,
    outputSchema: analyzedSchema,
    execute: async ({ inputData }) => ({
      ...inputData,
      analysis: observationAnalysisSchema.parse(inputData.analysis),
    }),
  });
  const nearby = createStep({
    id: "check-nearby-issues",
    inputSchema: analyzedSchema,
    outputSchema: locatedSchema,
    execute: async ({ inputData }) =>
      guarded(async () => ({
        ...inputData,
        nearbyIssues: await callbacks.nearby(
          inputData.input,
          inputData.analysis,
        ),
      })),
  });
  const persist = createStep({
    id: "persist-issue-and-observation",
    inputSchema: locatedSchema,
    outputSchema: persistedSchema,
    execute: async ({ inputData }) =>
      guarded(async () => ({
        ...inputData,
        issueId: await callbacks.persist(
          inputData.input,
          inputData.analysis,
          inputData.nearbyIssues,
        ),
      })),
  });
  const metadata = createStep({
    id: "calculate-revisit-metadata",
    inputSchema: persistedSchema,
    outputSchema: createOutputSchema,
    execute: async ({ inputData }) =>
      guarded(async () => ({
        issueId: inputData.issueId,
        nearbyIssues: inputData.nearbyIssues,
        revisitMetadata: await callbacks.metadata(
          inputData.issueId,
          inputData.input,
          inputData.analysis,
          inputData.nearbyIssues,
        ),
      })),
  });
  const workflow = createWorkflow({
    id: "new-field-observation",
    inputSchema: createIssueSchema,
    outputSchema: createOutputSchema,
  })
    .then(validate)
    .then(analyze)
    .then(normalize)
    .then(nearby)
    .then(persist)
    .then(metadata)
    .commit();
  const run = await workflow.createRun();
  const result = await trace("Mastra workflow", "ai.workflow", () =>
    run.start({ inputData: input }),
  );
  if (result.status !== "success")
    throw (
      failure ??
      new AppError("WORKFLOW_FAILED", 503, "Field observation workflow failed")
    );
  return result.result;
}

const revisitInputSchema = z
  .object({
    issueId: z.uuid(),
    beforeObservationId: z.uuid(),
    afterObservationId: z.uuid(),
  })
  .strict();
const comparedSchema = revisitInputSchema.extend({
  comparison: comparisonSchema,
});
const revisitedSchema = comparedSchema.extend({
  diff: z.record(z.string(), z.unknown()),
});
const revisitOutputSchema = z.object({
  diff: z.record(z.string(), z.unknown()),
  revisitMetadata: z.record(z.string(), z.unknown()),
  recommendedStatus: comparisonSchema.shape.recommendedStatus,
});
export async function runRevisitWorkflow(
  input: z.infer<typeof revisitInputSchema>,
  callbacks: {
    load(): Promise<void>;
    compare(): Promise<Comparison>;
    persist(comparison: Comparison): Promise<Record<string, unknown>>;
    metadata(): Promise<Metadata>;
  },
) {
  let failure: unknown;
  const guarded = <T>(fn: () => Promise<T>) =>
    fn().catch((error) => {
      failure = error;
      throw new Error("Revisit workflow step failed");
    });
  const load = createStep({
    id: "load-original-issue",
    inputSchema: revisitInputSchema,
    outputSchema: revisitInputSchema,
    execute: async ({ inputData }) =>
      guarded(async () => {
        await callbacks.load();
        return inputData;
      }),
  });
  const compare = createStep({
    id: "gemma-compare-observations",
    inputSchema: revisitInputSchema,
    outputSchema: comparedSchema,
    execute: async ({ inputData }) =>
      guarded(async () => ({
        ...inputData,
        comparison: validatedComparison(await callbacks.compare()),
      })),
  });
  const persist = createStep({
    id: "persist-real-world-diff-and-event",
    inputSchema: comparedSchema,
    outputSchema: revisitedSchema,
    execute: async ({ inputData }) =>
      guarded(async () => ({
        ...inputData,
        diff: await callbacks.persist(inputData.comparison),
      })),
  });
  const metadata = createStep({
    id: "update-tabpfn-features",
    inputSchema: revisitedSchema,
    outputSchema: revisitOutputSchema,
    execute: async ({ inputData }) =>
      guarded(async () => ({
        diff: inputData.diff,
        revisitMetadata: await callbacks.metadata(),
        recommendedStatus: inputData.comparison.recommendedStatus,
      })),
  });
  const workflow = createWorkflow({
    id: "revisit-field-issue",
    inputSchema: revisitInputSchema,
    outputSchema: revisitOutputSchema,
  })
    .then(load)
    .then(compare)
    .then(persist)
    .then(metadata)
    .commit();
  const run = await workflow.createRun();
  const result = await trace("Mastra workflow", "ai.workflow", () =>
    run.start({ inputData: input }),
  );
  if (result.status !== "success")
    throw (
      failure ?? new AppError("WORKFLOW_FAILED", 503, "Revisit workflow failed")
    );
  return result.result;
}
