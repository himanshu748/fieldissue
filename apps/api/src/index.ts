import { removeFromSemanticIndex } from "./semantic.js";
import { DataLifecycle } from "./lifecycle.js";
import { BackboardProvider, ModelComparisonService } from "./backboard.js";
import { SemanticSearch, embeddingClient } from "./semantic.js";
import { PostgresStorageProvider } from "./postgres-storage.js";
import { RequestGuard, dailyAllowance } from "./request-guard.js";
import { serve } from "@hono/node-server";
import { Pool } from "pg";
import { databaseOptions } from "./db.js";
import { S3Client } from "@aws-sdk/client-s3";
import { resolve } from "node:path";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { readConfig } from "./config.js";
import {
  LocalStorageProvider,
  S3CompatibleStorageProvider,
} from "./storage.js";
import { IntelligenceClient } from "./intelligence.js";
import { IssueRepository } from "./repository.js";
import { IssueService } from "./service.js";
import { createApp } from "./app.js";
import {
  initializeTelemetry,
  flushTelemetry,
  reportFailure,
} from "./telemetry.js";
import { SerpApiPlaceContextProvider } from "./place.js";
import { ElevenLabsSpeechProvider, AudioSummaryService } from "./audio.js";
const config = readConfig();
initializeTelemetry(config.SENTRY_DSN);
const pool = new Pool(databaseOptions(config));
pool.on("error", () => {
  reportFailure("DATABASE_FAILURE", "database");
  console.error("Database pool failure");
});
const storage =
  config.STORAGE_PROVIDER === "local"
    ? new LocalStorageProvider(
        resolve(
          fileURLToPath(new URL("../../../", import.meta.url)),
          config.LOCAL_STORAGE_PATH,
        ),
        config.MEDIA_BASE_URL,
      )
    : config.STORAGE_PROVIDER === "postgres"
      ? new PostgresStorageProvider(
          pool,
          config.MEDIA_BASE_URL,
          config.MEDIA_DATABASE_MAX_BYTES,
        )
      : new S3CompatibleStorageProvider(
          new S3Client({
            endpoint: config.S3_ENDPOINT,
            region: config.S3_REGION,
            forcePathStyle: true,
            credentials: {
              accessKeyId: config.S3_ACCESS_KEY_ID!,
              secretAccessKey: config.S3_SECRET_ACCESS_KEY!,
            },
            maxAttempts: 2,
          }),
          config.S3_BUCKET!,
          config.MEDIA_BASE_URL,
        );
const intelligence = new IntelligenceClient(
  config.INTELLIGENCE_URL,
  config.INTERNAL_SERVICE_TOKEN,
  config.PROVIDER_TIMEOUT_MS,
  0,
);
const repository = new IssueRepository(pool);
const place = config.SERPAPI_API_KEY
  ? new SerpApiPlaceContextProvider(config.SERPAPI_API_KEY)
  : undefined;
const consume = dailyAllowance(pool, config.PROVIDER_DAILY_UNITS);
const service = new IssueService(
  repository,
  storage,
  intelligence,
  place,
  consume,
  config.AI_MOCK_MODE === "true" ||
    !!(config.TABPFN_TRAINING_DATA && config.TABPFN_WEIGHTS_PATH),
);
const speech =
  config.ELEVENLABS_API_KEY && config.ELEVENLABS_VOICE_ID
    ? new ElevenLabsSpeechProvider(
        config.ELEVENLABS_API_KEY,
        config.ELEVENLABS_VOICE_ID,
        config.ELEVENLABS_MODEL_ID,
        config.ELEVENLABS_TIMEOUT_MS,
      )
    : undefined;
const audio = speech
  ? new AudioSummaryService(repository, storage, speech, consume)
  : undefined;
const tiger = config.TIGER_DATABASE_URL
  ? new Pool({
      connectionString: config.TIGER_DATABASE_URL,
      ssl: { rejectUnauthorized: true },
      max: 2,
      connectionTimeoutMillis: 10000,
      statement_timeout: 15000,
    })
  : undefined;
tiger?.on("error", () =>
  reportFailure("SEMANTIC_DATABASE_FAILURE", "database"),
);
const semantic =
  config.SEMANTIC_SEARCH_ENABLED === "true" && tiger
    ? new SemanticSearch(
        repository,
        tiger,
        embeddingClient(config.INTELLIGENCE_URL, config.INTERNAL_SERVICE_TOKEN),
      )
    : undefined;
