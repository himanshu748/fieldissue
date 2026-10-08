import type { Pool } from "pg";
import { randomUUID } from "node:crypto";
import { AppError } from "./errors.js";
import {
  validStorageKey,
  type Media,
  type StorageProvider,
} from "./storage.js";

/** Durable across web-process restarts; bounded so uploads cannot fill a free DB. */
export class PostgresStorageProvider implements StorageProvider {
  constructor(
    private pool: Pool,
    private baseUrl: string,
    private maxBytes = 209715200,
  ) {}
  async put(media: Media) {
    const ext = (
      {
        "image/jpeg": "jpg",
        "image/png": "png",
        "image/webp": "webp",
        "audio/mpeg": "mp3",
      } as Record<string, string>
    )[media.mime];
    if (!ext)
      throw new AppError("INVALID_MEDIA_TYPE", 400, "Unsupported media type");
    const storageKey = `${randomUUID()}.${ext}`;
    const c = await this.pool.connect();
    try {
      await c.query("BEGIN");
      await c.query(
        "SELECT pg_advisory_xact_lock(hashtext('fieldissue:media-capacity'))",
      );
      const r = await c.query(
        "SELECT COALESCE(sum(octet_length(bytes)),0)::bigint AS used FROM media_objects",
      );
      if (Number(r.rows[0].used) + media.bytes.length > this.maxBytes)
        throw new AppError(
          "STORAGE_CAPACITY",
          503,
          "Photo storage is full. Existing evidence is safe; contact the project owner.",
        );
      await c.query(
        "INSERT INTO media_objects(storage_key,mime_type,bytes) VALUES($1,$2,$3)",
        [storageKey, media.mime, media.bytes],
      );
      await c.query("COMMIT");
      return {
        storageKey,
        mediaUrl: `${this.baseUrl.replace(/\/$/, "")}/${storageKey}`,
        mimeType: media.mime,
      };
    } catch (error) {
      await c.query("ROLLBACK");
      throw error;
    } finally {
      c.release();
    }
  }
  async read(key: string): Promise<Media> {
    validStorageKey(key);
    const r = await this.pool.query(
      "SELECT bytes,mime_type FROM media_objects WHERE storage_key=$1",
      [key],
    );
    if (!r.rows[0])
      throw new AppError("MEDIA_NOT_FOUND", 404, "Media not found");
    return { bytes: r.rows[0].bytes, mime: r.rows[0].mime_type, filename: key };
  }
  async delete(key: string) {
    validStorageKey(key);
    await this.pool.query("DELETE FROM media_objects WHERE storage_key=$1", [
      key,
    ]);
  }
}
