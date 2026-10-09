const MAX_DIMENSION = 1600;
// Client-side ceiling; the server's own MAX_UPLOAD_BYTES (up to 10 MiB) still applies.
export const CLIENT_MAX_BYTES = 5 * 1024 * 1024;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

export interface PreparedImage {
  blob: Blob;
  fingerprint?: string;
  width: number;
  height: number;
  originalBytes: number;
}

function load(file: Blob): Promise<ImageBitmap | HTMLImageElement> {
  if ("createImageBitmap" in window)
    return createImageBitmap(file, { imageOrientation: "from-image" }).catch(() => loadElement(file));
  return loadElement(file);
}

function loadElement(file: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("This file could not be read as an image."));
    };
    img.src = url;
  });
}

function encode(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Image encoding failed."))),
      "image/jpeg",
      quality,
    ),
  );
}

// Redrawing onto a canvas and re-encoding as JPEG drops EXIF (including GPS tags)
// and keeps uploads small enough for field connections.
export async function prepareImage(file: File, serverMaxBytes?: number): Promise<PreparedImage> {
  if (!ACCEPTED.includes(file.type))
    throw new Error("Use a JPEG, PNG or WebP photo.");
  const source = await load(file);
  const scale = Math.min(1, MAX_DIMENSION / Math.max(source.width, source.height));
  const width = Math.max(1, Math.round(source.width * scale));
  const height = Math.max(1, Math.round(source.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("This browser cannot prepare images.");
  context.drawImage(source, 0, 0, width, height);
  if ("close" in source) source.close();
  const cap = Math.min(CLIENT_MAX_BYTES, serverMaxBytes ?? CLIENT_MAX_BYTES);
  let blob = await encode(canvas, 0.86);
  for (const quality of [0.76, 0.66, 0.56]) {
    if (blob.size <= cap) break;
    blob = await encode(canvas, quality);
  }
  if (blob.size > cap) throw new Error("This photo is still too large after compression.");
  const fingerprint=Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",await blob.arrayBuffer())),b=>b.toString(16).padStart(2,"0")).join("");
  return { blob, fingerprint, width, height, originalBytes: file.size };
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
