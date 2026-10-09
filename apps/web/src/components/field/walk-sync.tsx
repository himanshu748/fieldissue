import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { request, api } from "@/lib/api";
import { communityApi } from "@/lib/community";
import { useWalk, restoreWalk, type Walk } from "@/lib/walk";
import { distanceMeters } from "@/lib/geo";
import { lastObserved } from "@/lib/format";
import { ErrorNotice } from "./states";
type Stored = { revision: number; data: Walk };
export function WalkSync() {
  const walk = useWalk();
  const [signed, setSigned] = useState(false),
    [remote, setRemote] = useState<Stored | null>(),
    [error, setError] = useState<Error>(),
    [busy, setBusy] = useState(false),
    [notice, setNotice] = useState("");
  useEffect(() => {
    void communityApi
      .me()
      .then(async (r) => {
        setSigned(!!r.account);
        if (r.account)
          setRemote(
            (await request<{ walk: Stored | null }>("/v1/account/walk")).walk,
          );
      })
      .catch(setError);
  }, []);
  async function run(fn: () => Promise<void>) {
    setBusy(true);
    setError(undefined);
    try {
      await fn();
    } catch (e) {
      setError(e as Error);
    } finally {
      setBusy(false);
    }
  }
  async function save() {
    if (!walk || remote === undefined) return;
    const data = {
      ...walk,
      items: walk.items.map(({ issueId, state, observationId }) => ({
        issueId,
        state,
        ...(observationId ? { observationId } : {}),
      })),
    };
    const r = await request<Stored>("/v1/account/walk", {
      method: "POST",
      json: { revision: remote?.revision ?? 0, walk: data },
    });
    setRemote(r);
    setNotice(
      "Walk saved to your account. Sign in on another device and load it here.",
    );
  }
  async function load() {
    const r = (await request<{ walk: Stored | null }>("/v1/account/walk")).walk;
    setRemote(r);
    if (!r) {
      setNotice("No account walk has been saved.");
      return;
    }
    const items = await Promise.all(
      r.data.items.map(async (item) => {
        const i = await api.issue(item.issueId);
        return {
          ...item,
          title: i.title,
          status: i.status,
          distanceMeters: distanceMeters(r.data.origin, i),
          lastObservedAt: lastObserved(i),
        };
      }),
    );
    restoreWalk({ ...r.data, items });
    setNotice("Loaded the saved walk. Local changes were replaced.");
  }
  return (
    <section className="space-y-3 border border-ink p-4">
      <h2 className="font-bold">Keep a walk across devices</h2>
      {signed ? (
        <>
          <p className="text-sm text-muted-foreground">
            Saving uploads the exact starting point and selected stops to your
            private account. Changes stay in this tab until you save again.
            Loading replaces this tab’s walk.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              disabled={!walk || busy || remote === undefined}
              onClick={() => void run(save)}
            >
              Save to my account
            </Button>
            <Button
              variant="outline"
              disabled={busy}
              onClick={() => void run(load)}
            >
              Load account walk
            </Button>
            {remote ? (
              <Button
                variant="ghost"
                disabled={busy}
                onClick={() =>
                  void run(async () => {
                    await request("/v1/account/walk", { method: "DELETE" });
                    setRemote(null);
                    setNotice(
                      "Account copy removed. This tab’s walk is unchanged.",
                    );
                  })
                }
              >
                Remove account copy
              </Button>
            ) : null}
          </div>
        </>
      ) : (
        <p>
          <Link className="underline" to="/app/community">
            Sign in
          </Link>{" "}
          to save privately. Guest walks stay in this tab.
        </p>
      )}
      {notice ? <p role="status">{notice}</p> : null}
      {error ? <ErrorNotice error={error} /> : null}
    </section>
  );
}
