import { expect, it, vi } from "vitest";
import { IssueService } from "../src/service.js";
import type { IssueRepository } from "../src/repository.js";
import type { IntelligenceProvider } from "../src/intelligence.js";
import type { StorageProvider } from "../src/storage.js";
import { AppError } from "../src/errors.js";

const id = "00000000-0000-4000-8000-000000000001";
const input = {
  title: "Bench",
  description: "",
  note: "broken",
  latitude: 12,
  longitude: 77,
};
const media = {
  bytes: Buffer.from("fixture"),
  mime: "image/png",
  filename: "bench.png",
};
function setup() {
  const repository = {
    findIdempotentIssue: vi.fn(async () => null as string | null),
    nearby: vi.fn(async () => []),
    create: vi.fn(async () => ({ id, replayed: false })),
    get: vi.fn(async () => ({ id, status: "OPEN" })),
    features: vi.fn(async () => ({ status: "OPEN" })),
    savePrediction: vi.fn(async () => {}),
  };
  const storage = {
    put: vi.fn(async () => ({
      storageKey: "uploaded-fixture",
      mediaUrl: "/media/uploaded-fixture",
      mimeType: "image/png",
    })),
    read: vi.fn(),
    delete: vi.fn(async () => {}),
  };
  const intelligence = {
    analyze: vi.fn(async () => ({
      objects: ["bench"],
      conditions: ["broken"],
      suggestedCategory: "OTHER" as const,
      suggestedSeverity: "LOW" as const,
      evidence: [],
      confidence: 0,
      model: "fixture",
      modelVersion: "test",
    })),
    compare: vi.fn(),
    predict: vi.fn(async () => ({
      probabilityChanged: 0.5,
      priorityScore: 0.2,
      modelVersion: "test",
    })),
  };
  const service = new IssueService(
    repository as unknown as IssueRepository,
    storage satisfies StorageProvider,
    intelligence satisfies IntelligenceProvider,
  );
  return { service, repository, storage, intelligence };
}

it("returns a committed replay without inference or another upload", async () => {
  const { service, repository, storage, intelligence } = setup();
  repository.findIdempotentIssue.mockResolvedValue(id);
  const result = await service.create(input, media, "existing-key");
  expect(result).toMatchObject({ id, replayed: true });
  expect(intelligence.analyze).not.toHaveBeenCalled();
  expect(intelligence.predict).not.toHaveBeenCalled();
  expect(storage.put).not.toHaveBeenCalled();
});

it("rejects a conflicting committed key before spending provider credits", async () => {
  const { service, repository, storage, intelligence } = setup();
  repository.findIdempotentIssue.mockRejectedValue(
    new AppError("IDEMPOTENCY_CONFLICT", 409, "Conflicting request"),
  );
  await expect(
    service.create(input, media, "existing-key"),
  ).rejects.toMatchObject({
    code: "IDEMPOTENCY_CONFLICT",
  });
  expect(intelligence.analyze).not.toHaveBeenCalled();
  expect(storage.put).not.toHaveBeenCalled();
});

it("cleans the unused upload when another request wins the idempotency race", async () => {
  const { service, repository, storage, intelligence } = setup();
  repository.create.mockResolvedValue({ id, replayed: true });
  const result = await service.create(input, media, "concurrent-key");
  expect(result).toMatchObject({ id, replayed: true });
  expect(repository.create).toHaveBeenCalledWith(
    input,
    expect.anything(),
    expect.anything(),
    { key: "concurrent-key", hash: expect.stringMatching(/^[a-f0-9]{64}$/) },
  );
  expect(storage.delete).toHaveBeenCalledExactlyOnceWith("uploaded-fixture");
  expect(intelligence.predict).not.toHaveBeenCalled();
});

it.each(["write failure", "idempotency conflict"])(
  "cleans uncommitted media after a %s",
  async (reason) => {
    const { service, repository, storage } = setup();
    repository.create.mockRejectedValue(new Error(reason));
    await expect(service.create(input, media, "new-key")).rejects.toThrow(
      reason,
    );
    expect(storage.delete).toHaveBeenCalledExactlyOnceWith("uploaded-fixture");
  },
);

it.each(["features", "predict", "savePrediction"] as const)(
  "preserves a committed issue and its media when optional %s fails",
  async (operation) => {
    const { service, repository, storage, intelligence } = setup();
    const callback =
      operation === "predict" ? intelligence.predict : repository[operation];
    callback.mockRejectedValue(new Error("optional metadata unavailable"));
    const result = await service.create(input, media);
    expect(result).toMatchObject({
      id,
      status: "OPEN",
      replayed: false,
      revisitMetadata: { available: false },
    });
    expect(storage.delete).not.toHaveBeenCalled();
  },
);

it("does not remove committed evidence if reading the response fails", async () => {
  const { service, repository, storage } = setup();
  repository.get.mockRejectedValue(new Error("read temporarily unavailable"));
  await expect(service.create(input, media)).rejects.toThrow(
    "read temporarily unavailable",
  );
  expect(storage.delete).not.toHaveBeenCalled();
});
