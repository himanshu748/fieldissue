/** Round public output only; stored coordinates and spatial queries stay precise. */
export const publicCoordinate = (value: number) =>
  Math.round(value * 1000) / 1000;

export function publicResponse(
  value: any,
  guestId?: string,
  inheritedOwner = false,
): any {
  if (Array.isArray(value))
    return value.map((item) => publicResponse(item, guestId, inheritedOwner));
  if (!value || typeof value !== "object") return value;
  const ownerSource = value.type === "Feature" ? value.properties : value;
  const owner =
    ownerSource && Object.hasOwn(ownerSource, "guestOwner")
      ? !!guestId && ownerSource.guestOwner === guestId
      : inheritedOwner;
  const out: Record<string, unknown> = {};
  for (const [key, item] of Object.entries(value)) {
    if (["guestOwner", "reporterId"].includes(key)) continue;
    if (
      !owner &&
      ["latitude", "longitude"].includes(key) &&
      typeof item === "number"
    )
      out[key] = publicCoordinate(item);
    else if (
      !owner &&
      value.type === "Point" &&
      key === "coordinates" &&
      Array.isArray(item)
    )
      out[key] = item.map((coordinate) =>
        typeof coordinate === "number"
          ? publicCoordinate(coordinate)
          : coordinate,
      );
    else out[key] = publicResponse(item, guestId, owner);
  }
  if (value.publicId && value.status) out.permissions = { manage: owner };
  return out;
}
