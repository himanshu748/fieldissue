import assert from "node:assert/strict";
const api = process.env.E2E_API_URL ?? "http://127.0.0.1:3000";
const png = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wl6X8sAAAAASUVORK5CYII=",
  "base64",
);
async function request(path, options = {}) {
  const r = await fetch(api + path, options);
  const body = await r.json();
  assert.ok(r.ok, `${path}: ${r.status} ${JSON.stringify(body)}`);
  return body;
}
for (let i = 0; i < 80; i++) {
  try {
    await request("/ready");
    break;
  } catch (error) {
    if (i === 79) throw error;
    await new Promise((r) => setTimeout(r, 250));
  }
}
function form(note) {
  const f = new FormData();
  f.set("title", "Broken park bench");
  f.set("note", note);
  f.set("latitude", "12.9716");
  f.set("longitude", "77.5946");
  f.set("image", new File([png], "bench.png", { type: "image/png" }));
  return f;
}
const issue = await request("/v1/issues", {
  method: "POST",
  body: form("broken wooden slat; graffiti visible"),
  headers: { "Idempotency-Key": `http-e2e-${Date.now()}` },
});
assert.equal(issue.status, "OPEN");
assert.equal(issue.latitude, 12.9716);
const retrieved = await request(`/v1/issues/${issue.id}`);
assert.equal(retrieved.id, issue.id);
assert.equal(retrieved.observations.length, 1);
await new Promise((r) => setTimeout(r, 10));
const second = await request(`/v1/issues/${issue.id}/observations`, {
  method: "POST",
  body: form("wooden slat replaced; graffiti removed; clean surface"),
});
const diff = await request(`/v1/issues/${issue.id}/diff`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    beforeObservationId: issue.observations[0].id,
    afterObservationId: second.observation.id,
  }),
});
assert.ok(diff.removed.length > 0);
assert.equal((await request(`/v1/issues/${issue.id}`)).status, "OPEN");
const resolved = await request(`/v1/issues/${issue.id}/resolve`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ note: "Confirmed repaired on revisit" }),
});
assert.equal(resolved.status, "RESOLVED");
const events = (await request(`/v1/issues/${issue.id}/timeline`)).events.map(
  (x) => x.eventType,
);
for (const event of [
  "ISSUE_CREATED",
  "OBSERVATION_ADDED",
  "DIFF_GENERATED",
  "STATUS_CHANGED",
  "ISSUE_RESOLVED",
])
  assert.ok(events.includes(event));
console.log(
  JSON.stringify(
    {
      result: "PASS",
      publicId: issue.publicId,
      observations: 2,
      diffPersisted: true,
      status: resolved.status,
      events,
      aiMode: "explicit development mock",
    },
    null,
    2,
  ),
);
