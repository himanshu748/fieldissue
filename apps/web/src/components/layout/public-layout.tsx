import { Link, NavLink, Outlet } from "react-router";
import { ArrowUpRightIcon } from "lucide-react";
import { Brand } from "./brand";
import { cn } from "@/lib/utils";

const links = [
  { to: "/methodology", label: "Methodology" },
  { to: "/privacy", label: "Privacy" },
  { to: "/about", label: "About" },
];

export function PublicHeader({ overlay }: { overlay?: boolean }) {
  return (
    <header className={cn("z-30 w-full", overlay ? "absolute inset-x-0 top-0" : "border-b border-ink")}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:h-20 sm:px-8">
        <Brand />
        <nav aria-label="Site" className="flex items-center gap-1 sm:gap-4">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                cn(
                  "hidden min-h-11 items-center px-2 font-mono text-xs uppercase tracking-wider md:inline-flex",
                  isActive ? "text-ink underline decoration-observe decoration-2 underline-offset-8" : "text-muted-foreground hover:text-ink",
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
          <Link
            to="/app/explore"
            className="inline-flex min-h-11 items-center gap-1.5 border border-ink px-3 font-mono text-xs uppercase tracking-wider hover:bg-ink hover:text-paper"
          >
            Explore <ArrowUpRightIcon aria-hidden className="size-3.5" />
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="border-t border-ink bg-ink text-paper">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="flex flex-col gap-4">
          <Brand inverted />
          <p className="max-w-sm text-sm text-paper/70">
            Open-source issue tracking for the physical world. Not an emergency service and not a replacement for official
            municipal reporting.
          </p>
        </div>
        <nav aria-label="Product" className="flex flex-col gap-1 text-sm">
          <p className="eyebrow mb-2 text-paper/50">Product</p>
          <Link className="min-h-9 hover:text-observe" to="/app/report">Report an issue</Link>
          <Link className="min-h-9 hover:text-observe" to="/app/explore">Explore nearby</Link>
          <Link className="min-h-9 hover:text-observe" to="/app/walk">Plan a walk</Link>
          <Link className="min-h-9 hover:text-observe" to="/app/lab">Model Lab</Link>
        </nav>
        <nav aria-label="Trust" className="flex flex-col gap-1 text-sm">
          <p className="eyebrow mb-2 text-paper/50">Trust</p>
          <Link className="min-h-9 hover:text-observe" to="/methodology">Methodology and AI limits</Link>
          <Link className="min-h-9 hover:text-observe" to="/privacy">Privacy and safety</Link>
          <Link className="min-h-9 hover:text-observe" to="/about">About and open source</Link>
          <a className="min-h-9 hover:text-observe" href="https://github.com/himanshu748/fieldissue" rel="noreferrer" target="_blank">
            Source on GitHub ↗
          </a>
        </nav>
      </div>
    </footer>
  );
}

export function PublicLayout() {
  return (
    <div className="flex min-h-dvh flex-col bg-paper">
      <PublicHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
}
