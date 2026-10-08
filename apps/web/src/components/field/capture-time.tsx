import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function captureTimeValid(value: string) {
  return !value || (Number.isFinite(new Date(value).getTime()) && new Date(value).getTime() <= Date.now());
}

export function CaptureTime({ value, onChange, disabled }: { value: string; onChange: (value: string) => void; disabled: boolean }) {
  const valid = captureTimeValid(value);
  return <Field>
    <FieldLabel htmlFor="capture-time">When was this photo taken? (optional)</FieldLabel>
    <Input id="capture-time" type="datetime-local" value={value} onInput={e => onChange(e.currentTarget.value)} onChange={e => onChange(e.target.value)} onBlur={e => onChange(e.currentTarget.value)} disabled={disabled} aria-invalid={!valid} aria-describedby="capture-time-hint" />
    <FieldDescription id="capture-time-hint">Use your local time if you know it. Otherwise, leave this blank: the record will say “upload time”, not claim a capture date.</FieldDescription>
    {!valid ? <p role="alert" className="text-sm text-destructive">Choose a valid time that is not in the future.</p> : null}
  </Field>;
}
