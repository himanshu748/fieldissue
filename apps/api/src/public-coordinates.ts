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

/** SQL for the same visible point used in public JSON. Parameters are bound UUIDs. */
export function visiblePointSql(ownerParameter: string, alias: "" | "i" = "") {
  const prefix = alias ? `${alias}.` : "";
  return `(CASE WHEN ${prefix}guest_owner=${ownerParameter}::uuid THEN ${prefix}geom ELSE ST_SetSRID(ST_MakePoint(floor(${prefix}longitude*1000+0.5)/1000,floor(${prefix}latitude*1000+0.5)/1000),4326) END)`;
}

/** Rounding moves a point less than 80 m. The wider indexed filter cannot hide a visible match. */
export function visibleRadiusSql(
  precise: string,
  visible: string,
  center: string,
  radius: string,
) {
  return `(ST_DWithin(${precise}::geography,${center},(${radius})+100) AND ST_DWithin(${visible}::geography,${center},${radius}))`;
}
