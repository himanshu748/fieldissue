import { useEffect, useState } from "react";
import { fetchMedia } from "@/lib/api";
import { useAccess } from "@/lib/access";

interface Entry {
  url?: string;
  promise: Promise<string>;
  refs: number;
  timer?: number;
}

// <img> cannot send a bearer header, so media is fetched with authorization and
// shown through a blob URL. Entries are ref-counted and revoked shortly after the
// last viewer unmounts so the same photo is not downloaded twice per screen.
const cache = new Map<string, Entry>();

function acquire(key: string) {
  let entry = cache.get(key);
  if (!entry) {
    const created: Entry = {
      refs: 0,
      promise: fetchMedia(key).then((blob) => {
        created.url = URL.createObjectURL(blob);
        return created.url;
      }),
    };
    created.promise.catch(() => cache.delete(key));
    cache.set(key, created);
    entry = created;
  }
  if (entry.timer) {
    clearTimeout(entry.timer);
    entry.timer = undefined;
  }
  entry.refs += 1;
  return entry;
}

function release(key: string) {
  const entry = cache.get(key);
  if (!entry) return;
  entry.refs -= 1;
  if (entry.refs > 0) return;
  entry.timer = window.setTimeout(() => {
    if (entry.refs > 0) return;
    if (entry.url) URL.revokeObjectURL(entry.url);
    cache.delete(key);
  }, 30000);
}

export function useProtectedMedia(storageKey: string | undefined) {
  const { hasToken } = useAccess();
  const [state, setState] = useState<{ key?: string; url?: string; error?: Error }>({});

  useEffect(() => {
    if (!storageKey) return;
    let active = true;
    const entry = acquire(storageKey);
    entry.promise.then(
      (url) => active && setState({ key: storageKey, url }),
      (error: Error) => active && setState({ key: storageKey, error }),
    );
    return () => {
      active = false;
      release(storageKey);
    };
  }, [storageKey, hasToken]);

  const current = state.key === storageKey ? state : {};
  return { url: current.url, error: current.error, loading: !!storageKey && !current.url && !current.error };
}
