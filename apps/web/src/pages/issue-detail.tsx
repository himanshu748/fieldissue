import { useState } from "react";
import { Link, useParams } from "react-router";
import {
  ArrowLeftRightIcon,
  CameraIcon,
  CheckCircle2Icon,
  FootprintsIcon,
  MapPinIcon,
  RotateCcwIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { AudioBriefing } from "@/components/field/audio-briefing";
import { IssueStatus, SeverityIndicator } from "@/components/field/issue-status";
import { ModelProvenance } from "@/components/field/model-provenance";
import { NearbyMap } from "@/components/field/nearby-map";
import { ObservationImage } from "@/components/field/observation-image";
import { ObservationTimeline } from "@/components/field/observation-timeline";
import { ErrorNotice } from "@/components/field/states";
import { useAppConfig } from "@/hooks/use-app-config";
import { useResource } from "@/hooks/use-resource";
import { api } from "@/lib/api";
import { formatCoords, distanceMeters } from "@/lib/geo";
import { formatDate, formatDateTime, label, lastObserved, timeAgo } from "@/lib/format";
import { appendItem, useWalk, WALK_LIMIT } from "@/lib/walk";
import type { Status } from "@/lib/types";

const sourceLabel = {
  device: "device location",
  manual: "entered manually",
  inherited: "inherited from the issue",
  unspecified: "source not recorded",
} as const;

function StatusAction({
  to,
  children,
  description,
  onConfirm,
}: {
  to: Status;
  children: string;
  description: string;
  onConfirm: (to: Status) => Promise<void>;
}) {
  const [busy, setBusy] = useState(false);
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm">
          {children}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{children}?</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              await onConfirm(to);
              setBusy(false);
            }}
          >
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function IssueDetailPage() {
  const { id = "" } = useParams();
  const { config } = useAppConfig();
  const walk = useWalk();
  const issue = useResource((signal) => api.issue(id, signal), [id]);
  const diffs = useResource((signal) => api.diffs(id, signal), [id]);
  const timeline = useResource((signal) => api.timeline(id, signal), [id]);

  if (issue.error) return <ErrorNotice error={issue.error} onRetry={issue.reload} title="This issue could not be loaded" />;
  if (!issue.data)
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-14 w-3/4" />
        <Skeleton className="aspect-[16/9] w-full" />
      </div>
    );

  const data = issue.data;
  const observations = data.observations;
  const original = observations[0];
  const latest = observations.at(-1);
  const closed = data.status === "RESOLVED" || data.status === "REJECTED";
  const inWalk = walk?.items.find((i) => i.issueId === data.id);

  async function changeStatus(to: Status) {
    try {
      await api.patch(data.publicId, { status: to });
      toast.success(`Status changed to ${label(to)}.`);
      issue.reload();
      timeline.reload();
    } catch (e) {
      toast.error((e as Error).message);
    }
  }

  function addToWalk() {
    if (!walk) return;
    const added = appendItem({
      issueId: data.id,
      title: data.title,
      status: data.status,
      distanceMeters: distanceMeters(walk.origin, data),
      lastObservedAt: lastObserved(data),
    });
    if (added) toast.success("Added to your walk.");
    else toast.error(`A walk holds at most ${WALK_LIMIT} issues.`);
  }

  return (
    <article className="flex flex-col gap-10">
      <header className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-lg tracking-wide text-observe-ink">{data.publicId}</span>
          <IssueStatus status={data.status} />
          {inWalk ? (
            <Badge variant="secondary" className="h-7 gap-1.5">
              <FootprintsIcon /> In your walk
            </Badge>
          ) : null}
        </div>
        <h1 className="text-3xl leading-tight font-bold uppercase sm:text-5xl">{data.title}</h1>
        <p className="text-muted-foreground">
          Reported {formatDate(data.createdAt)} · last observed {timeAgo(lastObserved(data))} · {observations.length}{" "}
          observation{observations.length === 1 ? "" : "s"}
        </p>
        <div className="flex flex-wrap gap-2">
          {data.status !== "REJECTED" ? (
            <Button asChild>
              <Link to={`/app/issues/${data.publicId}/revisit`}>
                <CameraIcon data-icon="inline-start" />
                Add revisit
              </Link>
            </Button>
          ) : null}
          {observations.length > 1 ? (
            <Button asChild variant="outline">
              <Link to={`/app/issues/${data.publicId}/compare`}>
                <ArrowLeftRightIcon data-icon="inline-start" />
                Compare evidence
              </Link>
            </Button>
          ) : null}
          {!closed ? (
            <Button asChild variant="outline">
              <Link to={`/app/issues/${data.publicId}/resolve`}>
                <CheckCircle2Icon data-icon="inline-start" />
                Review resolution
              </Link>
            </Button>
          ) : null}
          {data.status === "RESOLVED" ? (
            <StatusAction
              to="OPEN"
              onConfirm={changeStatus}
              description="Reopening records a status change. Every earlier observation, comparison and the resolution itself stay in the history."
            >
              Reopen issue
            </StatusAction>
          ) : null}
          {walk && !inWalk && !closed ? (
            <Button variant="ghost" onClick={addToWalk}>
              <FootprintsIcon data-icon="inline-start" />
              Add to walk
            </Button>
          ) : null}
        </div>
      </header>

      <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div className="flex flex-col gap-10">
          <section aria-labelledby="original" className="flex flex-col gap-3">
            <h2 id="original" className="eyebrow">
              Original photo
            </h2>
            <ObservationImage storageKey={original?.storageKey} alt={`Original photo for ${data.publicId}`} className="aspect-[4/3] border border-ink" />
            {original?.note ? <p className="text-muted-foreground">“{original.note}”</p> : null}
          </section>

          <section aria-labelledby="evidence" className="flex flex-col gap-4">
            <h2 id="evidence" className="eyebrow">
              Evidence history
            </h2>
            <Accordion type="multiple" defaultValue={latest ? [latest.id] : []} className="border-y border-ink">
              {observations.map((o, index) => {
                const a = o.aiAnalysis ?? {};
                return (
                  <AccordionItem key={o.id} value={o.id}>
                    <AccordionTrigger className="text-base">
                      <span className="flex flex-col gap-0.5 text-left">
                        <span className="font-semibold">
                          {index === 0 ? "Original observation" : `Revisit ${index}`}
                        </span>
                        <span className="font-mono text-xs text-muted-foreground">{formatDateTime(o.capturedAt)}</span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid gap-4 pt-2 sm:grid-cols-[12rem_1fr]">
                        <ObservationImage storageKey={o.storageKey} alt={`Observation ${index + 1}`} className="aspect-square border border-border" />
                        <div className="flex flex-col gap-3">
                          {o.note ? <p>“{o.note}”</p> : <p className="text-muted-foreground">No note.</p>}
                          {a.conditions?.length ? (
                            <div>
                              <p className="eyebrow text-muted-foreground">Conditions</p>
                              <ul className="mt-1 list-inside list-disc">
                                {a.conditions.map((c) => (
                                  <li key={c}>{c}</li>
                                ))}
                              </ul>
                            </div>
                          ) : null}
                          <p className="font-mono text-xs text-muted-foreground">
                            {formatCoords(o)} · {sourceLabel[o.locationSource] ?? o.locationSource} · capture time from{" "}
                            {o.captureTimeSource === "user" ? "the reporter" : o.captureTimeSource === "upload" ? "upload" : "unknown"}
                          </p>
                          <ModelProvenance model={a.model} modelVersion={a.modelVersion} confidence={a.confidence} />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </section>

          <section aria-labelledby="comparisons" className="flex flex-col gap-4">
            <h2 id="comparisons" className="eyebrow">
              Saved comparisons
            </h2>
            {diffs.error ? <ErrorNotice error={diffs.error} onRetry={diffs.reload} /> : null}
            {diffs.data && !diffs.data.items.length ? (
              <p className="text-muted-foreground">
                {observations.length > 1 ? "No comparison saved yet." : "A comparison needs a revisit photo first."}
              </p>
            ) : null}
            <ul className="flex flex-col gap-3">
              {diffs.data?.items.map((d) => (
                <li key={d.id}>
                  <Link
                    to={`/app/issues/${data.publicId}/compare?before=${d.beforeObservationId}&after=${d.afterObservationId}`}
                    className="flex flex-col gap-2 border border-border bg-surface p-4 hover:border-ink"
                  >
                    <span className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-mono text-xs text-muted-foreground">{formatDateTime(d.createdAt)}</span>
                      <Badge variant="outline">Model suggested {label(d.recommendedStatus)}</Badge>
                    </span>
                    <span>{d.summary}</span>
                    <span className="font-mono text-xs text-muted-foreground">
                      −{d.removed.length} removed · +{d.added.length} added · {d.unchanged.length} unchanged
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="flex flex-col gap-8">
          <section className="flex flex-col gap-4 border border-ink bg-surface p-5">
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="eyebrow text-muted-foreground">Category</dt>
                <dd className="mt-1 font-semibold">{label(data.category)}</dd>
              </div>
              <div>
                <dt className="eyebrow text-muted-foreground">Severity</dt>
                <dd className="mt-1">
                  <SeverityIndicator severity={data.severity} />
                </dd>
              </div>
            </dl>
            <Separator />
            <div className="flex gap-3">
              <MapPinIcon aria-hidden className="mt-0.5 shrink-0 text-observe-ink" />
              <div className="min-w-0">
                {data.placeContext?.name ? (
                  <>
                    <p className="font-semibold">Near {data.placeContext.name}</p>
                    {data.placeContext.address ? <p className="text-sm text-muted-foreground">{data.placeContext.address}</p> : null}
                    <p className="text-xs text-muted-foreground">Place context from SerpApi, within 2 km of the point.</p>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">No verified nearby place name.</p>
                )}
                <p className="mt-1 font-mono text-xs break-all">{formatCoords(data)}</p>
              </div>
            </div>
            <NearbyMap
              markers={[{ id: data.publicId, latitude: data.latitude, longitude: data.longitude, title: data.title, status: data.status }]}
              className="h-56"
            />
            {!closed && data.status === "OPEN" ? (
              <div className="flex flex-wrap gap-2">
                <StatusAction to="ACKNOWLEDGED" onConfirm={changeStatus} description="Records that a person has seen and accepted this report.">
                  Mark acknowledged
                </StatusAction>
                <StatusAction to="IN_PROGRESS" onConfirm={changeStatus} description="Records that someone says a fix is under way.">
                  Mark in progress
                </StatusAction>
              </div>
            ) : null}
            {data.status === "ACKNOWLEDGED" ? (
              <StatusAction to="IN_PROGRESS" onConfirm={changeStatus} description="Records that someone says a fix is under way.">
                Mark in progress
              </StatusAction>
            ) : null}
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="eyebrow">Field briefing</h2>
            <AudioBriefing issueId={data.publicId} available={config?.audio} />
          </section>

          <section aria-labelledby="history" className="flex flex-col gap-4">
            <h2 id="history" className="eyebrow">
              Issue history
            </h2>
            {timeline.error ? <ErrorNotice error={timeline.error} onRetry={timeline.reload} /> : null}
            {timeline.data ? (
              <ObservationTimeline events={timeline.data.events} pending={closed ? undefined : "Awaiting the next revisit"} />
            ) : (
              <Skeleton className="h-40" />
            )}
          </section>

          {data.status === "RESOLVED" ? (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <RotateCcwIcon aria-hidden className="size-4" />
              Resolved {data.resolvedAt ? formatDate(data.resolvedAt) : ""}. Human-confirmed, not identity-verified.
            </p>
          ) : null}
        </aside>
      </div>
    </article>
  );
}
