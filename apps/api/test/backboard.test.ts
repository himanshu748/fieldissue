import { it, expect, vi } from "vitest";
import { BackboardProvider, comparisonModels } from "../src/backboard.js";
import { createApp } from "../src/app.js";
const output = {
  category: "OTHER",
  severity: "LOW",
  rationale: "Text-only interpretation.",
  evidence: ["broken bench"],
};
const response = (extra: object = {}) =>
  new Response(
    JSON.stringify({
      status: "COMPLETED",
      model_name: comparisonModels[0],
      model_provider: "openrouter",
      content: JSON.stringify(output),
      ...extra,
    }),
    { status: 200 },
  );
it("uses an allowlisted model with memory and web search off and validates evidence provenance", async () => {
  const fetcher = vi.fn(async () => response());
  const provider = new BackboardProvider("private-test-key", fetcher as any);
  const result = await provider.interpret(
    comparisonModels[0],
    "A broken bench",
  );
  expect(result.result).toEqual(output);
  const body = JSON.parse((fetcher.mock.calls[0] as any)[1].body);
  expect(body).toMatchObject({
    model_name: comparisonModels[0],
    memory: "off",
    web_search: "off",
    json_output: true,
    openrouter: { max_price: { prompt: 0.5, completion: 0.5 } },
  });
  const bad = new BackboardProvider("private-test-key", async () =>
    response({
      content: JSON.stringify({ ...output, evidence: ["a repaired bench"] }),
    }),
  );
  await expect(
    bad.interpret(comparisonModels[0], "A broken bench"),
  ).rejects.toMatchObject({ code: "INVALID_MODEL_OUTPUT" });
  const wrong = new BackboardProvider("private-test-key", async () =>
    response({ model_name: "another-model" }),
  );
  await expect(
    wrong.interpret(comparisonModels[0], "A broken bench"),
  ).rejects.toMatchObject({ code: "INVALID_MODEL_OUTPUT" });
});
it("requires access, explicit consent and two distinct allowed models before any provider call", async () => {
  const compare = vi.fn(async () => ({ results: [] }));
  const app = createApp({
    repository: {} as any,
    service: {} as any,
    storage: {} as any,
    maxUploadBytes: 1024,
    accessToken: "test-access",
    modelComparison: { compare } as any,
  });
  const base = {
    observationId: "00000000-0000-4000-8000-000000000001",
    models: [...comparisonModels],
    consentToExternalProcessing: true,
  };
  const send = (body: object, auth = true) =>
    app.request("/v1/model-lab/compare", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(auth ? { Authorization: "Bearer test-access" } : {}),
      },
      body: JSON.stringify(body),
    });
  expect((await send(base, false)).status).toBe(401);
  expect(
    (await send({ ...base, consentToExternalProcessing: false })).status,
  ).toBe(400);
  expect(
    (
      await send({
        ...base,
        models: [comparisonModels[0], comparisonModels[0]],
      })
    ).status,
  ).toBe(400);
  expect(
    (
      await send({
        ...base,
        models: ["arbitrary-expensive-model", comparisonModels[0]],
      })
    ).status,
  ).toBe(400);
  expect(compare).not.toHaveBeenCalled();
  expect((await send(base)).status).toBe(200);
  expect(compare).toHaveBeenCalledTimes(1);
});
