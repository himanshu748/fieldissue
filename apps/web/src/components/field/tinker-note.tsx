import { useId, useState } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { ErrorNotice } from "./states";
import { api } from "@/lib/api";
import { formatDateTime, label } from "@/lib/format";

export function TinkerNote({ observationId, note, available, canManage = true }: {
  observationId?: string; note?: string; available?: boolean; canManage?: boolean;
}) {
  const id = useId();
  const [consent, setConsent] = useState(false);
  const [result, setResult] = useState<Awaited<ReturnType<typeof api.interpretNote>>>();
  const [error, setError] = useState<Error>();
  const [loading, setLoading] = useState(false);
  if (!available) return <p className="text-sm text-muted-foreground">Trained note interpretation is unavailable on this deployment.</p>;
  if (!note?.trim()) return <p className="text-sm text-muted-foreground">Add a written note with your next observation to use the trained note model.</p>;
  if (!canManage) return <p className="text-sm text-muted-foreground">Live interpretation needs a report you own and your consent. <Link to="/app/lab#tinker-examples" className="underline">Inspect recorded Tinker examples</Link>, or <Link to="/app/report" className="underline">create your own report</Link>.</p>;
  async function run() {
    if (!observationId || !consent) return;
    setLoading(true); setError(undefined);
    try { setResult(await api.interpretNote(observationId)); }
    catch (e) { setError(e as Error); }
    finally { setLoading(false); }
  }
  return <div className="flex flex-col gap-4">
    <p className="text-sm text-muted-foreground">Tinker's fine-tuned Qwen3 turns informal English, Hindi and Hinglish notes into a structured description. It reads only your note. Please review its interpretation.</p>
    <blockquote className="border-l-2 border-observe pl-3 text-sm break-words">{note}</blockquote>
    <label htmlFor={id} className="flex items-start gap-3 text-sm">
      <Checkbox id={id} checked={consent} onCheckedChange={v => setConsent(v === true)} className="mt-0.5 size-5 shrink-0" />
      Send this note to Tinker for interpretation. No photo or coordinates are sent.
    </label>
    <Button className="self-start" disabled={!consent || loading || !observationId} onClick={run}>
      {loading ? <Spinner /> : null} {loading ? "Interpreting note…" : "Interpret with trained model"}
    </Button>
    {error ? <ErrorNotice error={error} title="Note interpretation unavailable" /> : null}
    {result ? <div className="space-y-3 border border-ink bg-surface p-4" aria-live="polite">
      <div className="flex flex-wrap gap-2"><Badge variant="outline">Tinker · fine-tuned Qwen3</Badge><Badge variant="secondary">Trained on synthetic notes</Badge></div>
      <p className="font-semibold">{label(result.result.category)} · {label(result.result.severity)}</p>
      <p>{label(result.result.object)}: {label(result.result.condition)}</p>
      <p className="eyebrow text-muted-foreground">Interpretation of the reporter's words</p>
      <ul className="list-inside list-disc text-sm">{result.result.evidence.map((e,i) => <li key={i}>{e}</li>)}</ul>
      <p className="text-xs text-muted-foreground">{formatDateTime(result.createdAt)} · {(result.latencyMs / 1000).toFixed(1)} s{result.cached ? " · saved result" : " · fresh inference"}. This does not change the issue's category, severity or resolution.</p>
      <details className="text-xs"><summary className="cursor-pointer py-2">Model provenance</summary><p className="break-all font-mono">{result.modelVersion}</p></details>
    </div> : null}
  </div>;
}
