import { CheckIcon } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

export interface Step {
  label: string;
  state: "done" | "active" | "waiting";
}

// Each row reflects a real event (encode finished, bytes sent, response received);
// nothing here is timed to look busy.
export function ProgressSteps({ title, steps }: { title: string; steps: Step[] }) {
  return (
    <div className="flex flex-col gap-4 border border-ink bg-surface p-5" role="status" aria-live="polite">
      <p className="eyebrow">{title}</p>
      <ol className="flex flex-col gap-3">
        {steps.map((step) => (
          <li key={step.label} className={cn("flex items-center gap-3", step.state === "waiting" && "text-muted-foreground")}>
            <span className="grid size-6 place-items-center">
              {step.state === "done" ? (
                <CheckIcon aria-hidden className="text-grass" />
              ) : step.state === "active" ? (
                <Spinner />
              ) : (
                <span aria-hidden className="size-3 rounded-full border-2 border-dashed border-muted-foreground" />
              )}
            </span>
            <span>
              {step.label}
              <span className="sr-only">
                {step.state === "done" ? " (complete)" : step.state === "active" ? " (in progress)" : " (waiting)"}
              </span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
