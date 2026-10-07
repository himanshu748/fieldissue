import { spawn, spawnSync } from "node:child_process";
import { renderEnvironment } from "./render-config.mjs";

// Refuse accidental mock deployments, ephemeral uploads outside the explicit
// demo profile, or an open public API. See scripts/render-config.mjs.
const { env, demo, migrateFirst } = renderEnvironment(process.env);
Object.assign(process.env, env);
process.env.INTELLIGENCE_URL = "http://127.0.0.1:8000";
if (demo)
  console.log(
    "FieldIssue judge demo profile: real Gemma, no TabPFN, " +
      (process.env.STORAGE_PROVIDER === "local" ? "ephemeral local media" : "S3 media"),
  );
if (migrateFirst) {
  const migration = spawnSync(process.execPath, ["apps/api/dist/migrate.js"], {
    stdio: "inherit",
  });
  if (migration.status !== 0) process.exit(1);
}
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
