import type { Pool } from "pg";
import { AppError } from "./errors.js";

/** Separate from core report/search quota. All counters reserve atomically or roll back. */
export async function reserveModelAllowance(
  pool: Pool,
  provider: "tinker" | "tabpfn-demo",
  lifetime: number,
  guestId?: string,
) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const day = (
      await client.query(
        "SELECT (clock_timestamp() AT TIME ZONE 'UTC')::date::text AS day",
      )
    ).rows[0].day;
    const counters: [string, number, string][] = [
      [provider, guestId ? lifetime - 20 : lifetime, "MODEL_CREDIT_LIMIT"],
      [`${provider}:day:${day}`, 20, "MODEL_DAILY_LIMIT"],
      ...(guestId
        ? ([
            [`${provider}:public:${day}`, 10, "MODEL_DAILY_LIMIT"],
            [`${provider}:guest:${guestId}:${day}`, 3, "MODEL_GUEST_LIMIT"],
          ] as [string, number, string][])
        : []),
    ];
    for (const [key, limit, code] of counters) {
      await client.query(
        "INSERT INTO integration_allowances(provider,units) VALUES($1,0) ON CONFLICT DO NOTHING",
        [key],
      );
      const updated = await client.query(
        "UPDATE integration_allowances SET units=units+1 WHERE provider=$1 AND units<$2 RETURNING units",
        [key, limit],
      );
      if (!updated.rowCount)
        throw new AppError(
          code,
          429,
          code === "MODEL_CREDIT_LIMIT"
            ? "The credit-only model allowance is used. Saved results remain available."
            : "Today's model-demo allowance is used. Saved results and reporting still work. Try again after midnight UTC.",
        );
    }
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
