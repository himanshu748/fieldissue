import { SaveOffline } from "@/components/field/save-offline";
import { useCaptureDraft } from "@/hooks/use-capture-draft";
import { CaptureTime, captureTimeValid } from "@/components/field/capture-time";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeftRightIcon, ShieldAlertIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
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


type Phase = { kind: "idle" } | { kind: "sending"; step: UploadPhase; fraction?: number } | { kind: "failed"; error: Error };

export function RevisitPage() {
  const { id = "" } = useParams();
  return <RevisitForm key={id} id={id} />;
}

function RevisitForm({ id }: { id: string }) {
  const navigate = useNavigate();
  const { config } = useAppConfig();
  const issue = useResource((signal) => api.issue(id, signal), [id]);
  const { draft, setDraft, clear: clearDraft, notice: draftNotice, persist } = useCaptureDraft(`revisit:${id}`, { photo: null, location: null, locationMode: "here", note: "", capturedAt: "", reporterSawNoChange: false });
  const { photo, location, locationMode, note, capturedAt, reporterSawNoChange = false } = draft;
  const setPhoto = (photo: PreparedImage | null) => setDraft(d => ({ ...d, photo }));
  const setLocation = (location: Located | null) => setDraft(d => ({ ...d, location }));
  const setReporterSawNoChange = (reporterSawNoChange: boolean) => setDraft(d => ({ ...d, reporterSawNoChange }));
  const setNote = (note: string) => setDraft(d => ({ ...d, note }));
  const setCapturedAt = (capturedAt: string) => setDraft(d => ({ ...d, capturedAt }));
  const setLocationMode = (locationMode: "inherit" | "here") => setDraft(d => ({ ...d, locationMode }));
  const [consent, setConsent] = useState(false);
  const [phase, setPhase] = useState<Phase>({ kind: "idle" });
  const attempt = useRef<{ key: string; signature: string; photo: PreparedImage } | null>(draft.attempt && photo ? { ...draft.attempt, photo } : null);
  const sending = phase.kind === "sending";

  const signature = useMemo(
    () => JSON.stringify([photo?.fingerprint, photo?.blob.size, photo?.width, locationMode, location?.latitude, location?.longitude, note.trim(), capturedAt, reporterSawNoChange]),
    [photo, locationMode, location, note, capturedAt, reporterSawNoChange],
  );

  useEffect(() => {
    if (!sending) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [sending]);

  if (issue.error instanceof ApiError && issue.error.status===0 && config?.publicAccess && /^FI-\d{6,}$/.test(id)) return <div className="mx-auto max-w-2xl space-y-6"><h1 className="text-3xl font-bold">Save an offline revisit</h1><p>The previous evidence for {id} needs a connection. Confirm the issue ID before saving. Record your current location, or explicitly choose the issue’s saved location.</p><CaptureButton value={photo} onChange={setPhoto}/><RadioGroup value={locationMode} onValueChange={v=>setLocationMode(v as "here"|"inherit")}><Field orientation="horizontal"><RadioGroupItem value="here" id="offline-loc-here"/><FieldLabel htmlFor="offline-loc-here">Record my current location</FieldLabel></Field><Field orientation="horizontal"><RadioGroupItem value="inherit" id="offline-loc-inherit"/><FieldLabel htmlFor="offline-loc-inherit">Reuse the issue’s location; not a fresh GPS reading</FieldLabel></Field></RadioGroup>{locationMode==="here"?<LocationPicker value={location} onChange={setLocation} idPrefix="offline-revisit" allowReuse={false}/>:null}<label className="block">Your observation<Textarea value={note} maxLength={5000} onChange={e=>setNote(e.target.value)}/></label><ReporterAssessment checked={reporterSawNoChange} onChange={setReporterSawNoChange}/><CaptureTime value={capturedAt} onChange={setCapturedAt} disabled={false}/><SaveOffline key={signature} signature={signature} issueId={id} draft={draft} onSaved={key=>{if(photo){attempt.current={key,signature,photo};setDraft(d=>({...d,attempt:{key,signature}}));}}}/><Button variant="outline" onClick={issue.reload}>Check connection</Button></div>;
  if (issue.error) return <ErrorNotice error={issue.error} onRetry={issue.reload} title="This issue could not be loaded" />;
  if (!issue.data)
    return (
      <div className="mx-auto flex max-w-2xl flex-col gap-4">
        <Skeleton className="h-12 w-2/3" />
        <Skeleton className="aspect-[4/3]" />
      </div>
    );

  const data = issue.data;
  const previous = data.observations.filter(o=>!o.exclusionType).at(-1);
  const locationReady = locationMode === "inherit" || !!location;
  const missing = [!photo && "a new photo", !locationReady && "a location", !consent && "consent to analysis", !captureTimeValid(capturedAt) && "a valid capture time"].filter(Boolean) as string[];

  async function send() {
    if (!photo || !locationReady || !consent || !captureTimeValid(capturedAt) || sending) return;
    if (attempt.current?.signature !== signature || attempt.current?.photo !== photo) attempt.current = { key: newKey("revisit"), signature, photo };
    setPhase({ kind: "sending", step: "uploading", fraction: 0 });
    const nextDraft = { ...draft, attempt: { key: attempt.current!.key, signature } };
    setDraft(nextDraft);
    await persist(nextDraft);
    const form = new FormData();
    if (config?.publicAccess && consent) form.set("publicConsent", "true");
    form.set("image", photo.blob, "revisit.jpg");
    if (locationMode === "here" && location) {
      form.set("latitude", String(location.latitude));
      form.set("longitude", String(location.longitude));
      form.set("locationSource", location.source);
    }
    if (note.trim()) form.set("note", note.trim());
    form.set("reporterSawNoChange", String(reporterSawNoChange));
    if (capturedAt) form.set("capturedAt", new Date(capturedAt).toISOString());
    setPhase({ kind: "sending", step: "uploading", fraction: 0 });
    try {
      const result = await api.addObservation(data.publicId, form, attempt.current.key, (step, fraction) =>
        setPhase({ kind: "sending", step, fraction }),
      );
      clearDraft();
      attempt.current = null;
      markVisited([data.id], result.observation.id);
      const before = result.realWorldDiff?.beforeObservationId ?? previous?.id;
      navigate(
        before
          ? `/app/issues/${data.publicId}/compare?before=${before}&after=${result.observation.id}`
          : `/app/issues/${data.publicId}`,
        { state: { justSaved: true, diffUnavailable: !!result.diffUnavailable } },
      );
    } catch (error) {
      if (error instanceof ApiError && error.code === "IDEMPOTENCY_CONFLICT") { attempt.current = null; setDraft(d => ({ ...d, attempt: undefined })); }
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

      <p role="status" className="text-sm text-muted-foreground">{draftNotice}</p>

      <FieldSet disabled={sending}>
        <FieldLegend className="eyebrow">Take a new photo</FieldLegend>
        <details className="border border-ink p-3"><summary className="min-h-11 cursor-pointer py-2">Show original photo for framing</summary><ObservationImage storageKey={data.observations[0]?.storageKey} alt="Original photo reference for matching the viewing angle" className="max-w-sm aspect-[4/3]"/><p className="text-sm">Match the same subject and angle where possible. A different tree or inherited coordinates cannot establish a revisit.</p></details>
      <CaptureButton value={photo} onChange={setPhoto} prompt="Open camera" disabled={sending} />
      </FieldSet>

      <FieldSet disabled={sending}>
        <FieldLegend className="eyebrow">Location</FieldLegend>
        <RadioGroup value={locationMode} onValueChange={(v) => setLocationMode(v as "inherit" | "here")}>
          <Field orientation="horizontal">
            <RadioGroupItem value="inherit" id="loc-inherit" />
            <FieldLabel htmlFor="loc-inherit" className="font-normal">
              Reuse the issue’s location ({formatCoords(data)}); not a fresh GPS reading
            </FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <RadioGroupItem value="here" id="loc-here" />
            <FieldLabel htmlFor="loc-here" className="font-normal">
              Record my current location (recommended)
            </FieldLabel>
          </Field>
        </RadioGroup>
        {locationMode === "here" ? <LocationPicker value={location} onChange={setLocation} idPrefix="revisit" allowReuse={false} /> : null}
      </FieldSet>

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="revisit-note" className="eyebrow">
            What do you see? <span className="normal-case tracking-normal text-muted-foreground">(optional)</span>
          </FieldLabel>
          <Textarea
            id="revisit-note"
            maxLength={5000}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Describe what is visible, or leave this blank."
            disabled={sending}
          />
        </Field>
        <FieldDescription>Your note is a personal observation. The comparison must be supported by the photos.</FieldDescription>
      </FieldGroup>

      <ReporterAssessment checked={reporterSawNoChange} onChange={setReporterSawNoChange} disabled={sending} />

      <CaptureTime value={capturedAt} onChange={setCapturedAt} disabled={sending} />

      <SaveOffline key={signature} signature={signature} onSaved={key=>{if(photo){attempt.current={key,signature,photo};setDraft(d=>({...d,attempt:{key,signature}}));}}} draft={draft} issueId={id} disabled={sending} />
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

function ReporterAssessment({ checked, onChange, disabled = false }: { checked: boolean; onChange: (value: boolean) => void; disabled?: boolean }) {
  return <FieldGroup>
    <Field orientation="horizontal">
      <Checkbox id="reporter-no-change" checked={checked} onCheckedChange={v => onChange(v === true)} disabled={disabled} aria-describedby="reporter-no-change-help" />
      <FieldLabel htmlFor="reporter-no-change">Reporter saw no change</FieldLabel>
    </Field>
    <FieldDescription id="reporter-no-change-help">Optional personal assessment. Saved separately and not sent to the vision model.</FieldDescription>
  </FieldGroup>;
}
