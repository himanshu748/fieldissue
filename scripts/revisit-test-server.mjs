/** Isolated local QA only. Never imports production config or provider credentials. */
import { serve } from "@hono/node-server";
import { Pool } from "pg";
import { resolve } from "node:path";
import { createApp } from "../apps/api/dist/app.js";
import { IssueRepository } from "../apps/api/dist/repository.js";
import { IssueService } from "../apps/api/dist/service.js";
import { PostgresStorageProvider } from "../apps/api/dist/postgres-storage.js";
import { migrate } from "../apps/api/dist/migrate.js";
const db = new URL(process.env.TEST_DATABASE_URL ?? "");
if (
  !["127.0.0.1", "localhost"].includes(db.hostname) ||
  db.pathname !== "/fieldissue_test"
)
  throw new Error("Requires isolated localhost fieldissue_test database");
const pool = new Pool({ connectionString: db.href });
await migrate(pool);
const repository = new IssueRepository(pool);
const origin = "http://127.0.0.1:3190";
const storage = new PostgresStorageProvider(pool, `${origin}/media`);
const service = new IssueService(
  repository,
  storage,
  {
    analyze: async () => ({
      objects: ["synthetic tree"],
      conditions: ["schematic branches"],
      suggestedCategory: "ENVIRONMENT",
      suggestedSeverity: "MEDIUM",
      evidence: ["Synthetic drawing for interface testing only"],
      confidence: 0,
      model: "synthetic-browser-fixture",
      modelVersion: "1",
    }),
    compare: async ({ before, after }) => {
      const wrong = [before.note, after.note].some((n) =>
        n.includes("wrong tree"),
      );
      return {
        outcome: wrong ? "NOT_COMPARABLE" : "UNCHANGED",
        comparabilityReason: wrong
          ? "Synthetic fixture depicts a different tree. Retake the same subject."
          : "Synthetic fixture of the same broken trunk.",
        sameSubjectEvidence: wrong ? [] : ["matching schematic trunk"],
        summary: wrong
          ? "Different synthetic subjects. No reliable assessment."
          : "Synthetic fixture branches remain; not a real model assessment.",
        removed: [],
        added: [],
        unchanged: wrong ? [] : ["schematic branches remain"],
        recommendedStatus: "OPEN",
        confidence: 0,
        model: "synthetic-browser-fixture",
        modelVersion: "1",
      };
    },
  },
  undefined,
  async () => {},
  false,
);
const app = createApp({
  repository,
  service,
  storage,
  webDirectory: resolve("apps/web/dist"),
  publicAccess: true,
  publicOrigin: origin,
  accessToken: "isolated-browser-test-token-not-a-production-secret",
  maxUploadBytes: 1000000,
  capabilities: {
    mock: true,
    publicAccess: true,
    accessRequired: false,
    storage: "postgres",
    audio: false,
  },
});
const server = serve(
  { fetch: app.fetch, hostname: "127.0.0.1", port: 3190 },
  () =>
    console.log("Synthetic QA server on localhost:3190; no external providers"),
);
process.on("SIGTERM", () => server.close(() => void pool.end()));
