import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { Pool } from "pg";
import { IssueRepository } from "../src/repository.js";
import { IssueService } from "../src/service.js";
import { DataLifecycle } from "../src/lifecycle.js";
import { PostgresStorageProvider } from "../src/postgres-storage.js";
import { migrate } from "../src/migrate.js";

const suite = process.env.TEST_DATABASE_URL ? describe : describe.skip;
suite("evidence identity and complete data removal", () => {
  let pool: Pool,
    repository: IssueRepository,
    storage: PostgresStorageProvider,
    service: IssueService;
  const ids: string[] = [];
  const keys: string[] = [];
  const media = {
    bytes: Buffer.from([255, 216, 255, 1, 2, 3]),
    mime: "image/jpeg",
    filename: "test.jpg",
  };
  const analysis = {
    objects: ["bench"],
    conditions: ["broken slat"],
    evidence: ["broken slat"],
    suggestedCategory: "INFRASTRUCTURE",
    suggestedSeverity: "LOW",
    confidence: 0.5,
    model: "test-fixture",
    modelVersion: "1",
  };
  const input = {
    title: "Lifecycle test fixture",
    description: "",
    note: "test only",
    latitude: 0,
    longitude: 0,
    capturedAt: "2026-01-01T00:00:00Z",
  };
  beforeAll(async () => {
    pool = new Pool({ connectionString: process.env.TEST_DATABASE_URL });
    await migrate(pool);
    repository = new IssueRepository(pool);
    storage = new PostgresStorageProvider(pool, "http://localhost/media");
    service = new IssueService(
      repository,
      storage,
      {
        analyze: async () => analysis,
        compare: async () => {
          throw new Error("Identical files must never reach model inference");
        },
      } as never,
      undefined,
      async () => {},
      false,
    );
  });
  afterAll(async () => {
    await pool.query(
      "DELETE FROM evidence_diffs WHERE issue_id=ANY($1::uuid[])",
      [ids],
    );
    await pool.query("DELETE FROM issues WHERE id=ANY($1::uuid[])", [ids]);
    await pool.query(
      "DELETE FROM removal_jobs WHERE issue_id=ANY($1::uuid[])",
      [ids],
    );
    for (const key of keys) await storage.delete(key);
    await pool.end();
  });
  async function create() {
    const issue = await service.create(
      input,
      media,
      `lifecycle-${crypto.randomUUID()}`,
    );
    ids.push(issue.id);
    keys.push(issue.observations[0].storageKey);
    return issue;
  }
  it("withdraws an old hallucinated diff, preserves its audit and never resolves the issue", async () => {
    const issue = await create();
    const stored = await storage.put(media);
    keys.push(stored.storageKey);
    const after = await repository.addObservation(
      issue.id,
      {
        note: "claimed repair",
        latitude: 0,
        longitude: 0,
        capturedAt: "2026-01-02T00:00:00Z",
      },
      stored,
      analysis as never,
    );
    const before = issue.observations[0].id;
    const old = await repository.saveDiff(issue.id, before, after.id, {
      summary: "Incorrect model suggestion",
      outcome: "CHANGED",
      comparabilityReason: "Synthetic erroneous assessment",
      sameSubjectEvidence: ["synthetic frame"],
      removed: ["broken slat"],
      added: [],
      unchanged: [],
      recommendedStatus: "RESOLVED",
      confidence: 0.9,
      model: "test-fixture",
      modelVersion: "1",
    });
    const diff = await service.diff(issue.id, before, after.id);
    expect(diff).toMatchObject({
      model: "fieldissue-image-identity",
      added: [],
      removed: [],
      unchanged: [],
      recommendedStatus: "OPEN",
    });
    expect(diff.id).not.toBe(old.id);
    expect(
      (await repository.diffs(issue.id)).items.find((d) => d.id === old.id),
    ).toMatchObject({
      summary: "Incorrect model suggestion",
      supersededReason:
        "Identical uploaded files; prior model comparison withdrawn",
    });
    expect((await repository.get(issue.id)).status).toBe("OPEN");
    await expect(
      repository.patch(issue.id, { status: "RESOLVED" }, "fixture", {
        basis: "latest_observation",
        observationId: after.id,
      }),
    ).rejects.toMatchObject({ code: "REPEATED_PHOTO" });
    const events = (await repository.timeline(issue.id)).events;
    expect(
      events.find((e) => e.eventType === "COMPARISON_SUPERSEDED")?.payload
        .previousComparison.summary,
    ).toBe("Incorrect model suggestion");
    await service.diff(issue.id, before, after.id);
    expect((await repository.timeline(issue.id)).events.length).toBe(
      events.length,
    );
  });
  it("removes dependent records and retries failed media/secondary cleanup", async () => {
    const issue = await create();
    const revisit = await service.addObservation(
      issue.id,
      {
        note: "test",
        latitude: 0,
        longitude: 0,
        capturedAt: "2026-01-02T00:00:00Z",
      },
      media,
      "test-revisit",
    );
    keys.push(revisit.observation.storageKey);
    const audio = await storage.put({
      bytes: Buffer.from("audio fixture"),
      mime: "audio/mpeg",
      filename: "test.mp3",
    });
    keys.push(audio.storageKey);
    await pool.query(
      "INSERT INTO audio_summaries(cache_key,issue_id,media_url,storage_key,voice_id,model) VALUES($1,$2,$3,$4,'fixture','fixture')",
      [crypto.randomUUID(), issue.id, audio.mediaUrl, audio.storageKey],
    );
    let unavailable = true;
    const deleted: string[] = [];
    const lifecycle = new DataLifecycle(repository, storage, async (id) => {
      if (unavailable) throw new Error("offline");
      deleted.push(id);
    });
    await lifecycle.remove(issue.publicId);
    await expect(repository.get(issue.id)).rejects.toMatchObject({
      status: 404,
    });
    await lifecycle.cleanup();
    expect(
      (
        await pool.query(
          "SELECT attempts FROM removal_jobs WHERE issue_id=$1",
          [issue.id],
        )
      ).rows[0].attempts,
    ).toBe(1);
    await expect(storage.read(audio.storageKey)).rejects.toMatchObject({
      code: "MEDIA_NOT_FOUND",
    });
    unavailable = false;
    await pool.query(
      "UPDATE removal_jobs SET available_at=now() WHERE issue_id=$1",
      [issue.id],
    );
    await lifecycle.cleanup();
    expect(deleted).toContain(issue.id);
    expect(
      (
        await pool.query("SELECT 1 FROM removal_jobs WHERE issue_id=$1", [
          issue.id,
        ])
      ).rowCount,
    ).toBe(0);
    for (const table of [
      "observations",
      "idempotency_keys",
      "observation_requests",
      "audio_summaries",
      "evidence_diffs",
      "issue_events",
    ])
      expect(
        (
          await pool.query(`SELECT 1 FROM ${table} WHERE issue_id=$1`, [
            issue.id,
          ])
        ).rowCount,
      ).toBe(0);
  });
  it("expires inactive records only, leaving recently updated evidence intact", async () => {
    const old = await create(),
      recent = await create();
    await pool.query(
      "UPDATE issues SET updated_at=now()-interval '31 days' WHERE id=$1",
      [old.id],
    );
    const lifecycle = new DataLifecycle(repository, storage);
    expect(await lifecycle.expired(30)).toContain(old.publicId);
    expect(await lifecycle.expired(30)).not.toContain(recent.publicId);
    await lifecycle.maintain(30);
    await expect(repository.get(old.id)).rejects.toMatchObject({ status: 404 });
    expect((await repository.get(recent.id)).id).toBe(recent.id);
  });
});
