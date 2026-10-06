import { z } from "zod";

export const categorySchema = z.enum([
  "CLEANLINESS",
  "INFRASTRUCTURE",
  "ACCESSIBILITY",
  "SAFETY",
  "ENVIRONMENT",
  "SIGNAGE",
  "LIGHTING",
  "TRAIL",
  "OTHER",
]);
export const severitySchema = z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]);
export const statusSchema = z.enum([
  "OPEN",
  "ACKNOWLEDGED",
  "IN_PROGRESS",
  "RESOLVED",
  "REJECTED",
]);
const boundedList = z.array(z.string().trim().min(1).max(500)).max(30);
export const observationAnalysisSchema = z
  .object({
    objects: boundedList,
    conditions: boundedList,
    suggestedCategory: categorySchema,
    suggestedSeverity: severitySchema,
    evidence: boundedList,
    confidence: z.number().min(0).max(1),
    model: z.string().min(1).max(200),
    modelVersion: z.string().min(1).max(200),
  })
  .strict();
export const comparisonSchema = z
  .object({
    summary: z.string().min(1).max(2000),
    removed: boundedList,
    added: boundedList,
    unchanged: boundedList,
    recommendedStatus: statusSchema,
    confidence: z.number().min(0).max(1),
    model: z.string().min(1).max(200),
    modelVersion: z.string().min(1).max(200),
  })
  .strict();
export const predictionSchema = z
  .object({
    probabilityChanged: z.number().min(0).max(1),
    priorityScore: z.number().min(0).max(1),
    modelVersion: z.string().min(1).max(200),
  })
  .strict();
export type Status = z.infer<typeof statusSchema>;
export type Analysis = z.infer<typeof observationAnalysisSchema>;
export type Comparison = z.infer<typeof comparisonSchema>;
export type Prediction = z.infer<typeof predictionSchema>;
const coordinate = (min: number, max: number) =>
  z
    .union([z.number(), z.string().trim().min(1).transform(Number)])
    .pipe(z.number().finite().min(min).max(max));
export const observationInputSchema = z
  .object({
    note: z.string().trim().max(5000).default(""),
    latitude: coordinate(-90, 90),
    longitude: coordinate(-180, 180),
    capturedAt: z.iso.datetime({ offset: true }).optional(),
  })
  .strict();
export const createIssueSchema = observationInputSchema.extend({
  title: z.string().trim().min(1).max(200).optional(),
  description: z.string().trim().max(5000).default(""),
  category: categorySchema.optional(),
  severity: severitySchema.optional(),
  reporterId: z.uuid().optional(),
});
export const patchIssueSchema = z
  .object({
    title: z.string().trim().min(1).max(200).optional(),
    description: z.string().trim().max(5000).optional(),
    category: categorySchema.optional(),
    severity: severitySchema.optional(),
    status: statusSchema.optional(),
  })
  .strict()
  .refine((v) => Object.keys(v).length > 0, "At least one update is required");
export type CreateIssueInput = z.infer<typeof createIssueSchema>;
export type ObservationInput = z.infer<typeof observationInputSchema>;
export type PatchIssueInput = z.infer<typeof patchIssueSchema>;
