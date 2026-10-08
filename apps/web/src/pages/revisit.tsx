import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeftRightIcon, ShieldAlertIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { CaptureButton } from "@/components/field/capture-button";
import { LocationPicker } from "@/components/field/location-picker";
import { ObservationImage } from "@/components/field/observation-image";
import { ProcessingConsent } from "@/components/field/processing-consent";
import { ProgressSteps, type Step } from "@/components/field/progress-steps";
import { ErrorNotice } from "@/components/field/states";
import { useAppConfig } from "@/hooks/use-app-config";
import { useResource } from "@/hooks/use-resource";
import { api, ApiError, newKey, type UploadPhase } from "@/lib/api";
import { formatCoords, type Located } from "@/lib/geo";
import { formatDateTime } from "@/lib/format";
import type { PreparedImage } from "@/lib/image";
import { markVisited } from "@/lib/walk";

const NO_CHANGE = "No visible change since the previous observation.";

type Phase = { kind: "idle" } | { kind: "sending"; step: UploadPhase; fraction?: number } | { kind: "failed"; error: Error };

export function RevisitPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { config } = useAppConfig();
  const issue = useResource((signal) => api.issue(id, signal), [id]);
  const [photo, setPhoto] = useState<PreparedImage | null>(null);
  const [locationMode, setLocationMode] = useState<"inherit" | "here">("inherit");
  const [location, setLocation] = useState<Located | null>(null);
  const [note, setNote] = useState("");
  const [consent, setConsent] = useState(false);
  const [phase, setPhase] = useState<Phase>({ kind: "idle" });
  const attempt = useRef<{ key: string; signature: string; photo: PreparedImage } | null>(null);
  const sending = phase.kind === "sending";

  const signature = useMemo(
    () => JSON.stringify([photo?.blob.size, photo?.width, locationMode, location?.latitude, location?.longitude, note.trim()]),
    [photo, locationMode, location, note],
  );

  useEffect(() => {
    if (!sending) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [sending]);

  if (issue.error) return <ErrorNotice error={issue.error} onRetry={issue.reload} title="This issue could not be loaded" />;
  if (!issue.data)
    return (
      <div className="mx-auto flex max-w-2xl flex-col gap-4">
        <Skeleton className="h-12 w-2/3" />
        <Skeleton className="aspect-[4/3]" />
      </div>
    );

  const data = issue.data;
  const previous = data.observations.at(-1);
  const locationReady = locationMode === "inherit" || !!location;
  const missing = [!photo && "a new photo", !locationReady && "a location", !consent && "consent to analysis"].filter(Boolean) as string[];

  async function send() {
    if (!photo || !locationReady || !consent || sending) return;
    if (attempt.current?.signature !== signature || attempt.current?.photo !== photo) attempt.current = { key: newKey("revisit"), signature, photo };
    const form = new FormData();
    form.set("image", photo.blob, "revisit.jpg");
    if (locationMode === "here" && location) {
      form.set("latitude", String(location.latitude));
      form.set("longitude", String(location.longitude));
      form.set("locationSource", location.source);
    }
    if (note.trim()) form.set("note", note.trim());
    setPhase({ kind: "sending", step: "uploading", fraction: 0 });
    try {
      const result = await api.addObservation(data.publicId, form, attempt.current.key, (step, fraction) =>
        setPhase({ kind: "sending", step, fraction }),
      );
      attempt.current = null;
      markVisited([data.id], result.observation.id);
      const before = previous?.id;
      navigate(
        before
          ? `/app/issues/${data.publicId}/compare?before=${before}&after=${result.observation.id}`
          : `/app/issues/${data.publicId}`,
        { state: { justSaved: true, diffUnavailable: !!result.diffUnavailable } },
      );
    } catch (error) {
      if (error instanceof ApiError && error.code === "IDEMPOTENCY_CONFLICT") attempt.current = null;
      setPhase({ kind: "failed", error: error as Error });
    }
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    void send();
  }

  const steps: Step[] = sending
    ? [
        { label: "New photo prepared and metadata removed", state: "done" },
        {
          label:
            phase.step === "uploading" && phase.fraction !== undefined && phase.fraction < 1
              ? `Uploading photo (${Math.round(phase.fraction * 100)}%)`
              : "Photo uploaded",
          state: phase.step === "uploading" ? "active" : "done",
        },
        { label: "Saving the observation and comparing it with the previous one", state: phase.step === "processing" ? "active" : "waiting" },
      ]
    : [];

  return (
    <form onSubmit={submit} className="mx-auto flex max-w-2xl flex-col gap-8" noValidate>
      <div>
        <p className="eyebrow text-muted-foreground">Revisit</p>
        <h1 className="mt-2 text-3xl leading-tight font-bold uppercase sm:text-5xl">
          <span className="font-mono text-observe-ink">{data.publicId}</span>
          <br />
          {data.title}
        </h1>
      </div>

      {data.status === "REJECTED" ? (
        <Alert variant="destructive">
          <AlertTitle>Rejected issues do not accept observations</AlertTitle>
        </Alert>
      ) : null}

      <section className="flex flex-col gap-3">
        <h2 className="eyebrow">Previous observation</h2>
        <ObservationImage storageKey={previous?.storageKey} alt="Previous observation" className="aspect-[4/3] border border-ink" />
        {previous ? (
          <p className="font-mono text-xs text-muted-foreground">Captured {formatDateTime(previous.capturedAt)}</p>
        ) : null}
        <p className="text-sm text-muted-foreground">
          Try to photograph the same object from a similar spot and angle. A very different viewpoint can make the comparison
          report changes that did not happen.
        </p>
      </section>

      <Alert>
        <ShieldAlertIcon />
        <AlertTitle>No photo is worth a risk</AlertTitle>
        <AlertDescription>If the spot is unsafe or blocked today, skip it. You can always come back.</AlertDescription>
      </Alert>

      <FieldSet disabled={sending}>
        <FieldLegend className="eyebrow">Take a new photo</FieldLegend>
        <CaptureButton value={photo} onChange={setPhoto} prompt="Open camera" disabled={sending} />
      </FieldSet>

      <FieldSet disabled={sending}>
        <FieldLegend className="eyebrow">Location</FieldLegend>
        <RadioGroup value={locationMode} onValueChange={(v) => setLocationMode(v as "inherit" | "here")}>
          <Field orientation="horizontal">
            <RadioGroupItem value="inherit" id="loc-inherit" />
            <FieldLabel htmlFor="loc-inherit" className="font-normal">
              Same spot as the issue ({formatCoords(data)}), recorded as inherited
            </FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <RadioGroupItem value="here" id="loc-here" />
            <FieldLabel htmlFor="loc-here" className="font-normal">
              Record where I am now
            </FieldLabel>
          </Field>
        </RadioGroup>
        {locationMode === "here" ? <LocationPicker value={location} onChange={setLocation} idPrefix="revisit" /> : null}
      </FieldSet>

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="revisit-note" className="eyebrow">
            What changed? <span className="normal-case tracking-normal text-muted-foreground">(optional)</span>
          </FieldLabel>
          <Textarea
            id="revisit-note"
            maxLength={5000}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="The broken slat has been replaced…"
            disabled={sending}
          />
        </Field>
        <Field orientation="horizontal">
          <Checkbox
            id="no-change"
            checked={note === NO_CHANGE}
            onCheckedChange={(v) => setNote(v === true ? NO_CHANGE : "")}
            disabled={sending}
          />
          <FieldLabel htmlFor="no-change" className="font-normal">
            Nothing seems to have changed
          </FieldLabel>
        </Field>
        <FieldDescription>Saying nothing changed is useful evidence too.</FieldDescription>
      </FieldGroup>

      <ProcessingConsent id="revisit-consent" checked={consent} onChange={setConsent} config={config} />

      {sending ? <ProgressSteps title="Saving your revisit" steps={steps} /> : null}
      {phase.kind === "failed" ? (
        <ErrorNotice
          error={phase.error}
          title="The revisit was not saved"
          onRetry={phase.error instanceof ApiError && phase.error.code === "IDEMPOTENCY_CONFLICT" ? undefined : send}
        />
      ) : null}

      <div className="flex flex-col gap-2">
        <Button type="submit" size="lg" className="h-14 text-base" disabled={missing.length > 0 || sending || data.status === "REJECTED"}>
          <ArrowLeftRightIcon data-icon="inline-start" />
          {sending ? "Saving…" : phase.kind === "failed" ? "Retry" : "Save and compare observations"}
        </Button>
        {missing.length && !sending ? (
          <p className="text-center text-sm text-muted-foreground">Still needed: {missing.join(", ")}.</p>
        ) : null}
      </div>
    </form>
  );
}
