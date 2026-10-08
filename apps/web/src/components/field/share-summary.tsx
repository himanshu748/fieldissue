import { useState } from "react";
import { Button } from "@/components/ui/button";
import { request } from "@/lib/api";
import { ErrorNotice } from "./states";

export function ShareSummary({ id }: { id: string }) {
  const [summary, setSummary] = useState("");
  const [error, setError] = useState<Error>();
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  async function prepare() {
    setBusy(true); setError(undefined);
    try {
      const value = await request<{ publicId: string; category: string; severity: string; status: string; publicLocation: { latitude: number; longitude: number; precision: string } }>(`/v1/issues/${encodeURIComponent(id)}/share-summary`);
      setSummary(`${value.publicId} · ${value.category.toLowerCase()} · ${value.status.toLowerCase()}\nSeverity: ${value.severity.toLowerCase()}\nApproximate area: ${value.publicLocation.latitude.toFixed(2)}, ${value.publicLocation.longitude.toFixed(2)}\n${value.publicLocation.precision}.\nHuman review required. This summary excludes photos, free text and exact coordinates.`);
    } catch (e) { setError(e as Error); }
    finally { setBusy(false); }
  }
  async function copy() {
    try { await navigator.clipboard.writeText(summary); setCopied(true); }
    catch { setError(new Error("Clipboard access is unavailable. Select and copy the summary above.")); }
  }
  return <section className="flex flex-col gap-3 border-t border-border pt-5">
    <h2 className="eyebrow">Share a summary</h2>
    <p className="text-sm text-muted-foreground">Preview an approximate location and status. Nothing is posted automatically.</p>
    {!summary ? <Button variant="outline" onClick={prepare} disabled={busy}>{busy ? "Preparing…" : "Preview safe summary"}</Button> : <>
      <pre className="whitespace-pre-wrap break-words border border-border p-3 text-sm" tabIndex={0}>{summary}</pre>
      <Button variant="outline" onClick={copy}>{copied ? "Copied" : "Copy summary"}</Button>
    </>}
    {error ? <ErrorNotice error={error} /> : null}
  </section>;
}
