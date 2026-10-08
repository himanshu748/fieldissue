import { beforeAll, afterAll, describe, it, expect, vi } from "vitest";
import { Pool } from "pg";
import { IssueRepository } from "../src/repository.js";
import { migrate } from "../src/migrate.js";
import { SemanticSearch } from "../src/semantic.js";
const describeDb = process.env.TEST_DATABASE_URL ? describe : describe.skip;
describeDb("durable secondary index queue", () => {
  let pool: Pool, repo: IssueRepository, id: string;
  beforeAll(async () => {
    pool = new Pool({ connectionString: process.env.TEST_DATABASE_URL });
    await migrate(pool);
    repo = new IssueRepository(pool);
    id = (
      await repo.create(
        {
          title: "Index retry fixture",
          description: "",
          note: "",
          latitude: 0,
          longitude: 0,
        },
        {
          mediaUrl: "https://example.test/test.jpg",
          storageKey: "queue-test.jpg",
          mimeType: "image/jpeg",
        },
        {
          objects: ["bench"],
          conditions: ["damaged"],
          evidence: [],
          suggestedCategory: "OTHER",
          suggestedSeverity: "LOW",
          confidence: 0.5,
          model: "development-fixture",
          modelVersion: "test",
        },
      )
    ).id;
  });
  afterAll(async () => {
    if (id) await pool.query("DELETE FROM issues WHERE id=$1", [id]);
    await pool?.end();
  });
  it("retains primary writes through failure, retries, and does not lose a newer edit during embedding", async () => {
    const tiger = { query: vi.fn(async () => ({ rows: [] })) } as any;
    const failed = new SemanticSearch(repo, tiger, async () => {
      throw Error("test provider outage");
    });
    expect(await failed.processNext(id)).toBe(false);
    expect((await repo.get(id)).status).toBe("OPEN");
    let job = (
      await pool.query("SELECT * FROM semantic_index_jobs WHERE issue_id=$1", [
        id,
      ])
    ).rows[0];
    expect(job.attempts).toBe(1);
    expect(job.last_error).toBe("INDEX_UNAVAILABLE");
    expect(tiger.query).not.toHaveBeenCalled();
    await pool.query(
      "UPDATE semantic_index_jobs SET available_at=now() WHERE issue_id=$1",
      [id],
    );
    const claimedVersion = job.version;
    const worker = new SemanticSearch(repo, tiger, async () => {
      await repo.patch(id, { title: "Corrected index retry fixture" });
      return Array(384).fill(1 / Math.sqrt(384));
    });
    expect(await worker.processNext(id)).toBe(true);
    job = (
      await pool.query("SELECT * FROM semantic_index_jobs WHERE issue_id=$1", [
        id,
      ])
    ).rows[0];
    expect(job.completed_version).toBe(claimedVersion);
    expect(Number(job.version)).toBeGreaterThan(Number(job.completed_version));
    const next = new SemanticSearch(repo, tiger, async () =>
      Array(384).fill(1 / Math.sqrt(384)),
    );
    expect(await next.processNext(id)).toBe(true);
    job = (
      await pool.query("SELECT * FROM semantic_index_jobs WHERE issue_id=$1", [
        id,
      ])
    ).rows[0];
    expect(job.completed_version).toBe(job.version);
    expect(await next.processNext(id)).toBe(false);
    expect(
      (await repo.timeline(id)).events.some(
        (e) => e.eventType === "ISSUE_UPDATED",
      ),
    ).toBe(true);
  });
});
