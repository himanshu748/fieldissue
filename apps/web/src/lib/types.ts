import type { Analysis, Comparison, Status } from "@fieldissue/shared";

export type { Analysis, Comparison, Status };

export const STATUSES = [
  "OPEN",
  "ACKNOWLEDGED",
  "IN_PROGRESS",
  "RESOLVED",
  "REJECTED",
] as const satisfies readonly Status[];

export const CATEGORIES = [
  "CLEANLINESS",
  "INFRASTRUCTURE",
  "ACCESSIBILITY",
  "SAFETY",
  "ENVIRONMENT",
  "SIGNAGE",
  "LIGHTING",
  "TRAIL",
  "OTHER",
] as const satisfies readonly Analysis["suggestedCategory"][];

export const SEVERITIES = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "CRITICAL",
] as const satisfies readonly Analysis["suggestedSeverity"][];

export type Category = (typeof CATEGORIES)[number];
export type Severity = (typeof SEVERITIES)[number];
export type LocationSource = "device" | "manual" | "inherited" | "unspecified";

export interface PlaceContext {
  name: string;
  address?: string;
  source: "SerpApi";
  providerPlaceId?: string;
}

export interface Observation {
  id: string;
  issueId: string;
  note: string;
  mediaUrl: string;
  storageKey: string;
  mimeType: string;
  latitude: number;
  longitude: number;
  capturedAt: string;
  createdAt: string;
  aiAnalysis: Partial<Analysis>;
  locationSource: LocationSource;
  captureTimeSource: "user" | "upload" | "unspecified";
  previousObservationId?: string | null;
}

export interface Issue {
  id: string;
  publicId: string;
  title: string;
  description: string;
  category: Category;
  severity: Severity;
  status: Status;
  latitude: number;
  longitude: number;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
  placeContext?: PlaceContext | null;
  observations?: Observation[];
}

export interface IssueList {
  items: Issue[];
  nextCursor: string | null;
}

export interface NearbyIssue {
  id: string;
  publicId: string;
  title: string;
}

export interface CreateIssueResult extends Issue {
  observations: Observation[];
  nearbyIssues?: NearbyIssue[];
  replayed?: boolean;
}

export interface Diff extends Comparison {
  id: string;
  issueId: string;
  beforeObservationId: string;
  afterObservationId: string;
  createdAt: string;
}

export interface AddObservationResult {
  observation: Observation & { replayed?: boolean };
  realWorldDiff?: Diff | null;
  recommendedStatus: Status | null;
  replayed?: boolean;
  diffUnavailable?: boolean;
}

export interface IssueEvent {
  id: string;
  issueId: string;
  eventType:
    | "ISSUE_CREATED"
    | "OBSERVATION_ADDED"
    | "CLASSIFICATION_UPDATED"
    | "STATUS_CHANGED"
    | "DIFF_GENERATED"
    | "ISSUE_RESOLVED"
    | "REVISIT_REVIEWED"
    | "ISSUE_UPDATED";
  payload: Record<string, unknown>;
  createdAt: string;
}

export interface AppConfig {
  accessRequired: boolean;
  storage: string;
  retentionNotice: string;
  audio: boolean;
  mock: boolean;
}

export interface WalkSuggestion {
  issueId: string;
  title: string;
  distanceMeters: number;
  status: Status;
  lastObservedAt: string;
}

export interface WalkSuggestions {
  items: WalkSuggestion[];
  sortingMethod: string;
  routeCalculated: boolean;
}

export interface Evaluation {
  id: string;
  title: string;
  model: string;
  dataset: string;
  recordedAt?: string;
  metrics: Record<string, unknown>;
  limitations: string[];
  evidenceUrl?: string;
  serving: boolean;
}

export interface IntegrationStatus {
  id: string;
  name: string;
  status: string;
  detail: string;
}

export interface AudioSummary {
  storageKey: string;
  mediaUrl: string;
  cached: boolean;
  text?: string;
}

export const COMPARISON_MODELS = ["google/gemma-3-27b-it", "qwen/qwen-2.5-72b-instruct"] as const;

export interface ModelInterpretation {
  status: "complete" | "pending" | "failed";
  model?: string;
  provider?: string;
  promptVersion?: string;
  inputModality?: string;
  result?: { category: Category; severity: Severity; rationale: string; evidence: string[] };
  latencyMs?: number | null;
  inputTokens?: number | null;
  outputTokens?: number | null;
  costUsd?: number | null;
  createdAt?: string;
  cached?: boolean;
  error?: string;
}

export interface ModelComparisonResult {
  observationId: string;
  inputModality: string;
  results: ModelInterpretation[];
  disagreement: { category: boolean; severity: boolean } | null;
  changesIssueStatus: false;
}

export interface SemanticResult {
  items: (Issue & { similarity: number; score: number; indexedAt?: string; model?: string })[];
  method: string;
  model: string;
}
