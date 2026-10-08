import { expect, it, vi } from "vitest";
import { RequestGuard } from "../src/request-guard.js";
it("bounds concurrent writes, releases after failure, and does not reserve denied work", async () => {
  const reserve = vi.fn().mockResolvedValue(undefined);
  const guard = new RequestGuard(reserve, 10, 1);
  const release = await guard.enter(4);
  await expect(guard.enter(4)).rejects.toMatchObject({ status: 429 });
  expect(reserve).toHaveBeenCalledTimes(1);
  release();
  release();
  const next = await guard.enter(0);
  next();
  expect(reserve).toHaveBeenCalledTimes(1);
  reserve.mockRejectedValueOnce(new Error("db down"));
  await expect(guard.enter(4)).rejects.toThrow("db down");
  const after = await guard.enter(4);
  after();
});
it("does not trust a new client identity to escape the shared minute allowance", async () => {
  let now = 1000;
  const guard = new RequestGuard(
    async () => {},
    2,
    2,
    () => now,
  );
  (await guard.enter(1))();
  (await guard.enter(1))();
  await expect(guard.enter(0)).rejects.toMatchObject({ code: "RATE_LIMITED" });
  now += 60001;
  (await guard.enter(1))();
});
