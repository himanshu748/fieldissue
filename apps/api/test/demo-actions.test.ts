import { runInNewContext } from "node:vm";
import { expect, it } from "vitest";
import { demoPageScript } from "../src/demo-page.js";

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((r) => {
    resolve = r;
  });
  return { promise, resolve };
}
function fixture() {
  class Node {
    private currentValue = "";
    get value() {
      return this.currentValue;
    }
    set value(v: string) {
      this.currentValue = v;
      if (!v) this.files = [];
    }
    private text = "";
    get textContent() {
      return this.text;
    }
    set textContent(v: string) {
      this.text = v;
      this.children = [];
    }
    hidden = false;
    disabled = false;
    dataset: Record<string, string> = {};
    files: object[] = [];
    children: Node[] = [];
    listeners: Record<string, (this: Node) => unknown> = {};
    appendChild(n: Node) {
      this.children.push(n);
    }
    addEventListener(k: string, fn: (this: Node) => unknown) {
      this.listeners[k] = fn;
    }
    scrollIntoView() {}
    getContext() {
      return { drawImage() {} };
    }
    toBlob(cb: (blob: object) => void) {
      cb({});
    }
  }
  const nodes = new Map<string, Node>();
  const $ = (id: string) => {
    if (!nodes.has(id)) nodes.set(id, new Node());
    return nodes.get(id)!;
  };
  const stored = new Map([["fieldissue-token", "test-session-token"]]);
  const calls: { path: string; options: any }[] = [];
  const images: (() => void)[] = [];
  let holdImages = false,
    timelineFails = false,
    postFails = false,
    nextId = 0;
  let postHook: (() => any) | undefined;
  let getHook: ((path: string) => Promise<any> | undefined) | undefined;
  const issue = (id = "a") => ({
    id,
    publicId: id,
    title: id,
    status: "OPEN",
    category: "OTHER",
    severity: "LOW",
    latitude: 1,
    longitude: 2,
    observations: [],
  });
  const response = (body: any, ok = true) => ({
    ok,
    status: ok ? 200 : 503,
    json: async () => body,
  });
  class Form {
    values = new Map();
    set(k: string, v: unknown) {
      this.values.set(k, v);
    }
  }
  runInNewContext(demoPageScript, {
    document: { getElementById: $, createElement: () => new Node() },
    sessionStorage: {
      getItem: (k: string) => stored.get(k),
      setItem: (k: string, v: string) => stored.set(k, v),
    },
    window: { crypto: { randomUUID: () => String(++nextId) } },
    crypto: { randomUUID: () => String(++nextId) },
    navigator: {},
    URL: { createObjectURL: () => "blob:test", revokeObjectURL() {} },
    Image: class {
      naturalWidth = 1;
      naturalHeight = 1;
      onload!: () => void;
      set src(_: string) {
        if (holdImages) images.push(() => this.onload());
        else this.onload();
      }
    },
    File: class {},
    FormData: Form,
    Date,
    Math,
    fetch: async (path: string, options: any) => {
      calls.push({ path, options });
      if (options.method === "POST") {
        if (postHook) return postHook();
        if (postFails) throw new Error("Connection lost");
        return response(
          path === "/v1/issues"
            ? issue()
            : {
                observation: { id: "saved-observation" },
                diffUnavailable: true,
              },
        );
      }
      const hooked = getHook?.(path);
      if (hooked) return hooked;
      if (path.endsWith("/timeline"))
        return timelineFails
          ? response(
              { error: { code: "DB_UNAVAILABLE", message: "Read failed" } },
              false,
            )
          : response({ events: [] });
      if (path.includes("?status="))
        return response({ items: [issue("a"), issue("b")] });
      return response(issue(path.split("/").at(-1)));
    },
  });
  $("lat").value = "1";
  $("lon").value = "2";
  const click = async (id: string) => {
    await $(id).listeners.click.call($(id));
  };
  const choose = async (id: "a" | "b") => {
    await click("loadOpen");
    const n = $("openList")
      .children.filter((n) => n.listeners.click)
      .at(id === "a" ? -2 : -1)!;
    return n.listeners.click.call(n);
  };
  return {
    $,
    calls,
    stored,
    click,
    choose,
    issue,
    response,
    images,
    photo: (id: string) => {
      const n = $(id);
      n.files = [{}];
      n.value = "photo.jpg";
      return n.files[0];
    },
    holdImages: () => {
      holdImages = true;
    },
    failTimeline: (v = true) => {
      timelineFails = v;
    },
    failPost: (v = true) => {
      postFails = v;
    },
    hookPost: (hook: typeof postHook) => {
      postHook = hook;
    },
    hookGet: (hook: typeof getHook) => {
      getHook = hook;
    },
    posts: () => calls.filter((c) => c.options.method === "POST"),
  };
}

