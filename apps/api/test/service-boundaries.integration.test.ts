import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { Pool } from "pg";
import { mkdtemp, rm, readdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { IssueRepository } from "../src/repository.js";
import { IssueService } from "../src/service.js";
import { LocalStorageProvider } from "../src/storage.js";
import { migrate } from "../src/migrate.js";
import { databaseOptions } from "../src/db.js";
import { createApp } from "../src/app.js";
import type { IntelligenceProvider } from "../src/intelligence.js";

function barrier(count: number) {
  let entered!: () => void;
  let release!: () => void;
  const allEntered = new Promise<void>((resolve) => {
    entered = resolve;
  });
  const released = new Promise<void>((resolve) => {
    release = resolve;
  });
  return {
    allEntered,
    release,
    wait: async () => {
      if (--count === 0) entered();
      await released;
    },
  };
}
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
  suggestedCategory: "INFRASTRUCTURE" as const,
  suggestedSeverity: "MEDIUM" as const,
  evidence: ["broken slat"],
  confidence: 0.9,
  model: "fixture",
  modelVersion: "1",
};
const unusedCompare = async () => {
  throw new Error("Unexpected comparison in issue creation");
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

  it.each(["analysis", "upload", "prediction"])(
    "keeps readiness available while concurrent %s calls are waiting",
    async (stage) => {
      const limitedPool = new Pool({
        ...databaseOptions({ DATABASE_URL: process.env.TEST_DATABASE_URL }),
        max: 2,
        connectionTimeoutMillis: 500,
      });
      const limitedRepository = new IssueRepository(limitedPool);
      const gate = barrier(2);
      const provider = {
        compare: unusedCompare,
        analyze: async () => {
          if (stage === "analysis") await gate.wait();
          return analysis;
        },
        predict: async () => {
          if (stage === "prediction") await gate.wait();
          return {
            probabilityChanged: 0.5,
            priorityScore: 0.2,
            modelVersion: "test",
          };
        },
      } satisfies IntelligenceProvider;
      const gatedStorage = {
        put: async (value: typeof media) => {
          if (stage === "upload") await gate.wait();
          return storage.put(value);
        },
        read: (key: string) => storage.read(key),
        delete: (key: string) => storage.delete(key),
      };
      const service = new IssueService(
        limitedRepository,
        gatedStorage,
        provider,
      );
      const app = createApp({
        service,
        repository: limitedRepository,
        storage: gatedStorage,
        maxUploadBytes: 10485760,
        ready: async () => true,
      });
      const pending = Promise.allSettled(
        [1, 2].map(async () => {
          const created = await service.create(input, media);
          ids.push(created.id);
          return created;
        }),
      );
      // Bounded even if a regression fails before reaching the chosen provider.
      const timeout = setTimeout(gate.release, 5000);
      try {
        await Promise.race([
          gate.allEntered,
          pending.then(() => {
            throw new Error("Creation ended before provider gate");
          }),
        ]);
        expect((await app.request("/ready")).status).toBe(200);
      } finally {
        clearTimeout(timeout);
        gate.release();
        const results = await pending;
        await limitedPool.end();
        expect(results.every((r) => r.status === "fulfilled")).toBe(true);
      }
    },
  );

  it.each([undefined, "prediction-write-failure"])(
    "keeps core writes committed when prediction SQL fails (key: %s)",
    async (key) => {
      await pool.query(
        "CREATE FUNCTION fixture_reject_prediction() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'fixture prediction failure'; END $$; CREATE TRIGGER fixture_prediction_failure BEFORE INSERT ON revisit_predictions FOR EACH ROW EXECUTE FUNCTION fixture_reject_prediction()",
      );
      try {
        const service = new IssueService(repository, storage, {
          compare: unusedCompare,
          analyze: async () => analysis,
          predict: async () => ({
            probabilityChanged: 0.5,
            priorityScore: 0.2,
            modelVersion: "test",
          }),
        });
        const created = await service.create(input, media, key);
        ids.push(created.id);
        expect(created).toMatchObject({
          status: "OPEN",
          revisitMetadata: { available: false },
        });
        expect(created.observations).toHaveLength(1);
        expect(
          (await storage.read(created.observations[0].storageKey)).bytes,
        ).toEqual(media.bytes);
        const events = await repository.timeline(created.id);
        expect(events.events.map((event) => event.eventType)).toEqual([
          "ISSUE_CREATED",
          "CLASSIFICATION_UPDATED",
        ]);
        if (key) {
          const replay = await service.create(input, media, key);
          expect(replay).toMatchObject({ id: created.id, replayed: true });
        }
      } finally {
        await pool.query(
          "DROP TRIGGER fixture_prediction_failure ON revisit_predictions; DROP FUNCTION fixture_reject_prediction()",
        );
      }
    },
  );

  it("keeps only the winning upload when concurrent creations share a key", async () => {
    const before = (await readdir(directory)).length;
    const gate = barrier(2);
    const service = new IssueService(repository, storage, {
      compare: unusedCompare,
      analyze: async () => {
        await gate.wait();
        return analysis;
      },
      predict: async () => ({
        probabilityChanged: 0.5,
        priorityScore: 0.2,
        modelVersion: "test",
      }),
    });
    const pending = Promise.allSettled(
      [1, 2].map(async () => {
        const created = await service.create(
          input,
          media,
          "concurrent-boundary-media",
        );
        ids.push(created.id);
        return created;
      }),
    );
    const timeout = setTimeout(gate.release, 5000);
    try {
      await Promise.race([
        gate.allEntered,
        pending.then(() => {
          throw new Error("Creation ended before provider gate");
        }),
      ]);
    } finally {
      clearTimeout(timeout);
      gate.release();
    }
    const results = await pending;
    expect(results.every((r) => r.status === "fulfilled")).toBe(true);
    const created = results.map((r) => {
      if (r.status === "rejected") throw r.reason;
      return r.value;
    });
    expect(new Set(created.map((r) => r.id)).size).toBe(1);
    expect(created.filter((r) => r.replayed)).toHaveLength(1);
    expect((await readdir(directory)).length).toBe(before + 1);
    expect(created[0].observations).toHaveLength(1);
  });
});
