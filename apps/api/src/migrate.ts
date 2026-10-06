import { Pool } from "pg";
import { readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { databaseOptions } from "./db.js";
const root = resolve(fileURLToPath(new URL("../../../", import.meta.url)));
export async function migrate(pool: Pool, seed = false) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(
      "SELECT pg_advisory_xact_lock(hashtext('fieldissue:migrate'))",
    );
    await client.query(
      "CREATE TABLE IF NOT EXISTS schema_migrations(name TEXT PRIMARY KEY,applied_at TIMESTAMPTZ NOT NULL DEFAULT now())",
    );
    const dir = resolve(root, "db", seed ? "seeds" : "migrations");
    for (const name of (await readdir(dir))
      .filter((x) => x.endsWith(".sql"))
      .sort()) {
      const key = seed ? `seed:${name}` : name;
      if (
        (
          await client.query("SELECT 1 FROM schema_migrations WHERE name=$1", [
            key,
          ])
        ).rowCount
      )
        continue;
      await client.query(await readFile(resolve(dir, name), "utf8"));
      await client.query("INSERT INTO schema_migrations(name) VALUES($1)", [
        key,
      ]);
    }
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const pool = new Pool(databaseOptions());
  try {
    await migrate(pool, process.argv[2] === "seed");
    console.log("Database migrations applied");
  } catch {
    console.error(
      "Migration failed. Check DATABASE_URL and PostGIS/vector availability.",
    );
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}
