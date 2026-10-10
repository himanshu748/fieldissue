import { expect, it } from "vitest";
import { publicResponse } from "../src/public-coordinates.js";

it("inherits ownership for observations without granting it to another nested issue", () => {
  const value = {
    publicId: "FI-000007",
    status: "OPEN",
    guestOwner: "owner",
    latitude: 26.9402177,
    observations: [{ latitude: 26.9402177, longitude: 80.9169963 }],
    nearbyIssues: [
      { guestOwner: "other", latitude: 26.9399027, longitude: 80.9169585 },
    ],
  };
  const clean = publicResponse(value, "owner");
  expect(clean.observations[0].latitude).toBe(26.9402177);
  expect(clean.nearbyIssues[0]).toEqual({ latitude: 26.94, longitude: 80.917 });
  expect(clean).not.toHaveProperty("guestOwner");
  expect(value.nearbyIssues[0]!.latitude).toBe(26.9399027);
});

it("rounds both GeoJSON geometry and properties using each feature's ownership", () => {
  const feature = (owner: string) => ({
    type: "Feature",
    geometry: { type: "Point", coordinates: [80.9169963, 26.9402177] },
    properties: {
      guestOwner: owner,
      latitude: 26.9402177,
      longitude: 80.9169963,
    },
  });
  const result = publicResponse(
    { features: [feature("owner"), feature("other")] },
    "owner",
  );
  expect(result.features[0].geometry.coordinates).toEqual([
    80.9169963, 26.9402177,
  ]);
  expect(result.features[1].geometry.coordinates).toEqual([80.917, 26.94]);
});
