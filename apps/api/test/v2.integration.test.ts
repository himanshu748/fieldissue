import { beforeAll, afterAll, describe, it, expect } from "vitest";
import { Pool } from "pg";
import { IssueRepository } from "../src/repository.js";
import { migrate } from "../src/migrate.js";
import { createApp } from "../src/app.js";
const describeDb = process.env.TEST_DATABASE_URL ? describe : describe.skip;
describeDb("walk queue and explicit resolution evidence", () => {
  let pool: Pool, repo: IssueRepository;
  const ids: string[] = [];
  const analysis = {
    objects: ["bench"],
    conditions: ["broken"],
    suggestedCategory: "OTHER",
    suggestedSeverity: "LOW",
    evidence: [],
    confidence: 0.5,
    model: "development-fixture",
    modelVersion: "test",
  } as any;
  const media = {
    mediaUrl: "https://example.test/fixture.png",
    storageKey: "fixture.png",
    mimeType: "image/png",
  };
  beforeAll(async () => {
    pool = new Pool({ connectionString: process.env.TEST_DATABASE_URL });
    await migrate(pool);
    repo = new IssueRepository(pool);
    for (const [delta, days] of [
      [0, 3],
      [0, 1],
      [0.01, 5],
      [0.02, 6],
      [1, 10],
    ]) {
      const r = await repo.create(
        {
          title: "V2 integration fixture",
          description: "",
          note: "",
          latitude: 51.77 + delta!,
          longitude: 0.77,
          capturedAt: new Date(Date.now() - days! * 86400000).toISOString(),
        },
        media,
        analysis,
      );
      ids.push(r.id);
    }
    await repo.patch(ids[3]!, { status: "RESOLVED" });
  });
  afterAll(async () => {
    if (ids.length)
      await pool.query("DELETE FROM issues WHERE id=ANY($1::uuid[])", [ids]);
    await pool?.end();
  });
  it("bounds nearby unresolved suggestions and orders equal distances oldest first", async () => {
    const result = await repo.walkSuggestions(51.77, 0.77, 5000, 5);
    expect(result.items.map((x) => x.issueId)).toEqual(ids.slice(0, 3));
    expect(result.routeCalculated).toBe(false);
    expect(result.items[0]!.distanceMeters).toBeCloseTo(0, 1);
    const app = createApp({
      repository: repo,
      service: {} as any,
      storage: {} as any,
      maxUploadBytes: 1024,
      accessToken: "private-test-token",
    });
    expect(
      (await app.request("/v1/walks/suggestions?latitude=51&longitude=0"))
        .status,
    ).toBe(401);
    expect(
      (
        await app.request(
          "/v1/walks/suggestions?latitude=51&longitude=0&limit=6",
          { headers: { Authorization: "Bearer private-test-token" } },
        )
      ).status,
    ).toBe(400);
  });
  it("rejects stale or foreign evidence and records manual versus observed decisions", async () => {
    const target = await repo.get(ids[0]!);
    const old = target.observations[0]!.id;
    const fresh = await repo.addObservation(
      target.id,
      { note: "new fixture", latitude: 51.77, longitude: 0.77 },
      media,
      analysis,
    );
    for (const observationId of [
      old,
      (await repo.get(ids[1]!)).observations[0]!.id,
    ])
      await expect(
        repo.patch(target.id, { status: "RESOLVED" }, "stale fixture", {
          basis: "latest_observation",
          observationId,
        }),
      ).rejects.toMatchObject({ code: "EVIDENCE_CHANGED" });
    expect((await repo.get(target.id)).status).toBe("OPEN");
    await repo.patch(
      target.id,
      { status: "RESOLVED" },
      "Verified current fixture",
      { basis: "latest_observation", observationId: fresh.id },
    );
    expect(
      (await repo.timeline(target.id)).events.find(
        (e) => e.eventType === "ISSUE_RESOLVED",
      )?.payload,
    ).toMatchObject({ basis: "latest_observation", observationId: fresh.id });
    await repo.patch(target.id, { status: "OPEN" });
    await repo.patch(target.id, { status: "RESOLVED" }, "Manual fixture", {
      basis: "manual_confirmation",
    });
    expect(
      (await repo.timeline(target.id)).events
        .filter((e) => e.eventType === "ISSUE_RESOLVED")
        .at(-1)?.payload,
    ).toMatchObject({ basis: "manual_confirmation", observationId: null });
  });
});
