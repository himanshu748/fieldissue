import { z } from "zod";
import { reportFailure, trace } from "./telemetry.js";
export interface PlaceContext {
  name: string;
  address?: string;
  source: "SerpApi";
  providerPlaceId?: string;
}
export interface PlaceContextProvider {
  context(latitude: number, longitude: number): Promise<PlaceContext | null>;
}
const responseSchema = z.object({
  local_results: z
    .array(
      z.object({
        title: z.string().max(300),
        address: z.string().max(500).optional(),
        place_id: z.string().max(200).optional(),
      }),
    )
    .optional(),
});
export class SerpApiPlaceContextProvider implements PlaceContextProvider {
  constructor(
    private readonly apiKey: string,
    private readonly timeoutMs = 5000,
    private readonly fetcher: typeof fetch = fetch,
  ) {}
  async context(latitude: number, longitude: number) {
    if (!this.apiKey) return null;
    return trace("place-context", "http.client", async () => {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.timeoutMs);
      try {
        const url = new URL("https://serpapi.com/search.json");
        url.search = new URLSearchParams({
          engine: "google_maps",
          q: "park landmark",
          ll: `@${latitude},${longitude},16z`,
          type: "search",
          api_key: this.apiKey,
        }).toString();
        const r = await this.fetcher(url, { signal: controller.signal });
        if (!r.ok) throw new Error("unavailable");
        const parsed = responseSchema.safeParse(await r.json());
        if (!parsed.success) throw new Error("invalid");
        const place = parsed.data.local_results?.[0];
        return place
          ? {
              name: place.title,
              address: place.address,
              source: "SerpApi" as const,
              providerPlaceId: place.place_id,
            }
          : null;
      } catch {
        reportFailure("PLACE_CONTEXT_UNAVAILABLE", "serpapi");
        return null;
      } finally {
        clearTimeout(timer);
      }
    });
  }
}
