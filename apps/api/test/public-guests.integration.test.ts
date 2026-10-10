import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { Pool } from "pg";
import { createApp } from "../src/app.js";
import { IssueRepository } from "../src/repository.js";
import { IssueService } from "../src/service.js";
import { PostgresStorageProvider } from "../src/postgres-storage.js";
import { migrate } from "../src/migrate.js";
const suite = process.env.TEST_DATABASE_URL ? describe : describe.skip;
suite("public guests preserve ownership and private evidence", () => {
  let pool: Pool,
    repository: IssueRepository,
    service: IssueService,
    app: ReturnType<typeof createApp>;
  let ownerCookie: string,
    otherCookie: string,
    published: any,
    privateIssue: any;
  const token = "public-test-operator-token-at-least-32-characters";
  const ids: string[] = [],
    keys: string[] = [];
  const png = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aI1sAAAAASUVORK5CYII=",
    "base64",
  );
  const input = {
    title: "Public access fixture",
    description: "",
    note: "test",
    latitude: 0,
    longitude: 0,
  };
  let analyses = 0;
  function form(consent = true) {
    const f = new FormData();
    f.set("image", new Blob([png], { type: "image/png" }), "fixture.png");
    f.set("latitude", "0");
    f.set("longitude", "0");
    f.set("note", "test");
    if (consent) f.set("publicConsent", "true");
    f.set("reporterId", "00000000-0000-0000-0000-000000000001");
    return f;
  }
  const headers = (cookie: string) => ({
    Cookie: cookie,
    Origin: "http://localhost",
  });
  beforeAll(async () => {
    pool = new Pool({ connectionString: process.env.TEST_DATABASE_URL });
    await migrate(pool);
    repository = new IssueRepository(pool);
    const storage = new PostgresStorageProvider(pool, "http://localhost/media");
    service = new IssueService(
      repository,
      storage,
      {
        analyze: async () => {
          analyses++;
          return {
            objects: ["bench"],
            conditions: ["broken"],
            evidence: ["broken"],
            suggestedCategory: "INFRASTRUCTURE",
            suggestedSeverity: "LOW",
            confidence: 0.5,
            model: "test-fixture",
            modelVersion: "1",
          };
        },
      } as never,
      undefined,
      async () => {},
      false,
    );
    app = createApp({
      repository,
      service,
      storage,
      accessToken: token,
      publicAccess: true,
      maxUploadBytes: 100000,
    });
    const a = await app.request("/app-config"),
      b = await app.request("/app-config");
    ownerCookie = a.headers.get("set-cookie")!.split(";")[0]!;
    otherCookie = b.headers.get("set-cookie")!.split(";")[0]!;
    expect(await a.json()).toMatchObject({
      accessRequired: false,
      publicAccess: true,
    });
    expect(a.headers.get("set-cookie")).toContain("HttpOnly");
    expect(a.headers.get("set-cookie")).toContain("SameSite=Strict");
    privateIssue = await service.create(input, {
      bytes: png,
      mime: "image/png",
      filename: "fixture.png",
    });
    ids.push(privateIssue.id);
    keys.push(privateIssue.observations[0].storageKey);
  });
  afterAll(async () => {
    await pool.query(
      "DELETE FROM evidence_diffs WHERE issue_id=ANY($1::uuid[])",
      [ids],
    );
    await pool.query("DELETE FROM issues WHERE id=ANY($1::uuid[])", [ids]);
    await pool.query(
      "DELETE FROM media_objects WHERE storage_key=ANY($1::text[])",
      [keys],
    );
    await pool.end();
  });
  it("requires explicit publication consent before inference and blocks cross-origin writes", async () => {
    const before = analyses;
    expect(
      (
        await app.request("/v1/issues", {
          method: "POST",
          headers: headers(ownerCookie),
          body: form(false),
        })
      ).status,
    ).toBe(400);
    expect(
      (
        await app.request("/v1/issues", {
          method: "POST",
          headers: { Cookie: ownerCookie, Origin: "https://attacker.invalid" },
          body: form(),
        })
      ).status,
    ).toBe(403);
    expect(
      (await app.request("/v1/issues", { method: "POST", body: form() }))
        .status,
    ).toBe(403);
    expect(analyses).toBe(before);
  });
  it("creates a public report atomically, ignores client ownership and scopes replay keys", async () => {
    const response = await app.request("/v1/issues", {
      method: "POST",
      headers: { ...headers(ownerCookie), "Idempotency-Key": "same-key" },
      body: form(),
    });
    expect(response.status).toBe(201);
    published = await response.json();
    ids.push(published.id);
    keys.push(published.observations[0].storageKey);
    expect(published.permissions.manage).toBe(true);
    expect((await repository.features(published.id)).nearby_issue_count).toBe(
      0,
    );
    expect(published.isPublic).toBe(true);
    expect(published).not.toHaveProperty("guestOwner");
    expect(published).not.toHaveProperty("reporterId");
    expect(published.nearbyIssues).not.toContainEqual(
      expect.objectContaining({ id: privateIssue.id }),
    );
    const replay = await app.request("/v1/issues", {
      method: "POST",
      headers: { ...headers(ownerCookie), "Idempotency-Key": "same-key" },
      body: form(),
    });
    expect(replay.status).toBe(200);
    expect((await replay.json()).id).toBe(published.id);
    const other = await app.request("/v1/issues", {
      method: "POST",
      headers: { ...headers(otherCookie), "Idempotency-Key": "same-key" },
      body: form(),
    });
    expect(other.status).toBe(201);
    const d = await other.json();
    ids.push(d.id);
    keys.push(d.observations[0].storageKey);
    expect(d.id).not.toBe(published.id);
  });
  it("permits public browsing but protects existing private reports and photos", async () => {
    expect((await app.request(`/v1/issues/${published.publicId}`)).status).toBe(
      200,
    );
    for (const suffix of [
      "",
      "/observations",
      "/diffs",
      "/timeline",
      "/share-summary",
    ])
      expect(
        (await app.request(`/v1/issues/${privateIssue.publicId}${suffix}`))
          .status,
      ).toBe(404);
    expect(
      (await app.request(`/media/${privateIssue.observations[0].storageKey}`))
        .status,
    ).toBe(404);
    expect(
      (await app.request(`/media/${published.observations[0].storageKey}`))
        .status,
    ).toBe(200);
    const list = await (await app.request("/v1/issues")).json();
    expect(list.items.some((i: any) => i.id === privateIssue.id)).toBe(false);
    expect(list.items.some((i: any) => i.id === published.id)).toBe(true);
    const map = await (
      await app.request("/v1/issues/map?bbox=-1,-1,1,1")
    ).json();
    expect(
      map.features.some((i: any) => i.properties.id === privateIssue.id),
    ).toBe(false);
    const walk = await (
      await app.request("/v1/walks/suggestions?latitude=0&longitude=0")
    ).json();
    expect(walk.items.some((i: any) => i.issueId === privateIssue.id)).toBe(
      false,
    );
    expect((await app.request("/v1/revisit-training-data")).status).toBe(403);
    expect(
      (
        await app.request(`/v1/issues/${privateIssue.publicId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      ).status,
    ).toBe(200);
  });
  it("allows another guest to add evidence without gaining management rights", async () => {
    const response = await app.request(
      `/v1/issues/${published.publicId}/observations`,
      {
        method: "POST",
        headers: headers(otherCookie),
        body: (() => {
          const f = form();
          f.delete("reporterId");
          return f;
        })(),
      },
    );
    expect(response.status).toBe(201);
    const observations = (await repository.get(published.id)).observations;
    keys.push(observations.at(-1)!.storageKey);
    expect(observations).toHaveLength(2);
    const item = await (
      await app.request(`/v1/issues/${published.publicId}`, {
        headers: headers(otherCookie),
      })
    ).json();
    expect(item.permissions.manage).toBe(false);
    expect(item.observations.at(-1).revisitFeatures.nearby_issue_count).toBe(1);
    const publicObservations = await (
      await app.request(`/v1/issues/${published.publicId}/observations`)
    ).json();
    expect(
      publicObservations.items.at(-1).revisitFeatures.nearby_issue_count,
    ).toBe(1);
    expect(
      (
        await app.request("/v1/model-lab/compare", {
          method: "POST",
          headers: {
            ...headers(otherCookie),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            observationId: privateIssue.observations[0].id,
            models: ["google/gemma-3-27b-it", "qwen/qwen-2.5-72b-instruct"],
            consentToExternalProcessing: true,
          }),
        })
      ).status,
    ).toBe(403);
  });
  it("lets the reporting browser resolve and reopen, blocks everyone else on both status routes", async () => {
    const url = `/v1/issues/${published.publicId}`;
    expect(
      (await (await app.request(url, { headers: headers(otherCookie) })).json())
        .permissions.manage,
    ).toBe(false);
    for (const cookie of [otherCookie, ownerCookie + "tampered"])
      for (const [path, method, body] of [
        [url, "PATCH", { status: "RESOLVED" }],
        [
          url + "/resolve",
          "POST",
          { basis: "manual_confirmation", note: "test" },
        ],
      ] as const) {
        expect(
          (
            await app.request(path, {
              method,
              headers: {
                ...headers(cookie),
                "Content-Type": "application/json",
              },
              body: JSON.stringify(body),
            })
          ).status,
        ).toBe(403);
      }
    const resolved = await app.request(url + "/resolve", {
      method: "POST",
      headers: { ...headers(ownerCookie), "Content-Type": "application/json" },
      body: JSON.stringify({
        basis: "manual_confirmation",
        note: "explicit test",
      }),
    });
    expect(resolved.status).toBe(200);
    const reopened = await app.request(url, {
      method: "PATCH",
      headers: { ...headers(ownerCookie), "Content-Type": "application/json" },
      body: JSON.stringify({ status: "OPEN" }),
    });
    expect(reopened.status).toBe(200);
    expect((await repository.get(published.id)).status).toBe("OPEN");
  });
  it("limits guest writes before provider work while reads remain available", async () => {
    const owner = (await repository.issue(pool, published.id)).guest_owner;
    await pool.query(
      "UPDATE guest_allowances SET uploads=6 WHERE guest_id=$1",
      [owner],
    );
    const before = analyses;
    expect(
      (
        await app.request("/v1/issues", {
          method: "POST",
          headers: headers(ownerCookie),
          body: form(),
        })
      ).status,
    ).toBe(429);
    expect(analyses).toBe(before);
    expect((await app.request("/v1/issues")).status).toBe(200);
  });
  it("gates trained-note processing by explicit consent and report ownership", async () => {
    const observationId = (await repository.get(published.id)).observations[0]!
      .id;
    const request = (cookie: string, consent: boolean) =>
      app.request("/v1/model-lab/interpret-note", {
        method: "POST",
        headers: { ...headers(cookie), "Content-Type": "application/json" },
        body: JSON.stringify({
          observationId,
          consentToExternalProcessing: consent,
        }),
      });
    expect((await request(ownerCookie, false)).status).toBe(400);
    expect((await request(otherCookie, true)).status).toBe(403);
    // This fixture deliberately has no provider; the owner's request reaches the provider gate.
    expect((await request(ownerCookie, true)).status).toBe(503);
    const privateId = (await repository.get(privateIssue.id)).observations[0]!
      .id;
    expect(
      (
        await app.request("/v1/model-lab/interpret-note", {
          method: "POST",
          headers: {
            ...headers(ownerCookie),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            observationId: privateId,
            consentToExternalProcessing: true,
          }),
        })
      ).status,
    ).toBe(403);
  });
  it("requires an explicit synthetic-scenario acknowledgment", async () => {
    const r = await app.request("/v1/model-lab/revisit-demo", {
      method: "POST",
      headers: { ...headers(ownerCookie), "Content-Type": "application/json" },
      body: JSON.stringify({
        features: {
          days_since_last_observation: 7,
          previous_observation_count: 3,
          issue_age_days: 21,
          severity: 1,
          category: 0,
          nearby_issue_count: 4,
          previous_change_count: 1,
          status: 0,
        },
      }),
    });
    expect(r.status).toBe(400);
  });
  it("keeps owner and operator GPS precise while rounding anonymous and non-owner output", async () => {
    const config = await app.request("/app-config");
    const precisionOwner = config.headers.get("set-cookie")!.split(";")[0]!;
    const f = form();
    f.set("latitude", "26.9402177");
    f.set("longitude", "80.9169963");
    const created = await app.request("/v1/issues", {
      method: "POST",
      headers: headers(precisionOwner),
      body: f,
    });
    expect(created.status).toBe(201);
    const issue = await created.json();
    ids.push(issue.id);
    keys.push(issue.observations[0].storageKey);
    for (const [requestHeaders, precise] of [
      [{}, false],
      [{ Cookie: otherCookie }, false],
      [{ Cookie: precisionOwner }, true],
      [{ Authorization: `Bearer ${token}` }, true],
    ] as const) {
      const point = precise
        ? { latitude: 26.9402177, longitude: 80.9169963 }
        : { latitude: 26.94, longitude: 80.917 };
      const read = async (path: string) => {
        const response = await app.request(path, { headers: requestHeaders });
        expect(response.status).toBe(200);
        return response.json();
      };
      const detail = await read(`/v1/issues/${issue.publicId}`);
      expect(detail).toMatchObject(point);
      expect(detail.observations[0]).toMatchObject(point);
      const observations = await read(
        `/v1/issues/${issue.publicId}/observations`,
      );
      expect(observations.items[0]).toMatchObject(point);
      const list = await read(
        "/v1/issues?near_lat=26.9402177&near_lon=80.9169963&radius_meters=1",
      );
      expect(
        list.items.find((item: any) => item.id === issue.id),
      ).toMatchObject(point);
      const map = await read("/v1/issues/map?bbox=80.9,26.9,81,27");
      const feature = map.features.find(
        (item: any) => item.properties.id === issue.id,
      );
      expect(feature.properties).toMatchObject(point);
      expect(feature.geometry.coordinates).toEqual([
        point.longitude,
        point.latitude,
      ]);
      const summary = await read(`/v1/issues/${issue.publicId}/share-summary`);
      expect(summary.publicLocation).toMatchObject(point);
      const walk = await read(
        "/v1/walks/suggestions?latitude=26.9402177&longitude=80.9169963&radius_meters=1",
      );
      expect(
        walk.items.find((item: any) => item.issueId === issue.id)
          .distanceMeters,
      ).toBeLessThan(0.01);
    }
    expect(await repository.get(issue.id)).toMatchObject({
      latitude: 26.9402177,
      longitude: 80.9169963,
    });
  });
});
