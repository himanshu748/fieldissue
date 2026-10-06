import { expect, it } from "vitest";
import { SerpApiPlaceContextProvider } from "../src/place.js";
import { ElevenLabsSpeechProvider, buildBriefing } from "../src/audio.js";
it("optional place failure returns no context", async () => {
  const provider = new SerpApiPlaceContextProvider(
    "test-key",
    20,
    async () => new Response("{}", { status: 500 }),
  );
  expect(await provider.context(12, 77)).toBeNull();
});
it("validates place response and times out cleanly", async () => {
  const provider = new SerpApiPlaceContextProvider(
    "test-key",
    20,
    async (_url, options) =>
      new Promise((_resolve, reject) =>
        options?.signal?.addEventListener("abort", () =>
          reject(new Error("timeout")),
        ),
      ),
  );
  expect(await provider.context(12, 77)).toBeNull();
});
it("ElevenLabs sends official TTS payload and rejects malformed output", async () => {
  let payload: any;
  const speech = new ElevenLabsSpeechProvider(
    "key",
    "public-voice",
    "eleven_multilingual_v2",
    100,
    async (url, options) => {
      expect(String(url)).toContain(
        "https://api.elevenlabs.io/v1/text-to-speech/",
      );
      payload = JSON.parse(options!.body as string);
      return new Response(Buffer.from([0x49, 0x44, 0x33, 1, 2, 3]), {
        headers: { "Content-Type": "audio/mpeg" },
      });
    },
  );
  const audio = await speech.generate("Field issue fourteen");
  expect(audio.bytes.subarray(0, 3).toString()).toBe("ID3");
  expect(payload.model_id).toBe("eleven_multilingual_v2");
  const malformed = new ElevenLabsSpeechProvider(
    "key",
    "voice",
    "model",
    100,
    async () =>
      new Response("{}", { headers: { "Content-Type": "application/json" } }),
  );
  await expect(malformed.generate("briefing")).rejects.toThrow();
});
it("builds deterministic briefing from saved issue content only", () => {
  const text = buildBriefing(
    {
      publicId: "FI-000014",
      title: "Broken bench",
      status: "OPEN",
      observations: [{ capturedAt: "2026-10-01T12:00:00Z" }],
      revisitPrediction: { priorityScore: 0.8 },
    },
    new Date("2026-10-04T12:00:00Z"),
  );
  expect(text).toContain("Field issue 14");
  expect(text).toContain("3 days ago");
  expect(text).toContain("Revisit recommended");
});
