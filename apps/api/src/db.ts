import type { PoolConfig } from "pg";
import { config as loadEnv } from "dotenv";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
loadEnv({
  path: resolve(fileURLToPath(new URL("../../../", import.meta.url)), ".env"),
  quiet: true,
});
/** Shared pool options so migrations and runtime enforce identical TLS policy. */
export function databaseOptions(
  env: Record<string, unknown> = process.env,
): PoolConfig {
  if (typeof env.DATABASE_URL !== "string" || !env.DATABASE_URL)
    throw new Error("DATABASE_URL is required");
  const url = new URL(env.DATABASE_URL);
  if (!["postgres:", "postgresql:"].includes(url.protocol))
    throw new Error("DATABASE_URL must use PostgreSQL");
  const tls = env.DATABASE_SSL === "true";
  if (
    tls &&
    ["sslmode", "sslcert", "sslkey", "sslrootcert"].some((key) =>
      url.searchParams.has(key),
    )
  )
    throw new Error(
      "Remove SSL URL options and use DATABASE_SSL=true for certificate-verified TLS",
    );
  return {
    connectionString: env.DATABASE_URL,
    max: 10,
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
    statement_timeout: 10000,
    ssl: tls ? { rejectUnauthorized: true } : false,
  };
}
