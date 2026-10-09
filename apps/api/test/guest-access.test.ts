import { expect, it } from "vitest";
import { createApp } from "../src/app.js";
import { signGuest, verifyGuest } from "../src/guest-access.js";
it("rejects forged and expired browser ownership cookies", () => {
  const secret = "fixture-secret",
    id = "00000000-0000-4000-8000-000000000001",
    now = Date.now();
  const cookie = signGuest(secret, id, now);
  expect(verifyGuest(secret, cookie, now)).toBe(id);
  expect(verifyGuest("other-secret", cookie, now)).toBeUndefined();
  expect(verifyGuest(secret, cookie + "x", now)).toBeUndefined();
  expect(verifyGuest(secret, cookie, now + 31 * 86400000)).toBeUndefined();
});

it("refuses public access without an operator secret at construction", () => {
  expect(() => createApp({ publicAccess: true } as never)).toThrow(
    "Public access requires an operator secret",
  );
});
