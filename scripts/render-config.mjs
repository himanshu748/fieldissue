// Validates the Render environment before any process starts. Two profiles:
//
// - production (default): S3 media, certificate-verified database TLS, and the
//   /ready health check that requires Gemma and the database.
// - judge demo (FIELDISSUE_DEMO_PROFILE=true): real Gemma only, never mocks.
//   Media must use durable PostgreSQL or S3 storage, the database may be a
//   Render private-network Postgres, and migrations run at start. Optional
//   provider credentials enable the separate synthetic TabPFN API demo. See
//   docs/render-deployment.md before using it.


export function renderEnvironment(source) {
  const env = { ...source };
  const demo = env.FIELDISSUE_DEMO_PROFILE === "true";
  // Judge demos are public with signed guest ownership; the operator token stays private.
  env.PUBLIC_GUEST_ACCESS ??= demo ? "true" : "false";
  const required = [
    "API_ACCESS_TOKEN",
    "INTERNAL_SERVICE_TOKEN",
    "DATABASE_URL",
    "GEMMA_BASE_URL",
    "GEMMA_MODEL",
    "GEMMA_MODEL_VERSION",
    "GEMMA_API_KEY",
  ];
  if (!demo || env.STORAGE_PROVIDER === "s3")
    required.push("S3_BUCKET", "S3_ACCESS_KEY_ID", "S3_SECRET_ACCESS_KEY");
  if (!demo) required.push("MEDIA_BASE_URL");
  for (const name of required) {
    if (!env[name]?.trim()) throw new Error(`Missing deployment setting: ${name}`);
  }
  // Refuse accidental mock deployments, an open public API, or shared tokens.
  if (
    env.API_ACCESS_TOKEN.length < 32 ||
    env.INTERNAL_SERVICE_TOKEN.length < 32 ||
    env.API_ACCESS_TOKEN === env.INTERNAL_SERVICE_TOKEN ||
    env.NODE_ENV !== "production" ||
    env.ENVIRONMENT !== "production" ||
    env.AI_MOCK_MODE !== "false" ||
    env.PORT === "8000"
  ) {
    throw new Error("Unsafe Render configuration; check docs/render-deployment.md");
  }
  if (!demo) {
    if (env.DATABASE_SSL !== "true" || env.STORAGE_PROVIDER !== "s3")
      throw new Error("Unsafe Render configuration; check docs/render-deployment.md");
    return { env, demo, migrateFirst: false };
  }
  // Plain TCP is accepted only for a single-label Render private-network host.
  let host;
  try {
    host = new URL(env.DATABASE_URL).hostname;
  } catch {
    throw new Error("DATABASE_URL must be a PostgreSQL URL");
  }
  if (env.DATABASE_SSL !== "true" && (env.DATABASE_SSL !== "false" || host.includes(".")))
    throw new Error("Demo profile: use DATABASE_SSL=true unless the database is on Render's private network");
  if (!["postgres", "s3"].includes(env.STORAGE_PROVIDER))
    throw new Error("Demo profile: STORAGE_PROVIDER must be postgres or s3 (durable evidence required)");
  if (!env.MEDIA_BASE_URL?.trim()) {
    if (!env.RENDER_EXTERNAL_URL?.trim())
      throw new Error("Missing deployment setting: MEDIA_BASE_URL");
    env.MEDIA_BASE_URL = `${env.RENDER_EXTERNAL_URL.replace(/\/+$/, "")}/media`;
  }
  return { env, demo, migrateFirst: true };
}
