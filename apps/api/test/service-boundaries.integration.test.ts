import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { Pool } from "pg";
import { mkdtemp, rm, readdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { IssueRepository } from "../src/repository.js";
import { IssueService } from "../src/service.js";
import { LocalStorageProvider } from "../src/storage.js";
import { migrate } from "../src/migrate.js";
const describeDb = process.env.TEST_DATABASE_URL ? describe : describe.skip;
const media = {
  bytes: Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wl6X8sAAAAASUVORK5CYII=",
    "base64",
  ),
  mime: "image/png",
  filename: "bench.png",
};
const input = {
  title: "Provider boundary fixture",
  description: "",
  note: "broken bench",
  latitude: 12,
  longitude: 77,
};
const analysis = {
  objects: ["bench"],
  conditions: ["broken slat"],
  suggestedCategory: "INFRASTRUCTURE",
  suggestedSeverity: "MEDIUM",
  evidence: ["broken slat"],
  confidence: 0.9,
  model: "fixture",
  modelVersion: "1",
};
describeDb("provider and transaction boundaries", () => {
  let pool: Pool;
  let directory: string;
  let repository: IssueRepository;
  let storage: LocalStorageProvider;
  const ids: string[] = [];
  beforeAll(async () => {
    pool = new Pool({ connectionString: process.env.TEST_DATABASE_URL });
    await migrate(pool);
    repository = new IssueRepository(pool);
    directory = await mkdtemp(join(tmpdir(), "fi-boundaries-"));
    storage = new LocalStorageProvider(directory, "http://localhost/media");
  });
  afterAll(async () => {
    await pool.query(
      "DELETE FROM idempotency_keys WHERE issue_id=ANY($1::uuid[])",
      [ids],
    );
    await pool.query("DELETE FROM issues WHERE id=ANY($1::uuid[])", [ids]);
    await pool.end();
    await rm(directory, { recursive: true, force: true });
  });
  it("replays persisted requests even when inference later fails", async () => {
    let unavailable = false;
    let calls = 0;
    const provider = {
      analyze: async () => {
        calls++;
        if (unavailable) throw new Error("offline");
        return analysis;
      },
      predict: async () => {
        throw new Error("no predictor");
      },
    };
    const service = new IssueService(repository, storage, provider as never);
    const first = await service.create(input, media, "boundary-replay");
    ids.push(first.id);
    unavailable = true;
    const second = await service.create(input, media, "boundary-replay");
    expect(second.id).toBe(first.id);
    expect(second.replayed).toBe(true);
    expect(calls).toBe(1);
  });
  it("rejects malformed inference before writing storage or database", async () => {
    const before = (await readdir(directory)).length;
    const service = new IssueService(repository, storage, {
      analyze: async () => ({ confidence: 12 }),
      predict: async () => ({}),
    } as never);
    await expect(service.create(input, media)).rejects.toMatchObject({
      code: "INVALID_MODEL_OUTPUT",
    });
    expect((await readdir(directory)).length).toBe(before);
  });
  it("optional place failure cannot roll back a created issue", async () => {
    const provider = {
      analyze: async () => analysis,
      predict: async () => {
        throw new Error("not configured");
      },
    };
    const service = new IssueService(repository, storage, provider as never, {
      context: async () => {
        throw new Error("provider failed");
      },
    });
    const created = await service.create(input, media);
    ids.push(created.id);
    expect((await repository.get(created.id)).status).toBe("OPEN");
    expect(created.placeContext).toBeNull();
  });
});
