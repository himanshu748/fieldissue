import { Link, useParams } from "react-router";
import { api } from "@/lib/api";
import { useResource } from "@/hooks/use-resource";
import { formatDateTime, label } from "@/lib/format";
import { ObservationImage } from "@/components/field/observation-image";
import { ErrorNotice } from "@/components/field/states";
import { ImageComparisonSlider } from "@/components/field/image-comparison-slider";

export function EvidenceWalkthroughPage() {
  const { id = "" } = useParams();
  const issue = useResource((signal) => api.issue(id, signal), [id]);
  const comparisons = useResource((signal) => api.diffs(id, signal), [id]);
  if (issue.error || comparisons.error)
    return (
      <ErrorNotice
        error={(issue.error ?? comparisons.error)!}
        title="Evidence could not be loaded"
      />
    );
  if (!issue.data || !comparisons.data)
    return <p role="status">Loading saved evidence…</p>;
  const data = issue.data,
    observations = data.observations;
  const diff = comparisons.data.items.filter((d) => !d.supersededAt).at(-1);
  const before = observations.find((o) => o.id === diff?.beforeObservationId),
    after = observations.find((o) => o.id === diff?.afterObservationId);
  const reliable =
    diff &&
    !before?.exclusionType &&
    !after?.exclusionType &&
    ["CHANGED", "UNCHANGED"].includes(diff.outcome);
  return (
    <article className="mx-auto max-w-4xl space-y-8">
      <Link
        className="inline-flex min-h-11 items-center underline"
        to={`/app/issues/${data.publicId}`}
      >
        Back to {data.publicId}
      </Link>
      <header className="space-y-3">
        <p className="eyebrow">Read-only evidence walkthrough</p>
        <h1 className="text-3xl font-bold">
          A report, a return visit, and the evidence
        </h1>
        <p>{data.title}</p>
        <p>
          Current status: <strong>{label(data.status)}</strong>. Only a person
          can resolve this issue. This view makes no provider calls.
        </p>
      </header>
      <ol className="space-y-8">
        {observations.map((o, i) => (
          <li key={o.id} className="space-y-3 border-t border-ink pt-5">
            <h2 className="text-xl font-bold">
              {i === 0 ? "Original observation" : `Revisit ${i}`}
            </h2>
            <ObservationImage
              storageKey={o.storageKey}
              alt={`${i === 0 ? "Original" : "Revisit"} photo captured ${formatDateTime(o.capturedAt)}`}
              className="aspect-[4/3] border border-ink"
            />
            <p>
              Captured {formatDateTime(o.capturedAt)} · Uploaded{" "}
              {formatDateTime(o.createdAt)}
            </p>
            <p>{o.note}</p>
            {o.reporterSawNoChange ? <p>Reporter saw no change</p> : null}
            <p>
              <strong>
                {o.exclusionType
                  ? `Excluded: ${label(o.exclusionType)}`
                  : "Eligible for comparison"}
              </strong>
              {o.correctionReason ? ` · ${o.correctionReason}` : ""}
            </p>
            <p className="text-sm">
              Location: {label(o.locationSource)}
              {o.locationSource === "inherited"
                ? ". Inherited coordinates do not independently establish where this photo was taken."
                : ""}
            </p>
            <p className="text-sm">
              Photo analysis: {o.aiAnalysis.model} · {o.aiAnalysis.modelVersion}
            </p>
          </li>
        ))}
      </ol>
      <section className="space-y-4 border-t border-ink pt-5">
        <h2 className="text-xl font-bold">
          What the selected evidence supports
        </h2>
        {diff && before && after ? (
          <>
            <p>
              Before: {formatDateTime(before.capturedAt)} → After:{" "}
              {formatDateTime(after.capturedAt)}
            </p>
            <ImageComparisonSlider
              beforeKey={before.storageKey}
              afterKey={after.storageKey}
              beforeLabel={formatDateTime(before.capturedAt)}
              afterLabel={formatDateTime(after.capturedAt)}
            />
            <h3 className="font-bold">{label(diff.outcome)}</h3>
            <p>{diff.comparabilityReason}</p>
            <p>{diff.summary}</p>
            {!reliable ? (
              <p>
                No reliable improvement, deterioration or unchanged state is
                established. Another view or human review is needed.
              </p>
            ) : null}
            <Link
              className="inline-flex min-h-11 items-center underline"
              to={`/app/issues/${data.publicId}/compare?before=${before.id}&after=${after.id}&comparison=${diff.id}`}
            >
              Inspect comparison and provenance
            </Link>
          </>
        ) : (
          <p>
            No current eligible comparison is saved. A completed comparison or
            repair is not claimed.
          </p>
        )}
        <p>
          Earlier comparisons remain in the report history, including superseded
          results.
        </p>
      </section>
    </article>
  );
}
