import { beforeAll, afterAll, describe, it, expect, vi } from "vitest";
import { Pool } from "pg";
import { IssueRepository } from "../src/repository.js";
import { migrate } from "../src/migrate.js";
import { ModelComparisonService, comparisonModels } from "../src/backboard.js";
import { AppError } from "../src/errors.js";
const suite = process.env.TEST_DATABASE_URL ? describe : describe.skip;
suite("comparison failure cooldown and recovery", () => {
  let pool: Pool,
    repository: IssueRepository,
    issueId: string,
    observationId: string;
  beforeAll(async () => {
    pool = new Pool({ connectionString: process.env.TEST_DATABASE_URL });
    await migrate(pool);
    repository = new IssueRepository(pool);
    const issue = await repository.create(
      {
        title: "Backboard regression fixture",
        description: "",
        note: 'Sign says "closed"\nUse alternate path',
        latitude: 0,
        longitude: 0,
      },
      {
        mediaUrl: "https://example.test/fixture.png",
        storageKey: "backboard-fixture.png",
        mimeType: "image/png",
      },
      {
        objects: ["sign"],
        conditions: ["closed"],
        suggestedCategory: "OTHER",
        suggestedSeverity: "LOW",
        evidence: [],
        confidence: 0.5,
        model: "development-fixture",
        modelVersion: "test",
      },
    );
    issueId = issue.id;
    observationId = (await repository.get(issueId)).observations[0]!.id;
  });
  afterAll(async () => {
    if (issueId) await pool.query("DELETE FROM issues WHERE id=$1", [issueId]);
    await pool?.end();
  });
  it("keeps invalid output failed, prevents immediate spending, then recovers and caches", async () => {
    const interpret = vi
      .fn()
      .mockRejectedValueOnce(
        new AppError("INVALID_MODEL_OUTPUT", 502, "invalid"),
      )
      .mockRejectedValueOnce(
        new AppError("INVALID_MODEL_OUTPUT", 502, "invalid"),
      )
      .mockResolvedValue({
        model: comparisonModels[0],
        result: {
          category: "OTHER",
          severity: "LOW",
          rationale: "text only",
          evidence: ['Sign says "closed"'],
        },
      });
    const consume = vi.fn(async () => {});
    const service = new ModelComparisonService(
      repository,
      { interpret } as any,
      consume,
    );
    expect(
      (await service.compare(observationId, [comparisonModels[0]])).results[0],
    ).toMatchObject({ status: "failed" });
    expect(
      (await service.compare(observationId, [comparisonModels[0]])).results[0],
    ).toMatchObject({ status: "failed", retryAfterSeconds: 60 });
    expect(interpret).toHaveBeenCalledTimes(2);
    await pool.query(
      "UPDATE model_comparisons SET updated_at=now()-interval '61 seconds' WHERE observation_id=$1",
      [observationId],
    );
    expect(
      (await service.compare(observationId, [comparisonModels[0]])).results[0],
    ).toMatchObject({ status: "complete", cached: false });
    expect(
      (await service.compare(observationId, [comparisonModels[0]])).results[0],
    ).toMatchObject({ status: "complete", cached: true });
    expect(interpret).toHaveBeenCalledTimes(3);
    expect(consume).toHaveBeenCalledTimes(3);
    expect(interpret.mock.calls[0]![1]).toContain(
      'Sign says "closed"\nUse alternate path',
    );
  });
});
