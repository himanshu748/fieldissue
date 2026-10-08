import { useState } from "react";
import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeftIcon, CheckCircle2Icon, InfoIcon, MinusIcon, PlusIcon, SparklesIcon, EqualIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageComparisonSlider } from "@/components/field/image-comparison-slider";
import { ModelProvenance } from "@/components/field/model-provenance";
import { ObservationImage } from "@/components/field/observation-image";
import { EmptyState, ErrorNotice } from "@/components/field/states";
import { useResource } from "@/hooks/use-resource";
import { api } from "@/lib/api";
import { formatDateTime, label } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Diff, Observation } from "@/lib/types";

function Conditions({
  title,
  items,
  icon: Icon,
  tone,
  empty,
}: {
  title: string;
  items: string[];
  icon: typeof PlusIcon;
  tone: string;
  empty: string;
}) {
  return (
    <section className="flex flex-col gap-3 border-t-2 border-ink pt-4">
      <h3 className="eyebrow flex items-center justify-between">
        {title} <span className="font-mono text-muted-foreground">{items.length}</span>
      </h3>
      {items.length ? (
        <ul className="flex flex-col gap-2">
          <AnimatePresence initial>
            {items.map((item, i) => (
              <motion.li
                key={item}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.06, duration: 0.3 }}
                className="flex gap-2"
              >
                <Icon aria-hidden className={cn("mt-1 size-4 shrink-0", tone)} />
                {item}
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      ) : (
        <p className="text-muted-foreground">{empty}</p>
      )}
    </section>
  );
}

function ObservationSelect({
  id,
  name,
  value,
  observations,
  onChange,
  disabledIds,
}: {
  id: string;
  name: string;
  value: string;
  observations: Observation[];
  onChange: (v: string) => void;
  disabledIds: Set<string>;
}) {
  return (
    <Field>
      <FieldLabel htmlFor={id} className="eyebrow">
        {name}
      </FieldLabel>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={id} className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {observations.map((o, i) => (
              <SelectItem key={o.id} value={o.id} disabled={disabledIds.has(o.id)}>
                {i === 0 ? "Original" : `Revisit ${i}`} · {formatDateTime(o.capturedAt)}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  );
}

export function ComparePage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const routeState = useLocation().state as { justSaved?: boolean; diffUnavailable?: boolean } | null;
  const issue = useResource((signal) => api.issue(id, signal), [id]);
  const diffs = useResource((signal) => api.diffs(id, signal), [id]);
  const [consent, setConsent] = useState(false);
  const [running, setRunning] = useState(false);
  const [runError, setRunError] = useState<Error>();

  const error = issue.error ?? diffs.error;
  if (error)
    return (
      <ErrorNotice
        error={error}
        onRetry={() => {
          issue.reload();
          diffs.reload();
        }}
        title="Evidence could not be loaded"
      />
    );
  if (!issue.data || !diffs.data)
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-12 w-1/2" />
        <Skeleton className="aspect-[4/3] w-full" />
      </div>
    );

  const data = issue.data;
  const observations = data.observations;
  if (observations.length < 2)
    return (
      <EmptyState icon={<InfoIcon />} title="Nothing to compare yet" description="A comparison needs the original photo and at least one revisit.">
        <Button asChild>
          <Link to={`/app/issues/${data.publicId}/revisit`}>Add a revisit</Link>
        </Button>
      </EmptyState>
    );

  const index = new Map(observations.map((o, i) => [o.id, i]));
  const latestDiff = diffs.data.items.at(-1);
  const beforeId =
    (params.get("before") && index.has(params.get("before")!) ? params.get("before")! : null) ??
    latestDiff?.beforeObservationId ??
    observations.at(-2)!.id;
  const afterId =
    (params.get("after") && index.has(params.get("after")!) ? params.get("after")! : null) ??
    latestDiff?.afterObservationId ??
    observations.at(-1)!.id;
  const before = observations[index.get(beforeId)!];
  const after = observations[index.get(afterId)!];
  const validPair = index.get(beforeId)! < index.get(afterId)!;
  const diff: Diff | undefined = diffs.data.items.find(
    (d) => d.beforeObservationId === beforeId && d.afterObservationId === afterId,
  );

  function choose(which: "before" | "after", value: string) {
    const next = new URLSearchParams(params);
    next.set("before", which === "before" ? value : beforeId);
    next.set("after", which === "after" ? value : afterId);
    setParams(next, { replace: true });
    setRunError(undefined);
  }

  async function run() {
    setRunning(true);
    setRunError(undefined);
    try {
      const saved = await api.diff(data.publicId, beforeId, afterId);
      diffs.setData({ items: [...diffs.data!.items.filter((d) => d.id !== saved.id), saved] });
    } catch (e) {
      setRunError(e as Error);
    } finally {
      setRunning(false);
    }
  }

  const beforeLabel = `${index.get(beforeId) === 0 ? "Original" : `Revisit ${index.get(beforeId)}`} · ${formatDateTime(before.capturedAt)}`;
  const afterLabel = `${index.get(afterId) === 0 ? "Original" : `Revisit ${index.get(afterId)}`} · ${formatDateTime(after.capturedAt)}`;
  const identical = diff?.model === "fieldissue-image-identity";
  const noChange = diff && !identical && !diff.added.length && !diff.removed.length;
  const closed = data.status === "RESOLVED" || data.status === "REJECTED";

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Link to={`/app/issues/${data.publicId}`} className="inline-flex min-h-11 items-center gap-2 font-mono text-sm text-observe-ink">
          <ArrowLeftIcon aria-hidden className="size-4" />
          {data.publicId}
        </Link>
        <h1 className="mt-1 text-3xl leading-tight font-bold uppercase sm:text-5xl">What changed?</h1>
      </div>

      {routeState?.justSaved ? (
        <Alert>
          <CheckCircle2Icon />
          <AlertTitle>Revisit saved</AlertTitle>
          <AlertDescription>
            {routeState.diffUnavailable
              ? "The comparison service did not answer, but your new observation is stored. You can run the comparison below."
              : "Your new observation is stored next to the earlier ones. Nothing was overwritten."}
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <ObservationSelect
          id="before"
          name="Before"
          value={beforeId}
          observations={observations}
          onChange={(v) => choose("before", v)}
          disabledIds={new Set(observations.filter((o) => index.get(o.id)! >= index.get(afterId)!).map((o) => o.id))}
        />
        <ObservationSelect
          id="after"
          name="After"
          value={afterId}
          observations={observations}
          onChange={(v) => choose("after", v)}
          disabledIds={new Set(observations.filter((o) => index.get(o.id)! <= index.get(beforeId)!).map((o) => o.id))}
        />
      </div>

      {validPair ? (
        <Tabs defaultValue="slider" className="flex flex-col gap-4">
          <TabsList className="self-start">
            <TabsTrigger value="slider" className="px-4">
              Slider
            </TabsTrigger>
            <TabsTrigger value="side" className="px-4">
              Side by side
            </TabsTrigger>
          </TabsList>
          <TabsContent value="slider">
            <ImageComparisonSlider beforeKey={before.storageKey} afterKey={after.storageKey} beforeLabel={beforeLabel} afterLabel={afterLabel} />
          </TabsContent>
          <TabsContent value="side">
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { o: before, l: `Before · ${beforeLabel}` },
                { o: after, l: `After · ${afterLabel}` },
              ].map(({ o, l }) => (
                <figure key={o.id} className="flex flex-col gap-2">
                  <ObservationImage storageKey={o.storageKey} alt={l} className="aspect-[4/3] border border-ink" />
                  <figcaption className="font-mono text-xs uppercase tracking-wider text-muted-foreground">{l}</figcaption>
                </figure>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      ) : (
        <Alert variant="destructive">
          <AlertTitle>Choose an earlier “before” and a later “after” observation.</AlertTitle>
        </Alert>
      )}

      {validPair && diff ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8">
          <p className="max-w-3xl font-heading text-xl leading-snug sm:text-2xl">{diff.summary}</p>
          {identical ? <Alert><InfoIcon /><AlertTitle>A fresh photo is needed</AlertTitle><AlertDescription>This is an exact file match, not an AI assessment or proof of a new visit. The issue status has not changed.</AlertDescription></Alert> : null}
          {noChange ? (
            <Alert>
              <EqualIcon />
              <AlertTitle>No added or removed conditions identified</AlertTitle>
              <AlertDescription>The model found no visible difference between these two photos.</AlertDescription>
            </Alert>
          ) : null}
          <div className="grid gap-8 md:grid-cols-3">
            <Conditions title="Removed conditions" items={diff.removed} icon={MinusIcon} tone="text-grass" empty="No condition removed." />
            <Conditions title="Unchanged conditions" items={diff.unchanged} icon={EqualIcon} tone="text-muted-foreground" empty="None listed." />
            <Conditions title="Added conditions" items={diff.added} icon={PlusIcon} tone="text-observe-ink" empty="No new condition identified." />
          </div>
          <section className="grid gap-6 border border-ink bg-surface p-5 md:grid-cols-[1fr_1.2fr]">
            <div>
              <h2 className="eyebrow text-muted-foreground">{identical ? "Status at comparison" : "AI recommendation"}</h2>
              <p className="mt-2 text-2xl font-bold">{label(diff.recommendedStatus)}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                A suggestion only. The issue is still <strong className="text-ink">{label(data.status)}</strong> until a person
                decides.
              </p>
            </div>
            <ModelProvenance model={diff.model} modelVersion={diff.modelVersion} confidence={diff.confidence} at={diff.createdAt} />
          </section>
        </motion.div>
      ) : null}

      {validPair && !diff ? (
        <section className="flex flex-col gap-4 border border-ink bg-surface p-5">
          <h2 className="eyebrow">No saved comparison for this pair</h2>
          <Field orientation="horizontal">
            <Checkbox id="diff-consent" checked={consent} onCheckedChange={(v) => setConsent(v === true)} className="size-5" />
            <FieldLabel htmlFor="diff-consent" className="font-normal">
              Send both stored photos and notes to the configured Gemma endpoint for comparison. The result is saved and never
              changes the status.
            </FieldLabel>
          </Field>
          {runError ? <ErrorNotice error={runError} title="Comparison failed" onRetry={consent ? run : undefined} /> : null}
          <Button onClick={run} disabled={!consent || running} className="self-start">
            {running ? <Spinner data-icon="inline-start" /> : <SparklesIcon data-icon="inline-start" />}
            {running ? "Comparing…" : "Compare observations"}
          </Button>
        </section>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button variant="outline" size="lg" onClick={() => navigate(`/app/issues/${data.publicId}`)}>
          {closed ? "Back to issue" : "Keep open"}
        </Button>
        {!closed ? (
          <Button asChild size="lg">
            <Link to={`/app/issues/${data.publicId}/resolve`}>
              <CheckCircle2Icon data-icon="inline-start" />
              Review resolution
            </Link>
          </Button>
        ) : null}
      </div>
    </div>
  );
}
