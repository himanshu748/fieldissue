import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { ArrowLeftIcon, CheckCircle2Icon, InfoIcon } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { Button } from "@/components/ui/button";
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { IssueStatus } from "@/components/field/issue-status";
import { ObservationImage } from "@/components/field/observation-image";
import { EmptyState, ErrorNotice } from "@/components/field/states";
import { useResource } from "@/hooks/use-resource";
import { api, ApiError } from "@/lib/api";
import { formatDateTime, label } from "@/lib/format";

type Basis = "latest_observation" | "manual_confirmation";

export function ResolvePage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const issue = useResource((signal) => api.issue(id, signal), [id]);
  const diffs = useResource((signal) => api.diffs(id, signal), [id]);
  const [basis, setBasis] = useState<Basis>("latest_observation");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<Error>();

  if (issue.error) return <ErrorNotice error={issue.error} onRetry={issue.reload} title="This issue could not be loaded" />;
  if (!issue.data)
    return (
      <div className="mx-auto flex max-w-2xl flex-col gap-4">
        <Skeleton className="h-12 w-2/3" />
        <Skeleton className="aspect-[4/3]" />
      </div>
    );

  const data = issue.data;
  if (data.permissions?.manage === false) return <EmptyState icon={<InfoIcon />} title="Resolution belongs to the reporter" description="Open the browser that created this report to resolve or reopen it. You can still contribute a fresh revisit photo from this browser."><Button asChild><Link to={`/app/issues/${data.publicId}/revisit`}>Add a revisit</Link></Button></EmptyState>;
  const latest = data.observations.at(-1);
  const latestDiff = diffs.data?.items.filter((d) => d.afterObservationId === latest?.id).at(-1);
  const repeatedPhoto = latestDiff?.model === "fieldissue-image-identity";
  const hasRevisit = data.observations.length > 1;

  if (data.status === "RESOLVED" || data.status === "REJECTED")
    return (
      <EmptyState
        icon={<InfoIcon />}
        title={`This issue is already ${label(data.status).toLowerCase()}`}
        description="Resolution can only be recorded on an active issue. A resolved issue can be reopened from its record."
      >
        <Button asChild>
          <Link to={`/app/issues/${data.publicId}`}>Open record</Link>
        </Button>
      </EmptyState>
    );

  async function confirm() {
    setBusy(true);
    setError(undefined);
    try {
      await api.resolve(data.publicId, {
        note: note.trim(),
        basis,
        ...(basis === "latest_observation" && latest ? { observationId: latest.id } : {}),
      });
      toast.success(`${data.publicId} marked resolved by a person.`);
      navigate(`/app/issues/${data.publicId}`);
    } catch (e) {
      setError(e as Error);
      if (e instanceof ApiError && e.code === "EVIDENCE_CHANGED") issue.reload();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8">
      <div>
        <Link to={`/app/issues/${data.publicId}`} className="inline-flex min-h-11 items-center gap-2 font-mono text-sm text-observe-ink">
          <ArrowLeftIcon aria-hidden className="size-4" />
          {data.publicId}
        </Link>
        <h1 className="mt-1 text-3xl leading-tight font-bold uppercase sm:text-5xl">Resolve issue?</h1>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <span className="text-lg">{data.title}</span>
          <IssueStatus status={data.status} />
        </div>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="eyebrow">Latest observation</h2>
        <ObservationImage storageKey={latest?.storageKey} alt="Latest observation" className="aspect-[4/3] border border-ink" />
        {latest ? <p className="font-mono text-xs text-muted-foreground">Captured {formatDateTime(latest.capturedAt)}</p> : null}
        {latestDiff && !repeatedPhoto ? (
          <p className="text-sm text-muted-foreground">
            The latest comparison suggested <strong className="text-ink">{label(latestDiff.recommendedStatus)}</strong>. That is
            advisory; your decision is what counts.
          </p>
        ) : null}
      </section>

      {repeatedPhoto ? <Alert><InfoIcon /><AlertTitle>The latest photo repeats earlier evidence</AlertTitle><AlertDescription>Take a fresh photo before confirming from visual evidence, or explicitly choose manual confirmation without new evidence.</AlertDescription></Alert> : null}
      <FieldSet>
        <FieldLegend className="eyebrow">Resolution basis</FieldLegend>
        <RadioGroup value={basis} onValueChange={(v) => setBasis(v as Basis)}>
          <Field orientation="horizontal" className="items-start border border-border bg-surface p-4">
            <RadioGroupItem value="latest_observation" id="basis-latest" disabled={!latest || repeatedPhoto} className="mt-0.5" />
            <FieldContent>
              <FieldLabel htmlFor="basis-latest">Verified from the latest observation</FieldLabel>
              <FieldDescription>
                {repeatedPhoto ? "This file repeats an earlier photo. Add a fresh revisit for new visual evidence." : hasRevisit
                  ? "The photo above shows the problem is fixed. It is linked to this decision."
                  : "Only the original photo exists. Consider adding a revisit first."}
              </FieldDescription>
            </FieldContent>
          </Field>
          <Field orientation="horizontal" className="items-start border border-border bg-surface p-4">
            <RadioGroupItem value="manual_confirmation" id="basis-manual" className="mt-0.5" />
            <FieldContent>
              <FieldLabel htmlFor="basis-manual">Manually recorded without new evidence</FieldLabel>
              <FieldDescription>For example, an official notice said it was fixed. The record will say no photo supports it.</FieldDescription>
            </FieldContent>
          </Field>
        </RadioGroup>
      </FieldSet>

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="resolution-note" className="eyebrow">
            Resolution note
          </FieldLabel>
          <Textarea
            id="resolution-note"
            maxLength={5000}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="The damaged section appears repaired."
          />
          <FieldDescription>Kept in the issue history. Reopening later never deletes it.</FieldDescription>
        </Field>
      </FieldGroup>

      <Alert>
        <InfoIcon />
        <AlertTitle>Human-confirmed, not identity-verified</AlertTitle>
        <AlertDescription>
          The record confirms a human decision, not a verified identity. Guest controls belong to the browser that created the report.
        </AlertDescription>
      </Alert>

      {error ? <ErrorNotice error={error} title="Resolution was not recorded" /> : null}

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button size="lg" className="h-14 text-base" disabled={busy || (basis === "latest_observation" && repeatedPhoto)}>
            {busy ? <Spinner data-icon="inline-start" /> : <CheckCircle2Icon data-icon="inline-start" />}
            Confirm resolution
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mark {data.publicId} resolved?</AlertDialogTitle>
            <AlertDialogDescription>
              {basis === "latest_observation"
                ? "You are confirming that the latest photo shows the problem is fixed."
                : "You are recording a resolution without new photographic evidence."}{" "}
              All evidence stays in the history and the issue can be reopened.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirm}>Yes, I confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
