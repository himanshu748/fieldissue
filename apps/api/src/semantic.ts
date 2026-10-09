import { randomUUID } from "node:crypto";
import { Pool } from "pg";
import { z } from "zod";
import { AppError } from "./errors.js";
import { IssueRepository, camel } from "./repository.js";
const vectorSchema = z.array(z.number().finite()).length(384);
export const embeddingRevision = "751bff37182d3f1213fa05d7196b954e230abad9";
export const embeddingModel = "sentence-transformers/all-MiniLM-L6-v2";
const lifecycleReady = new WeakMap<Pool, Promise<unknown>>();
async function ensureLifecycle(tiger: Pool) {
  let ready = lifecycleReady.get(tiger);
  if (!ready) {
    ready = tiger
      .query(
        "CREATE TABLE IF NOT EXISTS fieldissue_index_tombstones (issue_id uuid PRIMARY KEY, removed_at timestamptz NOT NULL DEFAULT now())",
      )
      .catch((error) => {
        lifecycleReady.delete(tiger);
        throw error;
      });
    lifecycleReady.set(tiger, ready);
  }
  await ready;
}
export async function removeFromSemanticIndex(tiger: Pool, id: string) {
  await ensureLifecycle(tiger);
  const c = await tiger.connect();
  try {
    await c.query("BEGIN");
    await c.query("SELECT pg_advisory_xact_lock(hashtextextended($1,0))", [id]);
    await c.query(
      "INSERT INTO fieldissue_index_tombstones(issue_id) VALUES($1) ON CONFLICT DO NOTHING",
      [id],
    );
    await c.query("DELETE FROM fieldissue_semantic_index WHERE issue_id=$1", [
      id,
    ]);
    await c.query("COMMIT");
  } catch (error) {
    await c.query("ROLLBACK");
    throw error;
  } finally {
    c.release();
  }
}
export class SemanticSearch {
  private running = false;
  constructor(
    private repository: IssueRepository,
    private tiger: Pool,
    private embed: (text: string) => Promise<number[]>,
  ) {}
  async processNext(issueId?: string) {
    if (this.running) return false;
    this.running = true;
    let job: any;
    try {
      const token = randomUUID();
      job = (
        await this.repository.pool.query(
          `UPDATE semantic_index_jobs SET lease_token=$1,locked_until=now()+interval '2 minutes'
     WHERE issue_id=(SELECT issue_id FROM semantic_index_jobs WHERE ($2::uuid IS NULL OR issue_id=$2) AND completed_version<version AND available_at<=now() AND locked_until<now() ORDER BY available_at FOR UPDATE SKIP LOCKED LIMIT 1) RETURNING *`,
          [token, issueId ?? null],
        )
      ).rows[0];
      if (!job) return false;
      const issue = await this.repository.get(job.issue_id);
      const last = issue.observations.at(-1);
      // Index only text already saved with the report. Do not export images or exact capture metadata.
      const document = [
        issue.title,
        issue.description,
        issue.category,
        last?.note,
        JSON.stringify(last?.aiAnalysis?.conditions ?? []),
      ]
        .filter(Boolean)
        .join(". ")
        .slice(0, 4000);
      const vector = vectorSchema.parse(await this.embed(document));
      await ensureLifecycle(this.tiger);
      const c = await this.tiger.connect();
      try {
        await c.query("BEGIN");
        await c.query("SELECT pg_advisory_xact_lock(hashtextextended($1,0))", [
          issue.id,
        ]);
        if (
          (
            await c.query(
              "SELECT 1 FROM fieldissue_index_tombstones WHERE issue_id=$1",
              [issue.id],
            )
          ).rowCount
        ) {
          await c.query("ROLLBACK");
          return false;
        }
        await c.query(
          `INSERT INTO fieldissue_semantic_index(issue_id,title,document,category,status,latitude,longitude,embedding,model,source_version,model_revision)
    VALUES($1,$2,$3,$4,$5,$6,$7,$8::vector,$9,$10,$11)
    ON CONFLICT(issue_id) DO UPDATE SET title=excluded.title,document=excluded.document,category=excluded.category,status=excluded.status,latitude=excluded.latitude,longitude=excluded.longitude,embedding=excluded.embedding,model=excluded.model,model_revision=excluded.model_revision,source_version=excluded.source_version,indexed_at=now()
    WHERE fieldissue_semantic_index.source_version<=excluded.source_version`,
          [
            issue.id,
            issue.title,
            document,
            issue.category,
            issue.status,
            issue.latitude,
            issue.longitude,
            JSON.stringify(vector),
            embeddingModel,
            job.version,
            embeddingRevision,
          ],
        );
        await c.query("COMMIT");
      } catch (error) {
        await c.query("ROLLBACK");
        throw error;
      } finally {
        c.release();
      }
      await this.repository.pool.query(
        "UPDATE semantic_index_jobs SET completed_version=GREATEST(completed_version,$2),locked_until='-infinity',attempts=0,last_error=NULL WHERE issue_id=$1 AND lease_token=$3",
        [issue.id, job.version, token],
      );
      return true;
    } catch {
      if (job)
        await this.repository.pool
          .query(
            `UPDATE semantic_index_jobs SET attempts=attempts+1,last_error='INDEX_UNAVAILABLE',locked_until='-infinity',available_at=now()+make_interval(secs=>LEAST(3600,30*power(2,LEAST(attempts,6)))::int) WHERE issue_id=$1 AND lease_token=$2`,
            [job.issue_id, job.lease_token],
          )
          .catch(() => {});
      return false;
    } finally {
      this.running = false;
    }
  }
  async search(input: {
    publicOnly?: boolean;
    q: string;
    limit: number;
    category?: string;
    status?: string;
    latitude?: number;
    longitude?: number;
    radius_meters?: number;
  }) {
    try {
      const vector = vectorSchema.parse(await this.embed(input.q));
      const rows = (
        await this.tiger.query(
          `SELECT issue_id,indexed_at,model,1-(embedding<=>$1::vector) AS similarity,
     (0.75*(1-(embedding<=>$1::vector))+0.25*ts_rank_cd(keywords,plainto_tsquery('english',$2))) AS score
     FROM fieldissue_semantic_index WHERE model=$3 AND model_revision='751bff37182d3f1213fa05d7196b954e230abad9' AND ($4::text IS NULL OR category=$4) AND ($5::text IS NULL OR status=$5)
     AND ($6::float8 IS NULL OR ST_DWithin(ST_SetSRID(ST_MakePoint(longitude,latitude),4326)::geography,ST_SetSRID(ST_MakePoint($7,$6),4326)::geography,$8))
     ORDER BY score DESC,issue_id LIMIT $9`,
          [
            JSON.stringify(vector),
            input.q,
            embeddingModel,
            input.category ?? null,
            input.status ?? null,
            input.latitude ?? null,
            input.longitude ?? null,
            input.radius_meters ?? null,
            input.limit * 3,
          ],
        )
      ).rows;
      if (!rows.length)
        return {
          items: [],
          method: "hybrid_keyword_vector",
          model: embeddingModel,
        };
      const current = (
        await this.repository.pool.query(
          "SELECT * FROM issues WHERE id=ANY($1::uuid[]) AND (NOT $2::boolean OR is_public)",
          [rows.map((r) => r.issue_id), !!input.publicOnly],
        )
      ).rows;
      const byId = new Map(current.map((r) => [r.id, r]));
      const items = rows
        .flatMap((r) => {
          const issue = byId.get(r.issue_id);
          if (
            !issue ||
            (input.category && issue.category !== input.category) ||
            (input.status && issue.status !== input.status)
          )
            return [];
          return [
            {
              ...camel(issue),
              similarity: r.similarity,
              score: r.score,
              indexedAt: r.indexed_at,
              model: r.model,
            },
          ];
        })
        .slice(0, input.limit);
      return { items, method: "hybrid_keyword_vector", model: embeddingModel };
    } catch {
      throw new AppError(
        "SEMANTIC_SEARCH_UNAVAILABLE",
        503,
        "Semantic search is temporarily unavailable. Use title search instead.",
      );
    }
  }
}
export function embeddingClient(baseUrl: string, token: string) {
  return async (text: string) => {
    const r = await fetch(new URL("/internal/embed", baseUrl), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Internal-Token": token,
      },
      body: JSON.stringify({ texts: [text] }),
      signal: AbortSignal.timeout(65000),
    });
    if (!r.ok) throw new Error("EMBEDDING_UNAVAILABLE");
    const body = z
      .object({
        model: z.literal(embeddingModel),
        dimensions: z.literal(384),
        revision: z.literal(embeddingRevision),
        vectors: z.array(vectorSchema).length(1),
      })
      .parse(await r.json());
    return body.vectors[0]!;
  };
}
