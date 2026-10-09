import type { CaptureDraft } from "@/hooks/use-capture-draft";
export interface QueuedCapture {
  id: string;
  issueId?: string;
  draft: CaptureDraft;
  key: string;
  savedAt: number;
  ownerId: string | null;
  captureScope: string;
}
const DB = "fieldissue-offline-v1";
const STORE = "captures";
const TTL = 7 * 86400000;
function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const r = indexedDB.open(DB, 1);
    r.onupgradeneeded = () =>
      r.result.createObjectStore(STORE, { keyPath: "id" });
    r.onsuccess = () => resolve(r.result);
    r.onerror = () =>
      reject(new Error("This browser could not open offline storage."));
  });
}
async function operate<T>(
  mode: IDBTransactionMode,
  fn: (s: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  const db = await open();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, mode);
    const r = fn(tx.objectStore(STORE));
    tx.oncomplete = () => {
      db.close();
      resolve(r.result);
    };
    tx.onerror = () => {
      db.close();
      reject(new Error("Offline storage failed. Keep this page open."));
    };
    tx.onabort = tx.onerror;
  });
}
export async function listQueued() {
  const all = (await operate("readonly", (s) => s.getAll())) as QueuedCapture[];
  const valid = [];
  for (const x of all) {
    if (Date.now() - x.savedAt > TTL || x.savedAt > Date.now())
      await removeQueued(x.id);
    else valid.push(x);
  }
  return valid.sort((a, b) => a.savedAt - b.savedAt);
}
export async function putQueued(x: QueuedCapture) {
  const items = await listQueued();
  if (items.length >= 10 && !items.some((i) => i.id === x.id))
    throw new Error(
      "Offline queue is full (10 photos). Upload or remove a saved item first.",
    );
  if (!x.draft.photo || x.draft.photo.blob.size > 5 * 1024 * 1024)
    throw new Error("A prepared photo up to 5 MB is required.");
  await operate("readwrite", (s) => s.put(x));
}
export async function removeQueued(id: string) {
  await operate("readwrite", (s) => s.delete(id));
}
export async function clearOfflineQueue() {
  await operate("readwrite", (s) => s.clear());
}
export async function offlineReady() {
  if (!("serviceWorker" in navigator)) return false;
  const r = await navigator.serviceWorker.getRegistration("/");
  return !!r?.active;
}
