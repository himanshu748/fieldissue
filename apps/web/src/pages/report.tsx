import { useCaptureDraft } from "@/hooks/use-capture-draft";
import { CaptureTime, captureTimeValid } from "@/components/field/capture-time";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { ShieldAlertIcon, SparklesIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { CaptureButton } from "@/components/field/capture-button";
import { LocationPicker } from "@/components/field/location-picker";
import { ProcessingConsent } from "@/components/field/processing-consent";
import { ProgressSteps, type Step } from "@/components/field/progress-steps";
import { ErrorNotice } from "@/components/field/states";
import { useAppConfig } from "@/hooks/use-app-config";
import { api, ApiError, newKey, type UploadPhase } from "@/lib/api";
import { recallLocation, type Located } from "@/lib/geo";
import type { PreparedImage } from "@/lib/image";

type Phase = { kind: "idle" } | { kind: "sending"; step: UploadPhase; fraction?: number } | { kind: "failed"; error: Error };

export function ReportPage() {
  const navigate = useNavigate();
  const { config } = useAppConfig();
  const { draft, setDraft, clear: clearDraft, notice: draftNotice, persist } = useCaptureDraft("report", { photo: null, location: recallLocation(), locationMode: "inherit", note: "", capturedAt: "" });
  const { photo, location, note, capturedAt } = draft;
  const setPhoto = (photo: PreparedImage | null) => setDraft(d => ({ ...d, photo }));
  const setLocation = (location: Located | null) => setDraft(d => ({ ...d, location }));
  const setNote = (note: string) => setDraft(d => ({ ...d, note }));
  const setCapturedAt = (capturedAt: string) => setDraft(d => ({ ...d, capturedAt }));
  const [consent, setConsent] = useState(false);
  const [phase, setPhase] = useState<Phase>({ kind: "idle" });
  // One idempotency key per exact set of inputs: a retry after a dropped
  // connection replays the same request instead of creating a duplicate.
  const attempt = useRef<{ key: string; signature: string; photo: PreparedImage } | null>(draft.attempt && photo ? { ...draft.attempt, photo } : null);
  const sending = phase.kind === "sending";

  const signature = useMemo(
    () => JSON.stringify([photo?.blob.size, photo?.width, location?.latitude, location?.longitude, location?.source, note.trim(), capturedAt]),
    [photo, location, note, capturedAt],
  );

  useEffect(() => {
    if (!sending) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [sending]);

  const missing = [!photo && "a photo", !location && "a location", !consent && "consent to analysis", !captureTimeValid(capturedAt) && "a valid capture time"].filter(Boolean) as string[];

  function submit(event: FormEvent) {
    event.preventDefault();
    void send();
  }

  async function send() {
    if (!photo || !location || !consent || !captureTimeValid(capturedAt) || sending) return;
    if (attempt.current?.signature !== signature || attempt.current?.photo !== photo) attempt.current = { key: newKey("create"), signature, photo };
    setPhase({ kind: "sending", step: "uploading", fraction: 0 });
    const nextDraft = { ...draft, attempt: { key: attempt.current!.key, signature } };
    setDraft(nextDraft);
    await persist(nextDraft);
    const form = new FormData();
    form.set("image", photo.blob, "observation.jpg");
    form.set("latitude", String(location.latitude));
    form.set("longitude", String(location.longitude));
    form.set("locationSource", location.source);
    if (note.trim()) form.set("note", note.trim());
    if (capturedAt) form.set("capturedAt", new Date(capturedAt).toISOString());
    setPhase({ kind: "sending", step: "uploading", fraction: 0 });
    try {
      const result = await api.createIssue(form, attempt.current.key, (step, fraction) =>
        setPhase({ kind: "sending", step, fraction }),
      );
      clearDraft();
      attempt.current = null;
      navigate(`/app/report/review?issue=${encodeURIComponent(result.publicId)}`, {
        state: { nearbyIssues: result.nearbyIssues ?? [], replayed: !!result.replayed },
      });
    } catch (error) {
      if (error instanceof ApiError && error.code === "IDEMPOTENCY_CONFLICT") { attempt.current = null; setDraft(d => ({ ...d, attempt: undefined })); }
      setPhase({ kind: "failed", error: error as Error });
    }
  }

  const steps: Step[] = sending
    ? [
        { label: "Photo prepared and metadata removed", state: "done" },
        {
          label:
            phase.step === "uploading" && phase.fraction !== undefined && phase.fraction < 1
              ? `Uploading photo (${Math.round(phase.fraction * 100)}%)`
              : "Photo uploaded",
          state: phase.step === "uploading" ? "active" : "done",
        },
        { label: "Examining visible conditions and preparing the issue", state: phase.step === "processing" ? "active" : "waiting" },
      ]
    : [];

  return (
    <form onSubmit={submit} className="mx-auto flex max-w-2xl flex-col gap-8" noValidate>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-muted-foreground">Report an issue</p>
          <h1 className="mt-2 text-3xl leading-tight font-bold uppercase sm:text-5xl">What did you notice?</h1>
        </div>
        <span className="font-mono text-sm text-muted-foreground">01 / 02</span>
      </div>

      <Alert>
        <ShieldAlertIcon />
        <AlertTitle>Stay safe first</AlertTitle>
        <AlertDescription>
          Photograph from where you already are. For exposed wiring, open manholes or anything dangerous, keep your distance
          and contact local emergency or municipal services.
        </AlertDescription>
      </Alert>

      <p role="status" className="text-sm text-muted-foreground">{draftNotice}</p>

      <FieldSet disabled={sending}>
        <FieldLegend className="eyebrow">Photo</FieldLegend>
        <CaptureButton value={photo} onChange={setPhoto} disabled={sending} />
      </FieldSet>

      <FieldSet disabled={sending}>
        <FieldLegend className="eyebrow">Location</FieldLegend>
        <FieldDescription>Stored exactly as given and shown with its source. Use the spot where the problem is.</FieldDescription>
        <LocationPicker value={location} onChange={setLocation} idPrefix="report" />
      </FieldSet>

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="report-note" className="eyebrow">
            Add a note <span className="normal-case tracking-normal text-muted-foreground">(optional)</span>
          </FieldLabel>
          <Textarea
            id="report-note"
            placeholder="Bench seat is damaged…"
            maxLength={5000}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            disabled={sending}
          />
          <FieldDescription>One sentence is enough. Don't include names or personal details.</FieldDescription>
        </Field>
      </FieldGroup>

      <CaptureTime value={capturedAt} onChange={setCapturedAt} disabled={sending} />

      <ProcessingConsent id="report-consent" checked={consent} onChange={setConsent} config={config} />

      {sending ? <ProgressSteps title="Reading your observation" steps={steps} /> : null}
      {phase.kind === "failed" ? (
        <ErrorNotice
          error={phase.error}
          title="The issue was not created"
          onRetry={phase.error instanceof ApiError && phase.error.code === "IDEMPOTENCY_CONFLICT" ? undefined : send}
        />
      ) : null}

      <div className="flex flex-col gap-2">
        <Button type="submit" size="lg" className="h-14 text-base" disabled={missing.length > 0 || sending}>
          <SparklesIcon data-icon="inline-start" />
          {sending ? "Analyzing…" : phase.kind === "failed" ? "Retry analysis" : "Analyze observation"}
        </Button>
        {missing.length && !sending ? (
          <p className="text-center text-sm text-muted-foreground">Still needed: {missing.join(", ")}.</p>
        ) : null}
      </div>
    </form>
  );
}
