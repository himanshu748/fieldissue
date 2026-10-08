import { createHash } from "node:crypto";
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
  const last = issue.observations.at(-1);
  const days = last
    ? Math.max(
        0,
        Math.floor(
          (now.getTime() - new Date(last.capturedAt).getTime()) / 86400000,
        ),
      )
    : 0;
  const number = Number(issue.publicId.replace("FI-", ""));
  const revisit =
    issue.revisitPrediction?.priorityScore >= 0.5 &&
    !["RESOLVED", "REJECTED"].includes(issue.status)
      ? " Revisit recommended."
      : "";
  return `Field issue ${number}. ${issue.title}. Status ${issue.status.toLowerCase().replace("_", " ")}. Last observed ${days} ${days === 1 ? "day" : "days"} ago.${revisit}`;
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
    let cleanup: string | undefined;
    try {
      const output = await this.repository.transaction(async (c) => {
        await c.query("SELECT pg_advisory_xact_lock(hashtextextended($1,0))", [
          `audio:${key}`,
        ]);
        const cached = (
          await c.query(
            "SELECT media_url,storage_key FROM audio_summaries WHERE cache_key=$1",
            [key],
          )
        ).rows[0];
        if (cached)
          return {
            mediaUrl: cached.media_url,
            storageKey: cached.storage_key,
            cached: true,
          };
        await this.consume(1);
        const media = await this.speech.generate(text);
        const stored = await this.storage.put(media);
        cleanup = stored.storageKey;
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
        return { ...stored, cached: false };
      });
      cleanup = undefined;
      return { ...output, text };
    } catch (error) {
      if (cleanup) await this.storage.delete(cleanup).catch(() => {});
      throw error;
    }
  }
}
