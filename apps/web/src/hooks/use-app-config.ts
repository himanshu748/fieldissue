import { useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api";
import type { AppConfig } from "@/lib/types";

let pending: Promise<AppConfig> | null = null;
type ConfigState = { config?: AppConfig; error?: Error };
const subscribers = new Set<(state: ConfigState) => void>();
let revision = 0;
let offlineTimer: ReturnType<typeof setTimeout> | undefined;

function scheduleOfflineRefresh(config?: AppConfig) {
  clearTimeout(offlineTimer);
  if (config?.offline && subscribers.size) offlineTimer = setTimeout(refreshConfig, 15000);
}

// One listener per event for the whole app. Per-component listeners used to
// invalidate the shared promise repeatedly and fan one focus event into 5 calls.
function refreshConfig() {
  const current = ++revision;
  pending = null;
  void loadConfig().then(
    config => {
      if (current !== revision) return;
      scheduleOfflineRefresh(config);
      subscribers.forEach(update => update({ config }));
    },
    (error: Error) => {
      if (current !== revision) return;
      subscribers.forEach(update => update({ error }));
    },
  );
}

export function loadConfig() {
  pending ??= api
    .config()
    .then((config) => {
      if (config.publicAccess) {
        try {
          localStorage.setItem(
            "fieldissue-public-config",
            JSON.stringify(config),
          );
        } catch {
          /* Offline configuration is optional. */
        }
      }
      return config;
    })
    .catch((error) => {
      if (error instanceof ApiError && error.status === 0) {
        try {
          const cached = JSON.parse(
            localStorage.getItem("fieldissue-public-config") ?? "null",
          );
          if (cached?.publicAccess === true) {
            pending = null;
            return {
              ...cached,
              offline: true,
              audio: false,
              tinkerNotes: false,
            };
          }
        } catch {
          /* No prior public configuration. */
        }
      }
      pending = null;
      throw error;
    });
  return pending;
}

export function resetAppConfig() {
  pending = null;
  window.dispatchEvent(new Event("fieldissue-account-change"));
}

export function useAppConfig() {
  const [state, setState] = useState<ConfigState>({});
  useEffect(() => {
    let active = true;
    const current = revision;
    if (!subscribers.size) {
      window.addEventListener("online", refreshConfig);
      window.addEventListener("fieldissue-account-change", refreshConfig);
      window.addEventListener("focus", refreshConfig);
    }
    subscribers.add(setState);
    loadConfig().then(
      config => {
        if (!active || current !== revision) return;
        scheduleOfflineRefresh(config);
        setState({ config });
      },
      (error: Error) => active && current === revision && setState({ error }),
    );
    return () => {
      active = false;
      subscribers.delete(setState);
      if (!subscribers.size) {
        window.removeEventListener("online", refreshConfig);
        window.removeEventListener("fieldissue-account-change", refreshConfig);
        window.removeEventListener("focus", refreshConfig);
        clearTimeout(offlineTimer);
      }
    };
  }, []);
  return state;
}
