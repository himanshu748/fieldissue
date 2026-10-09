import { beforeAll, afterAll, describe, it, expect, vi } from "vitest";
import { Pool } from "pg";
import { IssueRepository } from "../src/repository.js";
import { migrate } from "../src/migrate.js";
import { TinkerNoteService } from "../src/tinker.js";
import { AppError } from "../src/errors.js";
const suite = process.env.TEST_DATABASE_URL ? describe : describe.skip;
suite("Tinker persistent cache and lifetime allowance", () => {
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
        title: "Tinker regression fixture",
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
  it("caches a completed note and enforces the persistent 200-call cap", async () => {
    await pool.query(
      "DELETE FROM integration_allowances WHERE provider LIKE 'tinker%'",
    );
    const interpret = vi.fn(async () => ({
      result: {
        category: "SIGNAGE",
        severity: "LOW",
        object: "sign",
        condition: "closed",
        evidence: [],
      },
    }));
    const provider = {
      checkpoint: "tinker://test/sampler_weights/one",
      interpret,
      preflight: () => {},
    } as any;
    const service = new TinkerNoteService(repository, provider);
    expect(await service.interpret(observationId)).toMatchObject({
      cached: false,
    });
    expect(await service.interpret(observationId)).toMatchObject({
      cached: true,
    });
    expect(interpret).toHaveBeenCalledTimes(1);

    await pool.query(
      "UPDATE integration_allowances SET units=200 WHERE provider LIKE 'tinker%'",
    );
    const other = new TinkerNoteService(repository, {
      ...provider,
      checkpoint: "tinker://test/sampler_weights/two",
    });
    await expect(other.interpret(observationId)).rejects.toMatchObject({
      code: "MODEL_CREDIT_LIMIT",
    });
    await expect(other.interpret(observationId)).rejects.toMatchObject({
      code: "TINKER_BUSY",
    });
    expect(interpret).toHaveBeenCalledTimes(1);
    expect(await service.interpret(observationId)).toMatchObject({
      cached: true,
    });
    await pool.query(
      "DELETE FROM integration_allowances WHERE provider LIKE 'tinker%'",
    );
  });
});
