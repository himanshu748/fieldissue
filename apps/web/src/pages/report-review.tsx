import { useEffect, useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router";
import { ArrowRightIcon, CheckIcon, CopyIcon, PencilIcon } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { ModelProvenance } from "@/components/field/model-provenance";
import { ObservationImage } from "@/components/field/observation-image";
import { EmptyState, ErrorNotice } from "@/components/field/states";
import { useResource } from "@/hooks/use-resource";
import { api } from "@/lib/api";
import { label } from "@/lib/format";
import { CATEGORIES, SEVERITIES, type Category, type NearbyIssue, type Severity } from "@/lib/types";

function ConditionList({ title, items }: { title: string; items?: string[] }) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="eyebrow text-muted-foreground">{title}</h3>
      {items?.length ? (
        <ul className="flex flex-col gap-1.5">
          {items.map((c) => (
            <li key={c} className="flex gap-2">
              <CheckIcon aria-hidden className="mt-1 size-4 shrink-0 text-grass" />
              {c}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">None reported.</p>
      )}
    </div>
  );
}

export function ReportReviewPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const issueId = params.get("issue");
  const routeState = useLocation().state as { nearbyIssues?: NearbyIssue[]; replayed?: boolean } | null;
  const issue = useResource(issueId ? (signal) => api.issue(issueId, signal) : null, [issueId]);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<{ title: string; category: Category; severity: Severity } | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<Error>();

  useEffect(() => {
    if (issue.data) setDraft({ title: issue.data.title, category: issue.data.category, severity: issue.data.severity });
  }, [issue.data]);

  if (!issueId)
    return (
      <EmptyState icon={<PencilIcon />} title="Nothing to review" description="Start by reporting an observation.">
        <Button asChild>
          <Link to="/app/report">Report an issue</Link>
        </Button>
      </EmptyState>
    );
  if (issue.error) return <ErrorNotice error={issue.error} onRetry={issue.reload} title="The new issue could not be loaded" />;
  if (!issue.data || !draft)
    return (
      <div className="mx-auto flex max-w-3xl flex-col gap-4">
        <Skeleton className="h-12 w-2/3" />
        <Skeleton className="h-72" />
      </div>
    );

  const data = issue.data;
  const first = data.observations[0];
  const analysis = first?.aiAnalysis ?? {};
  const nearby = (routeState?.nearbyIssues ?? []).filter((n) => n.id !== data.id);

  async function save(event: FormEvent) {
    event.preventDefault();
    if (!draft) return;
    const patch: Record<string, string> = {};
    if (draft.title.trim() && draft.title.trim() !== data.title) patch.title = draft.title.trim();
    if (draft.category !== data.category) patch.category = draft.category;
    if (draft.severity !== data.severity) patch.severity = draft.severity;
    if (!Object.keys(patch).length) {
      setEditing(false);
      return;
    }
    setSaving(true);
    setSaveError(undefined);
    try {
      await api.patch(data.publicId, patch);
      toast.success("Corrections saved. The original model analysis is kept unchanged.");
      setEditing(false);
      issue.reload();
    } catch (e) {
      setSaveError(e as Error);
    } finally {
      setSaving(false);
    }
  }

  const corrected = {
    category: !!analysis.suggestedCategory && analysis.suggestedCategory !== data.category,
    severity: !!analysis.suggestedSeverity && analysis.suggestedSeverity !== data.severity,
  };

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-muted-foreground">
            {routeState?.replayed ? "Already saved earlier" : "Observation analyzed"} · <span className="text-observe-ink">{data.publicId}</span>
          </p>
          <h1 className="mt-2 text-3xl leading-tight font-bold uppercase sm:text-4xl">Check what the model saw</h1>
        </div>
        <span className="font-mono text-sm text-muted-foreground">02 / 02</span>
      </div>

      <Alert>
        <CheckIcon />
        <AlertTitle>Issue {data.publicId} is saved</AlertTitle>
        <AlertDescription>
          This deployment creates the issue in one step, then lets you correct its title, category and severity. Those
          corrections are recorded as human edits. The model's objects and conditions stay exactly as recorded with the photo.
        </AlertDescription>
      </Alert>

      {nearby.length ? (
        <Alert>
          <CopyIcon />
          <AlertTitle>This may already have been reported</AlertTitle>
          <AlertDescription>
            <p>Open issues within about 100 m. Histories are never merged automatically.</p>
            <ul className="mt-2 flex flex-col gap-1">
              {nearby.map((n) => (
                <li key={n.id}>
                  <Link className="underline" to={`/app/issues/${n.publicId}`}>
                    {n.publicId} · {n.title}
                  </Link>
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-6 md:grid-cols-[1fr_1.1fr]">
        <ObservationImage storageKey={first?.storageKey} alt="Your submitted photo" className="aspect-[4/3] border border-ink" />
        <Card>
          <CardHeader>
            <CardTitle>Model suggestions</CardTitle>
            <CardDescription>As recorded by the model. This analysis is immutable evidence; correct the classification below.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="eyebrow text-muted-foreground">Category</dt>
                <dd className="mt-1 text-lg font-semibold">{analysis.suggestedCategory ? label(analysis.suggestedCategory) : "Not given"}</dd>
              </div>
              <div>
                <dt className="eyebrow text-muted-foreground">Suggested severity</dt>
                <dd className="mt-1 text-lg font-semibold">{analysis.suggestedSeverity ? label(analysis.suggestedSeverity) : "Not given"}</dd>
              </div>
            </dl>
            <ConditionList title="Visible conditions" items={analysis.conditions} />
            <ConditionList title="Objects" items={analysis.objects} />
          </CardContent>
        </Card>
      </div>

      {analysis.evidence?.length ? (
        <section className="flex flex-col gap-2">
          <h2 className="eyebrow text-muted-foreground">Evidence the model cited</h2>
          <ul className="flex flex-wrap gap-2">
            {analysis.evidence.map((e) => (
              <Badge key={e} variant="outline" className="h-auto py-1 text-sm whitespace-normal">
                {e}
              </Badge>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="border border-border bg-surface p-4">
        <h2 className="eyebrow mb-3 text-muted-foreground">AI model</h2>
        <ModelProvenance model={analysis.model} modelVersion={analysis.modelVersion} confidence={analysis.confidence} at={first?.createdAt} />
      </section>

      <Card>
        <form onSubmit={save}>
          <CardHeader>
            <CardTitle>Issue details</CardTitle>
            <CardDescription>
              {corrected.category || corrected.severity ? "Already corrected by a person." : "Currently matches the model's suggestion."}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="review-title">Title</FieldLabel>
                <Input
                  id="review-title"
                  value={draft.title}
                  maxLength={200}
                  disabled={!editing}
                  onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="review-category">Category</FieldLabel>
                  <Select value={draft.category} onValueChange={(v) => setDraft({ ...draft, category: v as Category })} disabled={!editing}>
                    <SelectTrigger id="review-category" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {CATEGORIES.map((c) => (
                          <SelectItem key={c} value={c}>
                            {label(c)}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel htmlFor="review-severity">Severity</FieldLabel>
                  <Select value={draft.severity} onValueChange={(v) => setDraft({ ...draft, severity: v as Severity })} disabled={!editing}>
                    <SelectTrigger id="review-severity" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {SEVERITIES.map((s) => (
                          <SelectItem key={s} value={s}>
                            {label(s)}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FieldDescription>Advisory only, not a safety inspection.</FieldDescription>
                </Field>
              </div>
            </FieldGroup>
            {saveError ? (
              <div className="mt-4">
                <ErrorNotice error={saveError} title="Corrections were not saved" />
              </div>
            ) : null}
          </CardContent>
          <CardFooter className="mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            {editing ? (
              <>
                <Button type="button" variant="ghost" onClick={() => setEditing(false)} disabled={saving}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? <Spinner data-icon="inline-start" /> : null}
                  Save corrections
                </Button>
              </>
            ) : (
              <>
                <Button type="button" variant="outline" onClick={() => setEditing(true)}>
                  <PencilIcon data-icon="inline-start" />
                  Edit details
                </Button>
                <Button type="button" onClick={() => navigate(`/app/issues/${data.publicId}`)}>
                  Open issue record
                  <ArrowRightIcon data-icon="inline-end" />
                </Button>
              </>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
