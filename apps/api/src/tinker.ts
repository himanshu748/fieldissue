import { reserveModelAllowance } from "./model-allowance.js";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { categorySchema, severitySchema } from "@fieldissue/shared";
import { AppError } from "./errors.js";
import type { IssueRepository } from "./repository.js";
import { trace } from "./telemetry.js";
import { tinkerSystemPrompt } from "./tinker-prompt.js";

export const tinkerPromptVersion = "fieldissue-note-json-v2";
export const noteInterpretationSchema = z
  .object({
    category: categorySchema,
    object: z.string().trim().min(1).max(500),
    condition: z.string().trim().min(1).max(500),
    severity: severitySchema,
    evidence: z.array(z.string().trim().min(1).max(500)).max(30),
  })
  .strict();

export class TinkerNoteProvider {
  constructor(
    private key: string,
    readonly checkpoint: string,
    readonly expiresAt: string,
    private fetcher: typeof fetch = fetch,
  ) {}
  get available() {
    return (
      Number.isFinite(Date.parse(this.expiresAt)) &&
      Date.parse(this.expiresAt) > Date.now()
    );
  }
  preflight(note: string) {
    if (
      !note.trim() ||
      Buffer.byteLength(JSON.stringify({ note }), "utf8") > 2800
    )
      throw new AppError(
        "NOTE_LENGTH",
        422,
        "Use a nonempty note under 2,800 UTF-8 bytes for note interpretation.",
      );
    if (!this.available)
      throw new AppError(
        "TINKER_CHECKPOINT_EXPIRED",
        503,
        "The trained note model needs renewal. Saved interpretations remain available.",
      );
    if (note.includes("<|"))
      throw new AppError(
        "NOTE_SPECIAL_TOKENS",
        422,
        "Remove model control tokens from the note before interpreting it.",
      );
    const prompt = `<|im_start|>system\n${tinkerSystemPrompt}<|im_end|>\n<|im_start|>user\n${`{"note": ${JSON.stringify(note)}}`}<|im_end|>\n<|im_start|>assistant\n<think>\n\n</think>\n\n`;
    if (Buffer.byteLength(prompt, "utf8") > 4096)
      throw new AppError(
        "NOTE_LENGTH",
        422,
        "This note exceeds the model input allowance.",
      );
    return prompt;
  }
  async interpret(note: string) {
    const prompt = this.preflight(note);
    const started = Date.now();
    // Qwen3 non-thinking chat template, identical to the training tokenizer.
    // JSON quotes isolate untrusted note content; no photo or location is sent.
    const response = await this.fetcher(
      "https://tinker.thinkingmachines.dev/services/tinker-prod/oai/api/v1/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.key}`,
          "Content-Type": "application/json",
        },
        signal: AbortSignal.timeout(30000),
        body: JSON.stringify({
          model: this.checkpoint,
          prompt,
          max_tokens: 512,
          temperature: 0,
          stop: ["<|im_end|>"],
        }),
      },
    );
    if (!response.ok)
      throw new AppError(
        "TINKER_UNAVAILABLE",
        503,
        "The note model is unavailable. Try again later; the photo report is unaffected.",
      );
    const raw = await response.text();
    if (raw.length > 64000)
      throw new AppError(
        "INVALID_MODEL_OUTPUT",
        502,
        "The note model returned an oversized response.",
      );
    try {
      const body = JSON.parse(raw);
      if (
        body.choices?.length !== 1 ||
        body.choices[0].finish_reason !== "stop"
      )
        throw new Error();
      const result = noteInterpretationSchema.parse(
        JSON.parse(body.choices[0].text),
      );
      return {
        result,
        model: "Qwen/Qwen3-8B",
        modelVersion: this.checkpoint,
        provider: "Tinker",
        promptVersion: tinkerPromptVersion,
        inputModality: "text",
        trainingData: "synthetic",
        evidenceSource: "user_report",
        changesIssueStatus: false,
        latencyMs: Date.now() - started,
        createdAt: new Date().toISOString(),
        inputTokens: body.usage?.prompt_tokens ?? null,
        outputTokens: body.usage?.completion_tokens ?? null,
      };
    } catch {
      throw new AppError(
        "INVALID_MODEL_OUTPUT",
        502,
        "The note model returned an invalid interpretation.",
      );
    }
  }
}

export class TinkerNoteService {
  constructor(
    private repository: IssueRepository,
    private provider: TinkerNoteProvider,
  ) {}
  get available() {
    return this.provider.available;
  }
  get checkpoint() {
    return this.provider.checkpoint;
  }
  async interpret(observationId: string, guestId?: string) {
    const pool = this.repository.pool;
    const observation = (
      await pool.query("SELECT note FROM observations WHERE id=$1", [
        observationId,
      ])
    ).rows[0];
    if (!observation)
      throw new AppError("NOT_FOUND", 404, "Observation not found.");
    if (!observation.note?.trim())
      throw new AppError(
        "NOTE_REQUIRED",
        422,
        "Add a note when reporting to use note interpretation.",
      );
    const key = [observationId, this.provider.checkpoint, tinkerPromptVersion];
    const cached = (
      await pool.query(
        "SELECT status,result FROM model_comparisons WHERE observation_id=$1 AND model=$2 AND prompt_version=$3",
        key,
      )
    ).rows[0];
    if (cached?.status === "complete")
      return { ...cached.result, cached: true };
    this.provider.preflight(observation.note);
    const token = randomUUID();
    const claim = await pool.query(
      `INSERT INTO model_comparisons(observation_id,model,prompt_version,status,lease_token) VALUES($1,$2,$3,'pending',$4)
      ON CONFLICT(observation_id,model,prompt_version) DO UPDATE SET status='pending',lease_token=$4,updated_at=now(),consented_at=now()
      WHERE (model_comparisons.status='failed' AND model_comparisons.updated_at<now()-interval '1 minute') OR (model_comparisons.status='pending' AND model_comparisons.updated_at<now()-interval '3 minutes') RETURNING model`,
      [...key, token],
    );
    if (!claim.rowCount)
      throw new AppError(
        "TINKER_BUSY",
        409,
        "A note interpretation is pending or recently failed. Wait a minute before retrying.",
      );
    try {
      await reserveModelAllowance(pool, "tinker", 200, guestId);
      const result = await trace(
        "Tinker note interpretation",
        "ai.tinker",
        () => this.provider.interpret(observation.note),
      );
      const saved = await pool.query(
        "UPDATE model_comparisons SET status='complete',result=$5,error_code=NULL,updated_at=now() WHERE observation_id=$1 AND model=$2 AND prompt_version=$3 AND lease_token=$4 RETURNING model",
        [...key, token, JSON.stringify(result)],
      );
      if (!saved.rowCount)
        throw new AppError(
          "TINKER_BUSY",
          409,
          "A newer request owns this note interpretation.",
        );
      return { ...result, cached: false };
    } catch (error) {
      const code =
        error instanceof AppError ? error.code : "TINKER_UNAVAILABLE";
      await pool.query(
        "UPDATE model_comparisons SET status='failed',error_code=$5,updated_at=now() WHERE observation_id=$1 AND model=$2 AND prompt_version=$3 AND lease_token=$4",
        [...key, token, code],
      );
      throw error instanceof AppError
        ? error
        : new AppError(code, 503, "The note model is temporarily unavailable.");
    }
  }
}
