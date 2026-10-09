import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { formatDateTime, label } from "@/lib/format";
import type { TinkerExamples } from "@/lib/types";

export function RecordedTinkerExamples({ data }: { data: TinkerExamples }) {
  const [selected, setSelected] = useState(data.samples[0]?.id);
  const sample = data.samples.find(s => s.id === selected) ?? data.samples[0];
  if (!sample) return null;
  return <section id="tinker-examples" aria-labelledby="tinker-examples-title" className="scroll-mt-24 space-y-4 border border-ink bg-surface p-4 sm:p-6">
    <div className="flex flex-wrap gap-2"><Badge variant="outline">Recorded provider outputs</Badge><Badge variant="secondary">Synthetic notes</Badge></div>
    <h3 id="tinker-examples-title" className="text-xl font-bold">Inspect Tinker's recorded examples</h3>
    <p className="text-sm text-muted-foreground">All {data.samples.length} held-out notes from the {formatDateTime(data.recordedAt)} evaluation. These are saved base and fine-tuned model responses, including mistakes. Viewing them needs no account and makes no new provider call.</p>
    <label className="flex flex-col gap-2 text-sm font-semibold">Choose a synthetic note
      <select aria-label="Choose a synthetic note" value={sample.id} onChange={e => setSelected(e.target.value)} className="min-h-11 w-full min-w-0 border border-ink bg-paper px-3 font-normal">
        {data.samples.map(s => <option key={s.id} value={s.id}>{s.id}</option>)}
      </select>
    </label>
    <blockquote className="border-l-2 border-observe pl-3 break-words">{sample.note}</blockquote>
    <p className="text-sm">Synthetic target: {label(sample.target.category)} / {label(sample.target.severity)}. An annotation, not a verified field observation.</p>
    <div className="grid gap-4 md:grid-cols-2" aria-live="polite">
      {([["Base Qwen3", sample.basePrediction], ["Fine-tuned Qwen3", sample.fineTunedPrediction]] as const).map(([title, prediction]) => <div key={title} className="space-y-2 border border-border p-4">
        <h4 className="font-bold">{title}</h4>
        <p>{label(prediction.category)} / {label(prediction.severity)}</p>
        <p className="text-sm">{prediction.object}: {prediction.condition}</p>
        <ul className="list-inside list-disc text-sm">{prediction.evidence.map((e, i) => <li key={i}>{e}</li>)}</ul>
        {!prediction.evidence.length ? <p className="text-sm text-muted-foreground">No evidence claims returned.</p> : null}
      </div>)}
    </div>
    <details className="text-xs"><summary className="cursor-pointer py-2">Recorded model provenance</summary><p className="break-all font-mono">{data.model} · {data.modelVersion}</p></details>
    <a href={data.evidenceUrl} className="inline-flex min-h-11 items-center text-sm underline" target="_blank" rel="noreferrer">Inspect the complete evaluation record</a>
    <p className="text-sm text-muted-foreground">Small synthetic evaluations varied between runs: severity was 14/18 to 16/18 on 7 October, and 13/18 to 17/18 on 9 October. This does not establish a reliable real-world improvement. The live note action below is separate and requires your own report and consent.</p>
  </section>;
}
