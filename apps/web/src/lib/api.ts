import { getToken, markLocked } from "./access";
import type {
  AddObservationResult,
  AppConfig,
  AudioSummary,
  CreateIssueResult,
  Diff,
  Evaluation,
  IntegrationStatus,
  Issue,
  IssueEvent,
  IssueList,
  ModelComparisonResult,
  Observation,
  SemanticResult,
  WalkSuggestions,
} from "./types";

export class ApiError extends Error {
  constructor(
    message: string,
    readonly code: string,
    readonly status: number,
    readonly requestId?: string,
  ) {
    super(message);
  }
  get retryable() {
    return this.status === 0 || this.status === 429 || this.status >= 500;
  }
}

const friendly: Record<string, string> = {
  UNAUTHORIZED: "This deployment needs its shared access token.",
  PROVIDER_UNAVAILABLE:
    "The analysis service is unavailable right now. Nothing was saved. Your photo and note are kept here so you can retry.",
  PROVIDER_NOT_CONFIGURED: "This capability is not configured on this deployment.",
  PROVIDER_TIMEOUT:
    "The analysis service took too long. Nothing was saved. Retry when ready.",
  PAYLOAD_TOO_LARGE: "That image is larger than this deployment accepts.",
  RATE_LIMITED: "Too many requests in the last minute. Wait a moment, then retry.",
  IDEMPOTENCY_CONFLICT:
    "This retry no longer matches the original request. Start a fresh submission.",
  EVIDENCE_CHANGED:
    "A newer observation was added. Review the latest evidence before confirming.",
  INVALID_STATUS_TRANSITION: "That status change is not allowed from the current status.",
  SEMANTIC_SEARCH_UNAVAILABLE: "Semantic search is not available on this deployment. Title search still works.",
  BACKBOARD_UNAVAILABLE: "Model comparison through Backboard is not available on this deployment.",
  NOT_FOUND: "That record does not exist on this deployment.",
  VALIDATION_ERROR: "The request was rejected as invalid.",
};

function headers(extra?: HeadersInit) {
  const h = new Headers(extra);
  const token = getToken();
  if (token) h.set("Authorization", `Bearer ${token}`);
  return h;
}

async function toError(response: Response) {
  let code = `HTTP_${response.status}`;
  let message = response.statusText || "Request failed";
  let requestId = response.headers.get("X-Request-ID") ?? undefined;
  try {
    const body = await response.json();
    if (body?.error) {
      code = body.error.code ?? code;
      message = body.error.message ?? message;
      requestId = body.error.requestId ?? requestId;
    }
  } catch {
    // Non-JSON error body; keep the status text.
  }
  if (response.status === 401) markLocked(true);
  return new ApiError(friendly[code] ?? message, code, response.status, requestId);
}

export async function request<T>(
  path: string,
  init: { method?: string; json?: unknown; signal?: AbortSignal } = {},
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(path, {
      method: init.method ?? "GET",
      headers: headers(init.json === undefined ? undefined : { "Content-Type": "application/json" }),
      body: init.json === undefined ? undefined : JSON.stringify(init.json),
      signal: init.signal,
    });
  } catch (error) {
    if ((error as Error).name === "AbortError") throw error;
    throw new ApiError("Network unavailable. Check your connection and retry.", "NETWORK", 0);
  }
  if (!response.ok) throw await toError(response);
  return (await response.json()) as T;
}

export type UploadPhase = "uploading" | "processing";

// XHR is used only because fetch cannot report upload progress, and the UI must
// mark "Photo uploaded" complete only when the bytes have actually been sent.
export function upload<T>(
  path: string,
  form: FormData,
  idempotencyKey: string,
  onPhase: (phase: UploadPhase, fraction?: number) => void,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", path);
    headers({ "Idempotency-Key": idempotencyKey }).forEach((value, key) =>
      xhr.setRequestHeader(key, value),
    );
    xhr.upload.onprogress = (event) =>
      onPhase("uploading", event.lengthComputable ? event.loaded / event.total : undefined);
    xhr.upload.onload = () => onPhase("processing");
    xhr.onerror = () =>
      reject(
        new ApiError(
          "The connection dropped before the server answered. Retrying reuses the same request key, so it cannot create a duplicate.",
          "NETWORK",
          0,
        ),
      );
    xhr.onload = async () => {
      const response = new Response(xhr.responseText || null, {
        status: xhr.status,
        statusText: xhr.statusText,
        headers: { "X-Request-ID": xhr.getResponseHeader("X-Request-ID") ?? "" },
      });
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText) as T);
        } catch {
          reject(new ApiError("Unreadable server response", "BAD_RESPONSE", xhr.status));
        }
      } else reject(await toError(response));
    };
    onPhase("uploading", 0);
    xhr.send(form);
  });
}

