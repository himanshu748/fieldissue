import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile, unlink } from "node:fs/promises";
import { resolve, join } from "node:path";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { AppError } from "./errors.js";

export interface Media {
  bytes: Buffer;
  mime: string;
  filename: string;
}
export interface StoredMedia {
  storageKey: string;
  mediaUrl: string;
  mimeType: string;
}
export interface StorageProvider {
  put(media: Media): Promise<StoredMedia>;
  read(key: string): Promise<Media>;
  delete(key: string): Promise<void>;
}
const mimeExtensions: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "audio/mpeg": "mp3",
};
export function validStorageKey(key: string) {
  if (!/^[a-f0-9-]{36}\.(png|jpg|webp|mp3)$/.test(key))
    throw new AppError("INVALID_STORAGE_KEY", 400, "Invalid storage key");
  return key;
}
export function validateImage(media: Media, maxBytes: number) {
  if (!media.bytes.length || media.bytes.length > maxBytes)
    throw new AppError(
      "INVALID_MEDIA_SIZE",
      400,
      "Image exceeds size limit or is empty",
    );
  if (
    !/^[\p{L}\p{N}_ .()-]{1,150}$/u.test(media.filename) ||
    media.filename.includes("..")
  )
    throw new AppError("INVALID_FILENAME", 400, "Invalid image filename");
  const b = media.bytes;
  const actual = b
    .subarray(0, 8)
    .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
    ? "image/png"
    : b[0] === 255 && b[1] === 216 && b[2] === 255
      ? "image/jpeg"
      : b.subarray(0, 4).toString() === "RIFF" &&
          b.subarray(8, 12).toString() === "WEBP"
        ? "image/webp"
        : undefined;
  if (!actual || actual !== media.mime)
    throw new AppError(
      "INVALID_MEDIA_TYPE",
      400,
      "Only matching PNG, JPEG or WebP image content is accepted",
    );
}
function generateKey(media: Media) {
  const ext = mimeExtensions[media.mime];
  if (!ext)
    throw new AppError("INVALID_MEDIA_TYPE", 400, "Unsupported media type");
  return `${randomUUID()}.${ext}`;
}
export class LocalStorageProvider implements StorageProvider {
  constructor(
    private readonly root: string,
    private readonly baseUrl: string,
  ) {}
  async put(media: Media) {
    const storageKey = generateKey(media);
    try {
      await mkdir(this.root, { recursive: true, mode: 0o700 });
      await writeFile(join(resolve(this.root), storageKey), media.bytes, {
        flag: "wx",
        mode: 0o600,
      });
      return {
        storageKey,
        mediaUrl: `${this.baseUrl.replace(/\/$/, "")}/${storageKey}`,
        mimeType: media.mime,
      };
    } catch {
      throw new AppError("STORAGE_FAILURE", 503, "Media upload failed");
    }
  }
  async read(key: string) {
    validStorageKey(key);
    try {
      return {
        bytes: await readFile(join(resolve(this.root), key)),
        mime: mimeForKey(key),
        filename: key,
      };
    } catch {
      throw new AppError("MEDIA_NOT_FOUND", 404, "Media not found");
    }
  }
  async delete(key: string) {
    validStorageKey(key);
    try {
      await unlink(join(resolve(this.root), key));
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT")
        throw new AppError("STORAGE_FAILURE", 503, "Media cleanup failed");
    }
  }
}
export function mimeForKey(key: string) {
  const ext = key.split(".").at(-1);
  return (
    Object.entries(mimeExtensions).find(([, v]) => v === ext)?.[0] ??
    "application/octet-stream"
  );
}
export class S3CompatibleStorageProvider implements StorageProvider {
  constructor(
    private readonly client: S3Client,
    private readonly bucket: string,
    private readonly baseUrl: string,
    private readonly timeoutMs = 10000,
  ) {}
  async put(media: Media) {
    const storageKey = generateKey(media);
    try {
      await this.client.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: storageKey,
          Body: media.bytes,
          ContentType: media.mime,
        }),
        { abortSignal: AbortSignal.timeout(this.timeoutMs) },
      );
      return {
        storageKey,
        mediaUrl: `${this.baseUrl.replace(/\/$/, "")}/${storageKey}`,
        mimeType: media.mime,
      };
    } catch {
      throw new AppError(
        "STORAGE_FAILURE",
        503,
        "Object storage upload failed",
      );
    }
  }
  async read(key: string) {
    validStorageKey(key);
    try {
      const r = await this.client.send(
        new GetObjectCommand({ Bucket: this.bucket, Key: key }),
        { abortSignal: AbortSignal.timeout(this.timeoutMs) },
      );
      if (!r.Body) throw new Error("empty");
      return {
        bytes: Buffer.from(await r.Body.transformToByteArray()),
        mime: mimeForKey(key),
        filename: key,
      };
    } catch {
      throw new AppError("STORAGE_FAILURE", 503, "Object storage read failed");
    }
  }
  async delete(key: string) {
    validStorageKey(key);
    try {
      await this.client.send(
        new DeleteObjectCommand({ Bucket: this.bucket, Key: key }),
        { abortSignal: AbortSignal.timeout(this.timeoutMs) },
      );
    } catch {
      throw new AppError(
        "STORAGE_FAILURE",
        503,
        "Object storage cleanup failed",
      );
    }
  }
}
