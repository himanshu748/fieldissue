import { resetAppConfig } from "@/hooks/use-app-config";
import { listQueued, clearOfflineQueue } from "@/lib/offline-queue";
import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ErrorNotice } from "@/components/field/states";
import {
  communityApi,
  type Board,
  type Member,
  type Workspace,
  type InboxItem,
} from "@/lib/community";
import { clearCaptureDrafts } from "@/hooks/use-capture-draft";
import { clearWalk } from "@/lib/walk";
import { api } from "@/lib/api";
import { formatDateTime, label } from "@/lib/format";

export function CommunityPage() {
  const [me, setMe] = useState<Member | null>();
  const [mode, setMode] = useState<"login" | "signup" | "recover">("login");
  const [username, setUsername] = useState(""),
    [password, setPassword] = useState(""),
    [recovery, setRecovery] = useState(""),
    [newRecovery, setNewRecovery] = useState("");
  const [spaces, setSpaces] = useState<Workspace[]>([]),
    [board, setBoard] = useState<Board>(),
    [inbox, setInbox] = useState<InboxItem[]>([]);
  const [name, setName] = useState(""),
    [area, setArea] = useState(""),
    [code, setCode] = useState(""),
    [invite, setInvite] = useState(""),
    [issue, setIssue] = useState(""),
    [note, setNote] = useState("");
  const [busy, setBusy] = useState(false),
    [error, setError] = useState<Error>(),
    [notice, setNotice] = useState("");
  async function refresh() {
    const { account } = await communityApi.me();
    setMe(account);
    if (account) {
      setSpaces((await communityApi.list()).items);
      setInbox((await communityApi.inbox()).items);
    }
  }
  useEffect(() => {
    void refresh().catch(setError);
  }, []);
  useEffect(() => {
    if (!me) return;
    const timer = setInterval(() => {
      void communityApi
        .inbox()
        .then((x) => setInbox(x.items))
        .catch(() => {});
    }, 60000);
    return () => clearInterval(timer);
  }, [me]);
  async function run(fn: () => Promise<void>) {
    if (busy) return;
    setBusy(true);
    setError(undefined);
    setNotice("");
    try {
      await fn();
    } catch (e) {
      setError(e as Error);
    } finally {
      setBusy(false);
    }
  }
  async function open(id: string) {
    setBoard(await communityApi.board(id));
    setInvite("");
  }
  async function auth(e: FormEvent) {
    e.preventDefault();
    await run(async () => {
      if ((await listQueued()).some((item) => !item.ownerId))
        throw new Error(
          "Upload or delete guest offline captures before changing your account. This keeps retries linked to their original owner.",
        );
      const result = await communityApi.auth(mode, {
        username,
        password,
        ...(mode === "recover" ? { recovery } : {}),
      });
      clearCaptureDrafts();
      clearWalk();
      localStorage.setItem("fieldissue-account-changed", String(Date.now()));
      resetAppConfig();
      setPassword("");
      setRecovery("");
      setNewRecovery(result.recovery ?? "");
      await refresh();
    });
  }
  async function signout(all = false) {
    await run(async () => {
      await communityApi.logout(all);
      await clearOfflineQueue().catch(() => {
        setNotice(
          "Signed out. Offline storage cleanup failed; clear site data before sharing this device.",
        );
      });
      clearCaptureDrafts();
      clearWalk();
      localStorage.removeItem("fieldissue-public-config");
      sessionStorage.removeItem("fieldissue-offline-account");
      localStorage.setItem("fieldissue-account-changed", String(Date.now()));
      window.location.reload();
    });
  }
  async function propose(issueId: string) {
    await run(async () => {
      if (!board || !note.trim())
        throw new Error(
          "Write what the new evidence shows before requesting review.",
        );
      const detail = await api.issue(issueId);
      const observations = detail.observations ?? [];
      const latest = observations.at(-1);
      if (!latest) throw new Error("No revisit evidence available.");
      await communityApi.action(board.id, "propose", {
        issueId,
        observationId: latest.id,
        note,
      });
      await open(board.id);
      setNotice(
        "Review requested. Two other member accounts must approve the latest evidence.",
      );
    });
  }
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8">
      <header>
        <p className="eyebrow">Community</p>
        <h1 className="mt-2 text-3xl font-bold uppercase sm:text-5xl">
          Look after your area
        </h1>
        <p className="mt-3 text-muted-foreground">
          Keep your reports and walks across devices. Coordinate public issues
          with a small group.
        </p>
      </header>
      {error ? <ErrorNotice error={error} /> : null}
      {notice ? (
        <p role="status" className="border border-ink p-4">
          {notice}
        </p>
      ) : null}
      {me === undefined ? (
        <p role="status">Loading account…</p>
      ) : !me ? (
        <section className="max-w-lg border border-ink p-5">
          <h2 className="text-xl font-semibold">
            {mode === "signup"
              ? "Create an account"
              : mode === "recover"
                ? "Recover your account"
                : "Sign in"}
          </h2>
          <p className="my-3 text-sm text-muted-foreground">
            No email required. Use a nickname, not a legal name. Signing in
            attaches reports owned by this browser and clears unsaved tab
            drafts. Finish any capture first. Save the recovery code: there is
            no email reset.
          </p>
          <form className="flex flex-col gap-4" onSubmit={auth}>
            <label>
              Username
              <Input
                required
                pattern="[a-zA-Z0-9_]{3,32}"
                minLength={3}
                maxLength={32}
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </label>
            <label>
              {mode === "recover" ? "New password" : "Password"}
              <Input
                required
                type="password"
                minLength={12}
                maxLength={128}
                autoComplete={
                  mode === "login" ? "current-password" : "new-password"
                }
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className="text-xs">At least 12 characters.</span>
            </label>
            {mode === "recover" ? (
              <label>
                Recovery code
                <Input
                  required
                  value={recovery}
                  onChange={(e) => setRecovery(e.target.value)}
                  autoComplete="off"
                />
              </label>
            ) : null}
            <Button disabled={busy}>
              {mode === "signup"
                ? "Create account"
                : mode === "recover"
                  ? "Reset password"
                  : "Sign in"}
            </Button>
          </form>
          <div className="mt-3 flex flex-wrap gap-2">
            {(["login", "signup", "recover"] as const)
              .filter((x) => x !== mode)
              .map((x) => (
                <Button key={x} variant="ghost" onClick={() => setMode(x)}>
                  {x === "login"
                    ? "Sign in"
                    : x === "signup"
                      ? "Create account"
                      : "Use recovery code"}
                </Button>
              ))}
          </div>
        </section>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p>
              Signed in as <strong>{me.username}</strong>
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => void signout()}
                disabled={busy}
              >
                Sign out
              </Button>
              <Button
                variant="ghost"
                onClick={() => void signout(true)}
                disabled={busy}
              >
                Sign out all devices
              </Button>
            </div>
          </div>
          {newRecovery ? (
            <section
              className="space-y-3 border-2 border-observe p-5"
              role="status"
            >
              <h2 className="font-bold">Save your recovery code now</h2>
              <p className="text-sm">
                This replaces any previous recovery code. It is shown once. Keep
                it in a password manager; anyone with it can reset your account.
              </p>
              <code className="block break-all select-all">{newRecovery}</code>
              <Button onClick={() => setNewRecovery("")}>I saved it</Button>
            </section>
          ) : null}
          <section
            aria-labelledby="inbox-title"
            className="space-y-3 border border-ink p-5"
          >
            <h2 id="inbox-title" className="text-xl font-bold">
              Your updates
            </h2>
            <p className="text-sm text-muted-foreground">
              Assignments, subscribed issue changes and due reminders appear
              here. Refreshes while this page is open; no email or push
              notification is sent.
            </p>
            {inbox.length ? (
              inbox.map((n) => (
                <div
                  key={n.id}
                  className="flex flex-wrap items-center justify-between gap-2 border-t py-3"
                >
                  <div>
                    <p>{n.message}</p>
                    {n.public_id ? (
                      <Link
                        className="underline"
                        to={`/app/issues/${n.public_id}`}
                      >
                        {n.public_id}
                      </Link>
                    ) : null}
                    <span className="ml-2 text-xs">
                      {formatDateTime(n.due_at)}
                    </span>
                  </div>
                  {!n.read_at ? (
                    <Button
                      variant="ghost"
                      onClick={() =>
                        void run(async () => {
                          await communityApi.read(n.id);
                          await refresh();
                        })
                      }
                    >
                      Mark read
                    </Button>
                  ) : (
                    <span className="text-sm text-muted-foreground">Read</span>
                  )}
                </div>
              ))
            ) : (
              <p>No updates yet.</p>
            )}
          </section>
          <div className="grid gap-6 md:grid-cols-2">
            <form
              className="flex flex-col gap-3 border border-ink p-5"
              onSubmit={(e) => {
                e.preventDefault();
                void run(async () => {
                  const w = await communityApi.create(name, area);
                  await refresh();
                  await open(w.id);
                  setName("");
                });
              }}
            >
              <h2 className="text-xl font-bold">Start a workspace</h2>
              <label>
                Name
                <Input
                  required
                  value={name}
                  maxLength={80}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              <label>
                Area or neighbourhood
                <Input
                  value={area}
                  maxLength={160}
                  onChange={(e) => setArea(e.target.value)}
                />
              </label>
              <Button disabled={busy}>Create workspace</Button>
            </form>
            <form
              className="flex flex-col gap-3 border border-ink p-5"
              onSubmit={(e) => {
                e.preventDefault();
                void run(async () => {
                  const w = await communityApi.join(code);
                  setCode("");
                  await refresh();
                  await open(w.id);
                });
              }}
            >
              <h2 className="text-xl font-bold">Join a workspace</h2>
              <label>
                Invitation code
                <Input
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  autoComplete="off"
                />
              </label>
              <p className="text-sm text-muted-foreground">
                Codes expire after 24 hours and can be used once.
              </p>
              <Button disabled={busy}>Join workspace</Button>
            </form>
          </div>
          <section>
            <h2 className="mb-3 text-xl font-bold">Your workspaces</h2>
            <div className="flex flex-wrap gap-3">
              {spaces.map((w) => (
                <Button
                  key={w.id}
                  variant={board?.id === w.id ? "default" : "outline"}
                  onClick={() => void run(() => open(w.id))}
                >
                  {w.name}
                </Button>
              ))}
              {!spaces.length ? <p>No workspaces yet.</p> : null}
            </div>
          </section>
          {board ? (
            <section className="space-y-5 border border-ink p-5">
              <header>
                <h2 className="text-2xl font-bold">{board.name}</h2>
                <p>{board.area}</p>
                <p className="mt-2 text-sm">
                  Members: {board.members.map((m) => m.username).join(", ")}
                </p>
              </header>
              {board.owner ? (
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {board.members
                      .filter((m) => m.id !== me.id)
                      .map((m) => (
                        <Button
                          key={m.id}
                          variant="outline"
                          disabled={busy}
                          onClick={() =>
                            void run(async () => {
                              await communityApi.action(board.id, "members", {
                                accountId: m.id,
                              });
                              await open(board.id);
                            })
                          }
                        >
                          Remove {m.username}
                        </Button>
                      ))}
                    <Button
                      variant="outline"
                      disabled={busy}
                      onClick={() =>
                        void run(async () => {
                          await communityApi.action(board.id, "revoke-invites");
                          setInvite("");
                          setNotice("Unused invitations revoked.");
                        })
                      }
                    >
                      Revoke unused invitations
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    disabled={busy}
                    onClick={() =>
                      void run(async () => {
                        setInvite(
                          (
                            await communityApi.action<{ code: string }>(
                              board.id,
                              "invite",
                            )
                          ).code,
                        );
                      })
                    }
                  >
                    Create one-use invitation
                  </Button>
                  {invite ? (
                    <p
                      className="mt-3 break-all font-mono select-all"
                      role="status"
                    >
                      Invitation: {invite}
                    </p>
                  ) : null}
                </div>
              ) : (
                <Button
                  variant="outline"
                  disabled={busy}
                  onClick={() =>
                    void run(async () => {
                      await communityApi.action(board.id, "members", {
                        accountId: me.id,
                      });
                      setBoard(undefined);
                      await refresh();
                    })
                  }
                >
                  Leave workspace
                </Button>
              )}
              <form
                className="flex flex-wrap items-end gap-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  void run(async () => {
                    await communityApi.action(board.id, "issues", {
                      issueId: issue,
                    });
                    await open(board.id);
                    setIssue("");
                  });
                }}
              >
                <label className="grow">
                  Add your public report
                  <Input
                    placeholder="FI-000005"
                    required
                    value={issue}
                    onChange={(e) => setIssue(e.target.value)}
                  />
                </label>
                <Button disabled={busy}>Add report</Button>
              </form>
              <p className="text-sm text-muted-foreground">
                Workspace membership keeps coordination private. Reports added
                here remain public.
              </p>
              {board.issues.map((i) => (
                <article key={i.id} className="space-y-3 border-t py-4">
                  <Link
                    className="font-semibold underline"
                    to={`/app/issues/${i.public_id}`}
                  >
                    {i.public_id}: {i.title}
                  </Link>
                  <p>
                    {label(i.status)} ·{" "}
                    {i.assignee ? `Assigned to ${i.assignee}` : "Unassigned"}
                  </p>
                  {board.owner ? (
                    <label className="block">
                      Assign to
                      <select
                        className="ml-3 min-h-11 max-w-full border border-ink bg-paper px-3"
                        value={i.assignee_id ?? ""}
                        disabled={busy}
                        onChange={(e) =>
                          void run(async () => {
                            await communityApi.action(board.id, "assign", {
                              issueId: i.id,
                              accountId: e.target.value || null,
                            });
                            await open(board.id);
                          })
                        }
                      >
                        <option value="">Unassigned</option>
                        {board.members.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.username}
                          </option>
                        ))}
                      </select>
                    </label>
                  ) : null}
                  <Button
                    variant="outline"
                    disabled={
                      busy ||
                      !note.trim() ||
                      ["RESOLVED", "REJECTED"].includes(i.status)
                    }
                    onClick={() => void propose(i.id)}
                  >
                    Request evidence review
                  </Button>
                </article>
              ))}
              <label className="block">
                Resolution evidence note
                <Input
                  value={note}
                  maxLength={1000}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Describe what the fresh revisit and comparison show"
                />
              </label>
              <p className="text-sm text-muted-foreground">
                Community resolution requires a fresh compared revisit and two
                other member accounts. Accounts use unverified nicknames; this
                is not identity-verified or municipal certification. The
                proposer and report owner cannot approve their own evidence.
                Manual owner resolution remains a separate action.
              </p>
              {board.proposals.map((p) => (
                <article key={p.id} className="space-y-2 border-t py-4">
                  <Link className="underline" to={`/app/issues/${p.public_id}`}>
                    {p.public_id} evidence review
                  </Link>
                  <p>{p.note}</p>
                  <p>
                    {label(p.status)} · {p.approvals}/2 approvals
                  </p>
                  {p.status === "pending" && p.proposer_id !== me.id ? (
                    <div className="flex flex-wrap gap-2">
                      {[true, false].map((approve) => (
                        <Button
                          key={String(approve)}
                          variant={approve ? "default" : "outline"}
                          disabled={busy}
                          onClick={() =>
                            void run(async () => {
                              await communityApi.action(board.id, "vote", {
                                proposalId: p.id,
                                approve,
                              });
                              await open(board.id);
                            })
                          }
                        >
                          {approve
                            ? "Approve reviewed evidence"
                            : "Reject evidence"}
                        </Button>
                      ))}
                    </div>
                  ) : null}
                </article>
              ))}
            </section>
          ) : null}
        </>
      )}
    </div>
  );
}