it("keeps a successful create when timeline fails and retries only the read", async () => {
  const f = fixture();
  f.photo("photo1");
  f.failTimeline();
  await f.click("create");
  expect(f.$("issueHeading").textContent).toBe("a - a");
  expect(f.$("createError").textContent).not.toMatch(
    /nothing.*saved|Read failed/,
  );
  expect(f.$("refreshError").textContent).toMatch(/saved/i);
  f.failTimeline(false);
  await f.click("refreshIssue");
  await f.click("create");
  expect(f.posts()).toHaveLength(1);
});

it("retries an uncertain create with the identical key and prepared payload", async () => {
  const f = fixture();
  f.photo("photo1");
  f.$("note1").value = "original";
  f.failPost();
  await f.click("create");
  f.$("note1").value = "edited";
  f.$("lat").value = "3";
  f.failPost(false);
  await f.click("create");
  const [a, b] = f.posts();
  expect(b.options.headers["Idempotency-Key"]).toBe(
    a.options.headers["Idempotency-Key"],
  );
  expect(b.options.body).toBe(a.options.body);
  expect(b.options.body.values.get("note")).toBe("original");
});

it("retires a successful revisit before refresh and preserves its comparison result", async () => {
  const f = fixture();
  await f.choose("a");
  f.photo("photo2");
  f.$("note2").value = "repaired";
  f.failTimeline();
  await f.click("addRevisit");
  expect(f.$("photo2").value).toBe("");
  expect(f.$("note2").value).toBe("");
  expect(
    f.$("diff").children.some((n) => /revisit was saved/.test(n.textContent)),
  ).toBe(true);
  await f.click("addRevisit");
  f.failTimeline(false);
  await f.click("refreshIssue");
  expect(f.posts()).toHaveLength(1);
});

it("never replays an uncertain non-idempotent revisit", async () => {
  const f = fixture();
  await f.choose("a");
  f.photo("photo2");
  f.failPost();
  await f.click("addRevisit");
  f.failPost(false);
  await f.click("addRevisit");
  expect(f.posts()).toHaveLength(1);
  expect(f.$("revisitError").textContent).toMatch(/unknown|not confirmed/i);
});

it("captures revisit destination and note before image decoding and ignores stale completion", async () => {
  const f = fixture();
  await f.choose("a");
  f.photo("photo2");
  f.$("note2").value = "A evidence";
  f.holdImages();
  const pending = f.click("addRevisit");
  await f.choose("b");
  f.$("note2").value = "B draft";
  f.images.shift()!();
  await pending;
  expect(f.posts()[0].path).toBe("/v1/issues/a/observations");
  expect(f.posts()[0].options.body.values.get("note")).toBe("A evidence");
  expect(f.$("issueHeading").textContent).toBe("b - b");
  expect(f.$("note2").value).toBe("B draft");
});

it("ignores duplicate clicks while preparing a create", async () => {
  const f = fixture();
  f.photo("photo1");
  f.holdImages();
  const pending = f.click("create");
  const duplicate = f.click("create");
  expect(f.images).toHaveLength(1);
  f.images.shift()!();
  await Promise.all([pending, duplicate]);
  expect(f.posts()).toHaveLength(1);
});

