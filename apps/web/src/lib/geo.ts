export interface Point {
  latitude: number;
  longitude: number;
}

export interface Located extends Point {
  source: "device" | "manual";
  accuracy?: number;
}

export function requestDeviceLocation(): Promise<Located> {
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) {
      reject(new Error("This browser has no location access. Enter coordinates instead."));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) =>
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          source: "device",
        }),
      (error) =>
        reject(
          new Error(
            error.code === error.PERMISSION_DENIED
              ? "Location permission was declined. Enter coordinates instead."
              : "Your location could not be determined. Enter coordinates instead.",
          ),
        ),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 },
    );
  });
}

export function parseCoordinate(value: string, min: number, max: number) {
  const n = Number(value.trim());
  return value.trim() !== "" && Number.isFinite(n) && n >= min && n <= max ? n : null;
}

export function distanceMeters(a: Point, b: Point) {
  const rad = Math.PI / 180;
  const dLat = (b.latitude - a.latitude) * rad;
  const dLon = (b.longitude - a.longitude) * rad;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(a.latitude * rad) * Math.cos(b.latitude * rad) * Math.sin(dLon / 2) ** 2;
  return 6371000 * 2 * Math.asin(Math.sqrt(Math.min(1, h)));
}

export function formatDistance(meters: number) {
  if (meters < 1000) return `${Math.round(meters / 10) * 10} m`;
  return `${(meters / 1000).toFixed(meters < 10000 ? 1 : 0)} km`;
}

export function formatCoords(p: Point) {
  return `${p.latitude.toFixed(5)}, ${p.longitude.toFixed(5)}`;
}

const LAST = "fieldissue-last-location";

// Remembered only for this tab so Explore, Walk and Report agree on one origin.
export function rememberLocation(point: Located) {
  try {
    sessionStorage.setItem(LAST, JSON.stringify(point));
  } catch {
    // Non-essential.
  }
}

export function recallLocation(): Located | null {
  try {
    const raw = sessionStorage.getItem(LAST);
    if (!raw) return null;
    const p = JSON.parse(raw) as Located;
    return Number.isFinite(p.latitude) && Math.abs(p.latitude) <= 90 && Number.isFinite(p.longitude) && Math.abs(p.longitude) <= 180 && ["device", "manual"].includes(p.source) ? p : null;
  } catch {
    return null;
  }
}
