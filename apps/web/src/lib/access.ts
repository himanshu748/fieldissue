import { useSyncExternalStore } from "react";

// Same key as the legacy workspace so an unlocked tab stays unlocked across both.
const KEY = "fieldissue-token";
const listeners = new Set<() => void>();
let locked = false;
let cached: string | null | undefined;

function read() {
  if (cached === undefined) {
    try {
      cached = sessionStorage.getItem(KEY);
    } catch {
      cached = null;
    }
  }
  return cached;
}

function emit() {
  for (const listener of listeners) listener();
}

export function getToken() {
  return read();
}

export function setToken(value: string) {
  const token = value.trim();
  cached = token || null;
  locked = false;
  try {
    if (token) sessionStorage.setItem(KEY, token);
    else sessionStorage.removeItem(KEY);
  } catch {
    // Storage can be blocked; the in-memory value still unlocks this tab.
  }
  emit();
}

export function clearToken() {
  setToken("");
}

export function markLocked(value: boolean) {
  if (locked === value) return;
  locked = value;
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useAccess() {
  const token = useSyncExternalStore(subscribe, read);
  const isLocked = useSyncExternalStore(subscribe, () => locked);
  return { hasToken: !!token, isLocked };
}
