import { saveDownload } from "./issue-followup";
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
    setBusy(true);
    setError(undefined);
    try {
      const value = await request<{
        publicId: string;
        category: string;
        severity: string;
        status: string;
        publicLocation: {
          latitude: number;
          longitude: number;
          precision: string;
        };
      }>(`/v1/issues/${encodeURIComponent(id)}/share-summary`);
      setSummary(
        `${value.publicId} · ${value.category.toLowerCase()} · ${value.status.toLowerCase()}\nSeverity: ${value.severity.toLowerCase()}\nLocation: ${value.publicLocation.latitude}, ${value.publicLocation.longitude}\n${value.publicLocation.precision}.\nHuman review required. This summary excludes photos and free text. Check the location precision before sharing.`,
      );
    } catch (e) {
      setError(e as Error);
    } finally {
      setBusy(false);
    }
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
    } catch {
      setError(
        new Error(
          "Clipboard access is unavailable. Select and copy the summary above.",
        ),
      );
    }
  }
  async function card() {
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 720;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#f4f1e9";
    ctx.fillRect(0, 0, 1200, 720);
    ctx.fillStyle = "#202923";
    ctx.font = "bold 48px sans-serif";
    ctx.fillText("FIELDISSUE", 64, 90);
    ctx.font = "26px sans-serif";
    let y = 165;
    for (const line of summary.split("\n")) {
      let current = "";
      for (const word of line.split(" ")) {
        if (ctx.measureText(current + word).width > 1050) {
          ctx.fillText(current, 64, y);
          y += 40;
          current = "";
        }
        current += word + " ";
      }
      ctx.fillText(current, 64, y);
      y += 48;
    }
    canvas.toBlob((b) => {
      if (b) saveDownload(b, `${id}-summary.png`);
    }, "image/png");
  }
  async function exportRecord() {
    try {
      const data = await request(`/v1/issues/${encodeURIComponent(id)}/export`);
      saveDownload(
        new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
        `${id}-open311.json`,
      );
    } catch (e) {
      setError(e as Error);
    }
  }
  return (
    <section className="flex flex-col gap-3 border-t border-border pt-5">
      <h2 className="eyebrow">Share a summary</h2>
      <p className="text-sm text-muted-foreground">
        Preview an approximate location and status. Nothing is posted
        automatically.
      </p>
      {!summary ? (
        <Button variant="outline" onClick={prepare} disabled={busy}>
          {busy ? "Preparing…" : "Preview safe summary"}
        </Button>
      ) : (
        <>
          <pre
            className="whitespace-pre-wrap break-words border border-border p-3 text-sm"
            tabIndex={0}
          >
            {summary}
          </pre>
          <Button variant="outline" onClick={copy}>
            {copied ? "Copied" : "Copy summary"}
          </Button>
          <Button variant="outline" onClick={card}>
            Download share card
          </Button>
          <Button variant="outline" onClick={exportRecord}>
            Download municipal export
          </Button>
          <p className="text-xs text-muted-foreground">
            The export uses Open311 fields with approximate coordinates. A
            receiving city must map its service codes before import. Nothing is
            sent to a municipality.
          </p>
        </>
      )}
      {error ? <ErrorNotice error={error} /> : null}
    </section>
  );
}
