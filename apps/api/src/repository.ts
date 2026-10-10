import { Pool, type PoolClient } from "pg";
import { comparisonSchema } from "@fieldissue/shared";
import type {
  CreateIssueInput,
  ObservationInput,
  Analysis,
  Comparison,
  PatchIssueInput,
  Prediction,
} from "@fieldissue/shared";
import type { StoredMedia } from "./storage.js";
import { AppError, notFound } from "./errors.js";
import { canTransition } from "./domain.js";
import { trace, reportFailure } from "./telemetry.js";

export type Row = Record<string, any>;
export const camel = (row: Row): Row =>
  Object.fromEntries(
    Object.entries(row)
      .filter(([key]) => key !== "geom" && key !== "cursor_created_at")
      .map(([key, value]) => [
        key.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase()),
        value instanceof Date ? value.toISOString() : value,
      ]),
  );
export class IssueRepository {
  constructor(public readonly pool: Pool) {}
  async transaction<T>(fn: (client: PoolClient) => Promise<T>) {
    const c = await this.pool.connect();
    try {
      await c.query("BEGIN");
      const result = await trace("database transaction", "db.transaction", () =>
        fn(c),
      );
      await c.query("COMMIT");
      return result;
    } catch (error) {
      await c.query("ROLLBACK");
      reportFailure("DATABASE_TRANSACTION_FAILED", "database");
      throw error;
    } finally {
      c.release();
    }
  }
  async issue(c: Pool | PoolClient, id: string, lock = false) {
    const r = await c.query(
      `SELECT * FROM issues WHERE ${id.startsWith("FI-") ? "public_id=$1" : "id=$1::uuid"} ${lock ? "FOR UPDATE" : ""}`,
      [id],
    );
    if (!r.rows[0]) throw notFound();
    return r.rows[0];
  }
  async findIdempotentIssue(
    key: string,
    hash: string,
    client: Pool | PoolClient = this.pool,
  ): Promise<string | null> {
    const r = await client.query(
      "SELECT request_hash,issue_id FROM idempotency_keys WHERE key=$1",
      [key],
    );
    if (!r.rows[0]) return null;
    if (r.rows[0].request_hash !== hash)
      throw new AppError(
        "IDEMPOTENCY_CONFLICT",
        409,
        "Idempotency key was used for a different request",
      );
    return r.rows[0].issue_id as string;
  }
  async get(
    id: string,
  ): Promise<
    Row & { id: string; observations: Row[]; revisitPrediction: Row | null }
  > {
    const issue = await this.issue(this.pool, id);
    const observations = await this.observations(issue.id);
    const predictions = await this.pool.query(
      "SELECT * FROM revisit_predictions WHERE issue_id=$1 ORDER BY created_at DESC LIMIT 1",
      [issue.id],
    );
    return {
      ...camel(issue),
      id: issue.id as string,
      observations: observations.items,
      revisitPrediction: predictions.rows[0]
        ? camel(predictions.rows[0])
        : null,
    };
  }
  async savePlaceContext(id: string, context: unknown) {
    await this.pool.query("UPDATE issues SET place_context=$2 WHERE id=$1", [
      id,
      JSON.stringify(context),
    ]);
  }
  async create(
    input: CreateIssueInput,
    media: StoredMedia,
    analysis: Analysis,
    idempotency?: { key: string; hash: string },
    client?: PoolClient,
    guestOwner?: string,
  ) {
    const execute = async (c: PoolClient) => {
      let effectiveOwner = guestOwner;
      if (guestOwner) {
        await c.query("SELECT pg_advisory_xact_lock(hashtextextended($1,0))", [
          guestOwner,
        ]);
        const linked = (
          await c.query(
            "SELECT a.guest_id FROM account_guest_links l JOIN accounts a ON a.id=l.account_id WHERE l.guest_id=$1",
            [guestOwner],
          )
        ).rows[0];
        effectiveOwner = linked?.guest_id ?? guestOwner;
      }
      if (idempotency) {
        await c.query("SELECT pg_advisory_xact_lock(hashtextextended($1,0))", [
          idempotency.key,
        ]);
        const existingId = await this.findIdempotentIssue(
          idempotency.key,
          idempotency.hash,
          c,
        );
        if (existingId) return { id: existingId, replayed: true };
      }
      const r = await c.query(
        "INSERT INTO issues(title,description,category,severity,latitude,longitude,reporter_id,is_public,guest_owner) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *",
        [
          input.title ??
            `${analysis.objects[0] ?? "Field issue"}: ${analysis.conditions[0] ?? "Needs inspection"}`.slice(
              0,
              200,
            ),
          input.description,
          input.category ?? analysis.suggestedCategory,
          input.severity ?? analysis.suggestedSeverity,
          input.latitude,
          input.longitude,
          input.reporterId ?? null,
          !!guestOwner,
          effectiveOwner ?? null,
        ],
      );
      const issue = r.rows[0];
      const observation = await this.insertObservation(
        c,
        issue.id,
        input,
        media,
        analysis,
      );
      await this.event(c, issue.id, "ISSUE_CREATED", {
        observationId: observation.id,
      });
      await this.event(c, issue.id, "CLASSIFICATION_UPDATED", {
        category: issue.category,
        severity: issue.severity,
        source: "validated_evidence",
      });
      if (idempotency)
        await c.query(
          "INSERT INTO idempotency_keys(key,request_hash,issue_id) VALUES($1,$2,$3)",
          [idempotency.key, idempotency.hash, issue.id],
        );
      return { id: issue.id as string, replayed: false };
    };
    return client ? execute(client) : this.transaction(execute);
  }
  private async insertObservation(
    c: PoolClient,
    id: string,
    input: ObservationInput,
    media: StoredMedia,
    analysis: Analysis,
  ) {
    return (
      await c.query(
        "INSERT INTO observations(issue_id,note,media_url,storage_key,mime_type,latitude,longitude,captured_at,ai_analysis,location_source,capture_time_source) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *",
        [
          id,
          input.note,
          media.mediaUrl,
          media.storageKey,
          media.mimeType,
          input.latitude,
          input.longitude,
          input.capturedAt ?? new Date().toISOString(),
          JSON.stringify(analysis),
          input.locationSource ?? "unspecified",
          input.captureTimeSource ?? (input.capturedAt ? "user" : "upload"),
        ],
      )
    ).rows[0];
  }
  async findObservationRequest(
    issueId: string,
    key: string,
    hash: string,
    client: Pool | PoolClient = this.pool,
  ): Promise<(Row & { replayed: boolean }) | null> {
    const r = await client.query(
      "SELECT r.request_hash,o.* FROM observation_requests r JOIN observations o ON o.id=r.observation_id WHERE r.issue_id=$1 AND r.key=$2",
      [issueId, key],
    );
    if (!r.rows[0]) return null;
    if (r.rows[0].request_hash !== hash)
      throw new AppError(
        "IDEMPOTENCY_CONFLICT",
        409,
        "This revisit key belongs to different evidence",
      );
    const { request_hash, ...observation } = r.rows[0];
    return { ...camel(observation), replayed: true };
  }
  async addObservation(
    id: string,
    input: ObservationInput,
    media: StoredMedia,
    analysis: Analysis,
    idempotency?: { key: string; hash: string },
  ): Promise<Row & { replayed: boolean }> {
    return this.transaction(async (c) => {
      const issue = await this.issue(c, id, true);
      if (idempotency) {
        const existing = await this.findObservationRequest(
          issue.id,
          idempotency.key,
          idempotency.hash,
          c,
        );
        if (existing) return existing;
      }
      if (issue.status === "REJECTED")
        throw new AppError(
          "INVALID_STATUS_TRANSITION",
          409,
          "Rejected issues do not accept observations",
        );
      const previous = (
        await c.query(
          "SELECT id,captured_at FROM observations WHERE issue_id=$1 AND exclusion_type IS NULL ORDER BY captured_at DESC,created_at DESC,id DESC LIMIT 1",
          [issue.id],
        )
      ).rows[0];
      const at = new Date(input.capturedAt ?? Date.now());
      // Backdated uploads remain valid evidence, but cannot recreate historical
      // severity, status or neighbourhood counts. Do not invent a training row.
      const now = new Date();
      const features =
        previous &&
        at > previous.captured_at &&
        at <= now &&
        now.getTime() - at.getTime() <= 300000
          ? await this.features(issue.id, c, now)
          : null;
      const o = await this.insertObservation(
        c,
        issue.id,
        input,
        media,
        analysis,
      );
      if (features) {
        await c.query(
          "UPDATE observations SET revisit_features=$2,previous_observation_id=$3 WHERE id=$1",
          [o.id, JSON.stringify(features), previous.id],
        );
        o.revisit_features = features;
        o.previous_observation_id = previous.id;
      }
      await c.query(
        "UPDATE issues SET updated_at=clock_timestamp() WHERE id=$1",
        [issue.id],
      );
      await this.event(c, issue.id, "OBSERVATION_ADDED", {
        observationId: o.id,
      });
      if (idempotency)
        await c.query(
          "INSERT INTO observation_requests(issue_id,key,request_hash,observation_id) VALUES($1,$2,$3,$4)",
          [issue.id, idempotency.key, idempotency.hash, o.id],
        );
      return { ...camel(o), replayed: false };
    });
  }
  async observations(id: string) {
    const issue = await this.issue(this.pool, id);
    return {
      items: (
        await this.pool.query(
          "SELECT * FROM observations WHERE issue_id=$1 ORDER BY captured_at,created_at,id",
          [issue.id],
        )
      ).rows.map(camel),
    };
  }
  async pair(
    id: string,
    before: string,
    after: string,
    client: Pool | PoolClient = this.pool,
  ) {
    const issue = await this.issue(client, id);
    if (before === after)
      throw new AppError(
        "INVALID_DIFF",
        400,
        "Diff requires distinct observations",
      );
    const r = await client.query(
      "SELECT * FROM observations WHERE issue_id=$1 AND id=ANY($2::uuid[])",
      [issue.id, [before, after]],
    );
    const b = r.rows.find((x) => x.id === before),
      a = r.rows.find((x) => x.id === after);
    if (!a || !b) throw notFound();
    if (a.exclusion_type || b.exclusion_type)
      throw new AppError(
        "EXCLUDED_OBSERVATION",
        409,
        "Select two eligible observations. Excluded photos remain in history.",
      );
    if (
      a.captured_at < b.captured_at ||
      (a.captured_at.getTime() === b.captured_at.getTime() &&
        a.created_at <= b.created_at)
    )
      throw new AppError(
        "INVALID_DIFF",
        400,
        "After observation must be newer than before observation",
      );
    return {
      issueId: issue.id as string,
      evidenceRevision: issue.evidence_revision as number,
      before: b,
      after: a,
    };
  }
  async correctObservation(
    id: string,
    observationId: string,
    correction: {
      exclusionType:
        "WRONG_LOCATION" | "WRONG_PHOTOGRAPH" | "NOT_SUITABLE" | null;
      reason: string;
    },
    actor: { kind: "owner" | "operator"; id: string; ownerId?: string },
  ) {
    return this.transaction(async (c) => {
      const issue = await this.issue(c, id, true);
      // Recheck under the issue lock: ownership can change during account adoption.
      if (
        actor.kind !== "operator" &&
        (!actor.ownerId || issue.guest_owner !== actor.ownerId)
      )
        throw new AppError(
          "OWNER_REQUIRED",
          403,
          "Only the report owner or an operator can correct observations.",
        );
      const old = (
        await c.query(
          "SELECT * FROM observations WHERE id=$1 AND issue_id=$2 FOR UPDATE",
          [observationId, issue.id],
        )
      ).rows[0];
      if (!old) throw notFound();
      if (
        old.exclusion_type === correction.exclusionType &&
        old.correction_reason === correction.reason
      )
        return camel(old);
      const updated = (
        await c.query(
          "UPDATE observations SET exclusion_type=$2,correction_reason=$3,corrected_at=clock_timestamp() WHERE id=$1 RETURNING *",
          [observationId, correction.exclusionType, correction.reason],
        )
      ).rows[0];
      await c.query(
        "UPDATE issues SET evidence_revision=evidence_revision+1,updated_at=clock_timestamp() WHERE id=$1",
        [issue.id],
      );
      await this.event(c, issue.id, "OBSERVATION_CORRECTED", {
        observationId,
        exclusionType: correction.exclusionType,
        reason: correction.reason,
        previousExclusionType: old.exclusion_type,
        previousReason: old.correction_reason,
        actor: { kind: actor.kind, id: actor.id },
      });
      const withdrawn = await c.query(
        `UPDATE evidence_diffs SET superseded_at=clock_timestamp(),superseded_reason='Observation correction changed comparison eligibility'
        WHERE issue_id=$1 AND superseded_at IS NULL AND (before_observation_id=$2 OR after_observation_id=$2) RETURNING id`,
        [issue.id, observationId],
      );
      for (const diff of withdrawn.rows)
        await this.event(c, issue.id, "COMPARISON_SUPERSEDED", {
          diffId: diff.id,
          observationId,
          actor: { kind: actor.kind, id: actor.id },
        });
      return camel(updated);
    });
  }
  async saveIdentityComparison(
    id: string,
    before: string,
    after: string,
    revision?: number,
  ) {
    return this.saveDiff(
      id,
      before,
      after,
      {
        outcome: "INSUFFICIENT_EVIDENCE",
        comparabilityReason:
          "Identical file is not independent evidence of another visit.",
        sameSubjectEvidence: [],
        summary:
          "The same photo was uploaded twice. No new visual evidence is available; take a fresh photo to check whether the issue changed.",
        removed: [],
        added: [],
        unchanged: [],
        recommendedStatus: "OPEN",
        confidence: 0,
        model: "fieldissue-image-identity",
        modelVersion: "bytes-v2",
      },
      revision,
      "identity",
    );
  }
  async saveDiff(
    id: string,
    before: string,
    after: string,
    result: Comparison,
    revision?: number,
    selectionMode = "manual",
  ) {
    result = comparisonSchema.parse(result);
    return this.transaction(async (c) => {
      const issue = await this.issue(c, id, true);
      if (revision !== undefined && issue.evidence_revision !== revision)
        throw new AppError(
          "EVIDENCE_CHANGED",
          409,
          "Observation eligibility changed during comparison. Review the pair and retry.",
        );
      await this.pair(id, before, after, c);
      const existing = (
        await c.query(
          "SELECT * FROM evidence_diffs WHERE issue_id=$1 AND before_observation_id=$2 AND after_observation_id=$3 AND superseded_at IS NULL",
          [id, before, after],
        )
      ).rows[0];
      if (
        existing &&
        (selectionMode !== "identity" ||
          existing.model === "fieldissue-image-identity")
      )
        return camel(existing);
      if (existing) {
        await c.query(
          "UPDATE evidence_diffs SET superseded_at=clock_timestamp(),superseded_reason='Identical uploaded files; prior model comparison withdrawn' WHERE id=$1",
          [existing.id],
        );
        await this.event(c, id, "COMPARISON_SUPERSEDED", {
          diffId: existing.id,
          method: "image_identity",
          previousComparison: camel(existing),
        });
      }
      const row = (
        await c.query(
          `INSERT INTO evidence_diffs(issue_id,before_observation_id,after_observation_id,summary,removed,added,unchanged,recommended_status,confidence,model,model_version,outcome,comparability_reason,same_subject_evidence,evidence_revision,selection_mode)
        VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING *`,
          [
            id,
            before,
            after,
            result.summary,
            JSON.stringify(result.removed),
            JSON.stringify(result.added),
            JSON.stringify(result.unchanged),
            result.recommendedStatus,
            result.confidence,
            result.model,
            result.modelVersion,
            result.outcome,
            result.comparabilityReason,
            JSON.stringify(result.sameSubjectEvidence),
            issue.evidence_revision,
            selectionMode,
          ],
        )
      ).rows[0];
      await this.event(c, id, "DIFF_GENERATED", {
        diffId: row.id,
        outcome: result.outcome,
        recommendedStatus: result.recommendedStatus,
        ...(selectionMode === "identity" ? { method: "image_identity" } : {}),
        beforeObservationId: before,
        afterObservationId: after,
        selectionMode,
        evidenceRevision: issue.evidence_revision,
      });
      await c.query(
        "UPDATE issues SET updated_at=clock_timestamp() WHERE id=$1",
        [id],
      );
      return camel(row);
    });
  }
  async diffs(id: string) {
    const issue = await this.issue(this.pool, id);
    return {
      items: (
        await this.pool.query(
          "SELECT * FROM evidence_diffs WHERE issue_id=$1 ORDER BY created_at,id",
          [issue.id],
        )
      ).rows.map(camel),
    };
  }
  async timeline(id: string) {
    const issue = await this.issue(this.pool, id);
    return {
      events: (
        await this.pool.query(
          "SELECT * FROM issue_events WHERE issue_id=$1 ORDER BY created_at,id",
          [issue.id],
        )
      ).rows.map(camel),
    };
  }
  async patch(
    id: string,
    patch: PatchIssueInput,
    note = "",
    resolution?: {
      basis: "latest_observation" | "manual_confirmation";
      observationId?: string;
    },
  ) {
    return this.transaction(async (c) => {
      const current = await this.issue(c, id, true);
      if (resolution?.basis === "latest_observation") {
        const latest = (
          await c.query(
            "SELECT id FROM observations WHERE issue_id=$1 AND exclusion_type IS NULL ORDER BY captured_at DESC,created_at DESC,id DESC LIMIT 1",
            [current.id],
          )
        ).rows[0];
        if (!latest || latest.id !== resolution.observationId)
          throw new AppError(
            "EVIDENCE_CHANGED",
            409,
            "Select the latest observation before confirming resolution.",
          );
      }
      if (
        resolution?.basis === "latest_observation" &&
        (
          await c.query(
            "SELECT 1 FROM evidence_diffs WHERE issue_id=$1 AND after_observation_id=$2 AND model='fieldissue-image-identity' LIMIT 1",
            [current.id, resolution.observationId],
          )
        ).rowCount
      )
        throw new AppError(
          "REPEATED_PHOTO",
          409,
          "A repeated photo is not new visual evidence. Add a fresh observation or explicitly choose manual confirmation.",
        );
      if (patch.status && !canTransition(current.status, patch.status))
        throw new AppError(
          "INVALID_STATUS_TRANSITION",
          409,
          `Cannot transition ${current.status} to ${patch.status}`,
        );
      const columns: Record<string, string> = {
        title: "title",
        description: "description",
        category: "category",
        severity: "severity",
        status: "status",
      };
      const values: unknown[] = [current.id];
      const assignments = Object.entries(patch).map(([key, value]) => {
        values.push(value);
        return `${columns[key]}=$${values.length}`;
      });
      if (patch.status && patch.status !== "RESOLVED")
        assignments.push("resolved_at=NULL");
      if (patch.status === "RESOLVED")
        assignments.push("resolved_at=COALESCE(resolved_at,clock_timestamp())");
      await c.query(
        `UPDATE issues SET ${assignments.join(",")},updated_at=clock_timestamp() WHERE id=$1`,
        values,
      );
      if (patch.status && patch.status !== current.status) {
        await this.event(c, current.id, "STATUS_CHANGED", {
          from: current.status,
          to: patch.status,
          note,
        });
        if (patch.status === "RESOLVED")
          await this.event(c, current.id, "ISSUE_RESOLVED", {
            note,
            source: "explicit_backend_action",
            basis: resolution?.basis ?? "manual_confirmation",
            observationId: resolution?.observationId ?? null,
          });
      }
      const edits = Object.fromEntries(
        ["title", "description"].flatMap((key) => {
          const value = patch[key as "title" | "description"];
          return value !== undefined && value !== current[key]
            ? [[key, { before: current[key], after: value }]]
            : [];
        }),
      );
      if (Object.keys(edits).length)
        await this.event(c, current.id, "ISSUE_UPDATED", {
          source: "explicit_backend_action",
          edits,
        });
      if (patch.category || patch.severity)
        await this.event(c, current.id, "CLASSIFICATION_UPDATED", {
          category: patch.category ?? current.category,
          severity: patch.severity ?? current.severity,
          source: "explicit_backend_action",
        });
      return current.id as string;
    });
  }
  private async event(
    c: PoolClient,
    id: string,
    type: string,
    payload: unknown,
  ) {
    await c.query(
      "INSERT INTO issue_events(issue_id,event_type,payload) VALUES($1,$2,$3)",
      [id, type, JSON.stringify(payload)],
    );
  }
  async list(filters: {
    publicOnly?: boolean;
    status?: string;
    category?: string;
    severity?: string;
    limit: number;
    cursor?: { createdAt: string; id: string };
    nearLat?: number;
    nearLon?: number;
    radius?: number;
    search?: string;
  }) {
    const params: unknown[] = [];
    const where: string[] = filters.publicOnly ? ["is_public"] : [];
    const bind = (v: unknown) => {
      params.push(v);
      return `$${params.length}`;
    };
    for (const k of ["status", "category", "severity"] as const)
      if (filters[k]) where.push(`${k}=${bind(filters[k])}`);
    if (filters.search) {
      const term = bind(filters.search);
      where.push(
        `(strpos(lower(title),lower(${term}))>0 OR strpos(lower(public_id),lower(${term}))>0)`,
      );
    }
    if (filters.cursor)
      where.push(
        `(created_at,id)<(${bind(filters.cursor.createdAt)}::timestamptz,${bind(filters.cursor.id)}::uuid)`,
      );
    if (filters.nearLat !== undefined)
      where.push(
        `ST_DWithin(geom::geography,ST_SetSRID(ST_MakePoint(${bind(filters.nearLon)},${bind(filters.nearLat)}),4326)::geography,${bind(filters.radius)})`,
      );
    const result = await this.pool.query(
      `SELECT *,to_char(created_at AT TIME ZONE 'UTC','YYYY-MM-DD\"T\"HH24:MI:SS.US\"Z\"') AS cursor_created_at FROM issues ${where.length ? `WHERE ${where.join(" AND ")}` : ""} ORDER BY created_at DESC,id DESC LIMIT ${bind(filters.limit + 1)}`,
      params,
    );
    const more = result.rows.length > filters.limit;
    const rows = result.rows.slice(0, filters.limit);
    const last = rows.at(-1);
    return {
      items: rows.map(camel),
      nextCursor:
        more && last
          ? Buffer.from(
              JSON.stringify({
                createdAt: last.cursor_created_at,
                id: last.id,
              }),
            ).toString("base64url")
          : null,
    };
  }
  async map(
    bbox: [number, number, number, number],
    limit: number,
    publicOnly = false,
  ) {
    const [west, south, east, north] = bbox;
    const predicate =
      west <= east
        ? "geom && ST_MakeEnvelope($1,$2,$3,$4,4326)"
        : "(geom && ST_MakeEnvelope($1,$2,180,$4,4326) OR geom && ST_MakeEnvelope(-180,$2,$3,$4,4326))";
    const r = await this.pool.query(
      `SELECT * FROM issues WHERE ${predicate} ${publicOnly ? "AND is_public" : ""} ORDER BY created_at DESC,id DESC LIMIT $5`,
      [west, south, east, north, limit + 1],
    );
    return {
      type: "FeatureCollection",
      truncated: r.rows.length > limit,
      features: r.rows.slice(0, limit).map((x) => ({
        type: "Feature",
        geometry: { type: "Point", coordinates: [x.longitude, x.latitude] },
        properties: camel(x),
      })),
    };
  }
  async walkSuggestions(
    latitude: number,
    longitude: number,
    radius: number,
    limit: number,
    publicOnly = false,
  ) {
    const result = await this.pool.query(
      `SELECT i.id AS issue_id,i.title,i.status,
        ST_Distance(i.geom::geography,p.point) AS distance_meters,
        COALESCE((SELECT max(o.captured_at) FROM observations o WHERE o.issue_id=i.id),i.created_at) AS last_observed_at
       FROM issues i CROSS JOIN (SELECT ST_SetSRID(ST_MakePoint($1,$2),4326)::geography AS point) p
       WHERE ${publicOnly ? "i.is_public AND" : ""} i.status NOT IN ('RESOLVED','REJECTED') AND ST_DWithin(i.geom::geography,p.point,$3)
       ORDER BY distance_meters ASC,last_observed_at ASC,i.id ASC LIMIT $4`,
      [longitude, latitude, radius, limit],
    );
    return {
      items: result.rows.map(camel),
      sortingMethod: "distance_then_age",
      routeCalculated: false,
    };
  }
  async nearby(
    latitude: number,
    longitude: number,
    client: Pool | PoolClient = this.pool,
    publicOnly = false,
  ) {
    return (
      await client.query(
        `SELECT id,public_id,title FROM issues WHERE ${publicOnly ? "is_public AND" : ""} status NOT IN ('RESOLVED','REJECTED') AND ST_DWithin(geom::geography,ST_SetSRID(ST_MakePoint($1,$2),4326)::geography,100) LIMIT 10`,
        [longitude, latitude],
      )
    ).rows.map(camel);
  }
  async features(
    id: string,
    client: Pool | PoolClient = this.pool,
    at = new Date(),
  ): Promise<Record<string, string | number>> {
    const i = await this.issue(client, id);
    const r = (
      await client.query(
        "SELECT count(*)::int count,max(captured_at) last FROM observations WHERE issue_id=$1 AND exclusion_type IS NULL",
        [i.id],
      )
    ).rows[0];
    const changes = (
      await client.query(
        "SELECT count(*)::int count FROM evidence_diffs WHERE issue_id=$1 AND superseded_at IS NULL AND outcome='CHANGED' AND (jsonb_array_length(added)>0 OR jsonb_array_length(removed)>0)",
        [i.id],
      )
    ).rows[0].count;
    return {
      days_since_last_observation: Math.max(
        0,
        (at.getTime() - r.last.getTime()) / 86400000,
      ),
      previous_observation_count: r.count,
      issue_age_days: Math.max(
        0,
        (at.getTime() - i.created_at.getTime()) / 86400000,
      ),
      severity: i.severity,
      category: i.category,
      nearby_issue_count: (
        await client.query(
          "SELECT count(*)::int count FROM issues WHERE id<>$1 AND (NOT $4::boolean OR is_public) AND status NOT IN ('RESOLVED','REJECTED') AND ST_DWithin(geom::geography,ST_SetSRID(ST_MakePoint($2,$3),4326)::geography,100)",
          [i.id, i.longitude, i.latitude, !!i.is_public],
        )
      ).rows[0].count,
      previous_change_count: changes,
      status: i.status,
    };
  }
  async reviewRevisit(
    id: string,
    input: {
      beforeObservationId: string;
      afterObservationId: string;
      materialChange: boolean;
      note: string;
      evidenceIsGenuine: true;
    },
  ) {
    return this.transaction(async (c) => {
      const issue = await this.issue(c, id, true);
      await this.pair(
        issue.id,
        input.beforeObservationId,
        input.afterObservationId,
        c,
      );
      const after = (
        await c.query(
          "SELECT * FROM observations WHERE id=$1 AND issue_id=$2",
          [input.afterObservationId, issue.id],
        )
      ).rows[0];
      if (!after) throw notFound();
      if (
        !after.revisit_features ||
        after.previous_observation_id !== input.beforeObservationId
      )
        throw new AppError(
          "REVIEW_NOT_ELIGIBLE",
          409,
          "This pair has no predictors recorded before the revisit. Review a new, chronological revisit.",
        );
      const hasFixture = (
        await c.query(
          "SELECT 1 FROM observations WHERE issue_id=$1 AND ai_analysis->>'model' LIKE 'development-fixture%' LIMIT 1",
          [issue.id],
        )
      ).rowCount;
      if (hasFixture)
        throw new AppError(
          "REVIEW_NOT_ELIGIBLE",
          409,
          "Development fixtures cannot become real training labels.",
        );
      const row = (
        await c.query(
          `INSERT INTO revisit_reviews(after_observation_id,before_observation_id,issue_id,material_change,note,evidence_is_genuine)
        VALUES($1,$2,$3,$4,$5,true) ON CONFLICT(after_observation_id) DO UPDATE SET
        material_change=EXCLUDED.material_change,note=EXCLUDED.note,reviewed_at=clock_timestamp() RETURNING *`,
          [
            after.id,
            input.beforeObservationId,
            issue.id,
            input.materialChange,
            input.note,
          ],
        )
      ).rows[0];
      await this.event(c, issue.id, "REVISIT_REVIEWED", {
        beforeObservationId: input.beforeObservationId,
        afterObservationId: after.id,
        materialChange: input.materialChange,
        note: input.note,
        source: "human_review",
      });
      return camel(row);
    });
  }
  async trainingData() {
    const rows = (
      await this.pool
        .query(`SELECT o.revisit_features AS features,r.material_change AS changed
      FROM revisit_reviews r JOIN observations o ON o.id=r.after_observation_id
      JOIN observations b ON b.id=r.before_observation_id
      WHERE r.evidence_is_genuine AND o.exclusion_type IS NULL AND b.exclusion_type IS NULL AND o.revisit_features IS NOT NULL ORDER BY r.reviewed_at,r.after_observation_id`)
    ).rows;
    if (!rows.some((r) => r.changed) || !rows.some((r) => !r.changed))
      throw new AppError(
        "TRAINING_DATA_INCOMPLETE",
        409,
        "Review genuine changed and unchanged revisits before exporting TabPFN training data.",
      );
    const columns = [
      "days_since_last_observation",
      "previous_observation_count",
      "issue_age_days",
      "severity",
      "category",
      "nearby_issue_count",
      "previous_change_count",
      "status",
    ];
    // Values are typed server snapshots, never user notes or spreadsheet formulas.
    return (
      [
        ...[columns.concat("material_change_since_last_visit").join(",")],
        ...rows.map((r) =>
          columns
            .map((k) => String(r.features[k]))
            .concat(r.changed ? "1" : "0")
            .join(","),
        ),
      ].join("\n") + "\n"
    );
  }
  async savePrediction(
    id: string,
    features: Record<string, string | number>,
    prediction: Prediction,
    client: Pool | PoolClient = this.pool,
  ) {
    await client.query(
      "INSERT INTO revisit_predictions(issue_id,probability_changed,priority_score,features,model_version) VALUES($1,$2,$3,$4,$5)",
      [
        id,
        prediction.probabilityChanged,
        prediction.priorityScore,
        JSON.stringify(features),
        prediction.modelVersion,
      ],
    );
  }
}
