import { createHash, randomUUID } from "node:crypto";
import type { IssueRepository, Row } from "./repository.js";
import type { StorageProvider, Media } from "./storage.js";
import { AppError } from "./errors.js";
import { trace, reportFailure } from "./telemetry.js";
export interface SpeechProvider {
  readonly voiceId: string;
  readonly model: string;
  generate(text: string): Promise<Media>;
}
export function buildBriefing(issue: Row, now = new Date()) {
  const times = issue.observations
    .map((observation: Row) => new Date(observation.capturedAt).getTime())
    .filter((time: number) => Number.isFinite(time) && time <= now.getTime());
  const last = times.length ? Math.max(...times) : null;
  const days =
    last === null ? null : Math.floor((now.getTime() - last) / 86400000);
  const observed =
    days === null
      ? "Observation date unavailable."
      : days === 0
        ? "Last observed less than a day ago."
        : `Last observed ${days} ${days === 1 ? "day" : "days"} ago.`;
  const number = Number(issue.publicId.replace("FI-", ""));
  const revisit =
    issue.revisitPrediction?.priorityScore >= 0.5 &&
    !["RESOLVED", "REJECTED"].includes(issue.status)
      ? " Revisit recommended."
      : "";
  return `Field issue ${number}. ${issue.title}. Status ${issue.status.toLowerCase().replace("_", " ")}. ${observed}${revisit}`;
}
export class ElevenLabsSpeechProvider implements SpeechProvider {
  constructor(
    private readonly apiKey: string,
    public readonly voiceId: string,
    public readonly model = "eleven_multilingual_v2",
    private readonly timeoutMs = 30000,
    private readonly fetcher: typeof fetch = fetch,
  ) {
    if (!apiKey || !voiceId || !model)
      throw new AppError(
        "PROVIDER_NOT_CONFIGURED",
        503,
        "ElevenLabs key, public voice and model are required",
      );
    if (!/^[a-zA-Z0-9_-]{1,100}$/.test(voiceId))
      throw new AppError(
        "PROVIDER_NOT_CONFIGURED",
        503,
        "Invalid voice configuration",
      );
  }
  async generate(text: string): Promise<Media> {
    return trace("audio-summary", "http.client", async () => {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.timeoutMs);
      try {
        const r = await this.fetcher(
          `https://api.elevenlabs.io/v1/text-to-speech/${this.voiceId}?output_format=mp3_44100_128`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "xi-api-key": this.apiKey,
              Accept: "audio/mpeg",
            },
            body: JSON.stringify({ text, model_id: this.model }),
            signal: controller.signal,
          },
        );
        if (!r.ok)
          throw new AppError(
            "AUDIO_PROVIDER_UNAVAILABLE",
            503,
            "Audio generation failed",
          );
        if (!r.headers.get("Content-Type")?.startsWith("audio/mpeg"))
          throw new AppError(
            "INVALID_AUDIO_OUTPUT",
            502,
            "Audio provider returned an invalid format",
          );
        const reader = r.body?.getReader();
        if (!reader)
          throw new AppError(
            "INVALID_AUDIO_OUTPUT",
            502,
            "Audio provider returned empty data",
          );
        let size = 0;
        const chunks: Uint8Array[] = [];
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          size += value.length;
          if (size > 5242880) {
            await reader.cancel();
            throw new AppError(
              "INVALID_AUDIO_OUTPUT",
              502,
              "Audio output exceeds size limit",
            );
          }
          chunks.push(value);
        }
        const bytes = Buffer.concat(chunks);
        if (
          bytes.length < 3 ||
          !(
            bytes.subarray(0, 3).toString() === "ID3" ||
            (bytes[0] === 0xff && (bytes[1]! & 0xe0) === 0xe0)
          )
        )
          throw new AppError(
            "INVALID_AUDIO_OUTPUT",
            502,
            "Audio provider returned invalid MP3 data",
          );
        return { bytes, mime: "audio/mpeg", filename: "briefing.mp3" };
      } catch (error) {
        reportFailure("AUDIO_PROVIDER_UNAVAILABLE", "elevenlabs");
        if (error instanceof AppError) throw error;
        throw new AppError(
          controller.signal.aborted
            ? "PROVIDER_TIMEOUT"
            : "AUDIO_PROVIDER_UNAVAILABLE",
          503,
          "Audio generation unavailable",
        );
      } finally {
        clearTimeout(timer);
      }
    });
  }
}
export class AudioSummaryService {
  constructor(
    private readonly repository: IssueRepository,
    private readonly storage: StorageProvider,
    private readonly speech: SpeechProvider,
    private readonly consume: (units: number) => Promise<void> = async () => {},
  ) {}
  async generate(id: string) {
    const issue = await this.repository.get(id);
    const text = buildBriefing(issue);
    const key = createHash("sha256")
      .update(
        JSON.stringify({
          text,
          updatedAt: issue.updatedAt,
          voice: this.speech.voiceId,
          model: this.speech.model,
        }),
      )
      .digest("hex");
    const owner = randomUUID();
    const deadline = Date.now() + 40000;
    // A durable, expiring lease prevents duplicate provider calls without holding
    // a connection or transaction open during network I/O.
    while (true) {
      const cached = (
        await this.repository.pool.query(
          "SELECT media_url,storage_key FROM audio_summaries WHERE cache_key=$1",
          [key],
        )
      ).rows[0];
      if (cached)
        return {
          mediaUrl: cached.media_url,
          storageKey: cached.storage_key,
          cached: true,
          text,
        };
      const claim = await this.repository.pool.query(
        `INSERT INTO audio_generation_leases(cache_key,issue_id,owner,expires_at)
         VALUES($1,$2,$3,now()+interval '2 minutes')
         ON CONFLICT(cache_key) DO UPDATE SET owner=$3,expires_at=now()+interval '2 minutes'
         WHERE audio_generation_leases.expires_at<now() RETURNING owner`,
        [key, issue.id, owner],
      );
      if (claim.rowCount) break;
      if (Date.now() >= deadline)
        throw new AppError(
          "AUDIO_PENDING",
          503,
          "A briefing is already being prepared. Try again shortly.",
        );
      await new Promise((resolve) => setTimeout(resolve, 150));
    }
    let cleanup: string | undefined;
    try {
      // Another worker may have completed between the cache read and lease claim.
      const cached = (
        await this.repository.pool.query(
          "SELECT media_url,storage_key FROM audio_summaries WHERE cache_key=$1",
          [key],
        )
      ).rows[0];
      if (cached)
        return {
          mediaUrl: cached.media_url,
          storageKey: cached.storage_key,
          cached: true,
          text,
        };
      await this.consume(1);
      const media = await this.speech.generate(text);
      const stored = await this.storage.put(media);
      cleanup = stored.storageKey;
      await this.repository.transaction(async (c) => {
        const lease = await c.query(
          "SELECT owner FROM audio_generation_leases WHERE cache_key=$1 AND owner=$2 AND expires_at>now() FOR UPDATE",
          [key, owner],
        );
        if (!lease.rowCount)
          throw new AppError(
            "AUDIO_PENDING",
            503,
            "Briefing generation expired. Try again.",
          );
        const current = (
          await c.query("SELECT updated_at FROM issues WHERE id=$1 FOR SHARE", [
            issue.id,
          ])
        ).rows[0];
        if (
          !current ||
          new Date(current.updated_at).getTime() !==
            new Date(issue.updatedAt).getTime()
        )
          throw new AppError(
            "EVIDENCE_CHANGED",
            409,
            "This issue changed while the briefing was being prepared. Refresh and try again.",
          );
        await c.query(
          "INSERT INTO audio_summaries(cache_key,issue_id,media_url,storage_key,voice_id,model) VALUES($1,$2,$3,$4,$5,$6)",
          [
            key,
            issue.id,
            stored.mediaUrl,
            stored.storageKey,
            this.speech.voiceId,
            this.speech.model,
          ],
        );
      });
      cleanup = undefined;
      return { ...stored, cached: false, text };
    } catch (error) {
      if (cleanup) await this.storage.delete(cleanup).catch(() => {});
      throw error;
    } finally {
      await this.repository.pool
        .query(
          "DELETE FROM audio_generation_leases WHERE cache_key=$1 AND owner=$2",
          [key, owner],
        )
        .catch(() => {});
    }
  }
}
