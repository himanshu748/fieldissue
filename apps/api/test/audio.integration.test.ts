import { beforeAll, afterAll, describe, expect, it } from "vitest";
import { Pool } from "pg";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { IssueRepository } from "../src/repository.js";
import { LocalStorageProvider } from "../src/storage.js";
import { AudioSummaryService } from "../src/audio.js";
import { migrate } from "../src/migrate.js";
const describeDb = process.env.TEST_DATABASE_URL ? describe : describe.skip;
describeDb("durable audio cache", () => {
  let pool: Pool;
  let directory: string;
  let audio: AudioSummaryService;
  let calls = 0;
  const id = "30000000-0000-4000-8000-000000000001";
  beforeAll(async () => {
    pool = new Pool({
      connectionString: process.env.TEST_DATABASE_URL,
      max: 1,
      connectionTimeoutMillis: 15000,
    });
    await migrate(pool);
    await pool.query(
      "INSERT INTO issues(id,title,category,severity,latitude,longitude) VALUES($1,'Audio briefing fixture','OTHER','LOW',0,0)",
      [id],
    );
    directory = await mkdtemp(join(tmpdir(), "fi-audio-"));
    const storage = new LocalStorageProvider(
      directory,
      "http://localhost:3000/media",
    );
    audio = new AudioSummaryService(new IssueRepository(pool), storage, {
      voiceId: "public-voice",
      model: "test-model",
      generate: async () => {
        calls++;
        // This needs the only pool connection: provider I/O must not hold it.
        await pool.query("SELECT 1");
        await new Promise((r) => setTimeout(r, 20));
        return {
          bytes: Buffer.from("ID3fixture"),
          mime: "audio/mpeg",
          filename: "briefing.mp3",
        };
      },
    });
  });
  afterAll(async () => {
    if (pool) {
      await pool.query("DELETE FROM issues WHERE id=$1", [id]);
      await pool.end();
    }
    if (directory) await rm(directory, { recursive: true, force: true });
  });
  it("serializes concurrent requests so credits are spent once and cached durably", async () => {
    const results = await Promise.all([1, 2, 3].map(() => audio.generate(id)));
    expect(calls).toBe(1);
    expect(new Set(results.map((x) => x.storageKey)).size).toBe(1);
    expect(results.filter((x) => x.cached)).toHaveLength(2);
    expect(
      (
        await pool.query(
          "SELECT count(*)::int c FROM audio_summaries WHERE issue_id=$1",
          [id],
        )
      ).rows[0].c,
    ).toBe(1);
  });
  it("invalidates cache when issue content changes", async () => {
    await pool.query(
      "UPDATE issues SET title='Updated briefing fixture',updated_at=clock_timestamp() WHERE id=$1",
      [id],
    );
    const result = await audio.generate(id);
    expect(result.cached).toBe(false);
    expect(calls).toBe(2);
    expect(result.text).toContain("Updated briefing fixture");
  });
  it("releases a failed provider lease so a retry can succeed", async () => {
    let attempts = 0;
    const retrying = new AudioSummaryService(
      new IssueRepository(pool),
      new LocalStorageProvider(directory, "http://localhost:3000/media"),
      {
        voiceId: "public-voice",
        model: "failure-test",
        generate: async () => {
          if (++attempts === 1) throw new Error("Provider unavailable");
          return {
            bytes: Buffer.from("ID3fixture"),
            mime: "audio/mpeg",
            filename: "briefing.mp3",
          };
        },
      },
    );
    await expect(retrying.generate(id)).rejects.toThrow("Provider unavailable");
    expect((await retrying.generate(id)).cached).toBe(false);
    expect(attempts).toBe(2);
    expect(
      (
        await pool.query(
          "SELECT count(*)::int c FROM audio_generation_leases WHERE issue_id=$1",
          [id],
        )
      ).rows[0].c,
    ).toBe(0);
  });
  it("discards audio if the issue changes during generation", async () => {
    const deleted: string[] = [];
    const changing = new AudioSummaryService(
      new IssueRepository(pool),
      {
        put: async () => ({
          storageKey: "stale.mp3",
          mediaUrl: "http://localhost/media/stale.mp3",
          mimeType: "audio/mpeg",
        }),
        delete: async (key) => {
          deleted.push(key);
        },
        read: async () => {
          throw new Error("unused");
        },
      },
      {
        voiceId: "public-voice",
        model: "stale-test",
        generate: async () => {
          await pool.query(
            "UPDATE issues SET title='Changed during speech', updated_at=clock_timestamp() WHERE id=$1",
            [id],
          );
          return {
            bytes: Buffer.from("ID3fixture"),
            mime: "audio/mpeg",
            filename: "briefing.mp3",
          };
        },
      },
    );
    await expect(changing.generate(id)).rejects.toMatchObject({
      code: "EVIDENCE_CHANGED",
    });
    expect(deleted).toEqual(["stale.mp3"]);
    expect(
      (
        await pool.query(
          "SELECT count(*)::int c FROM audio_summaries WHERE issue_id=$1 AND model='stale-test'",
          [id],
        )
      ).rows[0].c,
    ).toBe(0);
  });
});
