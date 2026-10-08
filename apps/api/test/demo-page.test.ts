import { expect, it, vi } from "vitest";
import { Script } from "node:vm";
import { createApp } from "../src/app.js";
import { demoPageHtml, demoPageScript } from "../src/demo-page.js";
import { landingPageHtml, landingPageScript } from "../src/landing-page.js";
import type { IssueRepository } from "../src/repository.js";
import type { IssueService } from "../src/service.js";
import type { StorageProvider } from "../src/storage.js";
const token = "test-access-token-with-at-least-32-characters";
function fixture() {
  const list = vi.fn();
  return {
    list,
    app: createApp({
      service: {} as IssueService,
      repository: { list } as unknown as IssueRepository,
      storage: {} as StorageProvider,
      accessToken: token,
      maxUploadBytes: 1024,
    }),
  };
}
it("serves distinct public landing and dashboard pages and stable issue URLs", async () => {
  const { app } = fixture();
  const landing = await app.request("/");
  expect(await landing.text()).toBe(landingPageHtml);
  for (const path of ["/app", "/app/report", "/app/issues/FI-000001"]) {
    const res = await app.request(path);
    expect(res.status).toBe(200);
    expect(await res.text()).toBe(demoPageHtml);
  }
  expect(landingPageHtml).not.toContain('id="report"');
  expect(demoPageHtml).not.toContain('id="hero"');
  const alias = await app.request("/demo");
  expect(alias.headers.get("Location")).toBe("/app");
});
it("protects all private data while keeping static assets public", async () => {
  const { app, list } = fixture();
  for (const path of ["/v1/issues", "/media/a.png"]) {
    expect((await app.request(path)).status).toBe(401);
  }
  for (const path of [
    "/demo.js",
    "/landing.js",
    "/assets/field-walk.png",
    "/assets/leaflet.js",
    "/assets/leaflet.css",
  ]) {
    expect((await app.request(path)).status).toBe(200);
  }
  expect((await app.request("/assets/constructor")).status).toBe(401);
  expect(list).not.toHaveBeenCalled();
  for (const path of ["/", "/app", "/demo.js", "/landing.js", "/app-config"]) {
    expect(await (await app.request(path)).text()).not.toContain(token);
  }
});
it("allows scripts only from this origin and prevents page embedding", async () => {
  const { app } = fixture();
  for (const path of ["/", "/app"]) {
    const csp = (await app.request(path)).headers.get(
      "Content-Security-Policy",
    )!;
    expect(csp).toContain("script-src 'self'");
    expect(csp).not.toContain("script-src 'unsafe-inline'");
    expect(csp).toContain("frame-ancestors 'none'");
  }
});
it("ships valid scripts and labels generated artwork outside the evidence workflow", () => {
  for (const js of [demoPageScript, landingPageScript])
    expect(() => new Script(js)).not.toThrow();
  expect(landingPageHtml).toContain("AI-generated illustration");
  expect(landingPageHtml).toContain('href="/app"');
  expect(landingPageHtml).toContain("prefers-reduced-motion");
  expect(landingPageScript).not.toMatch(/fetch\(|\/v1\//);
  const ids = [...demoPageScript.matchAll(/\$\("([A-Za-z0-9]+)"\)/g)].map(
    (m) => m[1],
  );
  for (const id of new Set(ids))
    expect(demoPageHtml, id).toContain(`id="${id}"`);
});
