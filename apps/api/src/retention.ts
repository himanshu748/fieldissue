import { removeFromSemanticIndex } from "./semantic.js";
import { Pool } from "pg";
import { readConfig } from "./config.js";
import { databaseOptions } from "./db.js";
import { IssueRepository } from "./repository.js";
import { DataLifecycle } from "./lifecycle.js";
import { PostgresStorageProvider } from "./postgres-storage.js";

// Explicit operator command; defaults to a preview, never deleting implicitly.
const config = readConfig();
const pool = new Pool(databaseOptions(config));
const tiger = config.TIGER_DATABASE_URL
  ? new Pool({
      connectionString: config.TIGER_DATABASE_URL,
      ssl: { rejectUnauthorized: true },
      connectionTimeoutMillis: 10000,
      statement_timeout: 15000,
    })
  : undefined;
try {
  if (config.STORAGE_PROVIDER !== "postgres")
    throw new Error(
      "This operator command supports the hosted postgres storage configuration only.",
    );
  const lifecycle = new DataLifecycle(
    new IssueRepository(pool),
    new PostgresStorageProvider(pool, config.MEDIA_BASE_URL),
    tiger
      ? async (id) => {
          await removeFromSemanticIndex(tiger, id);
        }
      : undefined,
  );
  const [command, value, confirmation] = process.argv.slice(2);
  if (
    command === "remove" &&
    /^FI-[0-9]+$/.test(value ?? "") &&
    confirmation === `--confirm=${value}`
  ) {
    console.log(await lifecycle.remove(value!));
    await lifecycle.cleanup();
  } else if (command === "preview") {
    console.log({
      expired: config.DATA_RETENTION_DAYS
        ? await lifecycle.expired(config.DATA_RETENTION_DAYS)
        : [],
      retentionDays: config.DATA_RETENTION_DAYS,
    });
  } else
    throw new Error(
      "Usage: retention.ts preview | remove FI-000123 --confirm=FI-000123",
    );
} finally {
  await Promise.all([pool.end(), tiger?.end()]);
}
