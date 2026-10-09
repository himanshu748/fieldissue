import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import type { Pool } from "pg";
import { AppError } from "./errors.js";
const lifetime = 30 * 86400;
export const guestCookie = "fieldissue_guest";
export const guestLifetime = lifetime;
export function signGuest(
  secret: string,
  id: string = randomUUID(),
  now = Date.now(),
) {
  const payload = `${id}.${Math.floor(now / 1000)}`;
  return `${payload}.${createHmac("sha256", secret).update(`fieldissue-guest:${payload}`).digest("base64url")}`;
}
export function verifyGuest(secret: string, cookie?: string, now = Date.now()) {
  if (!cookie || cookie.length > 160) return undefined;
  const [id, issued, signature, extra] = cookie.split(".");
  if (
    extra ||
    !id ||
    !/^[a-f0-9-]{36}$/.test(id) ||
    !issued ||
    !/^\d{10}$/.test(issued) ||
    !signature
  )
    return undefined;
  const age = Math.floor(now / 1000) - Number(issued);
  if (age < 0 || age > lifetime) return undefined;
  const expected = Buffer.from(
    signGuest(secret, id, Number(issued) * 1000).split(".")[2]!,
  );
  const actual = Buffer.from(signature);
  return actual.length === expected.length && timingSafeEqual(actual, expected)
    ? id
    : undefined;
}
export async function guestAllowance(pool: Pool, id: string, upload: boolean) {
  const result = await pool.query(
    `INSERT INTO guest_allowances(day,guest_id,writes,uploads) VALUES((clock_timestamp() AT TIME ZONE 'UTC')::date,$1,1,$2)
     ON CONFLICT(day,guest_id) DO UPDATE SET writes=guest_allowances.writes+1,uploads=guest_allowances.uploads+EXCLUDED.uploads
     WHERE guest_allowances.writes<20 AND guest_allowances.uploads+EXCLUDED.uploads<=6 RETURNING writes`,
    [id, upload ? 1 : 0],
  );
  if (!result.rowCount)
    throw new AppError(
      "GUEST_LIMIT",
      429,
      "This browser's daily demo limit is reached. You can still browse. Try again after midnight UTC.",
    );
}
