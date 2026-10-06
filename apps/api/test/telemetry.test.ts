import { expect, it } from "vitest";
import { sanitizeEvent } from "../src/telemetry.js";
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
