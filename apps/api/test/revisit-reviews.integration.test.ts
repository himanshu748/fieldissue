import { beforeAll, afterAll, describe, expect, it } from "vitest";
import { Pool } from "pg";
import { IssueRepository } from "../src/repository.js";
import { migrate } from "../src/migrate.js";
import { createApp } from "../src/app.js";
const describeDb = process.env.TEST_DATABASE_URL ? describe : describe.skip;
describeDb("human-reviewed revisit training data", () => {
  let pool: Pool,
    repo: IssueRepository,
    id: string,
    before: string,
    after: string;
  const analysis = {
    objects: ["bench"],
    conditions: ["damaged"],
    suggestedCategory: "OTHER",
    suggestedSeverity: "LOW",
    evidence: ["test evidence"],
    confidence: 0.8,
    model: "test-fixture",
    modelVersion: "1",
  } as const;
  const media = {
    mediaUrl: "https://example.test/fixture.jpg",
    storageKey: "review-fixture.jpg",
    mimeType: "image/jpeg",
  };
  const input = (days: number) => ({
    title: "Review test only",
    description: "",
    note: "Test-only evidence",
    latitude: 0,
    longitude: 0,
    capturedAt: new Date(Date.now() - days * 86400000).toISOString(),
  });
  beforeAll(async () => {
    pool = new Pool({ connectionString: process.env.TEST_DATABASE_URL });
    await migrate(pool);
    repo = new IssueRepository(pool);
    const created = await repo.create(input(3), media, analysis as any);
    id = created.id;
    before = (await repo.get(id)).observations[0].id;
  });
  afterAll(async () => {
    if (id) await pool.query("DELETE FROM issues WHERE id=$1", [id]);
    await pool?.end();
  });
  it("captures predictors before adding the outcome evidence and excludes backdated visits", async () => {
    const second = await repo.addObservation(
      id,
      input(0),
      media,
      analysis as any,
    );
    after = second.id;
    expect(second.previousObservationId).toBe(before);
    expect(second.revisitFeatures.previous_observation_count).toBe(1);
    expect(second.revisitFeatures.previous_change_count).toBe(0);
    expect(second.revisitFeatures.days_since_last_observation).toBeCloseTo(
      3,
      2,
    );
    const backdated = await repo.addObservation(
      id,
      input(2),
      media,
      analysis as any,
    );
    expect(backdated.revisitFeatures).toBeNull();
    await expect(
      repo.reviewRevisit(id, {
        beforeObservationId: before,
        afterObservationId: backdated.id,
        materialChange: true,
        note: "Test-only confirmed change",
        evidenceIsGenuine: true,
      }),
    ).rejects.toMatchObject({ code: "REVIEW_NOT_ELIGIBLE" });
  });
  it("requires human assertion, keeps issue status unchanged and audits corrections", async () => {
    const app = createApp({
      repository: repo,
      service: {} as any,
      storage: {} as any,
      maxUploadBytes: 1024,
      accessToken: "test-only-access-token-32-characters",
    });
    const request = {
      beforeObservationId: before,
      afterObservationId: after,
      materialChange: true,
      note: "Test-only visible repair",
      evidenceIsGenuine: true as const,
    };
    expect(
      (
        await app.request(`/v1/issues/${id}/revisit-review`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(request),
        })
      ).status,
    ).toBe(401);
    expect(
      (
        await app.request(`/v1/issues/${id}/revisit-review`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer test-only-access-token-32-characters",
          },
          body: JSON.stringify({ ...request, evidenceIsGenuine: false }),
        })
      ).status,
    ).toBe(400);
    await repo.reviewRevisit(id, request);
    await repo.reviewRevisit(id, {
      ...request,
      note: "Test-only corrected explanation",
    });
    expect((await repo.get(id)).status).toBe("OPEN");
    expect(
      (
        await pool.query(
          "SELECT count(*)::int n FROM revisit_reviews WHERE issue_id=$1",
          [id],
        )
      ).rows[0].n,
    ).toBe(1);
    expect(
      (
        await pool.query(
          "SELECT count(*)::int n FROM issue_events WHERE issue_id=$1 AND event_type='REVISIT_REVIEWED'",
          [id],
        )
      ).rows[0].n,
    ).toBe(2);
    await expect(repo.trainingData()).rejects.toMatchObject({
      code: "TRAINING_DATA_INCOMPLETE",
    });
    const exportFailure = await app.request("/v1/revisit-training-data", {
      headers: { Authorization: "Bearer test-only-access-token-32-characters" },
    });
    expect(exportFailure.status).toBe(409);
    expect(exportFailure.headers.get("Content-Disposition")).toBeNull();
  });
  it("exports both human-labeled classes without notes, images, coordinates or model-generated labels", async () => {
    const third = await repo.addObservation(
      id,
      input(0),
      media,
      analysis as any,
    );
    await repo.reviewRevisit(id, {
      beforeObservationId: after,
      afterObservationId: third.id,
      materialChange: false,
      note: "Test-only no material change",
      evidenceIsGenuine: true,
    });
    const csv = await repo.trainingData();
    expect(csv.trim().split("\n")).toHaveLength(3);
    expect(csv.split("\n")[0]).toContain("material_change_since_last_visit");
    expect(csv).not.toMatch(/https:|Test-only|latitude|longitude/);
    expect(
      csv
        .trim()
        .split("\n")
        .slice(1)
        .map((r) => r.split(",").at(-1))
        .sort(),
    ).toEqual(["0", "1"]);
    const frozen = (await repo.get(id)).observations.find(
      (o) => o.id === after,
    )!.revisitFeatures;
    expect(frozen.previous_observation_count).toBe(1);
  });
  it("rejects fixture history even when the later observation uses a real-provider model name", async () => {
    await pool.query(
      "UPDATE observations SET ai_analysis=jsonb_set(ai_analysis,'{model}','\"development-fixture\"') WHERE id=$1",
      [before],
    );
    await expect(
      repo.reviewRevisit(id, {
        beforeObservationId: before,
        afterObservationId: after,
        materialChange: true,
        note: "Test-only fixture contamination",
        evidenceIsGenuine: true,
      }),
    ).rejects.toMatchObject({ code: "REVIEW_NOT_ELIGIBLE" });
  });
});
