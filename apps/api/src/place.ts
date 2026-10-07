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
const placeSchema = z.object({
  title: z.string().trim().min(1).max(300),
  address: z.string().max(500).optional(),
  place_id: z.string().max(200).optional(),
  gps_coordinates: z
    .object({
      latitude: z.number().min(-90).max(90),
      longitude: z.number().min(-180).max(180),
    })
    .optional(),
});
const responseSchema = z.object({
  local_results: z.array(placeSchema).optional(),
  // Maps can return a single place even when type=search was requested.
  place_results: placeSchema.optional(),
});
function distanceMeters(
  lat: number,
  lon: number,
  otherLat: number,
  otherLon: number,
) {
  const radians = Math.PI / 180;
  const a =
    Math.sin(((otherLat - lat) * radians) / 2) ** 2 +
    Math.cos(lat * radians) *
      Math.cos(otherLat * radians) *
      Math.sin(((otherLon - lon) * radians) / 2) ** 2;
  return 6371000 * 2 * Math.asin(Math.sqrt(Math.min(1, a)));
}
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
          q: "landmarks",
          ll: `@${latitude},${longitude},16z`,
          type: "search",
          api_key: this.apiKey,
        }).toString();
        const r = await this.fetcher(url, { signal: controller.signal });
        if (!r.ok) throw new Error("unavailable");
        const parsed = responseSchema.safeParse(await r.json());
        if (!parsed.success) throw new Error("invalid");
        // `ll` only biases Maps search; a matching name can be in another city.
        // Require coordinates and choose an actually nearby place.
        const candidates = [
          ...(parsed.data.local_results ?? []),
          ...(parsed.data.place_results ? [parsed.data.place_results] : []),
        ];
        const place = candidates
          .flatMap((candidate) => {
            const gps = candidate.gps_coordinates;
            if (!gps) return [];
            const distance = distanceMeters(
              latitude,
              longitude,
              gps.latitude,
              gps.longitude,
            );
            return distance <= 2000 ? [{ candidate, distance }] : [];
          })
          .sort((a, b) => a.distance - b.distance)[0]?.candidate;
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
