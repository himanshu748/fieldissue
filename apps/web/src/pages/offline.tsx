import { clearMatchingCaptureDraft } from "@/hooks/use-capture-draft";
import { loadConfig, resetAppConfig } from "@/hooks/use-app-config";
import { markVisited } from "@/lib/walk";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  listQueued,
  clearOfflineQueue,
  removeQueued,
  offlineReady,
  type QueuedCapture,
} from "@/lib/offline-queue";
import { communityApi } from "@/lib/community";
import { api } from "@/lib/api";
import { ErrorNotice } from "@/components/field/states";
import { CaptureButton } from "@/components/field/capture-button";
import { formatDateTime } from "@/lib/format";
function QueueItem({
  item,
  refresh,
}: {
  item: QueuedCapture;
  refresh: () => Promise<void>;
}) {
  const [consent, setConsent] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState<Error>(),
    [result, setResult] = useState("");
  async function send() {
    if (!consent || busy) return;
    setBusy(true);
    setError(undefined);
    try {
      const config = await api.config();
      if (config.captureScope !== item.captureScope)
        throw new Error(
          "This capture belongs to a different account or expired guest session. Sign back into the original account; do not resubmit an uncertain upload under another identity.",
        );
      const me = (await communityApi.me()).account;
      if (item.ownerId && me?.id !== item.ownerId)
        throw new Error(
          "Sign in to the account that saved this capture before uploading.",
        );
      const d = item.draft;
      const form = new FormData();
      form.set("publicConsent", "true");
      form.set(
        "image",
        d.photo!.blob,
        item.issueId ? "revisit.jpg" : "observation.jpg",
      );
      if (!item.issueId || d.locationMode === "here") {
        if (!d.location) throw new Error("This capture has no location.");
        form.set("latitude", String(d.location.latitude));
        form.set("longitude", String(d.location.longitude));
        form.set("locationSource", d.location.source);
      }
      if (d.note.trim()) form.set("note", d.note.trim());
      if (d.capturedAt)
        form.set("capturedAt", new Date(d.capturedAt).toISOString());
      if (item.issueId) {
        const saved = await api.addObservation(
          item.issueId,
          form,
          item.key,
          () => {},
        );
        markVisited(
          [item.issueId, saved.observation.issueId],
          saved.observation.id,
        );
        setResult(item.issueId);
      } else {
        const r = await api.createIssue(form, item.key, () => {});
        setResult(r.publicId);
      }
      await removeQueued(item.id);
      clearMatchingCaptureDraft(
        item.issueId ? `revisit:${item.issueId}` : "report",
        item.draft,
      );
      resetAppConfig();
    } catch (e) {
      setError(e as Error);
    } finally {
      setBusy(false);
    }
  }
  return (
    <article className="space-y-4 border border-ink p-5">
      <h2 className="text-xl font-bold">
        {item.issueId ? `Revisit ${item.issueId}` : "New report"}
      </h2>
      <p className="text-sm">
        Saved on this device{" "}
        {formatDateTime(new Date(item.savedAt).toISOString())}
      </p>
      <CaptureButton value={item.draft.photo} onChange={() => {}} disabled />
      <p className="break-words">{item.draft.note || "No note"}</p>
      <p className="text-sm">
        {item.draft.location
          ? `${item.draft.location.latitude}, ${item.draft.location.longitude}`
          : "Uses the existing issue location"}{" "}
        ·{" "}
        {item.draft.capturedAt
          ? `Captured ${item.draft.capturedAt}`
          : "Capture time will be recorded as upload time"}
      </p>
      {result ? (
        <p role="status">
          Saved online.{" "}
          <Link className="underline" to={`/app/issues/${result}`}>
            Open {result}
          </Link>
        </p>
      ) : (
        <>
          <label className="flex items-start gap-3">
            <Checkbox
              checked={consent}
              onCheckedChange={(v) => setConsent(v === true)}
            />
            I reviewed this capture and agree to publish its photo, note and
            approximate location publicly and send it for AI analysis. The service keeps the exact location for the owner and operator.
          </label>
          <div className="flex flex-wrap gap-3">
            <Button disabled={!consent || busy} onClick={send}>
              {busy ? "Uploading and analyzing…" : "Upload this capture"}
            </Button>
            <Button
              variant="outline"
              disabled={busy}
              onClick={async () => {
                await removeQueued(item.id);
                await refresh();
              }}
            >
              Delete from device
            </Button>
          </div>
        </>
      )}
      {error ? (
        <ErrorNotice
          error={error}
          title="Capture is still saved on this device"
        />
      ) : null}
    </article>
  );
}
export function OfflinePage() {
  const [items, setItems] = useState<QueuedCapture[]>([]),
    [error, setError] = useState<Error>(),
    [ready, setReady] = useState(false),
    [hidden, setHidden] = useState(0),
    [clearConsent, setClearConsent] = useState(false);
  async function refresh() {
    const scope = (await loadConfig()).captureScope;
    const all = await listQueued();
    setItems(all.filter((x) => x.captureScope === scope));
    setHidden(all.filter((x) => x.captureScope !== scope).length);
  }
  useEffect(() => {
    void refresh().catch(setError);
    void offlineReady().then(setReady);
  }, []);
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header>
        <p className="eyebrow">Saved on this device</p>
        <h1 className="mt-2 text-3xl font-bold uppercase">
          Pick up when connected
        </h1>
        <p className="mt-3 text-muted-foreground">
          Captures expire after seven days. Upload one at a time after review.
          Retrying an unchanged capture uses the same request key to prevent
          duplicates.
        </p>
      </header>
      <p role="status">
        {ready
          ? "Offline app shell is ready on this device."
          : "Keep the app open online once to prepare the offline shell."}{" "}
        Maps and AI analysis require a connection.
      </p>
      {error ? <ErrorNotice error={error} /> : null}
      {hidden > 0 ? (
        <section className="space-y-3 border border-ink p-4">
          <p>
            Saved captures from a different or expired session are hidden.
            Uploads cannot be transferred between identities.
          </p>
          <label className="flex flex-wrap gap-3">
            <Checkbox
              checked={clearConsent}
              onCheckedChange={(v) => setClearConsent(v === true)}
            />
            Delete all offline captures from this device, including any shown
            below
          </label>
          <Button
            variant="outline"
            disabled={!clearConsent}
            onClick={() =>
              void clearOfflineQueue().then(refresh).catch(setError)
            }
          >
            Clear all device captures
          </Button>
        </section>
      ) : null}
      {items.length ? (
        items.map((i) => <QueueItem key={i.id} item={i} refresh={refresh} />)
      ) : (
        <p>
          No captures saved.{" "}
          <Link className="underline" to="/app/report">
            Start a report
          </Link>{" "}
          and choose Save offline capture.
        </p>
      )}
    </div>
  );
}
