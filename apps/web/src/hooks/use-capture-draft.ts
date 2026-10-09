import { useEffect, useRef, useState } from "react";
import type { PreparedImage } from "@/lib/image";
import type { Located } from "@/lib/geo";

const PREFIX = "fieldissue-draft:";
const MAX_AGE = 24 * 60 * 60 * 1000;
export interface CaptureDraft {
  photo: PreparedImage | null;
  location: Located | null;
  locationMode: "inherit" | "here";
  note: string;
  capturedAt: string;
  attempt?: { key: string; signature: string };
}

export function clearCaptureDrafts() {
  try {
    for (const key of Object.keys(sessionStorage)) if (key.startsWith(PREFIX)) sessionStorage.removeItem(key);
  } catch { /* Storage may be unavailable. */ }
}

export function clearMatchingCaptureDraft(id:string,expected:CaptureDraft) {
  try {
    const key=PREFIX+id;const saved=JSON.parse(sessionStorage.getItem(key)??"null")?.draft;
    const shape=(d:CaptureDraft)=>JSON.stringify([d.photo?.fingerprint,d.note,d.capturedAt,d.locationMode,d.location]);
    if(saved && shape(saved)===shape(expected))sessionStorage.removeItem(key);
  }catch{/* Other drafts are preserved. */}
}

function restore(key: string, initial: CaptureDraft): CaptureDraft {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return initial;
    const { savedAt, draft, image } = JSON.parse(raw);
    if (!Number.isFinite(savedAt) || Date.now() - savedAt > MAX_AGE || savedAt > Date.now()) throw new Error();
    if (typeof draft.note !== "string" || typeof draft.capturedAt !== "string" || !["here", "inherit"].includes(draft.locationMode)) throw new Error();
    const photo = image ? {
      ...draft.photo,
      blob: new Blob([Uint8Array.from(atob(image), c => c.charCodeAt(0))], { type: "image/jpeg" }),
    } : null;
    return { ...draft, photo };
  } catch {
    try { sessionStorage.removeItem(key); } catch { /* Best effort. */ }
    return initial;
  }
}

// Session storage keeps drafts in the current tab, expires them after a day,
// and allows locking to remove photos synchronously, without a background queue.
export function useCaptureDraft(id: string, initial: CaptureDraft) {
  const key = PREFIX + id;
  const [draft, setDraft] = useState(() => restore(key, initial));
  const [notice, setNotice] = useState("Draft stays in this tab for up to 24 hours. Locking clears it. Nothing is sent until you submit.");
  const cleared = useRef(false);
  async function persist(value: CaptureDraft, active: () => boolean = () => true) {
    try {
      if (value.photo && value.photo.blob.size > 2 * 1024 * 1024) throw new Error();
      const bytes = value.photo ? new Uint8Array(await value.photo.blob.arrayBuffer()) : null;
      let binary = "";
      if (bytes) for (let i = 0; i < bytes.length; i += 8192) binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
      if (!active() || cleared.current) return;
      sessionStorage.setItem(key, JSON.stringify({ savedAt: Date.now(), draft: { ...value, photo: value.photo ? { ...value.photo, blob: undefined } : null }, image: bytes ? btoa(binary) : null }));
      setNotice("Draft saved in this tab for up to 24 hours. Locking clears it. Nothing is sent until you submit.");
    } catch {
      if (!active() || cleared.current) return;
      try { sessionStorage.removeItem(key); } catch { /* Storage disabled. */ }
      setNotice("This browser could not save the draft. Keep this page open; your current inputs are still available for retry.");
    }
  }
  useEffect(() => {
    let active = true;
    void persist(draft, () => active);
    return () => { active = false; };
  }, [draft, key]);
  function clear() {
    cleared.current = true;
    try { sessionStorage.removeItem(key); } catch { /* Best effort. */ }
  }
  return { draft, setDraft, clear, notice, persist };
}
