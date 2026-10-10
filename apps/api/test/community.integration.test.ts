import { beforeAll, afterAll, describe, it, expect } from "vitest";
import { randomUUID } from "node:crypto";
import { Pool } from "pg";
import { migrate } from "../src/migrate.js";
import { Accounts, digest, type Account } from "../src/accounts.js";
import { Community } from "../src/community.js";
import { duplicates, municipalExport } from "../src/public-tools.js";
import { createApp } from "../src/app.js";
import { IssueRepository } from "../src/repository.js";
import { signGuest } from "../src/guest-access.js";
const suite = process.env.TEST_DATABASE_URL ? describe : describe.skip;
suite("account and community boundaries", () => {
  let pool: Pool,
    accounts: Accounts,
    community: Community,
    owner: Account,
    reviewer: Account,
    other: Account,
    outsider: Account,
    space: string,
    issue: string,
    privateId: string,
    first: string,
    second: string,
    ownerToken: string,
    ownerRecovery: string,
    app: ReturnType<typeof createApp>;
  const actorIds: string[] = [];
  const operator = "community-test-operator-secret-long-enough";
  const password = "only-for-isolated-test-12345";
  const suffix = randomUUID().slice(0, 8);
  beforeAll(async () => {
    pool = new Pool({ connectionString: process.env.TEST_DATABASE_URL });
    await migrate(pool);
    accounts = new Accounts(pool);
    community = new Community(pool);
    const actors = [];
    for (const name of ["owner", "review", "other", "outside"]) {
      const result = await accounts.signup({
        username: `${name}_${suffix}`,
        password,
      });
      actors.push(result.account);
      actorIds.push(result.account.id);
      if (name === "owner") {
        ownerToken = result.token;
        ownerRecovery = result.recovery;
      }
    }
    [owner, reviewer, other, outsider] = actors as [
      Account,
      Account,
      Account,
      Account,
    ];
    space = (
      await community.create(owner, {
        name: "Isolated test group",
        area: "Synthetic location",
      })
    ).id;
    issue = (
      await pool.query(
        "INSERT INTO issues(title,category,severity,latitude,longitude,is_public,guest_owner) VALUES('Damaged bench fixture','INFRASTRUCTURE','LOW',0,0,true,$1) RETURNING id",
        [owner.guest_id],
      )
    ).rows[0].id;
    privateId = (
      await pool.query(
        "INSERT INTO issues(title,category,severity,latitude,longitude,is_public) VALUES('Private bench fixture','INFRASTRUCTURE','LOW',0,0,false) RETURNING id",
      )
    ).rows[0].id;
    const obs = await pool.query(
      "INSERT INTO observations(issue_id,note,media_url,storage_key,mime_type,latitude,longitude,captured_at) VALUES($1,'before','https://example.invalid/before','fixture-before','image/png',0,0,now()-interval '1 day'),($1,'after','https://example.invalid/after','fixture-after','image/png',0,0,now()) RETURNING id",
      [issue],
    );
    [first, second] = obs.rows.map((x) => x.id);
    await pool.query(
      "INSERT INTO evidence_diffs(issue_id,before_observation_id,after_observation_id,summary,removed,added,unchanged,recommended_status,confidence,model,model_version,outcome,comparability_reason,same_subject_evidence) VALUES($1,$2,$3,'Synthetic fixture','[]','[]','[\"fixture remains\"]','OPEN',0.5,'isolated-fixture','1','UNCHANGED','Synthetic same subject','[\"fixture\"]')",
      [issue, first, second],
    );
    app = createApp({
      repository: new IssueRepository(pool),
      service: {} as never,
      storage: {} as never,
      accessToken: operator,
      publicAccess: true,
      maxUploadBytes: 100000,
    });
  }, 60000);
  afterAll(async () => {
    await pool.query("DELETE FROM communities WHERE id=$1", [space]);
    await pool.query("DELETE FROM issues WHERE id=ANY($1::uuid[])", [
      [issue, privateId],
    ]);
    await pool.query("DELETE FROM accounts WHERE id=ANY($1::uuid[])", [
      actorIds,
    ]);
    await pool.end();
  }, 30000);
  it("uses hashed sessions, rejects credentials and cross-origin writes, and revokes guest ownership bypass", async () => {
    expect(await accounts.current(ownerToken)).toMatchObject({ id: owner.id });
    expect(
      (
        await pool.query(
          "SELECT token_hash FROM account_sessions WHERE account_id=$1",
          [owner.id],
        )
      ).rows[0].token_hash,
    ).toBe(digest(ownerToken));
    await expect(
      accounts.login({
        username: owner.username,
        password: "incorrect-test-password",
      }),
    ).rejects.toMatchObject({ code: "SIGN_IN_FAILED" });
    const oldGuest = `fieldissue_guest=${signGuest(operator, owner.guest_id)}`;
    const denied = await app.request(`/v1/issues/${issue}`, {
      method: "PATCH",
      headers: {
        Cookie: oldGuest,
        Origin: "http://localhost",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: "Must not change" }),
    });
    expect(denied.status).toBe(403);
    const owned = await app.request(`/v1/issues/${issue}`, {
      headers: { Cookie: `fieldissue_account=${ownerToken}` },
    });
    expect((await owned.json()).permissions.manage).toBe(true);
    const cross = await app.request("/v1/account/logout", {
      method: "POST",
      headers: {
        Cookie: `fieldissue_account=${ownerToken}`,
        Origin: "https://attacker.invalid",
      },
    });
    expect(cross.status).toBe(403);
    expect(await accounts.current(ownerToken)).toBeTruthy();
  });
  it("enforces membership, one-use invitations and assignment authority", async () => {
    await expect(community.detail(outsider, space)).rejects.toMatchObject({
      code: "COMMUNITY_ACCESS",
    });
    for (const a of [reviewer, other]) {
      const i = await community.invite(owner, space);
      await community.join(a, { code: i.code });
      await expect(
        community.join(outsider, { code: i.code }),
      ).rejects.toMatchObject({ code: "COMMUNITY_ACCESS" });
    }
    await expect(
      community.addIssue(reviewer, space, { issueId: issue }),
    ).rejects.toMatchObject({ code: "COMMUNITY_ACCESS" });
    await community.addIssue(owner, space, { issueId: issue });
    await expect(
      community.assign(reviewer, space, {
        issueId: issue,
        accountId: reviewer.id,
      }),
    ).rejects.toMatchObject({ code: "COMMUNITY_ACCESS" });
    await expect(
      community.assign(owner, space, {
        issueId: issue,
        accountId: outsider.id,
      }),
    ).rejects.toMatchObject({ code: "COMMUNITY_ACCESS" });
    await community.assign(owner, space, {
      issueId: issue,
      accountId: reviewer.id,
    });
    expect(
      (await community.detail(reviewer, space)).issues[0].assignee_id,
    ).toBe(reviewer.id);
  });
  it("saves privately across sessions and detects concurrent walk updates", async () => {
    const walk = {
      version: 1,
      createdAt: new Date().toISOString(),
      startedAt: null,
      origin: { latitude: 0, longitude: 0 },
      radiusMeters: 1000,
      items: [{ issueId: issue, state: "pending" }],
    };
    await community.saveWalk(owner, { revision: 0, walk });
    expect(await community.savedWalk(other)).toBeNull();
    const results = await Promise.allSettled(
      [1, 2].map(() => community.saveWalk(owner, { revision: 1, walk })),
    );
    expect(results.filter((r) => r.status === "fulfilled")).toHaveLength(1);
    expect((await community.savedWalk(owner)).revision).toBe(2);
    await expect(
      community.saveWalk(owner, {
        revision: 2,
        walk: { ...walk, items: [{ issueId: privateId, state: "pending" }] },
      }),
    ).rejects.toMatchObject({ code: "NOT_FOUND" });
    await expect(
      community.saveWalk(owner, {
        revision: 2,
        walk: { ...walk, items: [{ issueId: issue, state: "visited" }] },
      }),
    ).rejects.toMatchObject({ code: "VISIT_EVIDENCE_REQUIRED" });
  });
  it("requires current nonduplicate evidence and two independent reviewers, atomically resolving once", async () => {
    await expect(
      community.propose(owner, space, {
        issueId: issue,
        observationId: first,
        note: "Old evidence",
      }),
    ).rejects.toMatchObject({ code: "EVIDENCE_CHANGED" });
    await pool.query(
      "UPDATE evidence_diffs SET model='fieldissue-image-identity' WHERE issue_id=$1",
      [issue],
    );
    await expect(
      community.propose(owner, space, {
        issueId: issue,
        observationId: second,
        note: "Repeated evidence",
      }),
    ).rejects.toMatchObject({ code: "REVIEW_EVIDENCE_REQUIRED" });
    await pool.query(
      "UPDATE evidence_diffs SET model='isolated-fixture' WHERE issue_id=$1",
      [issue],
    );
    const proposal = await community.propose(owner, space, {
      issueId: issue,
      observationId: second,
      note: "Synthetic review only",
    });
    await expect(
      community.vote(owner, space, { proposalId: proposal.id, approve: true }),
    ).rejects.toMatchObject({ code: "COMMUNITY_ACCESS" });
    expect(
      await community.vote(reviewer, space, {
        proposalId: proposal.id,
        approve: true,
      }),
    ).toEqual({ status: "pending", approvals: 1 });
    expect(
      await community.vote(reviewer, space, {
        proposalId: proposal.id,
        approve: true,
      }),
    ).toEqual({ status: "pending", approvals: 1 });
    expect(
      await community.vote(other, space, {
        proposalId: proposal.id,
        approve: true,
      }),
    ).toEqual({ status: "resolved", approvals: 2 });
    expect(
      (await pool.query("SELECT status FROM issues WHERE id=$1", [issue]))
        .rows[0].status,
    ).toBe("RESOLVED");
    expect(
      (
        await pool.query(
          "SELECT count(*)::int AS n FROM issue_events WHERE issue_id=$1 AND event_type='ISSUE_RESOLVED'",
          [issue],
        )
      ).rows[0].n,
    ).toBe(1);
  });
  it("delivers only owned due notifications, handles subscriptions and redacts municipal export", async () => {
    await community.subscribe(owner, { issueId: issue, enabled: true });
    await pool.query(
      "UPDATE issues SET status='OPEN',resolved_at=NULL WHERE id=$1",
      [issue],
    );
    await pool.query(
      "INSERT INTO issue_events(issue_id,event_type,payload) VALUES($1,'STATUS_CHANGED','{}')",
      [issue],
    );
    await community.reminder(owner, {
      issueId: issue,
      dueAt: new Date(Date.now() + 3600000).toISOString(),
    });
    const inbox = await community.notifications(owner);
    expect(inbox.some((i) => i.message === "The issue status changed.")).toBe(
      true,
    );
    expect(inbox.some((i) => i.message.startsWith("Your planned"))).toBe(false);
    expect(await community.notifications(outsider)).toHaveLength(0);
    const candidates = await duplicates(pool, {
      latitude: 0,
      longitude: 0,
      note: "bench",
      category: "INFRASTRUCTURE",
    });
    expect(candidates.items.some((i) => i.id === issue)).toBe(true);
    expect(candidates.items.some((i) => i.id === privateId)).toBe(false);
    const exported = municipalExport({
      publicId: "FI-000001",
      category: "INFRASTRUCTURE",
      status: "OPEN",
      createdAt: new Date(),
      updatedAt: new Date(),
      latitude: 12.34567,
      longitude: 76.12345,
      note: "private",
      guestOwner: owner.guest_id,
    });
    expect(exported.request.lat).toBe(12.35);
    expect(JSON.stringify(exported)).not.toContain(owner.guest_id);
    expect(exported.sentToMunicipality).toBe(false);
  });
  it("claims guest reports at login without leaving the old guest cookie authorized", async () => {
    const guest = randomUUID();
    const r = (
      await pool.query(
        "INSERT INTO issues(title,category,severity,latitude,longitude,is_public,guest_owner) VALUES('Guest migration fixture','INFRASTRUCTURE','LOW',0,0,true,$1) RETURNING id",
        [guest],
      )
    ).rows[0];
    try {
      await accounts.login({ username: owner.username, password }, guest);
      expect(
        (await pool.query("SELECT guest_owner FROM issues WHERE id=$1", [r.id]))
          .rows[0].guest_owner,
      ).toBe(owner.guest_id);
      const response = await app.request(`/v1/issues/${r.id}`, {
        headers: { Cookie: `fieldissue_guest=${signGuest(operator, guest)}` },
      });
      expect((await response.json()).permissions.manage).toBe(false);
    } finally {
      await pool.query("DELETE FROM issues WHERE id=$1", [r.id]);
    }
  });
  it("keeps browser sign-in limits isolated and allows owners to revoke invitations and membership", async () => {
    const client = randomUUID();
    for (let n = 0; n < 20; n++) await accounts.throttle(client);
    await expect(accounts.throttle(client)).rejects.toMatchObject({
      code: "AUTH_LIMIT",
    });
    await expect(accounts.throttle(randomUUID())).resolves.toBeUndefined();
    const code = await community.invite(owner, space);
    await community.revokeInvites(owner, space);
    await expect(
      community.join(outsider, { code: code.code }),
    ).rejects.toMatchObject({ code: "COMMUNITY_ACCESS" });
    await expect(
      community.removeMember(reviewer, space, { accountId: other.id }),
    ).rejects.toMatchObject({ code: "COMMUNITY_ACCESS" });
    await community.removeMember(owner, space, { accountId: reviewer.id });
    await expect(community.detail(reviewer, space)).rejects.toMatchObject({
      code: "COMMUNITY_ACCESS",
    });
    expect(
      (await community.detail(owner, space)).issues[0].assignee_id,
    ).toBeNull();
  }, 60000);
  it("bounds failed guesses across browser rotations without counting successful login", async () => {
    const target = "guess_" + suffix;
    for (let n = 0; n < 30; n++) await accounts.recordFailure(target);
    await expect(accounts.checkFailures(target)).rejects.toMatchObject({
      code: "AUTH_LIMIT",
    });
    await expect(
      accounts.checkFailures(owner.username),
    ).resolves.toBeUndefined();
    await pool.query("DELETE FROM auth_failures WHERE username_hash=$1", [
      digest(target),
    ]);
  }, 60000);
  it("maps an in-flight guest upload to the linked account inside the persistence transaction", async () => {
    const guest = randomUUID();
    await accounts.login({ username: owner.username, password }, guest);
    const repo = new IssueRepository(pool);
    const r = await repo.create(
      {
        latitude: 0,
        longitude: 0,
        note: "delayed upload fixture",
        description: "",
      },
      {
        mediaUrl: "https://example.invalid/test.jpg",
        storageKey: "p2-race-" + suffix,
        mimeType: "image/jpeg",
      } as never,
      {
        objects: ["bench"],
        conditions: ["broken"],
        evidence: ["broken"],
        suggestedCategory: "INFRASTRUCTURE",
        suggestedSeverity: "LOW",
        confidence: 0.5,
        model: "test-fixture",
        modelVersion: "1",
      },
      undefined,
      undefined,
      guest,
    );
    try {
      expect((await repo.issue(pool, r.id)).guest_owner).toBe(owner.guest_id);
    } finally {
      await pool.query("DELETE FROM issues WHERE id=$1", [r.id]);
    }
  });
  it("keeps review notes private, permits separate workspaces and invalidates approvals on status changes", async () => {
    const w = await community.create(owner, { name: "Second test group" });
    try {
      await community.addIssue(owner, w.id, { issueId: issue });
      const one = await community.propose(owner, space, {
        issueId: issue,
        observationId: second,
        note: "PRIVATE workspace note",
      });
      const two = await community.propose(owner, w.id, {
        issueId: issue,
        observationId: second,
        note: "Another private note",
      });
      expect(one.id).not.toBe(two.id);
      await new IssueRepository(pool).patch(
        issue,
        { status: "RESOLVED" },
        "Manual confirmation",
      );
      expect(
        (
          await pool.query(
            "SELECT count(*)::int AS n FROM resolution_proposals WHERE issue_id=$1 AND status='pending'",
            [issue],
          )
        ).rows[0].n,
      ).toBe(0);
      const timeline = JSON.stringify(
        await new IssueRepository(pool).timeline(issue),
      );
      expect(timeline).not.toContain("Synthetic review only");
      expect(timeline).not.toContain("reviewerAccountIds");
      await new IssueRepository(pool).patch(issue, { status: "OPEN" });
    } finally {
      await pool.query("DELETE FROM communities WHERE id=$1", [w.id]);
    }
  });
  it("rotates recovery codes, invalidates all existing sessions, and permits new login", async () => {
    const login = await accounts.login({ username: owner.username, password });
    const recovered = await accounts.recover({
      username: owner.username,
      password: "changed-test-password-1234",
      recovery: ownerRecovery,
    });
    expect(await accounts.current(ownerToken)).toBeUndefined();
    expect(await accounts.current(login.token)).toBeUndefined();
    expect(await accounts.current(recovered.token)).toMatchObject({
      id: owner.id,
    });
    await expect(
      accounts.recover({
        username: owner.username,
        password,
        recovery: ownerRecovery,
      }),
    ).rejects.toMatchObject({ code: "SIGN_IN_FAILED" });
    await accounts.logout(recovered.token);
    expect(await accounts.current(recovered.token)).toBeUndefined();
  });
});
