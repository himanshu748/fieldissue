import { expect, it, vi } from "vitest";
import { createApp } from "../src/app.js";
import type { IssueRepository } from "../src/repository.js";
import type { IssueService } from "../src/service.js";
import type { StorageProvider } from "../src/storage.js";

const token = "test-access-token-with-at-least-32-characters";
function fixture() {
  const list = vi.fn().mockResolvedValue([]);
  const read = vi
    .fn()
    .mockResolvedValue({ bytes: Buffer.from("image"), mime: "image/png" });
  const app = createApp({
    service: {} as IssueService,
    repository: { list } as unknown as IssueRepository,
    storage: { read } as unknown as StorageProvider,
    accessToken: token,
    maxUploadBytes: 1024,
  });
  return { app, list, read };
}
it("rejects anonymous reads, uploads and private media before touching dependencies", async () => {
  const { app, list, read } = fixture();
  for (const [path, method] of [
    ["/v1/issues", "GET"],
    ["/v1/issues", "POST"],
    ["/media/a.png", "GET"],
  ]) {
    const response = await app.request(path, { method });
    expect(response.status).toBe(401);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
  }
  expect(list).not.toHaveBeenCalled();
  expect(read).not.toHaveBeenCalled();
});
it("requires the exact bearer token and leaves liveness public", async () => {
  const { app, list } = fixture();
  expect((await app.request("/health")).status).toBe(200);
  for (const value of [
    "",
    `Bearer ${token}x`,
    `bearer ${token}`,
    `Bearer ${token.slice(1)}`,
  ]) {
    expect(
      (await app.request("/v1/issues", { headers: { Authorization: value } }))
        .status,
    ).toBe(401);
  }
  expect(
    (
      await app.request("/v1/issues", {
        headers: { Authorization: `Bearer ${token}` },
      })
    ).status,
  ).toBe(200);
  expect(list).toHaveBeenCalledOnce();
});
it("does not let protected media enter shared caches", async () => {
  const { app, read } = fixture();
  const response = await app.request("/media/a.png", {
    headers: { Authorization: `Bearer ${token}` },
  });
  expect(response.status).toBe(200);
  expect(response.headers.get("Cache-Control")).toBe("private, no-store");
  expect(read).toHaveBeenCalledOnce();
});
