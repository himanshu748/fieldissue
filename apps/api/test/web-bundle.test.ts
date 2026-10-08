import { it, expect } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createApp } from "../src/app.js";
it("serves SPA routes and only allowlisted build assets without exposing private API", async () => {
  const dir = mkdtempSync(join(tmpdir(), "fieldissue-web-"));
  try {
    mkdirSync(join(dir, "assets"));
    writeFileSync(
      join(dir, "index.html"),
      "<!doctype html><h1>FieldIssue V2</h1>",
    );
    writeFileSync(join(dir, "assets", "app-a.js"), "console.log('bundle');");
    writeFileSync(join(dir, "assets", "private.env"), "PRIVATE_VALUE");
    const app = createApp({
      webDirectory: dir,
      repository: {} as any,
      service: {} as any,
      storage: {} as any,
      maxUploadBytes: 1024,
      accessToken: "private-test-token",
    });
    for (const route of [
      "/",
      "/app/explore",
      "/app/issues/FI-000001/compare",
      "/privacy",
    ]) {
      const response = await app.request(route);
      expect(response.status).toBe(200);
      expect(await response.text()).toContain("FieldIssue V2");
      expect(response.headers.get("Content-Security-Policy")).toContain(
        "frame-ancestors 'none'",
      );
    }
    expect((await app.request("/assets/app-a.js")).status).toBe(200);
    for (const route of [
      "/assets/private.env",
      "/v1/issues",
      "/media/private.png",
    ]) {
      expect((await app.request(route)).status).toBe(401);
    }
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