export function newKey(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

const id = (value: string) => encodeURIComponent(value);

export const api = {
  config: (signal?: AbortSignal) => request<AppConfig>("/app-config", { signal }),
  listIssues: (params: URLSearchParams, signal?: AbortSignal) =>
    request<IssueList>(`/v1/issues?${params}`, { signal }),
  issue: (issueId: string, signal?: AbortSignal) =>
    request<Issue & { observations: Observation[] }>(`/v1/issues/${id(issueId)}`, { signal }),
  diffs: (issueId: string, signal?: AbortSignal) =>
    request<{ items: Diff[] }>(`/v1/issues/${id(issueId)}/diffs`, { signal }),
  timeline: (issueId: string, signal?: AbortSignal) =>
    request<{ events: IssueEvent[] }>(`/v1/issues/${id(issueId)}/timeline`, { signal }),
  patch: (issueId: string, body: Record<string, unknown>) =>
    request<Issue>(`/v1/issues/${id(issueId)}`, { method: "PATCH", json: body }),
  diff: (issueId: string, beforeObservationId: string, afterObservationId: string) =>
    request<Diff>(`/v1/issues/${id(issueId)}/diff`, {
      method: "POST",
      json: { beforeObservationId, afterObservationId },
    }),
  resolve: (
    issueId: string,
    body: { note: string; basis: "latest_observation" | "manual_confirmation"; observationId?: string },
  ) => request<Issue>(`/v1/issues/${id(issueId)}/resolve`, { method: "POST", json: body }),
  audio: (issueId: string) =>
    request<AudioSummary>(`/v1/issues/${id(issueId)}/audio-summary`, { method: "POST" }),
  createIssue: (form: FormData, key: string, onPhase: (p: UploadPhase, f?: number) => void) =>
    upload<CreateIssueResult>("/v1/issues", form, key, onPhase),
  addObservation: (
    issueId: string,
    form: FormData,
    key: string,
    onPhase: (p: UploadPhase, f?: number) => void,
  ) => upload<AddObservationResult>(`/v1/issues/${id(issueId)}/observations`, form, key, onPhase),
  walkSuggestions: (
    latitude: number,
    longitude: number,
    radius: number,
    signal?: AbortSignal,
  ) =>
    request<WalkSuggestions>(
      `/v1/walks/suggestions?${new URLSearchParams({
        latitude: String(latitude),
        longitude: String(longitude),
        radius_meters: String(radius),
        limit: "5",
      })}`,
      { signal },
    ),
  semanticSearch: (q: string, signal?: AbortSignal) =>
    request<SemanticResult>(`/v1/search/semantic?${new URLSearchParams({ q, limit: "10" })}`, { signal }),
  compareModels: (observationId: string, models: readonly string[]) =>
    request<ModelComparisonResult>("/v1/model-lab/compare", {
      method: "POST",
      json: { observationId, models, consentToExternalProcessing: true },
    }),
  evaluations: (signal?: AbortSignal) =>
    request<{ evaluations: Evaluation[] }>("/v1/model-lab/evaluations", { signal }),
  integrations: (signal?: AbortSignal) =>
    request<{ integrations: IntegrationStatus[]; coreReady: boolean }>(
      "/v1/integrations/status",
      { signal },
    ),
};

export async function fetchMedia(storageKey: string, signal?: AbortSignal) {
  let response: Response;
  try {
    response = await fetch(`/media/${encodeURIComponent(storageKey)}`, {
      headers: headers(),
      signal,
    });
  } catch (error) {
    if ((error as Error).name === "AbortError") throw error;
    throw new ApiError("Network unavailable", "NETWORK", 0);
  }
  if (!response.ok) throw await toError(response);
  return response.blob();
}
