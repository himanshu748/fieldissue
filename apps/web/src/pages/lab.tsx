import { TabPFNDemo } from "@/components/field/tabpfn-demo";
import { TinkerNote } from "@/components/field/tinker-note";
import { RecordedTinkerExamples } from "@/components/field/tinker-examples";
import { useEffect } from "react";
import { Link, useLocation } from "react-router";
import { ArrowUpRightIcon, BeakerIcon, CircleDotIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ModelProvenance } from "@/components/field/model-provenance";
import { ObservationImage } from "@/components/field/observation-image";
import { EmptyState, ErrorNotice } from "@/components/field/states";
import { useResource, type Resource } from "@/hooks/use-resource";
import { BackboardPanel, SemanticSearchPanel } from "@/components/field/lab-panels";
import { api } from "@/lib/api";
import { formatDateTime, label } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Evaluation, IntegrationStatus } from "@/lib/types";

const statusTone: Record<string, string> = {
  verified: "bg-grass",
  active: "bg-grass",
  configured: "bg-water",
  ready: "bg-grass",
  unavailable: "bg-muted-foreground",
  not_configured: "bg-muted-foreground",
  error: "bg-destructive",
};

function IntegrationRow({ item }: { item: IntegrationStatus }) {
  return (
    <li className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 border-b border-border py-3">
      <span className="font-semibold">{item.name}</span>
      <span className="flex items-center gap-2 font-mono text-xs uppercase">
        <span aria-hidden className={cn("size-2 rounded-full", statusTone[item.status.toLowerCase()] ?? "bg-observe")} />
        {label(item.status)}
      </span>
      <span className="col-span-2 text-sm text-muted-foreground">{item.detail}</span>
    </li>
  );
}

