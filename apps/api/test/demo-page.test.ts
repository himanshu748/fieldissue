import { expect, it, vi } from "vitest";
import { Script } from "node:vm";
import { createApp } from "../src/app.js";
import { demoPageScript } from "../src/demo-page.js";
import type { IssueRepository } from "../src/repository.js";
import type { IssueService } from "../src/service.js";
import type { StorageProvider } from "../src/storage.js";

const token = "test-access-token-with-at-least-32-characters";
function fixture(accessToken?: string) {
  const list = vi.fn().mockResolvedValue({ items: [], nextCursor: null });
  const app = createApp({
    service: {} as IssueService,
    repository: { list } as unknown as IssueRepository,
    storage: {} as StorageProvider,
    accessToken,
    maxUploadBytes: 1024,
  });
  return { app, list };
}

it("serves the demo page and script publicly with a restrictive CSP", async () => {
  const { app } = fixture(token);
  const page = await app.request("/");
  expect(page.status).toBe(200);
  expect(page.headers.get("Content-Type")).toMatch(/text\/html/);
  const csp = page.headers.get("Content-Security-Policy") ?? "";
  expect(csp).toContain("script-src 'self'");
  expect(csp).toContain("connect-src 'self'");
  const html = await page.text();
  expect(html).toContain('<script src="/demo.js"></script>');
  const script = await app.request("/demo.js");
  expect(script.status).toBe(200);
  expect(script.headers.get("Content-Type")).toMatch(/javascript/);
});

it("keeps the API behind the gateway and never embeds the token", async () => {
  const { app, list } = fixture(token);
  const html = await (await app.request("/")).text();
  const js = await (await app.request("/demo.js")).text();
  expect(html).not.toContain(token);
  expect(js).not.toContain(token);
  expect((await app.request("/v1/issues")).status).toBe(401);
  expect((await app.request("/index.html")).status).toBe(401);
  expect((await app.request("/", { method: "POST" })).status).toBe(401);
  expect(list).not.toHaveBeenCalled();
});

it("ships a client script that parses as plain JavaScript", () => {
  expect(() => new Script(demoPageScript)).not.toThrow();
  // It only calls same-origin API routes.
  expect(demoPageScript).not.toMatch(/https?:\/\//);
});
