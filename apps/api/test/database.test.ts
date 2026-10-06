import { expect, it } from "vitest";
import { databaseOptions } from "../src/db.js";
it("uses certificate-verified TLS consistently for API and migrations", () => {
  const options = databaseOptions({
    DATABASE_URL: "postgresql://db.example.test/fieldissue",
    DATABASE_SSL: "true",
  });
  expect(options.ssl).toEqual({ rejectUnauthorized: true });
  expect(options.connectionTimeoutMillis).toBe(5000);
});
it("rejects ambiguous URL TLS settings and missing connection configuration", () => {
  expect(() =>
    databaseOptions({
      DATABASE_URL: "postgresql://db.example.test/fieldissue?sslmode=require",
      DATABASE_SSL: "true",
    }),
  ).toThrow();
  expect(() => databaseOptions({})).toThrow();
});
