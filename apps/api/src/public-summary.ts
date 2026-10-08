import type { Row } from "./repository.js";
/** Deliberately excludes free text, media, place addresses, reporter data and exact GPS. */
export function publicSummary(issue: Row) {
  return {
    publicId: issue.publicId,
    category: issue.category,
    severity: issue.severity,
    status: issue.status,
    publicLocation: {
      latitude: Math.round(issue.latitude * 100) / 100,
      longitude: Math.round(issue.longitude * 100) / 100,
      precision: "Rounded to 0.01 degrees (about 1 km); not an exact position",
    },
  };
}
