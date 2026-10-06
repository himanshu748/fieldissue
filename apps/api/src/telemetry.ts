import * as Sentry from "@sentry/node";
let enabled = false;
const safeString = (value: unknown, pattern: RegExp) =>
  typeof value === "string" && pattern.test(value) ? value : undefined;
/** Deny by default: provider exceptions and framework payloads can contain secrets. */
export function sanitizeEvent<T extends Record<string, unknown>>(event: T): T {
  const clean: Record<string, unknown> = {
    breadcrumbs: [],
    message: "FieldIssue operation event",
  };
  for (const key of [
    "event_id",
    "timestamp",
    "start_timestamp",
    "level",
    "platform",
    "type",
  ])
    if (event[key] !== undefined) clean[key] = event[key];
  const context = event.contexts as
    { trace?: Record<string, unknown> } | undefined;
  if (context?.trace) {
    const trace: Record<string, unknown> = {};
    for (const key of ["trace_id", "span_id", "parent_span_id"]) {
      const value = safeString(context.trace[key], /^[a-f0-9]{16,32}$/);
      if (value) trace[key] = value;
    }
    clean.contexts = { trace };
  }
  const tags = event.tags as Record<string, unknown> | undefined;
  if (tags) {
    clean.tags = Object.fromEntries(
      ["operation", "code", "request_id"].flatMap((key) => {
        const value = safeString(tags[key], /^[a-zA-Z0-9_-]{1,64}$/);
        return value ? [[key, value]] : [];
      }),
    );
  }
  const exception = event.exception as
    { values?: { value?: unknown }[] } | undefined;
  if (exception)
    clean.exception = {
      values: [
        {
          type: "FieldIssueError",
          value:
            safeString(exception.values?.[0]?.value, /^[A-Z_]{1,100}$/) ??
            "OPERATION_FAILED",
        },
      ],
    };
  if (event.transaction) clean.transaction = "FieldIssue API";
  return clean as T;
}
export function initializeTelemetry(dsn?: string) {
  if (!dsn) return;
  Sentry.init({
    dsn,
    defaultIntegrations: false,
    integrations: [],
    dataCollection: {
      userInfo: false,
      httpHeaders: false,
      httpBodies: [],
      cookies: false,
      urlQueryParams: false,
      databaseQueryData: false,
      genAI: { inputs: false, outputs: false },
      graphQL: { document: false, variables: false },
      queues: false,
      stackFrameVariables: false,
      frameContextLines: 0,
    },
    tracesSampleRate: 0.1,
    beforeSend: (event) =>
      sanitizeEvent(
        event as unknown as Record<string, unknown>,
      ) as unknown as typeof event,
    beforeSendTransaction: (event) =>
      sanitizeEvent(
        event as unknown as Record<string, unknown>,
      ) as unknown as typeof event,
    beforeSendSpan: (span) => ({
      ...span,
      name: [
        "API request",
        "database transaction",
        "Gemma evidence analysis",
        "Gemma evidence comparison",
        "TabPFN revisit prediction",
        "Mastra workflow",
        "place-context",
        "audio-summary",
      ].includes(span.name)
        ? span.name
        : "FieldIssue operation",
      attributes: {
        "sentry.op":
          typeof span.attributes["sentry.op"] === "string" &&
          /^[a-z.]{1,40}$/.test(span.attributes["sentry.op"])
            ? span.attributes["sentry.op"]
            : "fieldissue.operation",
      },
      links: [],
    }),
  });
  enabled = true;
}
export function reportFailure(
  code: string,
  operation: string,
  requestId?: string,
) {
  if (enabled)
    Sentry.captureException(
      new Error(/^[A-Z_]{1,100}$/.test(code) ? code : "OPERATION_FAILED"),
      { tags: { operation, code, request_id: requestId } },
    );
}
export function trace<T>(
  name: string,
  op: string,
  fn: () => Promise<T>,
  attributes: Record<string, string | number> = {},
): Promise<T> {
  return enabled ? Sentry.startSpan({ name, op, attributes }, fn) : fn();
}
export async function flushTelemetry() {
  if (enabled) await Sentry.flush(2000);
}
