import type { Pool } from "pg";
import { AppError } from "./errors.js";

/** Shared demo gate. Global limits deliberately do not trust spoofable forwarding headers. */
export class RequestGuard {
  private starts: number[] = [];
  private active = 0;
  constructor(
    private reserve: (units: number) => Promise<void>,
    private perMinute = 30,
    private concurrency = 2,
    private now = () => Date.now(),
  ) {}
  async enter(units: number): Promise<() => void> {
    const now = this.now();
    this.starts = this.starts.filter((t) => now - t < 60000);
    if (this.starts.length >= this.perMinute || this.active >= this.concurrency)
      throw new AppError(
        "RATE_LIMITED",
        429,
        "The demo is busy. Please try again in a minute.",
      );
    this.starts.push(now);
    this.active++;
    try {
      if (units) await this.reserve(units);
    } catch (error) {
      this.active--;
      throw error;
    }
    let released = false;
    return () => {
      if (!released) {
        released = true;
        this.active--;
      }
    };
  }
}
export function dailyAllowance(pool: Pool, limit: number) {
  return async (units: number) => {
    // Atomic across processes and restarts; failed requests also consume allowance.
    const result = await pool.query(
      `INSERT INTO provider_allowances(day,units)
       SELECT (clock_timestamp() AT TIME ZONE 'UTC')::date,$1::integer WHERE $1::integer <= $2::integer
       ON CONFLICT(day) DO UPDATE SET units=provider_allowances.units+EXCLUDED.units
       WHERE provider_allowances.units+EXCLUDED.units <= $2 RETURNING units`,
      [units, limit],
    );
    if (!result.rowCount)
      throw new AppError(
        "DAILY_LIMIT",
        429,
        "Today's free demo allowance is used. Browsing existing evidence still works. Try again after midnight UTC.",
      );
  };
}
