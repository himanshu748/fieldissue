import { describe, expect, it } from "vitest";
import { IntelligenceClient } from "../src/intelligence.js";
const input = {
  image_base64: "aQ==",
  mime_type: "image/png",
  note: "broken bench",
};
describe("intelligence boundaries", () => {
  it("enforces provider timeout", async () => {
    const client = new IntelligenceClient(
      "http://127.0.0.1:8000",
      "test-token",
      20,
      0,
      async (_url, opts) =>
        new Promise((_resolve, reject) =>
          opts?.signal?.addEventListener("abort", () =>
            reject(new Error("aborted")),
          ),
        ),
    );
    await expect(client.analyze(input)).rejects.toMatchObject({
      code: "PROVIDER_TIMEOUT",
    });
  });
  it("rejects malformed model JSON without retrying", async () => {
    let calls = 0;
    const client = new IntelligenceClient(
      "http://127.0.0.1:8000",
      "test-token",
      100,
      2,
      async () => {
        calls++;
        return new Response(JSON.stringify({ confidence: 9 }));
      },
    );
    await expect(client.analyze(input)).rejects.toMatchObject({
      code: "INVALID_MODEL_OUTPUT",
    });
    expect(calls).toBe(1);
  });
});
