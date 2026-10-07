import { spawn } from "node:child_process";

// Refuse accidental mock deployments, ephemeral uploads, or an open public API.
for (const name of ["API_ACCESS_TOKEN", "INTERNAL_SERVICE_TOKEN", "DATABASE_URL",
  "GEMMA_BASE_URL", "GEMMA_MODEL", "GEMMA_MODEL_VERSION", "GEMMA_API_KEY",
  "S3_BUCKET", "S3_ACCESS_KEY_ID", "S3_SECRET_ACCESS_KEY", "MEDIA_BASE_URL"]) {
  if (!process.env[name]?.trim()) throw new Error(`Missing deployment setting: ${name}`);
}
if (process.env.API_ACCESS_TOKEN.length < 32 ||
    process.env.INTERNAL_SERVICE_TOKEN.length < 32 ||
    process.env.API_ACCESS_TOKEN === process.env.INTERNAL_SERVICE_TOKEN ||
    process.env.NODE_ENV !== "production" || process.env.ENVIRONMENT !== "production" ||
    process.env.AI_MOCK_MODE !== "false" || process.env.DATABASE_SSL !== "true" ||
    process.env.STORAGE_PROVIDER !== "s3" || process.env.PORT === "8000") {
  throw new Error("Unsafe Render configuration; check docs/render-deployment.md");
}
process.env.INTELLIGENCE_URL = "http://127.0.0.1:8000";
const children = [
  spawn("/app/intelligence/.venv/bin/python", ["-m", "uvicorn",
    "fieldissue_intelligence.app:app", "--host", "127.0.0.1", "--port", "8000"],
  { cwd: "/app/intelligence", stdio: "inherit" }),
  spawn(process.execPath, ["apps/api/dist/index.js"], { stdio: "inherit" }),
];
let stopping = false;
let remaining = children.length;
let exitCode = 0;
function stop(code) {
  if (stopping) return;
  stopping = true;
  exitCode = code;
  for (const child of children) child.kill("SIGTERM");
  setTimeout(() => {
    for (const child of children) child.kill("SIGKILL");
  }, 12000).unref();
}
for (const child of children) {
  child.on("error", () => stop(1));
  child.on("exit", () => { if (!stopping) stop(1); });
  child.on("close", () => { if (--remaining === 0) process.exit(exitCode); });
}
process.on("SIGTERM", () => stop(0));
process.on("SIGINT", () => stop(0));
