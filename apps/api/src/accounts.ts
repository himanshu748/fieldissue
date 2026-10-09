import {
  createHash,
  randomBytes,
  randomUUID,
  scrypt,
  timingSafeEqual,
} from "node:crypto";
import type { Pool, PoolClient } from "pg";
import { z } from "zod";
import { AppError } from "./errors.js";
export const accountCookie = "fieldissue_account";
export const sessionSeconds = 30 * 86400;
export const credentials = z
  .object({
    username: z
      .string()
      .trim()
      .toLowerCase()
      .regex(/^[a-z0-9_]{3,32}$/),
    password: z.string().min(12).max(128),
  })
  .strict();
export type Account = { id: string; username: string; guest_id: string };
export const digest = (s: string) =>
  createHash("sha256").update(s).digest("hex");
const secret = () => randomBytes(32).toString("base64url");
const derive = (password: string, salt: string) =>
  new Promise<Buffer>((resolve, reject) =>
    scrypt(
      password,
      salt,
      64,
      { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 },
      (e, k) => (e ? reject(e) : resolve(k)),
    ),
  );
export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${(await derive(password, salt)).toString("hex")}`;
}
async function matches(password: string, stored: string) {
  const [salt, hash] = stored.split(":");
  const actual = await derive(password, salt!);
  const expected = Buffer.from(hash!, "hex");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
export async function transaction<T>(
  pool: Pool,
  fn: (c: PoolClient) => Promise<T>,
) {
  const c = await pool.connect();
  try {
    await c.query("BEGIN");
    const result = await fn(c);
    await c.query("COMMIT");
    return result;
  } catch (e) {
    await c.query("ROLLBACK");
    throw e;
  } finally {
    c.release();
  }
}
export class Accounts {
  constructor(readonly pool: Pool) {}
  async current(token?: string): Promise<Account | undefined> {
    if (!token || !/^[\w-]{43}$/.test(token)) return;
    return (
      await this.pool.query(
        "SELECT a.id,a.username,a.guest_id FROM account_sessions s JOIN accounts a ON a.id=s.account_id WHERE s.token_hash=$1 AND s.expires_at>now()",
        [digest(token)],
      )
    ).rows[0];
  }
  async throttle(client: string) {
    await this.pool.query(
      "DELETE FROM auth_attempts WHERE right(bucket,13)<to_char(now() AT TIME ZONE 'UTC'-interval '2 hours','YYYY-MM-DD-HH24')",
    );
    const r = await this.pool.query(
      `INSERT INTO auth_attempts(bucket,attempts) VALUES($1||':'||to_char(now() AT TIME ZONE 'UTC','YYYY-MM-DD-HH24'),1) ON CONFLICT(bucket) DO UPDATE SET attempts=auth_attempts.attempts+1 WHERE auth_attempts.attempts<20 RETURNING attempts`,
      [digest(client)],
    );
    if (!r.rowCount)
      throw new AppError(
        "AUTH_LIMIT",
        429,
        "Too many attempts from this browser. Try again next hour.",
      );
  }
  async checkFailures(username: string) {
    const r = await this.pool.query(
      "SELECT 1 FROM auth_failures WHERE username_hash=$1 AND failures>=30 AND reset_at>now()",
      [digest(username)],
    );
    if (r.rowCount)
      throw new AppError(
        "AUTH_LIMIT",
        429,
        "Too many failed attempts for this account. Wait five minutes before trying again.",
      );
  }
  async recordFailure(username: string) {
    await this.pool.query(
      "INSERT INTO auth_failures(username_hash,failures,reset_at) VALUES($1,1,now()+interval '5 minutes') ON CONFLICT(username_hash) DO UPDATE SET failures=CASE WHEN auth_failures.reset_at<=now() THEN 1 ELSE LEAST(auth_failures.failures+1,30) END,reset_at=CASE WHEN auth_failures.reset_at<=now() THEN now()+interval '5 minutes' ELSE auth_failures.reset_at END",
      [digest(username)],
    );
  }
  async claimGuest(c: PoolClient, a: Account, guestId?: string) {
    if (!guestId || guestId === a.guest_id) return;
    await c.query("SELECT pg_advisory_xact_lock(hashtextextended($1,0))", [
      guestId,
    ]);
    const linked = await c.query(
      "SELECT 1 FROM accounts WHERE guest_id=$1 UNION ALL SELECT 1 FROM account_guest_links WHERE guest_id=$1",
      [guestId],
    );
    if (linked.rowCount) return;
    await c.query(
      "INSERT INTO account_guest_links(guest_id,account_id) VALUES($1,$2)",
      [guestId, a.id],
    );
    await c.query("UPDATE issues SET guest_owner=$2 WHERE guest_owner=$1", [
      guestId,
      a.guest_id,
    ]);
  }
  async session(c: PoolClient, id: string) {
    const token = secret();
    await c.query(
      "DELETE FROM account_sessions WHERE expires_at<=now() OR account_id=$1",
      [id],
    );
    await c.query(
      "INSERT INTO account_sessions(token_hash,account_id,expires_at) VALUES($1,$2,now()+interval '30 days')",
      [digest(token), id],
    );
    return token;
  }
  async signup(input: unknown, guestId?: string) {
    const data = credentials.parse(input);
    await this.throttle(guestId ?? data.username);
    const passwordHash = await hashPassword(data.password);
    const recovery = secret();
    try {
      return await transaction(this.pool, async (c) => {
        if (guestId) {
          await c.query(
            "SELECT pg_advisory_xact_lock(hashtextextended($1,0))",
            [guestId],
          );
          if (
            (
              await c.query(
                "SELECT 1 FROM account_guest_links WHERE guest_id=$1",
                [guestId],
              )
            ).rowCount
          )
            throw new AppError(
              "ACCOUNT_EXISTS",
              409,
              "This browser identity is already linked. Reload and sign in.",
            );
        }
        const row = (
          await c.query(
            "INSERT INTO accounts(username,password_hash,recovery_hash,guest_id) VALUES($1,$2,$3,$4) RETURNING id,username,guest_id",
            [
              data.username,
              passwordHash,
              digest(recovery),
              guestId ?? randomUUID(),
            ],
          )
        ).rows[0];
        return {
          account: row as Account,
          token: await this.session(c, row.id),
          recovery,
        };
      });
    } catch (e) {
      if ((e as { code?: string }).code === "23505")
        throw new AppError(
          "ACCOUNT_EXISTS",
          409,
          "That username or browser ownership is already linked to an account. Sign in instead.",
        );
      throw e;
    }
  }
  async login(input: unknown, guestId?: string) {
    const data = credentials.parse(input);
    await this.throttle(guestId ?? data.username);
    await this.checkFailures(data.username);
    const row = (
      await this.pool.query("SELECT * FROM accounts WHERE username=$1", [
        data.username,
      ])
    ).rows[0];
    const dummy = `${"0".repeat(32)}:${"0".repeat(128)}`;
    const valid = await matches(data.password, row?.password_hash ?? dummy);
    if (!row || !valid) {
      await this.recordFailure(data.username);
      throw new AppError(
        "SIGN_IN_FAILED",
        403,
        "Username or password is incorrect.",
      );
    }
    await this.pool.query("DELETE FROM auth_failures WHERE username_hash=$1", [
      digest(data.username),
    ]);
    return transaction(this.pool, async (c) => {
      const token = secret();
      // Serialize login with recovery so an old-password request cannot create a session after reset.
      const current = (
        await c.query(
          "SELECT password_hash FROM accounts WHERE id=$1 FOR UPDATE",
          [row.id],
        )
      ).rows[0];
      if (current.password_hash !== row.password_hash)
        throw new AppError(
          "SIGN_IN_FAILED",
          403,
          "Credentials changed. Sign in again.",
        );
      await this.claimGuest(c, row, guestId);
      await c.query("DELETE FROM account_sessions WHERE expires_at<=now()");
      await c.query(
        "DELETE FROM account_sessions WHERE account_id=$1 AND token_hash NOT IN (SELECT token_hash FROM account_sessions WHERE account_id=$1 ORDER BY created_at DESC LIMIT 9)",
        [row.id],
      );
      await c.query(
        "INSERT INTO account_sessions(token_hash,account_id,expires_at) VALUES($1,$2,now()+interval '30 days')",
        [digest(token), row.id],
      );
      return {
        account: { id: row.id, username: row.username, guest_id: row.guest_id },
        token,
      };
    });
  }
  async recover(input: unknown, guestId?: string) {
    const data = credentials
      .extend({ recovery: z.string().regex(/^[\w-]{43}$/) })
      .parse(input);
    await this.throttle(guestId ?? data.username);
    const hash = await hashPassword(data.password);
    const recovery = secret();
    return transaction(this.pool, async (c) => {
      const row = (
        await c.query(
          "UPDATE accounts SET password_hash=$3,recovery_hash=$4 WHERE username=$1 AND recovery_hash=$2 RETURNING id,username,guest_id",
          [data.username, digest(data.recovery), hash, digest(recovery)],
        )
      ).rows[0];
      if (!row)
        throw new AppError(
          "SIGN_IN_FAILED",
          403,
          "Recovery details are incorrect.",
        );
      await this.claimGuest(c, row, guestId);
      return {
        account: row as Account,
        token: await this.session(c, row.id),
        recovery,
      };
    });
  }
  async logout(token?: string) {
    if (token)
      await this.pool.query(
        "DELETE FROM account_sessions WHERE token_hash=$1",
        [digest(token)],
      );
  }
}
