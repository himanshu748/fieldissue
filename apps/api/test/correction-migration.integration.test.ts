import { it, expect } from "vitest";
import { Pool } from "pg";
import { readdir, readFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
const testDb = process.env.TEST_DATABASE_URL ? it : it.skip;
testDb(
  "upgrades legacy comparisons without rewriting model evidence and audits supersession",
  async () => {
    const pool = new Pool({ connectionString: process.env.TEST_DATABASE_URL });
    const c = await pool.connect();
    try {
      await c.query("BEGIN");
      const schema = "migration_" + randomUUID().replaceAll("-", "");
      await c.query(`CREATE SCHEMA ${schema}`);
      await c.query(`SET LOCAL search_path TO ${schema},public`);
      const dir = new URL("../../../db/migrations/", import.meta.url);
      for (const name of (await readdir(dir))
        .filter((n) => n.endsWith(".sql") && n < "014")
        .sort())
        await c.query(await readFile(new URL(name, dir), "utf8"));
      const issue = (
        await c.query(
          "INSERT INTO issues(title,category,severity,latitude,longitude) VALUES('Synthetic migration fixture','ENVIRONMENT','MEDIUM',0,0) RETURNING id",
        )
      ).rows[0].id;
      const ids = [];
      for (const day of [9, 10])
        ids.push(
          (
            await c.query(
              "INSERT INTO observations(issue_id,media_url,storage_key,mime_type,latitude,longitude,captured_at) VALUES($1,'http://localhost/test','fixture.png','image/png',0,0,$2) RETURNING id",
              [issue, `2026-10-${day}T00:00:00Z`],
            )
          ).rows[0].id,
        );
      const old = (
        await c.query(
          `INSERT INTO evidence_diffs(issue_id,before_observation_id,after_observation_id,summary,removed,added,unchanged,recommended_status,confidence,model,model_version) VALUES($1,$2,$3,'Not comparable: different subject matter','[]','["litter"]','[]','OPEN',0.9,'legacy-fixture','1') RETURNING *`,
          [issue, ...ids],
        )
      ).rows[0];
      await c.query(
        await readFile(new URL("014_observation_corrections.sql", dir), "utf8"),
      );
      const saved = (
        await c.query("SELECT * FROM evidence_diffs WHERE id=$1", [old.id])
      ).rows[0];
      expect(saved).toMatchObject(old);
      expect(saved.superseded_at).toBeInstanceOf(Date);
      expect(saved.outcome).toBe("INSUFFICIENT_EVIDENCE");
      const event = (
        await c.query(
          "SELECT payload FROM issue_events WHERE event_type='COMPARISON_SUPERSEDED'",
        )
      ).rows;
      expect(event).toHaveLength(1);
      expect(event[0].payload).toMatchObject({
        diffId: old.id,
        actor: { kind: "migration" },
      });
      expect(
        (await c.query("SELECT status FROM issues WHERE id=$1", [issue]))
          .rows[0].status,
      ).toBe("OPEN");
    } finally {
      await c.query("ROLLBACK");
      c.release();
      await pool.end();
    }
  },
);
