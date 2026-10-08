import { createHash } from "node:crypto";
import {
  type CreateIssueInput,
  type ObservationInput,
  type PatchIssueInput,
} from "@fieldissue/shared";
import { IssueRepository } from "./repository.js";
import type { IntelligenceProvider, EvidenceInput } from "./intelligence.js";
import type { StorageProvider, Media } from "./storage.js";
import { AppError } from "./errors.js";
import {
  runCreateWorkflow,
  runRevisitWorkflow,
  validatedAnalysis,
} from "./workflows.js";
import type { PlaceContextProvider } from "./place.js";
export class IssueService {
  constructor(
    public readonly repository: IssueRepository,
    private readonly storage: StorageProvider,
    private readonly intelligence: IntelligenceProvider,
    private readonly place?: PlaceContextProvider,
    private readonly consume: (units: number) => Promise<void> = async () => {},
    private readonly predictionEnabled = true,
  ) {}
  private evidence(media: Media, note: string): EvidenceInput {
    return {
      image_base64: media.bytes.toString("base64"),
      mime_type: media.mime,
      note,
    };
  }
  async create(input: CreateIssueInput, media: Media, key?: string) {
    const hash = createHash("sha256")
      .update(JSON.stringify(input))
      .update(media.mime)
      .update(media.bytes)
      .digest("hex");
    let cleanupKey: string | undefined;
    try {
      // Committed replays need no provider calls. The repository rechecks under
      // its transaction lock to handle requests that race this initial lookup.
      let issueId = key
        ? await this.repository.findIdempotentIssue(key, hash)
        : null;
      let replayed = issueId !== null;
      let revisitMetadata: Record<string, unknown> | undefined;
      if (!issueId) {
        const result = await runCreateWorkflow(input, {
          analyze: async () => {
            await this.consume(1);
            return this.intelligence.analyze(this.evidence(media, input.note));
          },
          nearby: () => this.repository.nearby(input.latitude, input.longitude),
          persist: async (_input, analysis) => {
            const stored = await this.storage.put(media);
            cleanupKey = stored.storageKey;
            // Only issue/observation/event/idempotency writes hold a connection.
            // Inference and storage IO run outside the database transaction.
            const created = await this.repository.create(
              input,
              stored,
              analysis,
              key ? { key, hash } : undefined,
            );
            replayed = created.replayed;
            if (replayed) await this.storage.delete(stored.storageKey);
            // Once committed, later optional failures must not delete evidence.
            cleanupKey = undefined;
            return created.id;
          },
          metadata: (id) =>
            replayed ? Promise.resolve({}) : this.revisitMetadata(id),
        });
        issueId = result.issueId;
        revisitMetadata = replayed ? undefined : result.revisitMetadata;
      }
      const placeContext =
        !replayed && this.place
          ? await this.consume(1)
              .then(() => this.place!.context(input.latitude, input.longitude))
              .catch(() => null)
          : null;
      if (placeContext)
        await this.repository
          .savePlaceContext(issueId, placeContext)
          .catch(() => {});
      const saved = await this.repository.get(issueId);
      return {
        ...saved,
        placeContext: placeContext ?? saved.placeContext,
        nearbyIssues: (
          await this.repository.nearby(input.latitude, input.longitude)
        ).filter((nearby) => nearby.id !== issueId),
        replayed,
        revisitMetadata,
      };
    } catch (error) {
      if (cleanupKey) await this.storage.delete(cleanupKey).catch(() => {});
      throw error;
    }
  }

