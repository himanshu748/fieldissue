import { expect, it, vi } from "vitest";
import { Script } from "node:vm";
import { createApp } from "../src/app.js";
import {
  demoPageCsp,
  demoPageHtml,
  demoPageScript,
  landingScript,
} from "../src/demo-page.js";
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
  expect(html).toContain('<script src="/landing.js"></script>');
  const script = await app.request("/demo.js");
  expect(script.status).toBe(200);
  expect(script.headers.get("Content-Type")).toMatch(/javascript/);
  const landing = await app.request("/landing.js");
  expect(landing.status).toBe(200);
  expect(landing.headers.get("Content-Type")).toMatch(/javascript/);
  expect(await landing.text()).toBe(landingScript);
});

it("keeps the CSP strict: nothing from other origins, no inline script", () => {
  const directives = Object.fromEntries(
    demoPageCsp.split("; ").map((d) => {
      const [name, ...values] = d.split(" ");
      return [name, values.join(" ")];
    }),
  );
  expect(directives).toEqual({
    "default-src": "'none'",
    "script-src": "'self'",
    "style-src": "'unsafe-inline'",
    "img-src": "'self' blob: data:",
    "connect-src": "'self'",
    "base-uri": "'none'",
    "form-action": "'none'",
    "frame-ancestors": "'none'",
  });
  expect(demoPageCsp).not.toMatch(/https?:|\*/);
});

it("loads every page resource from this origin", () => {
  // Scripts are external same-origin files; inline <script> would be blocked.
  const scripts = [...demoPageHtml.matchAll(/<script\b[^>]*>/g)].map(
    (m) => m[0],
  );
  expect(scripts).toEqual([
    '<script src="/landing.js">',
    '<script src="/demo.js">',
  ]);
  expect(demoPageHtml).not.toMatch(/<link\b|<iframe\b|@import|@font-face/i);
  expect(demoPageHtml).not.toMatch(/(src|srcset|poster)=["']?https?:/i);
  expect(demoPageHtml).not.toMatch(/url\(["']?https?:/i);
  // Inline SVG markup only; the template interpolation was resolved.
  expect(demoPageHtml).not.toContain("$" + "{");
  // Only outbound links are to the open-source repository.
  const hrefs = [...demoPageHtml.matchAll(/href="(https?:[^"]+)"/g)].map(
    (m) => m[1],
  );
  expect(new Set(hrefs)).toEqual(
    new Set(["https://github.com/himanshu748/fieldissue"]),
  );
});

it("keeps every demo control the client script uses inside #try", () => {
  const ids = [...demoPageScript.matchAll(/\$\("([A-Za-z0-9]+)"\)/g)].map(
    (m) => m[1],
  );
  expect(ids.length).toBeGreaterThan(10);
  const tryStart = demoPageHtml.indexOf('id="try"');
  expect(tryStart).toBeGreaterThan(0);
  for (const id of new Set(ids)) {
    const at = demoPageHtml.indexOf(`id="${id}"`);
    expect(at, id).toBeGreaterThan(tryStart);
    expect(demoPageHtml.indexOf(`id="${id}"`, at + 1), id).toBe(-1);
  }
});

it("links the landing page to the demo and redirects /demo there", async () => {
  const { app } = fixture(token);
  expect(demoPageHtml).toContain('href="#try"');
  const res = await app.request("/demo");
  expect(res.status).toBe(302);
  expect(res.headers.get("Location")).toBe("/#try");
});

it("respects reduced motion and stays honest about the illustration", () => {
  expect(demoPageHtml).toContain("@media (prefers-reduced-motion: reduce)");
  expect(landingScript).toContain("prefers-reduced-motion: reduce");
  expect(demoPageHtml).toContain("Illustration");
  expect(demoPageHtml).toMatch(/notes, not the photo/);
  expect(demoPageHtml).toMatch(/TabPFN[\s\S]{0,200}Not on the demo/);
});

it("keeps the API behind the gateway and never embeds the token", async () => {
  const { app, list } = fixture(token);
  const html = await (await app.request("/")).text();
  const js = await (await app.request("/demo.js")).text();
  const landing = await (await app.request("/landing.js")).text();
  expect(html).not.toContain(token);
  expect(js).not.toContain(token);
  expect(landing).not.toContain(token);
  expect((await app.request("/v1/issues")).status).toBe(401);
  expect((await app.request("/index.html")).status).toBe(401);
  expect((await app.request("/", { method: "POST" })).status).toBe(401);
  expect(list).not.toHaveBeenCalled();
});

it("ships client scripts that parse as plain JavaScript", () => {
  for (const source of [demoPageScript, landingScript]) {
    expect(() => new Script(source)).not.toThrow();
    // Same-origin only: no absolute URLs at all.
    expect(source).not.toMatch(/https?:\/\//);
  }
  // The landing script is motion only; it never talks to the API.
  expect(landingScript).not.toMatch(/fetch\(|XMLHttpRequest|\/v1\//);
});
