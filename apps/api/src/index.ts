import { serve } from "@hono/node-server";
import { Pool } from "pg";
import { databaseOptions } from "./db.js";
import { S3Client } from "@aws-sdk/client-s3";
import { resolve } from "node:path";
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
const service = new IssueService(repository, storage, intelligence, place);
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
  ? new AudioSummaryService(repository, storage, speech)
  : undefined;
const app = createApp({
  service,
  repository,
  storage,
  maxUploadBytes: config.MAX_UPLOAD_BYTES,
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
  const timeout = setTimeout(() => process.exit(1), 10000);
  timeout.unref();
  server.close(() => {
    void Promise.all([pool.end(), flushTelemetry()]).finally(() => {
      clearTimeout(timeout);
      process.exit(0);
    });
  });
};
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
