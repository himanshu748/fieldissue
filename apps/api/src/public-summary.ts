import { publicCoordinate } from "./public-coordinates.js";
import type { Row } from "./repository.js";
/** Deliberately excludes free text, media, place addresses, reporter data. */
export function publicSummary(issue: Row, precise = false) {
  return {
    publicId: issue.publicId,
    category: issue.category,
    severity: issue.severity,
    status: issue.status,
    publicLocation: {
      latitude: precise ? issue.latitude : publicCoordinate(issue.latitude),
      longitude: precise ? issue.longitude : publicCoordinate(issue.longitude),
      precision: precise
        ? "Full precision for the owner or operator"
        : "Rounded to 0.001 degrees (about 100 m); not an exact position",
    },
  };
}