it("keeps the latest selection when an older issue read finishes later", async () => {
  const f = fixture();
  const old = deferred<any>();
  f.hookGet((path) => (path === "/v1/issues/a" ? old.promise : undefined));
  const pending = f.choose("a");
  await new Promise((r) => setTimeout(r, 0));
  await f.choose("b");
  old.resolve(f.response(f.issue("a")));
  await pending;
  expect(f.$("issueHeading").textContent).toBe("b - b");
});

it("preserves the session token across recovery", async () => {
  const f = fixture();
  f.photo("photo1");
  f.failPost();
  await f.click("create");
  f.failPost(false);
  await f.click("create");
  expect(f.stored.get("fieldissue-token")).toBe("test-session-token");
  expect(
    f
      .posts()
      .every(
        (c) => c.options.headers.Authorization === "Bearer test-session-token",
      ),
  ).toBe(true);
});

it("ignores duplicate revisit clicks during image decoding", async () => {
  const f = fixture();
  await f.choose("a");
  f.photo("photo2");
  f.holdImages();
  const one = f.click("addRevisit"),
    two = f.click("addRevisit");
  expect(f.images).toHaveLength(1);
  f.images.shift()!();
  await Promise.all([one, two]);
  expect(f.posts()).toHaveLength(1);
});

it("preserves a confirmed revisit result if the issue GET fails", async () => {
  const f = fixture();
  await f.choose("a");
  f.photo("photo2");
  f.hookGet((path) =>
    path === "/v1/issues/a"
      ? Promise.resolve(
          f.response({ error: { message: "read unavailable" } }, false),
        )
      : undefined,
  );
  await f.click("addRevisit");
  expect(f.$("refreshError").textContent).toMatch(/^Saved\./);
  expect(
    f.$("diff").children.some((n) => /revisit was saved/.test(n.textContent)),
  ).toBe(true);
  await f.click("refreshIssue");
  expect(f.posts()).toHaveLength(1);
});

it("does not render a stale timeline after navigating to another issue", async () => {
  const f = fixture();
  const timeline = deferred<any>();
  f.hookGet((path) =>
    path === "/v1/issues/a/timeline" ? timeline.promise : undefined,
  );
  const first = f.choose("a");
  await new Promise((r) => setTimeout(r, 0));
  await f.choose("b");
  timeline.resolve(
    f.response({
      events: [
        { createdAt: new Date().toISOString(), eventType: "OLD_ISSUE_EVENT" },
      ],
    }),
  );
  await first;
  expect(
    f.$("timeline").children.some((n) => /OLD_ISSUE_EVENT/.test(n.textContent)),
  ).toBe(false);
  expect(f.$("issueHeading").textContent).toBe("b - b");
});

it("does not overwrite a newly selected issue when create finishes", async () => {
  const f = fixture();
  f.photo("photo1");
  f.holdImages();
  const pending = f.click("create");
  await f.choose("b");
  f.images.shift()!();
  await pending;
  expect(f.$("issueHeading").textContent).toBe("b - b");
  expect(f.$("createError").textContent).toMatch(/Saved report a/);
});

it("clears another issue's unsent revisit fields on selection", async () => {
  const f = fixture();
  await f.choose("a");
  f.photo("photo2");
  f.$("note2").value = "A only";
  await f.choose("b");
  await f.click("addRevisit");
  expect(f.posts()).toHaveLength(0);
});

it("allows correction after a definitively rejected create", async () => {
  const f = fixture();
  f.photo("photo1");
  f.$("lat").value = "invalid";
  f.hookPost(() => ({
    ok: false,
    status: 400,
    json: async () => ({
      error: { code: "VALIDATION_ERROR", message: "Invalid latitude" },
    }),
  }));
  await f.click("create");
  f.$("lat").value = "1";
  f.hookPost(undefined);
  await f.click("create");
  expect(f.posts()[1].options.body.values.get("latitude")).toBe("1");
});

