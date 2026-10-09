import { randomBytes } from "node:crypto";
import type { Pool, PoolClient } from "pg";
import { z } from "zod";
import { AppError } from "./errors.js";
import { digest, transaction, type Account } from "./accounts.js";
const fail = (message = "This workspace is not available to your account.") =>
  new AppError("COMMUNITY_ACCESS", 403, message);
const uuid = z.uuid();
const issueRef = z.string().regex(/^(?:FI-\d{6,}|[a-f0-9-]{36})$/i);
const point = z
  .object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  })
  .strict();
export const savedWalkSchema = z
  .object({
    version: z.literal(1),
    createdAt: z.iso.datetime(),
    startedAt: z.iso.datetime().nullable(),
    origin: point,
    radiusMeters: z.number().min(1).max(50000),
    items: z
      .array(
        z
          .object({
            issueId: issueRef,
            state: z.enum(["pending", "visited", "skipped"]),
            observationId: uuid.optional(),
          })
          .strict(),
      )
      .min(1)
      .max(5),
  })
  .strict();
export class Community {
  constructor(readonly pool: Pool) {}
  async member(c: Pool | PoolClient, id: string, a: Account, owner = false) {
    const r = (
      await c.query(
        "SELECT w.* FROM communities w JOIN community_members m ON m.community_id=w.id WHERE w.id=$1 AND m.account_id=$2 FOR SHARE OF w",
        [uuid.parse(id), a.id],
      )
    ).rows[0];
    if (!r || (owner && r.owner_id !== a.id)) throw fail();
    return r;
  }
  async publicIssue(c: Pool | PoolClient, ref: string, lock = false) {
    const parsed = issueRef.parse(ref);
    const publicId = parsed.toUpperCase().startsWith("FI-");
    const i = (
      await c.query(
        `SELECT * FROM issues WHERE ${publicId ? "public_id=$1" : "id=$1::uuid"} AND is_public ${lock ? "FOR UPDATE" : ""}`,
        [publicId ? parsed.toUpperCase() : uuid.parse(parsed.toLowerCase())],
      )
    ).rows[0];
    if (!i) throw new AppError("NOT_FOUND", 404, "Public issue not found.");
    return i;
  }
  async list(a: Account) {
    return (
      await this.pool.query(
        "SELECT w.id,w.name,w.area,w.owner_id=$1 AS owner FROM communities w JOIN community_members m ON m.community_id=w.id WHERE m.account_id=$1 ORDER BY w.created_at DESC LIMIT 50",
        [a.id],
      )
    ).rows;
  }
  async create(a: Account, input: unknown) {
    const x = z
      .object({
        name: z.string().trim().min(1).max(80),
        area: z.string().trim().max(160).default(""),
      })
      .strict()
      .parse(input);
    return transaction(this.pool, async (c) => {
      await c.query("SELECT id FROM accounts WHERE id=$1 FOR UPDATE", [a.id]);
      if (
        Number(
          (
            await c.query(
              "SELECT count(*) FROM communities WHERE owner_id=$1",
              [a.id],
            )
          ).rows[0].count,
        ) >= 10
      )
        throw fail("Limit of ten workspaces reached.");
      const w = (
        await c.query(
          "INSERT INTO communities(name,area,owner_id) VALUES($1,$2,$3) RETURNING id,name,area",
          [x.name, x.area, a.id],
        )
      ).rows[0];
      await c.query("INSERT INTO community_members VALUES($1,$2,now())", [
        w.id,
        a.id,
      ]);
      return w;
    });
  }
  async detail(a: Account, id: string) {
    const w = await this.member(this.pool, id, a);
    const members = (
      await this.pool.query(
        "SELECT a.id,a.username FROM community_members m JOIN accounts a ON a.id=m.account_id WHERE m.community_id=$1 ORDER BY a.username",
        [id],
      )
    ).rows;
    const issues = (
      await this.pool.query(
        "SELECT i.public_id,i.title,i.status,i.id,ci.assignee_id,a.username AS assignee FROM community_issues ci JOIN issues i ON i.id=ci.issue_id LEFT JOIN accounts a ON a.id=ci.assignee_id WHERE ci.community_id=$1 AND i.is_public ORDER BY i.updated_at DESC LIMIT 100",
        [id],
      )
    ).rows;
    const proposals = (
      await this.pool.query(
        "SELECT p.id,p.issue_id,i.public_id,p.note,p.status,p.observation_id,p.proposer_id,(SELECT count(*)::int FROM resolution_votes v WHERE v.proposal_id=p.id AND v.approve) AS approvals FROM resolution_proposals p JOIN issues i ON i.id=p.issue_id WHERE p.community_id=$1 AND i.is_public ORDER BY p.created_at DESC LIMIT 100",
        [id],
      )
    ).rows;
    return {
      id: w.id,
      name: w.name,
      area: w.area,
      owner: w.owner_id === a.id,
      members,
      issues,
      proposals,
    };
  }
  async removeMember(a: Account, id: string, input: unknown) {
    const { accountId } = z.object({ accountId: uuid }).strict().parse(input);
    return transaction(this.pool, async (c) => {
      await c.query("SELECT id FROM communities WHERE id=$1 FOR UPDATE", [
        uuid.parse(id),
      ]);
      const w = await this.member(c, id, a, accountId !== a.id);
      if (w.owner_id === accountId)
        throw fail("The owner must stay in the workspace.");
      await c.query(
        "DELETE FROM community_members WHERE community_id=$1 AND account_id=$2",
        [id, accountId],
      );
      await c.query(
        "UPDATE community_issues SET assignee_id=NULL WHERE community_id=$1 AND assignee_id=$2",
        [id, accountId],
      );
      await c.query(
        "DELETE FROM resolution_votes v USING resolution_proposals p WHERE v.proposal_id=p.id AND p.community_id=$1 AND p.status='pending' AND v.account_id=$2",
        [id, accountId],
      );
      await c.query(
        "UPDATE resolution_proposals SET status='stale' WHERE community_id=$1 AND proposer_id=$2 AND status='pending'",
        [id, accountId],
      );
      return { ok: true };
    });
  }
  async revokeInvites(a: Account, id: string) {
    return transaction(this.pool, async (c) => {
      await this.member(c, id, a, true);
      await c.query(
        "DELETE FROM community_invites WHERE community_id=$1 AND used_by IS NULL",
        [id],
      );
      return { ok: true };
    });
  }
  async invite(a: Account, id: string) {
    return transaction(this.pool, async (c) => {
      await c.query("SELECT id FROM communities WHERE id=$1 FOR UPDATE", [
        uuid.parse(id),
      ]);
      await this.member(c, id, a, true);
      await c.query(
        "DELETE FROM community_invites WHERE community_id=$1 AND (expires_at<=now() OR used_by IS NOT NULL)",
        [id],
      );
      if (
        Number(
          (
            await c.query(
              "SELECT count(*) FROM community_invites WHERE community_id=$1",
              [id],
            )
          ).rows[0].count,
        ) >= 20
      )
        throw fail("Revoke unused invitations before creating more.");
      const token = randomBytes(24).toString("base64url");
      await c.query(
        "INSERT INTO community_invites(token_hash,community_id,expires_at) VALUES($1,$2,now()+interval '1 day')",
        [digest(token), id],
      );
      return { code: token, expiresInHours: 24 };
    });
  }
  async join(a: Account, input: unknown) {
    const { code } = z
      .object({ code: z.string().regex(/^[\w-]{32}$/) })
      .strict()
      .parse(input);
    return transaction(this.pool, async (c) => {
      const ref = (
        await c.query(
          "SELECT community_id FROM community_invites WHERE token_hash=$1",
          [digest(code)],
        )
      ).rows[0];
      if (!ref) throw fail("Invitation is invalid, expired or already used.");
      await c.query("SELECT id FROM communities WHERE id=$1 FOR UPDATE", [
        ref.community_id,
      ]);
      const i = (
        await c.query(
          "UPDATE community_invites SET used_by=$2 WHERE token_hash=$1 AND expires_at>now() AND used_by IS NULL RETURNING community_id",
          [digest(code), a.id],
        )
      ).rows[0];
      if (!i) throw fail("Invitation is invalid, expired or already used.");
      await c.query("SELECT id FROM communities WHERE id=$1 FOR UPDATE", [
        i.community_id,
      ]);
      if (
        Number(
          (
            await c.query(
              "SELECT count(*) FROM community_members WHERE community_id=$1",
              [i.community_id],
            )
          ).rows[0].count,
        ) >= 50
      )
        throw fail("This workspace has reached its 50-member limit.");
      if (
        (
          await c.query(
            "SELECT 1 FROM community_members WHERE community_id=$1 AND account_id=$2",
            [i.community_id, a.id],
          )
        ).rowCount
      )
        throw fail(
          "You already belong to this workspace; the invitation has not been used.",
        );
      await c.query(
        "INSERT INTO community_members(community_id,account_id) VALUES($1,$2) ON CONFLICT DO NOTHING",
        [i.community_id, a.id],
      );
      return { id: i.community_id };
    });
  }
  async addIssue(a: Account, id: string, input: unknown) {
    const { issueId } = z.object({ issueId: issueRef }).strict().parse(input);
    return transaction(this.pool, async (c) => {
      await this.member(c, id, a);
      const i = await this.publicIssue(c, issueId);
      if (i.guest_owner !== a.guest_id)
        throw fail("Only the report owner can add it to a workspace.");
      await c.query(
        "INSERT INTO community_issues(community_id,issue_id) VALUES($1,$2) ON CONFLICT DO NOTHING",
        [id, i.id],
      );
      return { ok: true };
    });
  }
  async assign(a: Account, id: string, input: unknown) {
    const x = z
      .object({ issueId: uuid, accountId: uuid.nullable() })
      .strict()
      .parse(input);
    return transaction(this.pool, async (c) => {
      await this.member(c, id, a, true);
      if (
        x.accountId &&
        !(
          await c.query(
            "SELECT 1 FROM community_members WHERE community_id=$1 AND account_id=$2",
            [id, x.accountId],
          )
        ).rowCount
      )
        throw fail("Assignee must belong to this workspace.");
      const r = await c.query(
        "UPDATE community_issues ci SET assignee_id=$3 FROM issues i WHERE ci.community_id=$1 AND ci.issue_id=$2 AND i.id=ci.issue_id AND i.is_public RETURNING ci.issue_id",
        [id, x.issueId, x.accountId],
      );
      if (!r.rowCount) throw fail();
      if (x.accountId)
        await c.query(
          "INSERT INTO account_notifications(account_id,issue_id,message) VALUES($1,$2,'You were assigned an issue in your workspace.')",
          [x.accountId, x.issueId],
        );
      return { ok: true };
    });
  }
  async evidence(c: PoolClient, i: any, observation: string) {
    const latest = (
      await c.query(
        "SELECT id FROM observations WHERE issue_id=$1 ORDER BY captured_at DESC,created_at DESC,id DESC LIMIT 1",
        [i.id],
      )
    ).rows[0];
    if (latest?.id !== observation)
      throw new AppError(
        "EVIDENCE_CHANGED",
        409,
        "Newer evidence exists. Start a new review.",
      );
    if (!["OPEN", "ACKNOWLEDGED", "IN_PROGRESS"].includes(i.status))
      throw new AppError(
        "REVIEW_CLOSED",
        409,
        "Only an active issue can be reviewed.",
      );
    const fresh = await c.query(
      "SELECT 1 FROM evidence_diffs WHERE issue_id=$1 AND after_observation_id=$2 AND model<>'fieldissue-image-identity'",
      [i.id, observation],
    );
    const repeated = await c.query(
      "SELECT 1 FROM evidence_diffs WHERE issue_id=$1 AND after_observation_id=$2 AND model='fieldissue-image-identity'",
      [i.id, observation],
    );
    if (!fresh.rowCount || repeated.rowCount)
      throw new AppError(
        "REVIEW_EVIDENCE_REQUIRED",
        409,
        "Add a fresh revisit photo and compare it before requesting verified resolution.",
      );
  }
  async propose(a: Account, id: string, input: unknown) {
    const x = z
      .object({
        issueId: uuid,
        observationId: uuid,
        note: z.string().trim().min(1).max(1000),
      })
      .strict()
      .parse(input);
    return transaction(this.pool, async (c) => {
      await this.member(c, id, a);
      const i = await this.publicIssue(c, x.issueId, true);
      if (
        !(
          await c.query(
            "SELECT 1 FROM community_issues WHERE community_id=$1 AND issue_id=$2",
            [id, i.id],
          )
        ).rowCount
      )
        throw fail();
      await this.evidence(c, i, x.observationId);
      await c.query(
        "UPDATE resolution_proposals SET status='stale' WHERE issue_id=$1 AND status='pending' AND observation_id<>$2",
        [i.id, x.observationId],
      );
      if (
        (
          await c.query(
            "SELECT 1 FROM resolution_proposals WHERE issue_id=$1 AND community_id=$2 AND status='pending'",
            [i.id, id],
          )
        ).rowCount
      )
        throw new AppError(
          "REVIEW_PENDING",
          409,
          "This issue already has a pending review.",
        );
      const p = (
        await c.query(
          "INSERT INTO resolution_proposals(community_id,issue_id,proposer_id,observation_id,note) VALUES($1,$2,$3,$4,$5) RETURNING id",
          [id, i.id, a.id, x.observationId, x.note],
        )
      ).rows[0];
      await c.query(
        "INSERT INTO account_notifications(account_id,issue_id,message) SELECT account_id,$2,'A resolution proposal needs independent review.' FROM community_members WHERE community_id=$1 AND account_id<>$3",
        [id, i.id, a.id],
      );
      return p;
    });
  }
  async vote(a: Account, id: string, input: unknown) {
    const x = z
      .object({ proposalId: uuid, approve: z.boolean() })
      .strict()
      .parse(input);
    return transaction(this.pool, async (c) => {
      await this.member(c, id, a);
      const ref = (
        await c.query(
          "SELECT issue_id FROM resolution_proposals WHERE id=$1 AND community_id=$2",
          [x.proposalId, id],
        )
      ).rows[0];
      if (!ref)
        throw new AppError("REVIEW_CLOSED", 409, "This review is unavailable.");
      const i = await this.publicIssue(c, ref.issue_id, true);
      const p = (
        await c.query(
          "SELECT * FROM resolution_proposals WHERE id=$1 AND community_id=$2 FOR UPDATE",
          [x.proposalId, id],
        )
      ).rows[0];
      if (!p || p.status !== "pending")
        throw new AppError(
          "REVIEW_CLOSED",
          409,
          "This review is no longer pending.",
        );
      if (p.proposer_id === a.id || i.guest_owner === a.guest_id)
        throw fail(
          "The proposer and report owner cannot provide an independent approval.",
        );
      await this.evidence(c, i, p.observation_id);
      const prior = (
        await c.query(
          "SELECT approve FROM resolution_votes WHERE proposal_id=$1 AND account_id=$2",
          [p.id, a.id],
        )
      ).rows[0];
      if (prior && prior.approve !== x.approve)
        throw new AppError(
          "VOTE_RECORDED",
          409,
          "Your vote is already recorded and cannot be changed.",
        );
      await c.query(
        "INSERT INTO resolution_votes(proposal_id,account_id,approve) VALUES($1,$2,$3) ON CONFLICT DO NOTHING",
        [p.id, a.id, x.approve],
      );
      const votes = (
        await c.query(
          "SELECT account_id,approve FROM resolution_votes WHERE proposal_id=$1",
          [p.id],
        )
      ).rows;
      let status = "pending";
      if (votes.some((v) => !v.approve)) status = "rejected";
      else if (votes.length >= 2) {
        status = "resolved";
        await c.query(
          "UPDATE issues SET status='RESOLVED',resolved_at=clock_timestamp(),updated_at=clock_timestamp() WHERE id=$1",
          [i.id],
        );
        await c.query(
          "INSERT INTO issue_events(issue_id,event_type,payload) VALUES($1,'STATUS_CHANGED',$2),($1,'ISSUE_RESOLVED',$3)",
          [
            i.id,
            JSON.stringify({
              from: i.status,
              to: "RESOLVED",
              note: "Confirmed by two workspace accounts.",
            }),
            JSON.stringify({
              note: "Confirmed by two workspace accounts.",
              basis: "latest_observation",
              observationId: p.observation_id,
              source: "two_reviewer_confirmation",
              proposalId: p.id,
              reviewerCount: votes.length,
              identityAssurance: "unverified_accounts",
            }),
          ],
        );
      }
      await c.query("UPDATE resolution_proposals SET status=$2 WHERE id=$1", [
        p.id,
        status,
      ]);
      return { status, approvals: votes.filter((v) => v.approve).length };
    });
  }
  async savedWalk(a: Account) {
    return (
      (
        await this.pool.query(
          "SELECT revision,data,updated_at FROM saved_walks WHERE account_id=$1",
          [a.id],
        )
      ).rows[0] ?? null
    );
  }
  async saveWalk(a: Account, input: unknown) {
    const x = z
      .object({ revision: z.number().int().min(0), walk: savedWalkSchema })
      .strict()
      .parse(input);
    if (
      new Set(x.walk.items.map((i) => i.issueId)).size !== x.walk.items.length
    )
      throw new AppError(
        "VALIDATION_ERROR",
        400,
        "A walk cannot repeat a stop.",
      );
    return transaction(this.pool, async (c) => {
      for (const item of x.walk.items) {
        const i = await this.publicIssue(c, item.issueId);
        if (
          item.state === "visited" &&
          (!item.observationId ||
            !(
              await c.query(
                "SELECT 1 FROM observations WHERE id=$1 AND issue_id=$2 AND created_at>=$3",
                [item.observationId, i.id, x.walk.createdAt],
              )
            ).rowCount)
        )
          throw new AppError(
            "VISIT_EVIDENCE_REQUIRED",
            400,
            "A visited stop must reference an observation saved after this walk started. This does not certify who took the photo.",
          );
      }
      const r = await c.query(
        "INSERT INTO saved_walks(account_id,revision,data) SELECT $1,1,$3::jsonb WHERE $2=0 ON CONFLICT(account_id) DO UPDATE SET revision=saved_walks.revision+1,data=$3,updated_at=now() WHERE saved_walks.revision=$2 RETURNING revision,data,updated_at",
        [a.id, x.revision, JSON.stringify(x.walk)],
      );
      if (!r.rowCount) {
        const u = await c.query(
          "UPDATE saved_walks SET revision=revision+1,data=$3,updated_at=now() WHERE account_id=$1 AND revision=$2 RETURNING revision,data,updated_at",
          [a.id, x.revision, JSON.stringify(x.walk)],
        );
        if (u.rowCount) return u.rows[0];
        throw new AppError(
          "WALK_CONFLICT",
          409,
          "Another device saved a newer walk. Load it before replacing it.",
        );
      }
      return r.rows[0];
    });
  }
  async notifications(a: Account) {
    await this.pool.query(
      "DELETE FROM account_notifications WHERE account_id=$1 AND due_at<now()-interval '90 days'",
      [a.id],
    );
    return (
      await this.pool.query(
        "SELECT n.id,n.message,n.due_at,n.read_at,i.public_id FROM account_notifications n LEFT JOIN issues i ON i.id=n.issue_id WHERE n.account_id=$1 AND n.due_at<=now() AND (n.issue_id IS NULL OR i.is_public) ORDER BY n.due_at DESC LIMIT 100",
        [a.id],
      )
    ).rows;
  }
  async reminder(a: Account, input: unknown) {
    const x = z
      .object({ issueId: issueRef, dueAt: z.iso.datetime() })
      .strict()
      .parse(input);
    const due = Date.parse(x.dueAt);
    if (due < Date.now() + 60000 || due > Date.now() + 90 * 86400000)
      throw new AppError(
        "VALIDATION_ERROR",
        400,
        "Choose between one minute and 90 days from now.",
      );
    return transaction(this.pool, async (c) => {
      await c.query("SELECT id FROM accounts WHERE id=$1 FOR UPDATE", [a.id]);
      if (
        Number(
          (
            await c.query(
              "SELECT count(*) FROM account_notifications WHERE account_id=$1 AND due_at>now()",
              [a.id],
            )
          ).rows[0].count,
        ) >= 100
      )
        throw fail("Limit of 100 upcoming reminders reached.");
      const i = await this.publicIssue(c, x.issueId);
      await c.query(
        "INSERT INTO account_notifications(account_id,issue_id,message,due_at) VALUES($1,$2,'Your planned revisit is due. Check conditions only if it is safe.',$3)",
        [a.id, i.id, x.dueAt],
      );
      return { ok: true };
    });
  }
  async subscribe(a: Account, input: unknown) {
    const x = z
      .object({ issueId: issueRef, enabled: z.boolean() })
      .strict()
      .parse(input);
    const i = await this.publicIssue(this.pool, x.issueId);
    if (x.enabled)
      await this.pool.query(
        "INSERT INTO issue_subscriptions VALUES($1,$2) ON CONFLICT DO NOTHING",
        [a.id, i.id],
      );
    else
      await this.pool.query(
        "DELETE FROM issue_subscriptions WHERE account_id=$1 AND issue_id=$2",
        [a.id, i.id],
      );
    return { ok: true };
  }
}
