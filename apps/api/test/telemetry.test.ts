import { expect, it } from "vitest";
import { sanitizeEvent, sanitizeSpan } from "../src/telemetry.js";
it("strips private attributes and unknown fields from streamed spans", () => {
  const span = sanitizeSpan({
    trace_id: "a".repeat(32),
    span_id: "b".repeat(16),
    start_timestamp: 1,
    end_timestamp: 2,
    status: "ok",
    is_segment: true,
    name: "secret-note",
    attributes: { "sentry.op": "secret", api_key: "secret-key" },
    links: [{ attributes: { note: "secret-linked-note" } }],
    future_sdk_field: "secret-private-payload",
  } as any);
  expect(JSON.stringify(span)).not.toContain("secret");
  expect(span.name).toBe("FieldIssue operation");
  expect(span.attributes).toEqual({ "sentry.op": "fieldissue.operation" });
  expect(span.start_timestamp).toBe(1);
  expect(span.end_timestamp).toBe(2);
  expect(span.links).toEqual([]);
});
it("strips private request bodies, secrets and breadcrumbs", () => {
  const event: any = sanitizeEvent({
    request: { data: "image bytes", headers: { authorization: "secret" } },
    extra: { api_key: "secret" },
    breadcrumbs: [
      { data: { url: "https://serpapi.com/search?api_key=secret" } },
    ],
    user: { ip_address: "1.2.3.4" },
    message: "safe",
  });
  expect(event.request).toBeUndefined();
  expect(event.extra).toBeUndefined();
  expect(event.user).toBeUndefined();
  expect(event.breadcrumbs).toEqual([]);
});
it("denies secret-bearing exception values, contexts and spans", () => {
  const event = sanitizeEvent({
    exception: { values: [{ value: "secret-api-key" }] },
    contexts: { private: { image: "secret-image-bytes" } },
    spans: [{ data: { url: "secret-provider-url" } }],
    message: "secret-message",
    tags: { api_key: "secret-key" },
  });
  expect(JSON.stringify(event)).not.toContain("secret");
});