let indexTimer: NodeJS.Timeout | undefined;
if (semantic) {
  indexTimer = setInterval(() => void semantic.processNext(), 30000);
  indexTimer.unref();
}
const lifecycle = new DataLifecycle(
  repository,
  storage,
  tiger
    ? async (id) => {
        await removeFromSemanticIndex(tiger, id);
      }
    : undefined,
);
const retentionTimer = setInterval(
  () =>
    void lifecycle
      .maintain(config.DATA_RETENTION_DAYS)
      .catch(() => reportFailure("RETENTION_FAILURE", "database")),
  60000,
);
retentionTimer.unref();
const webDirectory = fileURLToPath(new URL("../../web/dist", import.meta.url));
const app = createApp({
  modelComparison: config.BACKBOARD_API_KEY
    ? new ModelComparisonService(
        repository,
        new BackboardProvider(config.BACKBOARD_API_KEY),
        consume,
      )
    : undefined,
  semantic,
  consumeSearch: () => consume(1),
  webDirectory: existsSync(resolve(webDirectory, "index.html"))
    ? webDirectory
    : undefined,
  integrations: [
    {
      id: "render",
      name: "Render",
      status: process.env.RENDER ? "configured" : "local",
      detail: "Primary PostgreSQL database and application hosting.",
    },
    {
      id: "gemma",
      name: "Gemma",
      status: "configured",
      detail:
        "Core readiness checks model availability; saved observations carry actual inference provenance.",
    },
    {
      id: "mastra",
      name: "Mastra",
      status: "configured",
      detail: "Validated evidence workflow orchestration.",
    },
    {
      id: "serpapi",
      name: "SerpApi",
      status: place ? "configured" : "unavailable",
      detail:
        "Optional nearby place context; report creation survives provider failure.",
    },
    {
      id: "sentry",
      name: "Sentry",
      status: config.SENTRY_DSN ? "configured" : "unavailable",
      detail: "Sanitized service errors and timing; no report photos or notes.",
    },
    {
      id: "tinker",
      name: "Tinker",
      status: "recorded",
      detail:
        "Real training run on synthetic notes; expired checkpoint, offline evaluation only.",
    },
    {
      id: "elevenlabs",
      name: "ElevenLabs",
      status: audio ? "configured" : "unavailable",
      detail:
        "Cached spoken issue briefings when quota and credentials are configured.",
    },
    {
      id: "backboard",
      name: "Backboard",
      status: config.BACKBOARD_API_KEY ? "configured" : "unavailable",
      detail:
        "Consent-based Gemma 3 and Qwen 2.5 text interpretation comparison; results never resolve issues.",
    },
    {
      id: "tiger",
      name: "Tiger Data",
      status: semantic ? "configured" : "unavailable",
      detail:
        "Secondary hybrid keyword and open-model vector search; writes use a durable retry queue.",
    },
    {
      id: "entire",
      name: "Entire",
      status: "local_evidence",
      detail:
        "Actual Claude frontend session attached to the V2 commit; reviewed provenance is in docs/verification/entire-v2-2026-10-08.md. Raw transcript stays private.",
    },
    {
      id: "tabpfn",
      name: "TabPFN",
      status: "experimental",
      detail:
        "Disabled without genuine labeled revisit history, runtime and evaluation.",
    },
  ],
  service,
  repository,
  storage,
  maxUploadBytes: config.MAX_UPLOAD_BYTES,
  guard: new RequestGuard(
    async () => {},
    config.WRITE_REQUESTS_PER_MINUTE,
    config.PROVIDER_CONCURRENCY,
  ),
  capabilities: {
    accessRequired:
      !!config.API_ACCESS_TOKEN && config.PUBLIC_GUEST_ACCESS !== "true",
    publicAccess: config.PUBLIC_GUEST_ACCESS === "true",
    storage: config.STORAGE_PROVIDER,
    retentionNotice:
      config.DATA_RETENTION_DAYS > 0
        ? `Reports expire after ${config.DATA_RETENTION_DAYS} days without an update. Photos, audio and the search index are queued for removal; provider backups follow their own retention policies.`
        : (config.DATA_RETENTION_NOTICE ??
          "Operator-managed retention. Contact the workspace owner with an issue ID for removal."),
    audio: !!audio,
    mock: config.AI_MOCK_MODE === "true",
  },
  accessToken: config.API_ACCESS_TOKEN,
  publicAccess: config.PUBLIC_GUEST_ACCESS === "true",
  publicOrigin: new URL(config.MEDIA_BASE_URL).origin,
  secureGuestCookie: config.NODE_ENV === "production",
  ready: () => intelligence.ready(),
  audio: audio ? (id) => audio.generate(id) : undefined,
});
const server = serve(
  { fetch: app.fetch, hostname: "0.0.0.0", port: config.PORT },
  () => console.log(`FieldIssue API listening on ${config.PORT}`),
);
let stopping = false;
const shutdown = () => {
  if (stopping) return;
  stopping = true;
  if (indexTimer) clearInterval(indexTimer);
  clearInterval(retentionTimer);
  const timeout = setTimeout(() => process.exit(1), 10000);
  timeout.unref();
  server.close(() => {
    void Promise.all([pool.end(), tiger?.end(), flushTelemetry()]).finally(
      () => {
        clearTimeout(timeout);
        process.exit(0);
      },
    );
  });
};
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
