import { beforeAll, afterAll, describe, it, expect } from "vitest";
import { Pool } from "pg";
import { migrate } from "../src/migrate.js";
import { reserveModelAllowance } from "../src/model-allowance.js";
const suite = process.env.TEST_DATABASE_URL ? describe : describe.skip;
suite("model quota isolation and atomic rollback", () => {
  let pool: Pool;
  beforeAll(async () => {
    pool = new Pool({ connectionString: process.env.TEST_DATABASE_URL });
    await migrate(pool);
    await pool.query(
      "DELETE FROM integration_allowances WHERE provider LIKE 'tabpfn-demo%'",
    );
  });
  afterAll(async () => {
    await pool.query(
      "DELETE FROM integration_allowances WHERE provider LIKE 'tabpfn-demo%'",
    );
    await pool.end();
  });
  it("limits guests without consuming reporting quota or leaking partial reservations", async () => {
    const before = await pool.query(
      "SELECT sum(units)::text AS units FROM provider_allowances",
    );
    await Promise.all(
      [1, 2, 3].map(() =>
        reserveModelAllowance(pool, "tabpfn-demo", 100, "guest-a"),
      ),
    );
    await expect(
      reserveModelAllowance(pool, "tabpfn-demo", 100, "guest-a"),
    ).rejects.toMatchObject({ code: "MODEL_GUEST_LIMIT" });
    expect(
      (
        await pool.query(
          "SELECT units FROM integration_allowances WHERE provider='tabpfn-demo'",
        )
      ).rows[0].units,
    ).toBe(3);
    await reserveModelAllowance(pool, "tabpfn-demo", 100, "guest-b");
    await pool.query(
      "UPDATE integration_allowances SET units=80 WHERE provider='tabpfn-demo'",
    );
    await expect(
      reserveModelAllowance(pool, "tabpfn-demo", 100, "guest-b"),
    ).rejects.toMatchObject({ code: "MODEL_CREDIT_LIMIT" });
    await reserveModelAllowance(pool, "tabpfn-demo", 100);
    expect(
      (
        await pool.query(
          "SELECT units FROM integration_allowances WHERE provider='tabpfn-demo'",
        )
      ).rows[0].units,
    ).toBe(81);
    expect(
      (
        await pool.query(
          "SELECT sum(units)::text AS units FROM provider_allowances",
        )
      ).rows,
    ).toEqual(before.rows);
  });
});
