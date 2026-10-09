import { useState } from "react";
import { NavLink, Outlet } from "react-router";
import { CameraIcon, CompassIcon, FlaskConicalIcon, FootprintsIcon, LockOpenIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { ErrorNotice } from "@/components/field/states";
import { Brand } from "./brand";
import { AccessPanel } from "./access-panel";
import { clearToken, markLocked, useAccess } from "@/lib/access";
import { useAppConfig } from "@/hooks/use-app-config";
import { useWalk } from "@/lib/walk";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/app/explore", label: "Explore", icon: CompassIcon },
  { to: "/app/report", label: "Report", icon: CameraIcon },
  { to: "/app/walk", label: "Walk", icon: FootprintsIcon },
  { to: "/app/lab", label: "Lab", icon: FlaskConicalIcon },
];

export function AppShell() {
  const { config, error } = useAppConfig();
  const { hasToken, isLocked } = useAccess();
  const [operatorAccess, setOperatorAccess] = useState(false);
  const walk = useWalk();
  const pendingWalk = walk?.items.filter((i) => i.state === "pending").length ?? 0;
  const needsUnlock = !!config && ((config.accessRequired && !hasToken) || isLocked || (operatorAccess && !hasToken));

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-ink focus:p-3 focus:text-paper">
        Skip to content
      </a>
      <header className="sticky top-0 z-40 border-b border-ink bg-paper/95 backdrop-blur supports-[backdrop-filter]:bg-paper/85">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Brand />
          <nav aria-label="Workspace" className="hidden items-center gap-1 md:flex">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "relative inline-flex min-h-11 items-center gap-2 px-3 font-mono text-xs uppercase tracking-wider",
                    isActive ? "text-ink after:absolute after:inset-x-3 after:bottom-1 after:h-0.5 after:bg-observe" : "text-muted-foreground hover:text-ink",
                  )
                }
              >
                <item.icon aria-hidden className="size-4" />
                {item.label}
                {item.to === "/app/walk" && pendingWalk ? (
                  <span className="grid size-5 place-items-center rounded-full bg-ink text-[10px] text-paper">{pendingWalk}</span>
                ) : null}
              </NavLink>
            ))}
          </nav>
          {hasToken && !isLocked ? (
            <Button variant="ghost" size="sm" onClick={() => { clearToken(); setOperatorAccess(false); window.location.reload(); }} title="Forget the access token in this tab">
              <LockOpenIcon data-icon="inline-start" />
              <span className="hidden sm:inline">Lock</span>
            </Button>
          ) : (
            config?.publicAccess ? <Button variant="ghost" size="sm" onClick={() => { if (needsUnlock) { clearToken(); markLocked(false); setOperatorAccess(false); window.location.reload(); } else setOperatorAccess(true); }}>{needsUnlock ? "Continue as guest" : "Operator access"}</Button> : <span className="hidden w-16 md:block" />
          )}
        </div>
        {config?.mock ? (
          <p className="border-t border-ink bg-observe/15 px-4 py-1.5 text-center text-xs">
            Development fixture mode: analyses on this deployment are deterministic test output, not Gemma.
          </p>
        ) : null}
      </header>

      <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 pt-6 pb-28 sm:px-6 md:pb-16">
        {error ? (
          <ErrorNotice error={error} title="This deployment did not answer" onRetry={() => window.location.reload()} />
        ) : !config ? (
          <div className="flex flex-col gap-4">
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="h-64" />
          </div>
        ) : needsUnlock ? (
          <AccessPanel />
        ) : (
          <>
            {config.publicAccess && !hasToken ? <p className="mb-6 border-b border-border pb-3 text-sm text-muted-foreground">Public demo · no account needed. You can resolve and reopen reports created in this browser. Keep this browser’s cookies to retain those controls for 30 days.</p> : null}
            <Outlet />
          </>
        )}
      </main>

      <nav
        aria-label="Workspace"
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-ink bg-paper pb-[env(safe-area-inset-bottom)] md:hidden"
      >
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "relative flex min-h-16 flex-col items-center justify-center gap-1 font-mono text-[11px] uppercase tracking-wider",
                isActive ? "bg-ink text-paper" : "text-muted-foreground",
              )
            }
          >
            <item.icon aria-hidden className="size-5" />
            {item.label}
            {item.to === "/app/walk" && pendingWalk ? (
              <span className="absolute top-2 right-[calc(50%-22px)] grid size-4 place-items-center rounded-full bg-observe text-[9px] text-ink">
                {pendingWalk}
              </span>
            ) : null}
          </NavLink>
        ))}
      </nav>
      <Toaster position="top-center" />
    </div>
  );
}
