import { useState } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { CaptureDraft } from "@/hooks/use-capture-draft";
import { putQueued } from "@/lib/offline-queue";

import { loadConfig } from "@/hooks/use-app-config";
import { ErrorNotice } from "./states";
export function SaveOffline({
  draft,
  issueId,
  disabled,
  signature,
  onSaved,
}: {
  draft: CaptureDraft;
  issueId?: string;
  disabled?: boolean;
  signature: string;
  onSaved: (key: string) => void;
}) {
  const [consent, setConsent] = useState(false),
    [saved, setSaved] = useState(false),
    [error, setError] = useState<Error>(),
    [busy, setBusy] = useState(false);
  async function save() {
    setBusy(true);
    setError(undefined);
    try {
      const config = await loadConfig();
      const ownerId = config.captureAccountId ?? null;
      const captureScope = config.captureScope;
      if (!captureScope)
        throw new Error("Open the app online once before saving offline.");
      const bytes = await draft.photo!.blob.arrayBuffer();
      const imageHash = Array.from(
        new Uint8Array(await crypto.subtle.digest("SHA-256", bytes)),
        (b) => b.toString(16).padStart(2, "0"),
      ).join("");
      const hash = Array.from(
        new Uint8Array(
          await crypto.subtle.digest(
            "SHA-256",
            new TextEncoder().encode(
              JSON.stringify([captureScope, issueId, signature, imageHash]),
            ),
          ),
        ),
        (b) => b.toString(16).padStart(2, "0"),
      ).join("");
      const key =
        draft.attempt?.signature === signature
          ? draft.attempt.key
          : `offline:${hash}`;
      await putQueued({
        id: key,
        issueId,
        draft,
        key,
        savedAt: Date.now(),
        ownerId,
        captureScope,
      });
      onSaved(key);
      setSaved(true);
    } catch (e) {
      setError(e as Error);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="space-y-3 border border-ink p-4">
      <h2 className="font-bold">Save for when you have signal</h2>
      <p className="text-sm text-muted-foreground">
        Keeps this photo, note and exact location on this device for up to seven
        days. Nothing uploads automatically. Use a personal device; signing out
        clears the queue.
      </p>
      <label className="flex items-start gap-3 text-sm">
        <Checkbox
          checked={consent}
          onCheckedChange={(v) => setConsent(v === true)}
        />
        Keep this capture on this device until I review and upload it
      </label>
      <Button
        type="button"
        variant="outline"
        disabled={
          !consent ||
          !draft.photo ||
          (!issueId && !draft.location) ||
          disabled ||
          busy ||
          saved
        }
        onClick={save}
      >
        {saved
          ? "Saved on this device"
          : busy
            ? "Saving…"
            : "Save offline capture"}
      </Button>
      {saved ? (
        <p role="status">
          <Link className="underline" to="/app/offline">
            Open saved captures
          </Link>{" "}
          to review, upload or delete it.
        </p>
      ) : null}
      {error ? <ErrorNotice error={error} /> : null}
    </section>
  );
}
