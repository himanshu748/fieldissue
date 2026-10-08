import { CpuIcon, FlaskConicalIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function isFixtureModel(model?: string) {
  return !!model && /fixture|mock/i.test(model);
}

export function ModelProvenance({
  model,
  modelVersion,
  confidence,
  at,
}: {
  model?: string;
  modelVersion?: string;
  confidence?: number;
  at?: string;
}) {
  if (!model) return <p className="text-sm text-muted-foreground">No model provenance was recorded.</p>;
  return (
    <div className="flex flex-col gap-3">
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 font-mono text-xs">
        <dt className="text-muted-foreground uppercase">Model</dt>
        <dd className="flex min-w-0 items-center gap-1.5 break-all">
          <CpuIcon aria-hidden className="size-3.5 shrink-0" />
          {model}
        </dd>
        {modelVersion ? (
          <>
            <dt className="text-muted-foreground uppercase">Version</dt>
            <dd className="break-all">{modelVersion}</dd>
          </>
        ) : null}
        {confidence !== undefined ? (
          <>
            <dt className="text-muted-foreground uppercase">Self-reported</dt>
            <dd>
              {confidence.toFixed(2)} <span className="text-muted-foreground">(model output, not a calibrated probability)</span>
            </dd>
          </>
        ) : null}
        {at ? (
          <>
            <dt className="text-muted-foreground uppercase">Recorded</dt>
            <dd>{new Date(at).toLocaleString()}</dd>
          </>
        ) : null}
      </dl>
      {isFixtureModel(model) ? (
        <Alert>
          <FlaskConicalIcon />
          <AlertTitle>Development fixture output</AlertTitle>
          <AlertDescription>
            This record came from the deterministic test fixture, not from Gemma. Treat it as plumbing, not evidence.
          </AlertDescription>
        </Alert>
      ) : null}
    </div>
  );
}
