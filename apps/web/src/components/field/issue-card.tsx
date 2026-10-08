import { Link } from "react-router";
import { ArrowUpRightIcon } from "lucide-react";
import { IssueStatus, SeverityIndicator } from "./issue-status";
import { formatDistance } from "@/lib/geo";
import { label, timeAgo } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Issue } from "@/lib/types";

export function IssueCard({
  issue,
  distance,
  active,
  onFocus,
}: {
  issue: Issue;
  distance?: number;
  active?: boolean;
  onFocus?: () => void;
}) {
  return (
    <Link
      to={`/app/issues/${issue.publicId}`}
      onMouseEnter={onFocus}
      onFocus={onFocus}
      className={cn(
        "group flex flex-col gap-3 border border-border bg-surface p-4 transition-colors hover:border-ink focus-visible:border-ink",
        active && "border-ink shadow-[4px_4px_0_0_var(--ink)]",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="font-mono text-sm tracking-wide text-observe-ink">{issue.publicId}</span>
        <IssueStatus status={issue.status} />
      </div>
      <h3 className="text-lg leading-snug font-semibold">{issue.title}</h3>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
        <span>{label(issue.category)}</span>
        <SeverityIndicator severity={issue.severity} />
        {distance !== undefined ? <span className="font-mono">{formatDistance(distance)} away</span> : null}
        <span>Updated {timeAgo(issue.updatedAt)}</span>
      </div>
      {issue.placeContext?.name ? (
        <p className="truncate text-sm">Near {issue.placeContext.name}</p>
      ) : null}
      <span className="mt-auto flex items-center gap-1 font-mono text-xs uppercase tracking-wider opacity-70 group-hover:opacity-100">
        Open record <ArrowUpRightIcon aria-hidden className="size-3.5" />
      </span>
    </Link>
  );
}
