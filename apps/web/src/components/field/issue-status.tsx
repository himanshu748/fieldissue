import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { label } from "@/lib/format";
import type { Severity, Status } from "@/lib/types";

const dot: Record<Status, string> = {
  OPEN: "bg-observe",
  ACKNOWLEDGED: "bg-water",
  IN_PROGRESS: "bg-water",
  RESOLVED: "bg-grass",
  REJECTED: "bg-muted-foreground",
};

export function IssueStatus({ status, className }: { status: Status; className?: string }) {
  return (
    <Badge variant="outline" className={cn("h-7 gap-2 px-2.5 font-mono text-xs uppercase tracking-wider", className)}>
      <motion.span
        key={status}
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 22 }}
        aria-hidden
        className={cn("size-2 rounded-full", dot[status])}
      />
      {label(status)}
    </Badge>
  );
}

const levels: Record<Severity, number> = { LOW: 1, MEDIUM: 2, HIGH: 3, CRITICAL: 4 };

export function SeverityIndicator({ severity, className }: { severity: Severity; className?: string }) {
  const level = levels[severity];
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span aria-hidden className="flex items-end gap-0.5">
        {[1, 2, 3, 4].map((n) => (
          <span
            key={n}
            className={cn(
              "w-1.5",
              n <= level ? (level >= 3 ? "bg-observe" : "bg-ink") : "bg-border",
            )}
            style={{ height: 4 + n * 3 }}
          />
        ))}
      </span>
      <span className="text-sm">{label(severity)}</span>
    </span>
  );
}
