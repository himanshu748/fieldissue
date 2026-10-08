import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldContent, FieldDescription, FieldLabel } from "@/components/ui/field";
import type { AppConfig } from "@/lib/types";

export function ProcessingConsent({
  id,
  checked,
  onChange,
  config,
}: {
  id: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  config?: AppConfig;
}) {
  return (
    <Field orientation="horizontal" className="items-start border border-border bg-surface p-4">
      <Checkbox id={id} checked={checked} onCheckedChange={(v) => onChange(v === true)} className="mt-0.5 size-5" />
      <FieldContent>
        <FieldLabel htmlFor={id} className="font-medium">
          Send this photo and note for AI analysis
        </FieldLabel>
        <FieldDescription>
          {config?.mock
            ? "This deployment runs a development fixture instead of a live model, so nothing leaves the server."
            : "The image and note go to this deployment's analysis service, which sends them to the Gemma endpoint the operator configured (often a third-party host). Avoid faces, number plates and private homes where you can."}{" "}
          The model only suggests. A person decides every status change.
          {config?.retentionNotice ? ` ${config.retentionNotice}` : ""}
        </FieldDescription>
      </FieldContent>
    </Field>
  );
}
