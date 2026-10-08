import { Link } from "react-router";
import { cn } from "@/lib/utils";

export function Brand({ to = "/", className, inverted }: { to?: string; className?: string; inverted?: boolean }) {
  return (
    <Link to={to} className={cn("group inline-flex min-h-11 items-center gap-2.5", className)} aria-label="FieldIssue home">
      <svg aria-hidden viewBox="0 0 32 32" className="size-7">
        <rect width="32" height="32" fill={inverted ? "var(--paper)" : "var(--ink)"} />
        <circle cx="16" cy="14" r="6" fill="none" stroke={inverted ? "var(--ink)" : "var(--paper)"} strokeWidth="2.5" />
        <circle cx="16" cy="14" r="2" fill="var(--observe)" />
        <path d="M16 20v6" stroke={inverted ? "var(--ink)" : "var(--paper)"} strokeWidth="2.5" strokeLinecap="round" />
      </svg>
      <span className="font-heading text-lg font-bold tracking-[0.12em]">FIELDISSUE</span>
    </Link>
  );
}
