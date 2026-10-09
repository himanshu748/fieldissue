import { useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api";
import type { AppConfig } from "@/lib/types";

let pending: Promise<AppConfig> | null = null;

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
  const [state, setState] = useState<{ config?: AppConfig; error?: Error }>({});
  useEffect(() => {
    let active = true;
    loadConfig().then(
      (config) => active && setState({ config }),
      (error: Error) => active && setState({ error }),
    );
    const reconnect = () => {
      pending = null;
      void loadConfig().then(
        (config) => active && setState({ config }),
        (error) => active && setState({ error }),
      );
    };
    window.addEventListener("online", reconnect);
    window.addEventListener("fieldissue-account-change", reconnect);
    window.addEventListener("focus", reconnect);
    return () => {
      window.removeEventListener("online", reconnect);
      window.removeEventListener("fieldissue-account-change", reconnect);
      window.removeEventListener("focus", reconnect);
      active = false;
    };
  }, []);
  useEffect(() => {
    if (!state.config?.offline) return;
    const timer = setInterval(resetAppConfig, 15000);
    return () => clearInterval(timer);
  }, [state.config?.offline]);
  return state;
}
