import { expect, it } from "vitest";
// @ts-expect-error plain ESM script without type declarations
import { renderEnvironment } from "../../../scripts/render-config.mjs";

const base = {
  NODE_ENV: "production",
  ENVIRONMENT: "production",
  AI_MOCK_MODE: "false",
  PORT: "10000",
  API_ACCESS_TOKEN: "a".repeat(44),
  INTERNAL_SERVICE_TOKEN: "b".repeat(44),
  GEMMA_BASE_URL: "https://generativelanguage.googleapis.com/v1beta/openai",
  GEMMA_MODEL: "models/gemma-4-26b-a4b-it",
  GEMMA_MODEL_VERSION: "001",
  GEMMA_API_KEY: "test-key",
};
const production = {
  ...base,
  DATABASE_URL: "postgresql://u:p@db.example.com:5432/fieldissue",
  DATABASE_SSL: "true",
  STORAGE_PROVIDER: "s3",
  S3_BUCKET: "bucket",
  S3_ACCESS_KEY_ID: "id",
  S3_SECRET_ACCESS_KEY: "secret",
  MEDIA_BASE_URL: "https://fieldissue.example.com/media",
};
const demo = {
  ...base,
  FIELDISSUE_DEMO_PROFILE: "true",
  DATABASE_URL: "postgresql://u:p@dpg-abc123-a:5432/fieldissue",
  DATABASE_SSL: "false",
  STORAGE_PROVIDER: "local",
  RENDER_EXTERNAL_URL: "https://fieldissue-demo.onrender.com/",
};

it("keeps the production profile strict", () => {
  expect(renderEnvironment(production).migrateFirst).toBe(false);
  for (const change of [
    { STORAGE_PROVIDER: "local" },
    { DATABASE_SSL: "false" },
    { AI_MOCK_MODE: "true" },
    { NODE_ENV: "development" },
    { S3_BUCKET: "" },
    { MEDIA_BASE_URL: "" },
    { GEMMA_API_KEY: "" },
    { API_ACCESS_TOKEN: "short" },
    { INTERNAL_SERVICE_TOKEN: "a".repeat(44) },
  ])
    expect(() => renderEnvironment({ ...production, ...change })).toThrow();
});

it("allows the judge demo profile only with real Gemma", () => {
  const { env, demo: isDemo, migrateFirst } = renderEnvironment(demo);
  expect(isDemo).toBe(true);
  expect(migrateFirst).toBe(true);
  expect(env.LOCAL_STORAGE_PATH).toBe("/tmp/fieldissue-media");
  expect(env.MEDIA_BASE_URL).toBe("https://fieldissue-demo.onrender.com/media");
  for (const change of [
    { AI_MOCK_MODE: "true" },
    { NODE_ENV: "development" },
    { GEMMA_API_KEY: "" },
    { GEMMA_MODEL: "" },
    { API_ACCESS_TOKEN: "" },
    { STORAGE_PROVIDER: "memory" },
    { STORAGE_PROVIDER: "s3" },
    // Plain TCP only on Render's private network (single-label host).
    { DATABASE_URL: "postgresql://u:p@db.example.com:5432/x" },
    { DATABASE_SSL: "" },
    { RENDER_EXTERNAL_URL: "" },
  ])
    expect(() => renderEnvironment({ ...demo, ...change })).toThrow();
  expect(
    renderEnvironment({
      ...demo,
      DATABASE_URL: "postgresql://u:p@db.example.com:5432/x",
      DATABASE_SSL: "true",
    }).demo,
  ).toBe(true);
});
