import { expect, it, vi } from "vitest";
import { TabPFNDemoProvider, demoFeaturesSchema } from "../src/tabpfn-demo.js";
const features = {
  days_since_last_observation: 7,
  previous_observation_count: 3,
  issue_age_days: 21,
  severity: 1,
  category: 0,
  nearby_issue_count: 4,
  previous_change_count: 1,
  status: 0,
};
const response = (body: unknown) => new Response(JSON.stringify(body));
function fetcherFor({
  upload = "https://storage.googleapis.com/test/upload",
  quote = 10000,
  classes = [0, 1],
  probabilities = [[0.6, 0.4]],
} = {}) {
  return vi.fn(async (url: any) => {
    const u = String(url);
    if (u.endsWith("estimate_cost")) return response({ estimated_cost: quote });
    if (u.endsWith("prepare_test_set_upload"))
      return response({
        test_set_upload_id: "test",
        x_test_info: {
          signed_urls: [upload],
          required_headers: { "Content-Type": "text/csv" },
        },
      });
    if (u.endsWith("/predict"))
      return response({
        prediction: probabilities,
        metadata: { classes, n_estimators: 8, billing_model_version: "v3.5" },
      });
    return new Response(null, { status: 200 });
  });
}
it("runs real REST protocol with numeric inputs, bounded cost and separate storage credentials", async () => {
  const fetcher = fetcherFor();
  const result = await new TabPFNDemoProvider(
    "private-key",
    "fitted-id",
    fetcher,
  ).predict(features);
  expect(result).toMatchObject({
    probability: 0.4,
    trainingData: "synthetic",
    trainingRows: 96,
    changesIssueStatus: false,
    usedForWalkRanking: false,
  });
  const upload = fetcher.mock.calls.find((c) =>
    String(c[0]).includes("storage.googleapis.com"),
  ) as any;
  expect(upload[1].headers).not.toHaveProperty("Authorization");
  expect(upload[1].body).toContain("days_since_last_observation");
  expect(upload[1].body).toContain("7,3,21,1,0,4,1,0");
  expect(fetcher).toHaveBeenCalledTimes(4);
});
it("blocks unsafe upload destinations before sending any dataset", async () => {
  const fetcher = fetcherFor({ upload: "http://127.0.0.1/private" });
  await expect(
    new TabPFNDemoProvider("key", "fit", fetcher).predict(features),
  ).rejects.toMatchObject({ code: "INVALID_PROVIDER_RESPONSE" });
  expect(fetcher).toHaveBeenCalledTimes(2);
});
it("refuses quotes over the free token ceiling", async () => {
  const fetcher = fetcherFor({ quote: 50001 });
  await expect(
    new TabPFNDemoProvider("key", "fit", fetcher).predict(features),
  ).rejects.toMatchObject({ code: "TABPFN_QUOTA_BOUND" });
  expect(fetcher).toHaveBeenCalledTimes(1);
});
it("checks class provenance and normalized probabilities", async () => {
  await expect(
    new TabPFNDemoProvider(
      "key",
      "fit",
      fetcherFor({ classes: [1, 0] }),
    ).predict(features),
  ).rejects.toMatchObject({ code: "INVALID_PROVIDER_RESPONSE" });
  await expect(
    new TabPFNDemoProvider(
      "key",
      "fit",
      fetcherFor({ probabilities: [[0.7, 0.4]] }),
    ).predict(features),
  ).rejects.toMatchObject({ code: "INVALID_MODEL_OUTPUT" });
});
it("rejects impossible chronology and private input fields", () => {
  expect(
    demoFeaturesSchema.safeParse({ ...features, issue_age_days: 1 }).success,
  ).toBe(false);
  expect(
    demoFeaturesSchema.safeParse({ ...features, previous_change_count: 3 })
      .success,
  ).toBe(false);
  expect(
    demoFeaturesSchema.safeParse({ ...features, note: "private note" }).success,
  ).toBe(false);
});
