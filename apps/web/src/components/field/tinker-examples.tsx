import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { formatDateTime, label } from "@/lib/format";
import type { TinkerExamples } from "@/lib/types";

type Sample = TinkerExamples["samples"][number];
function outcome(sample: Sample) {
  const base = sample.basePrediction?.severity === sample.target.severity;
  const tuned = sample.fineTunedPrediction?.severity === sample.target.severity;
  return tuned
    ? base
      ? "both_right"
      : "fine_tuned_right"
    : base
      ? "base_right"
      : "both_wrong";
}
const percentage = (n: number) => `${(n * 100).toFixed(1)}%`;

export function RecordedTinkerExamples({ data }: { data: TinkerExamples }) {
  const [selected, setSelected] = useState(data.samples[0]?.id);
  const [language, setLanguage] = useState("all");
  const [source, setSource] = useState("all");
  const [result, setResult] = useState("all");
  const filtered = data.samples.filter(
    (s) =>
      (language === "all" || s.language === language) &&
      (source === "all" || s.source === source) &&
      (result === "all" || outcome(s) === result),
  );
  const sample = filtered.find((s) => s.id === selected) ?? filtered[0];
  const selectClass =
    "min-h-11 w-full min-w-0 border border-ink bg-paper px-3 font-normal";
  return (
    <section
      id="tinker-examples"
      aria-labelledby="tinker-examples-title"
      className="scroll-mt-24 space-y-4 border border-ink bg-surface p-4 sm:p-6"
    >
      <div className="flex flex-wrap gap-2">
        <Badge variant="outline">Recorded provider outputs</Badge>
        <Badge variant="secondary">Synthetic and public-source notes</Badge>
      </div>
      <h3 id="tinker-examples-title" className="text-xl font-bold">
        Inspect Tinker's recorded examples
      </h3>
      <p className="text-sm text-muted-foreground">
        All {data.samples.length} held-out notes from the{" "}
        {formatDateTime(data.recordedAt)} evaluation, including every mistake.
        Viewing saved outputs needs no account and makes no provider call.
        Labels were assigned by the assistant against a frozen rubric before
        inference. Public-source reports are genuine Boston 311 text, not
        independently human-labelled severity or the author's walks.
      </p>
      <p className="text-sm text-muted-foreground">
        On the 30 public reports, primary fine-tuned severity improved from
        15/30 to 23/30 against five-shot, but category accuracy fell from 25/30
        to 20/30. The public severity McNemar p value is 0.057. Synthetic notes
        share templates, so these results do not establish field accuracy.
      </p>
      {data.summary ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[32rem] text-sm">
            <caption className="mb-2 text-left">
              Severity accuracy with 95% note-bootstrap intervals. Four-level
              macro F1 includes absent labels.
            </caption>
            <thead>
              <tr className="border-b border-ink text-left">
                <th className="py-2" scope="col">
                  Slice / model
                </th>
                <th scope="col">Notes</th>
                <th scope="col">Accuracy [95% CI]</th>
                <th scope="col">Macro F1</th>
                <th scope="col">Schema</th>
                <th scope="col">Category</th>
                <th scope="col">Costly error or invalid</th>
              </tr>
            </thead>
            <tbody>
              {data.summary.map((s) => (
                <tr
                  className="border-b border-border"
                  key={`${s.slice}-${s.model}`}
                >
                  <th scope="row" className="py-2 text-left font-normal">
                    {label(s.slice)} / {label(s.model)}
                  </th>
                  <td>{s.n}</td>
                  <td className="font-mono">
                    {percentage(s.severityAccuracy)} [
                    {s.ci95.map(percentage).join(", ")}]
                  </td>
                  <td>{s.macroF1.toFixed(3)}</td>
                  <td>{percentage(s.schemaRate)}</td>
                  <td>{percentage(s.categoryAccuracy)}</td>
                  <td>{percentage(s.costlyErrorRate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="flex flex-col gap-2 text-sm font-semibold">
          Language
          <select
            aria-label="Filter Tinker language"
            className={selectClass}
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="all">All languages</option>
            <option value="english">English</option>
            <option value="hindi">Hindi</option>
            <option value="hinglish">Hinglish</option>
          </select>
        </label>
        <label className="flex flex-col gap-2 text-sm font-semibold">
          Source
          <select
            aria-label="Filter Tinker source"
            className={selectClass}
            value={source}
            onChange={(e) => setSource(e.target.value)}
          >
            <option value="all">All sources</option>
            <option value="synthetic">Synthetic</option>
            <option value="public-source">Public Boston 311</option>
          </select>
        </label>
        <label className="flex flex-col gap-2 text-sm font-semibold">
          Severity result
          <select
            aria-label="Filter Tinker result"
            className={selectClass}
            value={result}
            onChange={(e) => setResult(e.target.value)}
          >
            <option value="all">All results</option>
            <option value="fine_tuned_right">
              Fine-tuned right / base wrong
            </option>
            <option value="base_right">Base right / fine-tuned wrong</option>
            <option value="both_wrong">Both wrong</option>
            <option value="both_right">Both right</option>
          </select>
        </label>
      </div>
      <p role="status" className="text-sm text-muted-foreground">
        Showing {filtered.length} of {data.samples.length} notes.
      </p>
      {sample ? (
        <>
          <label className="flex flex-col gap-2 text-sm font-semibold">
            Choose a recorded note
            <select
              aria-label="Choose a recorded note"
              value={sample.id}
              onChange={(e) => setSelected(e.target.value)}
              className={selectClass}
            >
              {filtered.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.id}
                </option>
              ))}
            </select>
          </label>
          <blockquote
            lang={
              sample.language === "hindi"
                ? "hi"
                : sample.language === "hinglish"
                  ? "hi-Latn"
                  : "en"
            }
            className="border-l-2 border-observe pl-3 break-words"
          >
            {sample.note}
          </blockquote>
          <p className="text-sm">
            Rubric target: {label(sample.target.category)} /{" "}
            {label(sample.target.severity)}.{" "}
            {sample.source === "public-source"
              ? "Assistant-labelled public report."
              : "Assistant-authored synthetic scenario."}
          </p>
          {sample.sourceUrl ? (
            <a
              className="text-sm underline"
              href={sample.sourceUrl}
              target="_blank"
              rel="noreferrer"
            >
              Original public source record
            </a>
          ) : null}
          <div className="grid gap-4 md:grid-cols-2" aria-live="polite">
            {(
              [
                ["Base zero-shot", sample.basePrediction],
                ["Base five-shot", sample.fewShotPrediction],
                ["Fine-tuned seed 42", sample.fineTunedPrediction],
                ["Fine-tuned seed 1729", sample.secondSeedPrediction],
              ] as const
            ).map(([title, prediction]) => (
              <div key={title} className="space-y-2 border border-border p-4">
                <h4 className="font-bold">{title}</h4>
                {prediction ? (
                  <>
                    <p>
                      {label(prediction.category)} /{" "}
                      {label(prediction.severity)}
                    </p>
                    <p className="text-sm">
                      {prediction.object}: {prediction.condition}
                    </p>
                    <ul className="list-inside list-disc text-sm">
                      {prediction.evidence.map((e, i) => (
                        <li key={i}>{e}</li>
                      ))}
                    </ul>
                    {!prediction.evidence.length ? (
                      <p className="text-sm text-muted-foreground">
                        No evidence claims returned.
                      </p>
                    ) : null}
                    <p className="text-xs">
                      Severity{" "}
                      {prediction.severity === sample.target.severity
                        ? "matches"
                        : "does not match"}{" "}
                      the rubric target.
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-destructive">
                    Invalid schema. Counted as an incorrect and costly triage
                    output.
                  </p>
                )}
              </div>
            ))}
          </div>
          {sample.rawOutputs ? (
            <details className="text-xs">
              <summary className="cursor-pointer py-2">
                Unmodified provider output
              </summary>
              <pre className="max-h-96 overflow-auto whitespace-pre-wrap break-words bg-muted p-3">
                {JSON.stringify(sample.rawOutputs, null, 2)}
              </pre>
            </details>
          ) : null}
        </>
      ) : (
        <p className="border border-border p-4">
          No notes match these filters. Change a filter to inspect other
          results.
        </p>
      )}
      <details className="text-xs">
        <summary className="cursor-pointer py-2">
          Recorded model provenance
        </summary>
        <p className="break-all font-mono">
          {data.model} · {data.modelVersion}
        </p>
      </details>
      <a
        href={data.evidenceUrl}
        className="inline-flex min-h-11 items-center text-sm underline"
        target="_blank"
        rel="noreferrer"
      >
        Inspect predictions, per-language metrics and paired tests
      </a>
      <p className="text-sm text-muted-foreground">
        Earlier runs remain public: severity was 14/18 to 16/18 on 7 October and
        13/18 to 17/18 on 9 October. Those small tests differ from this frozen
        evaluation. Template correlation and assistant labels limit
        generalization. The live note action below requires your own report and
        consent.
      </p>
    </section>
  );
}
