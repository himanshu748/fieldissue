import { expect, it } from "vitest";
import { publicSummary } from "../src/public-summary.js";
it("shares only a small allowlist and a coarse location", () => {
  const result = publicSummary({
    publicId: "FI-000001",
    category: "TRAIL",
    severity: "LOW",
    status: "OPEN",
    latitude: 12.97621,
    longitude: 77.59291,
    title: "private home",
    description: "sensitive text",
    reporterId: "identity",
    observations: [{ note: "private", storageKey: "private" }],
    placeContext: { address: "private address" },
  });
  expect(result.publicLocation).toMatchObject({
    latitude: 12.98,
    longitude: 77.59,
  });
  expect(JSON.stringify(result)).not.toMatch(
    /private|identity|12.97621|77.59291/,
  );
  expect(Object.keys(result).sort()).toEqual(
    ["publicId", "category", "severity", "status", "publicLocation"].sort(),
  );
});
