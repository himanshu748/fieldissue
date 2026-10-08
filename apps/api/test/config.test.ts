import { expect, it } from "vitest";
import { readConfig } from "../src/config.js";
import { observationInputSchema } from "@fieldissue/shared";
it("rejects production mock mode and missing provider secrets", () => {
  expect(() =>
    readConfig({
      NODE_ENV: "production",
      AI_MOCK_MODE: "true",
      DATABASE_URL: "postgresql://localhost/a",
      INTERNAL_SERVICE_TOKEN: "private-test-token-123",
    }),
  ).toThrow();
});
it("rejects missing, blank and whitespace geolocation", () => {
  for (const latitude of [undefined, "", " "])
    expect(
      observationInputSchema.safeParse({ latitude, longitude: 77 }).success,
    ).toBe(false);
});
it("fails closed for production access and ephemeral evidence", () => {
  const base = {
    NODE_ENV: "production",
    AI_MOCK_MODE: "false",
    DATABASE_URL: "postgresql://localhost/a",
    INTERNAL_SERVICE_TOKEN: "private-test-token-with-more-than-32-characters",
    STORAGE_PROVIDER: "postgres",
  };
  expect(() => readConfig(base)).toThrow(/access token/);
  expect(() =>
    readConfig({ ...base, API_ACCESS_TOKEN: base.INTERNAL_SERVICE_TOKEN }),
  ).toThrow(/access token/);
  const configured = {
    ...base,
    API_ACCESS_TOKEN: "another-independent-test-access-token",
  };
  expect(readConfig(configured).STORAGE_PROVIDER).toBe("postgres");
  expect(() =>
    readConfig({ ...configured, STORAGE_PROVIDER: "local" }),
  ).toThrow(/durable/);
});