  async addObservation(
    id: string,
    input: ObservationInput,
    media: Media,
    key?: string,
  ) {
    const issue = await this.repository.get(id);
    const hash = createHash("sha256")
      .update(JSON.stringify(input))
      .update(media.mime)
      .update(media.bytes)
      .digest("hex");
    let observation = key
      ? await this.repository.findObservationRequest(issue.id, key, hash)
      : null;
    if (!observation) {
      await this.consume(1);
      const analysis = validatedAnalysis(
        await this.intelligence.analyze(this.evidence(media, input.note)),
      );
      const stored = await this.storage.put(media);
      try {
        observation = await this.repository.addObservation(
          issue.id,
          input,
          stored,
          analysis,
          key ? { key, hash } : undefined,
        );
      } catch (error) {
        await this.storage.delete(stored.storageKey).catch(() => {});
        throw error;
      }
      if (observation.replayed)
        await this.storage.delete(stored.storageKey).catch(() => {});
    }
    // Read the committed order, not a stale snapshot from before model inference.
    const ordered = (await this.repository.observations(issue.id)).items;
    const index = ordered.findIndex((o) => o.id === observation.id);
    const previous = ordered[index - 1];
    if (observation.replayed) {
      const cached = (await this.repository.diffs(issue.id)).items.find(
        (d) => d.afterObservationId === observation.id,
      );
      return {
        observation,
        realWorldDiff: cached ?? null,
        recommendedStatus: cached?.recommendedStatus ?? null,
        replayed: true,
        diffUnavailable: !cached && !!previous,
      };
    }
    if (previous) {
      try {
        const diff = await this.diff(issue.id, previous.id, observation.id);
        return {
          observation,
          realWorldDiff: diff,
          recommendedStatus: diff.recommendedStatus,
        };
      } catch {
        return {
          observation,
          realWorldDiff: null,
          recommendedStatus: null,
          diffUnavailable: true,
        };
      }
    }
    return { observation, recommendedStatus: null };
  }
  async diff(id: string, before: string, after: string) {
    const pair = await this.repository.pair(id, before, after);
    const beforeMedia = await this.storage.read(pair.before.storage_key);
    const afterMedia = await this.storage.read(pair.after.storage_key);
    // Identical bytes cannot establish a new field observation. Do this before
    // consulting old model output so earlier hallucinated comparisons can be corrected.
    if (beforeMedia.bytes.equals(afterMedia.bytes)) {
      return this.repository.saveIdentityComparison(
        pair.issueId,
        before,
        after,
      );
    }
    const cached = (await this.repository.diffs(pair.issueId)).items.find(
      (x) => x.beforeObservationId === before && x.afterObservationId === after,
    );
    if (cached) return cached;
    const result = await runRevisitWorkflow(
      {
        issueId: pair.issueId,
        beforeObservationId: before,
        afterObservationId: after,
      },
      {
        load: async () => {
          await this.repository.get(pair.issueId);
        },
        compare: async () => {
          await this.consume(1);
          return this.intelligence.compare({
            before: {
              ...this.evidence(beforeMedia, pair.before.note),
              evidence: pair.before.ai_analysis,
            },
            after: {
              ...this.evidence(afterMedia, pair.after.note),
              evidence: pair.after.ai_analysis,
            },
          });
        },
        persist: (comparison) =>
          this.repository.saveDiff(pair.issueId, before, after, comparison),
        metadata: () => this.revisitMetadata(pair.issueId),
      },
    );
    return { ...result.diff, revisitMetadata: result.revisitMetadata };
  }
  private async revisitMetadata(id: string): Promise<Record<string, unknown>> {
    if (!this.predictionEnabled)
      return { available: false, error: "PREDICTION_UNAVAILABLE" };
    let features: Record<string, string | number> | undefined;
    try {
      features = await this.repository.features(id);
      await this.consume(1);
      const prediction = await this.intelligence.predict(features);
      await this.repository.savePrediction(id, features, prediction);
      return { available: true, features, prediction };
    } catch (error) {
      return {
        available: false,
        features,
        error:
          error instanceof AppError ? error.code : "PREDICTION_UNAVAILABLE",
      };
    }
  }

  async patch(id: string, patch: PatchIssueInput) {
    return this.repository.get(await this.repository.patch(id, patch));
  }
  async resolve(
    id: string,
    note: string,
    resolution?: {
      basis: "latest_observation" | "manual_confirmation";
      observationId?: string;
    },
  ) {
    return this.repository.get(
      await this.repository.patch(id, { status: "RESOLVED" }, note, resolution),
    );
  }
  async predict(id: string) {
    if (!this.predictionEnabled)
      throw new AppError(
        "PREDICTION_UNAVAILABLE",
        503,
        "Revisit prediction needs genuine labeled history and configured model weights.",
      );
    const issue = await this.repository.get(id);
    if (["RESOLVED", "REJECTED"].includes(issue.status))
      throw new AppError(
        "INVALID_PREDICTION_TARGET",
        409,
        "Only active issues can be prioritized",
      );
    const features = await this.repository.features(issue.id);
    await this.consume(1);
    const output = await this.intelligence.predict(features);
    await this.repository.savePrediction(issue.id, features, output);
    return output;
  }
}
