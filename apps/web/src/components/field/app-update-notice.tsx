import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function AppUpdateNotice() {
  const [available, setAvailable] = useState(false);
  useEffect(() => {
    if (!import.meta.env.PROD || !("serviceWorker" in navigator)) return;
    let controlled = !!navigator.serviceWorker.controller;
    let active = true;
    const changed = () => {
      if (controlled && active) setAvailable(true);
      controlled = true;
    };
    navigator.serviceWorker.addEventListener("controllerchange", changed);
    const registration = navigator.serviceWorker.register("/sw.js", {
      updateViaCache: "none",
    });
    const check = () => {
      if (document.visibilityState === "visible")
        void registration.then((r) => r.update()).catch(() => {});
    };
    void registration.catch(() => {});
    document.addEventListener("visibilitychange", check);
    return () => {
      active = false;
      navigator.serviceWorker.removeEventListener("controllerchange", changed);
      document.removeEventListener("visibilitychange", check);
    };
  }, []);
  if (!available) return null;
  return (
    <aside
      role="status"
      className="sticky top-0 z-50 flex flex-wrap items-center justify-center gap-3 border-b border-ink bg-surface p-3 text-sm"
    >
      <p>
        A newer version is ready. Finish or save your current work, then reload
        to use it.
      </p>
      <Button type="button" size="sm" onClick={() => window.location.reload()}>
        Reload updated app
      </Button>
    </aside>
  );
}
