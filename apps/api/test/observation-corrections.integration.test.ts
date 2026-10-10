import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { Pool } from "pg";
import { migrate } from "../src/migrate.js";
import { IssueRepository } from "../src/repository.js";
import { IssueService } from "../src/service.js";
import { PostgresStorageProvider } from "../src/postgres-storage.js";
import { createApp } from "../src/app.js";
const suite = process.env.TEST_DATABASE_URL ? describe : describe.skip;
const analysis = {
  objects: ["tree"],
  conditions: ["cut branches"],
  suggestedCategory: "ENVIRONMENT",
  suggestedSeverity: "MEDIUM",
  evidence: ["branches"],
  confidence: 0.5,
  model: "test-fixture",
  modelVersion: "1",
};
const comparison = {
  outcome: "UNCHANGED",
  comparabilityReason: "Synthetic matching tree fixture",
  sameSubjectEvidence: ["same synthetic trunk"],
  summary: "Branches remain",
  removed: [],
  added: [],
  unchanged: ["branches remain"],
  recommendedStatus: "OPEN",
  confidence: 0.5,
  model: "test-fixture",
  modelVersion: "2",
};
suite("observation corrections preserve evidence and ownership", () => {
  let pool: Pool,
    repo: IssueRepository,
    service: IssueService,
    app: ReturnType<typeof createApp>,
    owner: string,
    other: string;
  let issue: any, A: any, B: any, C: any;
  let providerResult: unknown = comparison;
  let calls = 0,
    release: (() => void) | undefined,
    entered: (() => void) | undefined;
  const png = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aI1sAAAAASUVORK5CYII=",
    "base64",
  );
  const media = (n: number) => ({
    bytes: Buffer.concat([png, Buffer.from([n])]),
    mime: "image/png",
    filename: "synthetic.png",
  });
  const headers = (cookie: string) => ({
    Cookie: cookie,
    Origin: "http://localhost",
    "Content-Type": "application/json",
  });
  const correction = (cookie: string, type: string | null) =>
    app.request(
      `/v1/issues/${issue.publicId}/observations/${B.id}/correction`,
      {
        method: "POST",
        headers: headers(cookie),
        body: JSON.stringify({
          exclusionType: type,
          reason: "Wrong tree in synthetic incident reproduction",
        }),
      },
    );
  beforeAll(async () => {
    pool = new Pool({ connectionString: process.env.TEST_DATABASE_URL });
    await migrate(pool);
    repo = new IssueRepository(pool);
    const storage = new PostgresStorageProvider(pool, "http://localhost/media");
    service = new IssueService(
      repo,
      storage,
      {
        analyze: async () => analysis,
        compare: async () => {
          calls++;
          entered?.();
          if (entered)
            await new Promise<void>((r) => {
              release = r;
            });
          return providerResult;
        },
      } as never,
      undefined,
      async () => {},
      false,
    );
    app = createApp({
      repository: repo,
      service,
      storage,
      publicAccess: true,
      accessToken: "correction-test-operator-secret-at-least-32-characters",
      maxUploadBytes: 100000,
    });
    owner = (await app.request("/app-config")).headers
      .get("set-cookie")!
      .split(";")[0]!;
    other = (await app.request("/app-config")).headers
      .get("set-cookie")!
      .split(";")[0]!;
    const form = new FormData();
    form.set(
      "image",
      new Blob([media(0).bytes], { type: "image/png" }),
      "original.png",
    );
    form.set("note", "Synthetic A original tree");
    form.set("latitude", "0");
    form.set("longitude", "0");
    form.set("capturedAt", "2026-10-09T10:00:00Z");
    form.set("publicConsent", "true");
    const r = await app.request("/v1/issues", {
      method: "POST",
      headers: { Cookie: owner, Origin: "http://localhost" },
      body: form,
    });
    expect(r.status).toBe(201);
    issue = await r.json();
    A = issue.observations[0];
    const add = async (n: number) =>
      service.addObservation(
        issue.id,
        {
          note: `Synthetic ${n}`,
          latitude: 0,
          longitude: 0,
          capturedAt: `2026-10-${9 + n}T10:00:00Z`,
        },
        media(n),
      );
    B = (await add(1)).observation;
    C = (await add(2)).observation;
  });
  afterAll(async () => {
    const keys = issue
      ? (await repo.observations(issue.id)).items.map((o) => o.storageKey)
      : [];
    await pool.query("DELETE FROM issues WHERE id=$1", [issue?.id]);
    await pool.query(
      "DELETE FROM media_objects WHERE storage_key=ANY($1::text[])",
      [keys],
    );
    await pool.end();
  });
  it("reproduces A-B-C and preserves immutable evidence on correction", async () => {
    const prior = (await repo.diffs(issue.id)).items;
    expect(prior.at(-1)).toMatchObject({
      beforeObservationId: B.id,
      afterObservationId: C.id,
    });
    const before = (await repo.observations(issue.id)).items.find(
      (o) => o.id === B.id,
    )!;
    expect((await correction(other, "WRONG_LOCATION")).status).toBe(403);
    const r = await correction(owner, "WRONG_LOCATION");
    expect(r.status).toBe(200);
    const after = (await repo.observations(issue.id)).items.find(
      (o) => o.id === B.id,
    )!;
    expect(after).toMatchObject({
      exclusionType: "WRONG_LOCATION",
      storageKey: before.storageKey,
      capturedAt: before.capturedAt,
      aiAnalysis: before.aiAnalysis,
    });
    expect(
      (await repo.diffs(issue.id)).items.every((d) => d.supersededAt),
    ).toBe(true);
    expect((await repo.get(issue.id)).status).toBe("OPEN");
  });
  it("chooses A-C automatically and forbids explicit excluded pairs", async () => {
    const d = await service.compareSelected(issue.id, {
      mode: "latest_eligible",
    });
    expect(d).toMatchObject({
      beforeObservationId: A.id,
      afterObservationId: C.id,
      selectionMode: "latest_eligible",
    });
    expect(
      await service.compareSelected(issue.id, { mode: "original_latest" }),
    ).toMatchObject({ id: d.id });
    await expect(service.diff(issue.id, B.id, C.id)).rejects.toMatchObject({
      code: "EXCLUDED_OBSERVATION",
    });
    const all = (await repo.diffs(issue.id)).items;
    expect(all).toHaveLength(3);
    expect(all.filter((d) => !d.supersededAt)).toHaveLength(1);
  });
  it("restores eligibility without silently restoring old comparisons", async () => {
    expect((await correction(other, null)).status).toBe(403);
    expect((await correction(owner, null)).status).toBe(200);
    expect(
      (await repo.get(issue.id)).observations.find((o) => o.id === B.id)
        ?.exclusionType,
    ).toBeNull();
    const d = await service.compareSelected(issue.id, {
      mode: "latest_eligible",
    });
    expect(d.beforeObservationId).toBe(B.id);
    const history = (await repo.timeline(issue.id)).events.filter(
      (e) => e.eventType === "OBSERVATION_CORRECTED",
    );
    expect(history).toHaveLength(2);
    expect(history[0].payload.actor.kind).toBe("owner");
    expect(history[0].payload.actor.id).toBeTruthy();
    expect(
      (await repo.diffs(issue.id)).items.filter((d) => d.supersededAt),
    ).toHaveLength(2);
  });
  it("new uploads skip an excluded previous observation and still preserve OPEN", async () => {
    await correction(owner, "WRONG_LOCATION");
    const ownerId = (await repo.issue(pool, issue.id)).guest_owner;
    await repo.correctObservation(
      issue.id,
      C.id,
      { exclusionType: "NOT_SUITABLE", reason: "synthetic" },
      { kind: "owner", id: "test-actor", ownerId },
    );
    const d = await service.addObservation(
      issue.id,
      {
        note: "Synthetic D",
        latitude: 0,
        longitude: 0,
        capturedAt: "2026-10-12T10:00:00Z",
      },
      media(3),
    );
    expect(d.realWorldDiff).toMatchObject({
      beforeObservationId: A.id,
      afterObservationId: d.observation.id,
    });
    expect((await repo.get(issue.id)).status).toBe("OPEN");
    // A comparison that started before a correction must not commit as valid later.
    await repo.correctObservation(
      issue.id,
      C.id,
      { exclusionType: null, reason: "" },
      { kind: "owner", id: "test-actor", ownerId },
    );
    const started = new Promise<void>((r) => {
      entered = r;
    });
    const pending = service.diff(issue.id, A.id, C.id);
    await started;
    await repo.correctObservation(
      issue.id,
      C.id,
      { exclusionType: "WRONG_PHOTOGRAPH", reason: "concurrent correction" },
      { kind: "owner", id: "test-actor", ownerId },
    );
    release!();
    await expect(pending).rejects.toMatchObject({ code: "EVIDENCE_CHANGED" });
    entered = undefined;
  });
  it("no eligible baseline and duplicate uploads fail conservatively", async () => {
    const ownerId = (await repo.issue(pool, issue.id)).guest_owner;
    for (const o of (await repo.observations(issue.id)).items)
      await repo.correctObservation(
        issue.id,
        o.id,
        { exclusionType: "NOT_SUITABLE", reason: "synthetic" },
        { kind: "owner", id: "test-actor", ownerId },
      );
    await expect(
      service.compareSelected(issue.id, { mode: "latest_eligible" }),
    ).rejects.toMatchObject({ code: "NO_ELIGIBLE_BASELINE" });
    const first = await service.addObservation(
      issue.id,
      {
        note: "same",
        latitude: 0,
        longitude: 0,
        capturedAt: "2026-10-13T10:00:00Z",
      },
      media(4),
    );
    expect(first.realWorldDiff).toBeUndefined();
    const n = calls;
    const second = await service.addObservation(
      issue.id,
      {
        note: "same",
        latitude: 0,
        longitude: 0,
        capturedAt: "2026-10-14T10:00:00Z",
      },
      media(4),
    );
    expect(second.realWorldDiff).toMatchObject({
      outcome: "INSUFFICIENT_EVIDENCE",
      confidence: 0,
      added: [],
      removed: [],
    });
    expect(calls).toBe(n);
    expect(
      (await repo.timeline(issue.id)).events.at(-1)?.payload,
    ).toMatchObject({ method: "image_identity", recommendedStatus: "OPEN" });
  });
  it("rejects contradictory and missing provider evidence without losing the upload or resolving", async () => {
    const previous = (await repo.diffs(issue.id)).items.length;
    for (const [n, output] of [
      [
        7,
        {
          ...comparison,
          outcome: "NOT_COMPARABLE",
          added: ["litter"],
          confidence: 0.9,
        },
      ],
      [8, { summary: "unsupported legacy result" }],
    ] as const) {
      providerResult = output;
      const saved = await service.addObservation(
        issue.id,
        {
          note: "Synthetic invalid provider response",
          latitude: 0,
          longitude: 0,
          capturedAt: `2026-10-${15 + n}T10:00:00Z`,
        },
        media(n),
      );
      expect(saved).toMatchObject({
        diffUnavailable: true,
        realWorldDiff: null,
      });
      expect(
        (await repo.get(issue.id)).observations.some(
          (o) => o.id === saved.observation.id,
        ),
      ).toBe(true);
      const response = await app.request(`/v1/issues/${issue.publicId}/diff`, {
        method: "POST",
        headers: headers(owner),
        body: JSON.stringify({ mode: "latest_eligible" }),
      });
      expect(response.status).toBe(502);
      expect(await response.json()).toMatchObject({
        error: { code: "INVALID_MODEL_OUTPUT" },
      });
      expect((await repo.get(issue.id)).status).toBe("OPEN");
      expect((await repo.diffs(issue.id)).items).toHaveLength(previous);
    }
    providerResult = comparison;
  });
});
