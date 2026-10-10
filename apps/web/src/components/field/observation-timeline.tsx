import { motion } from "motion/react";
import { formatDateTime, label } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { IssueEvent } from "@/lib/types";

function describe(event: IssueEvent): { title: string; detail?: string; tone: "observe" | "ink" | "grass" | "muted" } {
  const p = event.payload ?? {};
  switch (event.eventType) {
    case "OBSERVATION_CORRECTED":
      return {title:p.exclusionType ? `Observation excluded: ${label(String(p.exclusionType))}` : "Observation restored",detail:`${p.reason || "No reason supplied"} · Authorized ${(p.actor as {kind?:string})?.kind ?? "owner"}`,tone:"ink"};
    case "COMPARISON_SUPERSEDED":
      return {title:"Comparison superseded",detail:"Earlier output remains in history, but is no longer current evidence.",tone:"muted"};
    case "ISSUE_CREATED":
      return { title: "Issue created from a field photo", tone: "observe" };
    case "OBSERVATION_ADDED":
      return { title: "Revisit observation added", tone: "observe" };
    case "CLASSIFICATION_UPDATED":
      return {
        title: p.source === "validated_evidence" ? "Classified from validated model evidence" : "Classification corrected by a person",
        detail: [p.category, p.severity].filter(Boolean).map((v) => label(String(v))).join(" · "),
        tone: "ink",
      };
    case "STATUS_CHANGED":
      return {
        title: `Status ${label(String(p.from ?? ""))} → ${label(String(p.to ?? ""))}`,
        detail: p.note ? String(p.note) : undefined,
        tone: p.to === "RESOLVED" ? "grass" : "ink",
      };
    case "DIFF_GENERATED":
      if (p.method === "image_identity") return { tone: "muted", title: "Repeated photo detected", detail: p.correction ? "The previous model comparison was withdrawn; its original output remains in the audit record." : "Exact file comparison found no new visual evidence. Status not changed." };
      return {
        title: "Observations compared by the model",
        detail: p.recommendedStatus ? `Model suggested ${label(String(p.recommendedStatus))}. Status not changed.` : undefined,
        tone: "muted",
      };
    case "ISSUE_RESOLVED":
      return {
        title: "Resolution confirmed by a person",
        detail: `${p.basis === "latest_observation" ? "Basis: latest observation" : "Basis: manual confirmation without new evidence"}${p.note ? ` · “${String(p.note)}”` : ""}`,
        tone: "grass",
      };
    case "REVISIT_REVIEWED":
      return {
        title: p.materialChange ? "Revisit reviewed: material change" : "Revisit reviewed: no material change",
        detail: p.note ? String(p.note) : undefined,
        tone: "ink",
      };
    case "ISSUE_UPDATED": {
      const edits = (p.edits ?? {}) as Record<string, { before?: unknown; after?: unknown }>;
      const fields = Object.keys(edits);
      return {
        title: `${fields.length ? fields.map((f) => label(f)).join(" and ") : "Details"} edited by a person`,
        detail: fields
          .map((f) => `${label(f)}: “${String(edits[f]?.before ?? "")}” → “${String(edits[f]?.after ?? "")}”`)
          .join(" · "),
        tone: "ink",
      };
    }
    default:
      return { title: label(String(event.eventType)), tone: "muted" };
  }
}

const tones = {
  observe: "bg-observe",
  ink: "bg-ink",
  grass: "bg-grass",
  muted: "bg-paper border-2 border-muted-foreground",
};

export function ObservationTimeline({ events, pending }: { events: IssueEvent[]; pending?: string }) {
  return (
    <ol className="relative flex flex-col">
      {events.map((event, index) => {
        const d = describe(event);
        return (
          <motion.li
            key={event.id}
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.3, delay: Math.min(index, 6) * 0.04 }}
            className="relative grid grid-cols-[20px_1fr] gap-x-3 pb-6 last:pb-0"
          >
            <span aria-hidden className="relative flex justify-center">
              <span className={cn("relative z-10 mt-1 size-3 rounded-full", tones[d.tone])} />
              {index < events.length - 1 || pending ? (
                <span className="absolute top-4 bottom-[-4px] w-px bg-ink/25" />
              ) : null}
            </span>
            <div className="flex min-w-0 flex-col gap-0.5">
              <p className="font-medium">{d.title}</p>
              {d.detail ? <p className="text-sm break-words text-muted-foreground">{d.detail}</p> : null}
              <time dateTime={event.createdAt} className="font-mono text-xs text-muted-foreground">
                {formatDateTime(event.createdAt)}
              </time>
            </div>
          </motion.li>
        );
      })}
      {pending ? (
        <li className="grid grid-cols-[20px_1fr] gap-x-3">
          <span aria-hidden className="flex justify-center">
            <span className="mt-1 size-3 rounded-full border-2 border-dashed border-muted-foreground" />
          </span>
          <p className="text-muted-foreground">{pending}</p>
        </li>
      ) : null}
    </ol>
  );
}