it("does not append old photos after issue selection changes", async () => {
  const f = fixture();
  const media = deferred<any>();
  f.hookGet((path) =>
    path === "/v1/issues/a"
      ? Promise.resolve(
          f.response({
            ...f.issue("a"),
            observations: [
              { storageKey: "a-photo", capturedAt: new Date().toISOString() },
            ],
          }),
        )
      : path === "/media/a-photo"
        ? media.promise
        : undefined,
  );
  const pending = f.choose("a");
  await new Promise((r) => setTimeout(r, 0));
  await f.choose("b");
  media.resolve({ ok: true, blob: async () => ({}) });
  await pending;
  expect(f.$("photos").children).toHaveLength(0);
});

it("blocks actions against the old issue while a new selection is loading", async () => {
  const f = fixture();
  await f.choose("a");
  f.photo("photo2");
  f.$("note2").value = "A evidence";
  const b = deferred<any>();
  f.hookGet((path) => (path === "/v1/issues/b" ? b.promise : undefined));
  const selecting = f.choose("b");
  await new Promise((r) => setTimeout(r, 0));
  f.holdImages();
  const adding = f.click("addRevisit");
  b.resolve(f.response(f.issue("b")));
  await selecting;
  f.$("note2").value = "B draft";
  f.images.shift()?.();
  await adding;
  expect(f.posts()).toHaveLength(0);
  expect(f.$("issueHeading").textContent).toBe("b - b");
  expect(f.$("note2").value).toBe("B draft");
});

it("keeps uncertain create identity through a later authentication rejection", async () => {
  const f = fixture();
  f.photo("photo1");
  f.failPost();
  await f.click("create");
  f.hookPost(() => ({
    ok: false,
    status: 401,
    json: async () => ({ error: { message: "Bad token" } }),
  }));
  await f.click("create");
  f.hookPost(undefined);
  f.failPost(false);
  f.$("token").value = "correct-token";
  await f.click("create");
  const posts = f.posts();
  expect(posts).toHaveLength(3);
  expect(
    new Set(posts.map((p) => p.options.headers["Idempotency-Key"])).size,
  ).toBe(1);
  expect(posts[2].options.body).toBe(posts[0].options.body);
});

it("ignores older same-issue refresh snapshots after a revisit saves", async () => {
  const f = fixture();
  await f.choose("a");
  const old = deferred<any>();
  let reads = 0;
  f.hookGet((path) =>
    path === "/v1/issues/a"
      ? ++reads === 1
        ? old.promise
        : Promise.resolve(
            f.response({
              ...f.issue("a"),
              observations: [
                { capturedAt: new Date().toISOString(), note: "new evidence" },
              ],
            }),
          )
      : undefined,
  );
  const refreshing = f.click("refreshIssue");
  await new Promise((r) => setTimeout(r, 0));
  f.photo("photo2");
  await f.click("addRevisit");
  expect(f.$("photos").children).toHaveLength(1);
  old.resolve(f.response(f.issue("a")));
  await refreshing;
  expect(f.$("photos").children).toHaveLength(1);
  expect(f.posts()).toHaveLength(1);
});

it("ignores older refresh errors after a successful newer refresh", async () => {
  const f = fixture();
  await f.choose("a");
  const old = deferred<any>();
  let reads = 0;
  f.hookGet((path) =>
    path === "/v1/issues/a" && ++reads === 1 ? old.promise : undefined,
  );
  const refreshing = f.click("refreshIssue");
  await new Promise((r) => setTimeout(r, 0));
  f.photo("photo2");
  await f.click("addRevisit");
  old.resolve(f.response({ error: { message: "stale failure" } }, false));
  await refreshing;
  expect(f.$("refreshError").hidden).toBe(true);
});
