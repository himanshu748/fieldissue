import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { ErrorNotice } from "./states";
import { api } from "@/lib/api";
import type { Observation } from "@/lib/types";

export function ObservationCorrection({
  issueId,
  observation,
  onSaved,
}: {
  issueId: string;
  observation: Observation;
  onSaved: () => void;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("WRONG_LOCATION");
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<Error>();
  const restoring = !!observation.exclusionType;
  async function save() {
    setBusy(true);
    setError(undefined);
    try {
      await api.correctObservation(issueId, observation.id, {
        exclusionType: restoring
          ? null
          : (type as NonNullable<Observation["exclusionType"]>),
        reason,
      });
      onSaved();
      setOpen(false);
    } catch (e) {
      setError(e as Error);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <Button
        variant="outline"
        className="min-h-11 self-start"
        onClick={() => setOpen(true)}
      >
        {restoring ? "Restore observation" : "Mark incorrect observation"}
      </Button>
      <AlertDialog
        open={open}
        onOpenChange={(v) => {
          if (!busy) setOpen(v);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {restoring ? "Restore observation?" : "Exclude this observation?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              The original photo, timestamps and AI output stay in history. This
              correction is audited. Earlier comparisons remain superseded; run
              a new comparison with eligible evidence. Issue status will not
              change.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {!restoring ? (
            <label htmlFor={`${id}-type`} className="space-y-2">
              Correction type
              <select
                id={`${id}-type`}
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="mt-2 min-h-11 w-full border border-ink bg-paper px-3"
              >
                <option value="WRONG_LOCATION">Wrong location</option>
                <option value="WRONG_PHOTOGRAPH">Wrong photograph</option>
                <option value="NOT_SUITABLE">
                  Not suitable for comparison
                </option>
              </select>
            </label>
          ) : null}
          <label htmlFor={`${id}-reason`}>
            Correction reason (optional)
            <Textarea
              id={`${id}-reason`}
              value={reason}
              maxLength={1000}
              onChange={(e) => setReason(e.target.value)}
            />
          </label>
          {error ? (
            <ErrorNotice error={error} title="Correction not saved" />
          ) : null}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={busy}>Cancel</AlertDialogCancel>
            <Button onClick={save} disabled={busy}>
              {busy
                ? "Saving…"
                : restoring
                  ? "Confirm restoration"
                  : "Confirm exclusion"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
