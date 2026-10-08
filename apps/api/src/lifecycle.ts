import type { IssueRepository } from "./repository.js";
import type { StorageProvider } from "./storage.js";

/** Operator-only removal. No public/shared-token endpoint can erase evidence. */
export class DataLifecycle {
  private running = false;
  constructor(
    private repository: IssueRepository,
    private storage: StorageProvider,
    private removeSecondary?: (id: string) => Promise<void>,
  ) {}

  async remove(id: string) {
    return this.repository.transaction(async (c) => {
      const issue = await this.repository.issue(c, id, true);
      const keys = (
        await c.query(
          "SELECT storage_key FROM observations WHERE issue_id=$1 UNION SELECT storage_key FROM audio_summaries WHERE issue_id=$1",
          [issue.id],
        )
      ).rows.map((r) => r.storage_key as string);
      await c.query(
        "INSERT INTO removal_jobs(issue_id,storage_keys) VALUES($1,$2)",
        [issue.id, keys],
      );
      // Remove dependent comparisons before observations (composite foreign keys).
      await c.query("DELETE FROM revisit_reviews WHERE issue_id=$1", [
        issue.id,
      ]);
      await c.query("DELETE FROM evidence_diffs WHERE issue_id=$1", [issue.id]);
      await c.query("DELETE FROM issues WHERE id=$1", [issue.id]);
      return { publicId: issue.public_id, cleanupPending: true };
    });
  }

  async expired(days: number) {
    if (!Number.isInteger(days) || days < 1 || days > 3650)
      throw new Error("Invalid retention days");
    return (
      await this.repository.pool.query(
        "SELECT public_id FROM issues WHERE updated_at < now()-make_interval(days=>$1) ORDER BY updated_at LIMIT 20",
        [days],
      )
    ).rows.map((r) => r.public_id as string);
  }

  async maintain(days: number) {
    if (this.running) return;
    this.running = true;
    try {
      if (days > 0)
        for (const id of await this.expired(days)) {
          // Recheck under row lock; a new observation must not race expiry.
          await this.repository.transaction(async (c) => {
            const issue = await this.repository.issue(c, id, true);
            if (
              Date.now() - new Date(issue.updated_at).getTime() <=
              days * 86400000
            )
              return;
            const keys = (
              await c.query(
                "SELECT storage_key FROM observations WHERE issue_id=$1 UNION SELECT storage_key FROM audio_summaries WHERE issue_id=$1",
                [issue.id],
              )
            ).rows.map((r) => r.storage_key);
            await c.query(
              "INSERT INTO removal_jobs(issue_id,storage_keys) VALUES($1,$2)",
              [issue.id, keys],
            );
            await c.query("DELETE FROM revisit_reviews WHERE issue_id=$1", [
              issue.id,
            ]);
            await c.query("DELETE FROM evidence_diffs WHERE issue_id=$1", [
              issue.id,
            ]);
            await c.query("DELETE FROM issues WHERE id=$1", [issue.id]);
          });
        }
      await this.cleanup();
    } finally {
      this.running = false;
    }
  }

  async cleanup() {
    const jobs = (
      await this.repository.pool.query(
        "SELECT * FROM removal_jobs WHERE available_at<=now() ORDER BY created_at LIMIT 20",
      )
    ).rows;
    for (const job of jobs) {
      try {
        for (const key of job.storage_keys) await this.storage.delete(key);
        if (this.removeSecondary) await this.removeSecondary(job.issue_id);
        await this.repository.pool.query(
          "DELETE FROM removal_jobs WHERE issue_id=$1",
          [job.issue_id],
        );
      } catch {
        await this.repository.pool.query(
          "UPDATE removal_jobs SET attempts=attempts+1,last_error='CLEANUP_UNAVAILABLE',available_at=now()+interval '1 minute' WHERE issue_id=$1",
          [job.issue_id],
        );
      }
    }
  }
}