function MetricsTable({ metrics }: { metrics: Record<string, unknown> }) {
  const base = metrics.base as Record<string, number> | undefined;
  const tuned = metrics.fineTuned as Record<string, number> | undefined;
  const total = metrics.heldOutExamples as number | undefined;
  if (!base || !tuned)
    return <pre className="overflow-x-auto bg-muted p-3 font-mono text-xs">{JSON.stringify(metrics, null, 2)}</pre>;
  const keys = Array.from(new Set([...Object.keys(base), ...Object.keys(tuned)]));
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[20rem] border-collapse text-sm">
        <caption className="mb-2 text-left text-muted-foreground">
          Held-out examples{total !== undefined ? `: ${total}` : ""}
        </caption>
        <thead>
          <tr className="border-b border-ink text-left">
            <th scope="col" className="py-2 font-mono text-xs uppercase">Metric</th>
            <th scope="col" className="py-2 text-right font-mono text-xs uppercase">Base</th>
            <th scope="col" className="py-2 text-right font-mono text-xs uppercase">Fine-tuned</th>
          </tr>
        </thead>
        <tbody>
          {keys.map((k) => (
            <tr key={k} className="border-b border-border">
              <th scope="row" className="py-2 text-left font-normal">
                {k.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase())}
              </th>
              <td className="py-2 text-right font-mono">
                {base[k] ?? "n/a"}
                {total ? `/${total}` : ""}
              </td>
              <td className={cn("py-2 text-right font-mono", (tuned[k] ?? 0) > (base[k] ?? 0) && "text-grass")}>
                {tuned[k] ?? "n/a"}
                {total ? `/${total}` : ""}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EvaluationCard({ evaluation }: { evaluation: Evaluation }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{evaluation.serving ? "Serving checkpoint evaluation" : "Historical evaluation"}</Badge>
          {!evaluation.serving ? <Badge variant="secondary">Not serving in production</Badge> : null}
        </div>
        <CardTitle className="mt-2 text-xl">{evaluation.title}</CardTitle>
        <CardDescription>
          <span className="font-mono">{evaluation.model}</span>
          {evaluation.recordedAt ? ` · recorded ${formatDateTime(evaluation.recordedAt)}` : ""}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <p>
          <span className="eyebrow mr-2 text-muted-foreground">Dataset</span>
          {evaluation.dataset}
        </p>
        <MetricsTable metrics={evaluation.metrics} />
        <div>
          <p className="eyebrow text-muted-foreground">Limitations</p>
          <ul className="mt-2 list-inside list-disc text-sm text-muted-foreground">
            {evaluation.limitations.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </div>
      </CardContent>
      {evaluation.id.includes("tinker") ? <CardFooter><a href="https://github.com/himanshu748/fieldissue/tree/main/services/intelligence/training" target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-1.5 text-sm underline">Training scripts, dataset and evaluation instructions <ArrowUpRightIcon aria-hidden className="size-4" /></a></CardFooter> : null}
      {evaluation.evidenceUrl ? (
        <CardFooter>
          <a href={evaluation.evidenceUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-1.5 text-sm underline">
            Raw evaluation record <ArrowUpRightIcon aria-hidden className="size-4" />
          </a>
        </CardFooter>
      ) : null}
    </Card>
  );
}

type LatestIssue = Awaited<ReturnType<typeof api.issue>> | null;

function GemmaEvidence({ latest }: { latest: Resource<LatestIssue> }) {
  if (latest.error) return <ErrorNotice error={latest.error} onRetry={latest.reload} />;
  if (latest.data === undefined) return <Skeleton className="h-64" />;
  if (latest.data === null)
    return <EmptyState icon={<BeakerIcon />} title="No analysis recorded yet" description="Report an issue to create the first real Gemma analysis on this deployment." />;
  const issue = latest.data;
  const obs = issue.observations.at(-1);
  const analysis = obs?.aiAnalysis ?? {};
  return (
    <div className="grid gap-6 md:grid-cols-[16rem_1fr]">
      <div className="flex flex-col gap-2">
        <ObservationImage storageKey={obs?.storageKey} alt="Input photo for the latest analysis" className="aspect-square border border-ink" />
        <p className="text-sm text-muted-foreground">
          Input note: {obs?.note ? `“${obs.note}”` : "none"}. From{" "}
          <Link className="underline" to={`/app/issues/${issue.publicId}`}>
            {issue.publicId}
          </Link>
          .
        </p>
      </div>
      <div className="flex min-w-0 flex-col gap-4">
        <ModelProvenance model={analysis.model} modelVersion={analysis.modelVersion} confidence={analysis.confidence} at={obs?.createdAt} />
        <div>
          <p className="eyebrow mb-2 text-muted-foreground">Stored output (validated against the shared schema)</p>
          <pre className="max-h-80 overflow-auto bg-ink p-4 font-mono text-xs text-paper">{JSON.stringify(analysis, null, 2)}</pre>
        </div>
        <p className="text-sm text-muted-foreground">
          Per-request latency is not stored with observations. It is traced in Sentry without image or note content.
        </p>
      </div>
    </div>
  );
}

export function LabPage() {
  const { hash } = useLocation();
  const evaluations = useResource((signal) => api.evaluations(signal), []);
  useEffect(() => {
    if (hash === "#tinker-examples" && evaluations.data?.tinkerExamples)
      document.getElementById("tinker-examples")?.scrollIntoView({ block: "start" });
  }, [hash, evaluations.data]);
  const integrations = useResource((signal) => api.integrations(signal), []);
  const latest = useResource<LatestIssue>(async (signal) => {
    const list = await api.listIssues(new URLSearchParams({ limit: "1" }), signal);
    const first = list.items[0];
    return first ? api.issue(first.publicId, signal) : null;
  }, []);
  const latestObservationId = latest.data?.observations.at(-1)?.id;
  const byId = new Map((integrations.data?.integrations ?? []).map((i) => [i.id.toLowerCase(), i]));
  const backboard = byId.get("backboard");
  const tiger = byId.get("tiger");

  return (
    <div className="flex flex-col gap-12">
      <div>
        <p className="eyebrow text-muted-foreground">Model Lab · for developers and judges</p>
        <h1 className="mt-2 text-3xl leading-tight font-bold uppercase sm:text-5xl">Inspect the machinery</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Everything here is read from this deployment. If a service is not configured, it says so. No output on this page is
          generated for display.
        </p>
      </div>

      <section className="flex flex-col gap-4" aria-labelledby="integrations">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 id="integrations" className="text-2xl font-bold uppercase">
            Integration status
          </h2>
          {integrations.data ? (
            <span className="flex items-center gap-2 font-mono text-xs uppercase">
              <CircleDotIcon aria-hidden className={cn("size-4", integrations.data.coreReady ? "text-grass" : "text-destructive")} />
              Core {integrations.data.coreReady ? "ready" : "not ready"}
            </span>
          ) : null}
        </div>
        {integrations.error ? <ErrorNotice error={integrations.error} onRetry={integrations.reload} title="Integration status unavailable" /> : null}
        {integrations.loading ? <Skeleton className="h-40" /> : null}
        {integrations.data && !integrations.data.integrations.length ? (
          <p className="text-muted-foreground">This deployment does not report any integration details.</p>
        ) : null}
        <ul className="grid gap-x-10 md:grid-cols-2">
          {integrations.data?.integrations.map((i) => (
            <IntegrationRow key={i.id} item={i} />
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-4" aria-labelledby="gemma">
        <h2 id="gemma" className="text-2xl font-bold uppercase">
          Gemma evidence
        </h2>
        <p className="max-w-2xl text-muted-foreground">The most recent issue's latest stored analysis, exactly as saved.</p>
        <GemmaEvidence latest={latest} />
      </section>

      <section className="flex flex-col gap-4" aria-labelledby="tinker-live">
        <h2 id="tinker-live" className="text-2xl font-bold uppercase">Trained field-note interpretation</h2>
        {evaluations.data?.tinkerExamples ? <RecordedTinkerExamples data={evaluations.data.tinkerExamples} /> : null}
        <TinkerNote key={latestObservationId} observationId={latestObservationId} note={latest.data?.observations.at(-1)?.note} available={byId.get("tinker")?.status === "configured"} canManage={latest.data?.permissions?.manage !== false} />
      </section>

      <section className="flex flex-col gap-4" aria-labelledby="backboard">
        <h2 id="backboard" className="text-2xl font-bold uppercase">
          Backboard comparison
        </h2>
        {integrations.data ? <BackboardPanel integration={backboard} observationId={latestObservationId} /> : <Skeleton className="h-24" />}
      </section>

      <section className="flex flex-col gap-4" aria-labelledby="semantic">
        <h2 id="semantic" className="text-2xl font-bold uppercase">
          Semantic issue search
        </h2>
        {integrations.data ? <SemanticSearchPanel integration={tiger} /> : <Skeleton className="h-24" />}
      </section>

      <section className="flex flex-col gap-4" aria-labelledby="tabpfn-demo">
        <h2 id="tabpfn-demo" className="text-2xl font-bold uppercase">Revisit scenario tester</h2>
        <p><a className="underline" href="/v1/openapi" target="_blank" rel="noreferrer">Public read API specification</a> · Public reports only; rate limits apply.</p>
      <TabPFNDemo available={byId.get("tabpfn")?.status === "configured"} />
      </section>

      <section className="flex flex-col gap-3" aria-labelledby="entire-evidence">
        <h2 id="entire-evidence" className="text-2xl font-bold uppercase">Entire development record</h2>
        <p className="max-w-2xl text-muted-foreground">Read nine actual messages from Claude's frontend implementation session, captured by Entire. Private paths and tool context were removed. This record documents development; live acceptance checks are recorded separately.</p>
        <a className="underline min-h-11 inline-flex items-center gap-2" href="https://github.com/himanshu748/fieldissue/blob/main/docs/verification/entire-v2-curated-session.json" target="_blank" rel="noreferrer">Read the reviewed session excerpt <ArrowUpRightIcon aria-hidden className="size-4" /></a>
      </section>

      <section className="flex flex-col gap-4" aria-labelledby="evals">
        <h2 id="evals" className="text-2xl font-bold uppercase">
          Recorded evaluations
        </h2>
        {evaluations.error ? <ErrorNotice error={evaluations.error} onRetry={evaluations.reload} title="Evaluations unavailable" /> : null}
        {evaluations.loading ? <Skeleton className="h-72" /> : null}
        {evaluations.data && !evaluations.data.evaluations.length ? (
          <p className="text-muted-foreground">No recorded evaluations on this deployment.</p>
        ) : null}
        <div className="grid gap-6">
          {evaluations.data?.evaluations.map((e) => (
            <EvaluationCard key={e.id} evaluation={e} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3 border-t border-ink pt-8" aria-labelledby="pipeline">
        <h2 id="pipeline" className="text-2xl font-bold uppercase">
          Pipeline
        </h2>
        <ol className="grid gap-4 font-mono text-sm md:grid-cols-5">
          {[
            "Browser resizes photo, strips metadata",
            "Hono API validates upload and access",
            "Mastra workflow calls the intelligence service",
            "Gemma output validated against a strict schema",
            "Issue, observation and events written in one transaction",
          ].map((s, i) => (
            <li key={s} className="border-t-2 border-ink pt-3">
              <span className="text-observe-ink">{String(i + 1).padStart(2, "0")}</span>
              <p className="mt-1 font-sans">{s}</p>
            </li>
          ))}
        </ol>
        <p className="text-sm text-muted-foreground">
          Sentry traces cover each step with request IDs and durations. Images, notes and model text are excluded from telemetry.
        </p>
      </section>
    </div>
  );
}
