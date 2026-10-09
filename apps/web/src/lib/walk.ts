import { useSyncExternalStore } from "react";
import type { Point } from "./geo";
import type { WalkSuggestion } from "./types";

export const WALK_LIMIT = 5;

export type WalkItemState = "pending" | "visited" | "skipped";

export interface WalkItem extends WalkSuggestion {
  state: WalkItemState;
  observationId?: string;
}

export interface Walk {
  version: 1;
  createdAt: string;
  startedAt: string | null;
  origin: Point;
  radiusMeters: number;
  items: WalkItem[];
}

// Keep precise walk locations within this tab session.
const KEY = "fieldissue-walk-v1";
const listeners = new Set<() => void>();
let snapshot: Walk | null | undefined;

function read(): Walk | null {
  if (snapshot !== undefined) return snapshot;
  try {
    // Remove the previous persistent queue when upgrading an existing browser.
    localStorage.removeItem(KEY);
    const parsed = JSON.parse(sessionStorage.getItem(KEY) ?? "null") as Walk | null;
    snapshot = parsed?.version === 1 && Array.isArray(parsed.items) ? parsed : null;
  } catch {
    snapshot = null;
  }
  return snapshot;
}

function write(next: Walk | null) {
  snapshot = next;
  try {
    if (next) sessionStorage.setItem(KEY, JSON.stringify(next));
    else sessionStorage.removeItem(KEY);
  } catch {
    // Storage blocked: the queue lives in memory for this page only.
  }
  for (const l of listeners) l();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === KEY) {
      snapshot = undefined;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function useWalk() {
  return useSyncExternalStore(subscribe, read);
}

export function createWalk(origin: Point, radiusMeters: number, picks: WalkSuggestion[]) {
  write({
    version: 1,
    createdAt: new Date().toISOString(),
    startedAt: null,
    origin,
    radiusMeters,
    items: picks.slice(0, WALK_LIMIT).map((p) => ({ ...p, state: "pending" })),
  });
}

export function startWalk() {
  const walk = read();
  if (walk) write({ ...walk, startedAt: walk.startedAt ?? new Date().toISOString() });
}

export function clearWalk() {
  write(null);
}

function update(issueIds: string[], fn: (item: WalkItem) => WalkItem) {
  const walk = read();
  if (!walk) return;
  const ids = new Set(issueIds);
  write({ ...walk, items: walk.items.map((i) => (ids.has(i.issueId) ? fn(i) : i)) });
}

export function skipItem(issueId: string) {
  update([issueId], (i) => ({ ...i, state: i.state === "skipped" ? "pending" : "skipped" }));
}

// Called only after the server has confirmed a saved observation.
export function markVisited(issueIds: string[], observationId: string) {
  update(issueIds, (i) => ({ ...i, state: "visited", observationId }));
}

export function appendItem(item: WalkSuggestion) {
  const walk = read();
  if (!walk || walk.items.length >= WALK_LIMIT || walk.items.some((i) => i.issueId === item.issueId)) return false;
  write({ ...walk, items: [...walk.items, { ...item, state: "pending" }] });
  return true;
}

// Restored only after explicit account-sync confirmation.
export function restoreWalk(walk: Walk) { write(walk); }
