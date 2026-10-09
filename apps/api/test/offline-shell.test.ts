import { describe, it, expect } from "vitest";
import { runInNewContext } from "node:vm";
import { serviceWorker } from "../src/offline-shell.js";
describe("offline shell privacy boundary", () => {
  it("caches only the app shell and build assets; never handles API, media, writes or other origins", async () => {
    const events: Record<string, (e: any) => void> = {};
    let handled = 0;
    const self = {
      location: { origin: "https://field.test" },
      addEventListener: (name: string, fn: any) => (events[name] = fn),
    };
    runInNewContext(serviceWorker("html", ["/assets/app.js"]), {
      self,
      URL,
      caches: { match: async () => new Response("cached") },
      fetch: async () => new Response("network"),
      Response,
    });
    for (const [path, method] of [
      ["/v1/issues", "GET"],
      ["/media/photo.jpg", "GET"],
      ["/v1/account/me", "GET"],
      ["/assets/app.js", "POST"],
      ["https://other.test/assets/app.js", "GET"],
    ]) {
      events.fetch!({
        request: {
          url: new URL(path!, "https://field.test").href,
          method,
          mode: "cors",
        },
        respondWith: () => handled++,
      });
    }
    expect(handled).toBe(0);
    events.fetch!({
      request: { url: "https://field.test/assets/app.js", method: "GET" },
      respondWith: () => handled++,
    });
    expect(handled).toBe(1);
  });
  it("serves a cached app shell when navigation loses its connection", async () => {
    const events: Record<string, (e: any) => void> = {};
    let response: Promise<Response> | undefined;
    runInNewContext(serviceWorker("html", []), {
      self: {
        location: { origin: "https://field.test" },
        addEventListener: (n: string, f: any) => (events[n] = f),
      },
      URL,
      caches: { match: async (key: string) => new Response(key) },
      fetch: async () => {
        throw new Error("offline");
      },
      Response,
    });
    events.fetch!({
      request: {
        url: "https://field.test/app/report",
        method: "GET",
        mode: "navigate",
      },
      respondWith: (r: Promise<Response>) => (response = r),
    });
    expect(await (await response!).text()).toBe("/offline-shell");
  });
});
