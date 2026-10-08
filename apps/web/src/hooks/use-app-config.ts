import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { AppConfig } from "@/lib/types";

let pending: Promise<AppConfig> | null = null;

function loadConfig() {
  pending ??= api.config().catch((error) => {
    pending = null;
    throw error;
  });
  return pending;
}

export function useAppConfig() {
  const [state, setState] = useState<{ config?: AppConfig; error?: Error }>({});
  useEffect(() => {
    let active = true;
    loadConfig().then(
      (config) => active && setState({ config }),
      (error: Error) => active && setState({ error }),
    );
    return () => {
      active = false;
    };
  }, []);
  return state;
}
