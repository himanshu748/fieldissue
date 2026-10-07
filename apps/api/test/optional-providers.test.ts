import { expect, it } from "vitest";
import { SerpApiPlaceContextProvider } from "../src/place.js";
import { ElevenLabsSpeechProvider, buildBriefing } from "../src/audio.js";
it.each(["local_results", "place_results"])(
  "accepts SerpApi's %s response shape",
  async (field) => {
    const place = {
      title: "Public park",
      address: "Bengaluru",
      place_id: "place-123",
      gps_coordinates: { latitude: 12.9763, longitude: 77.5929 },
    };
    const provider = new SerpApiPlaceContextProvider(
      "test-key",
      100,
      async () =>
        Response.json({ [field]: field === "local_results" ? [place] : place }),
    );
    expect(await provider.context(12.9763, 77.5929)).toEqual({
      name: place.title,
      address: place.address,
      providerPlaceId: place.place_id,
      source: "SerpApi",
    });
  },
);
it.each([
  {
    title: "Park Landmark",
    gps_coordinates: { latitude: 18.457, longitude: 73.864 },
  },
  { title: "Place without a verified position" },
])("ignores geographically unverified Maps results", async (place) => {
  const provider = new SerpApiPlaceContextProvider("test-key", 100, async () =>
    Response.json({ place_results: place }),
  );
  expect(await provider.context(12.9763, 77.5929)).toBeNull();
});
it("chooses the closest nearby result instead of the first search hit", async () => {
  const provider = new SerpApiPlaceContextProvider("test-key", 100, async () =>
    Response.json({
      local_results: [
        {
          title: "Far away",
          gps_coordinates: { latitude: 18.457, longitude: 73.864 },
        },
        {
          title: "Nearby",
          gps_coordinates: { latitude: 12.985, longitude: 77.593 },
        },
        {
          title: "Closest",
          gps_coordinates: { latitude: 12.9763, longitude: 77.5929 },
        },
      ],
    }),
  );
  expect((await provider.context(12.9763, 77.5929))?.name).toBe("Closest");
});
it("rejects malformed single-place results without blocking issue creation", async () => {
  const provider = new SerpApiPlaceContextProvider("test-key", 100, async () =>
    Response.json({ place_results: { title: "   " } }),
  );
  expect(await provider.context(12, 77)).toBeNull();
});
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
