import { z } from "zod";
import type { Pool } from "pg";
export async function duplicates(
  pool: Pool,
  input: {
    latitude: number;
    longitude: number;
    note: string;
    category?: string;
  },
) {
  const r = await pool.query(
    `WITH nearby AS (SELECT id,public_id,title,category,status,ST_Distance(geom::geography,ST_SetSRID(ST_MakePoint($2,$1),4326)::geography) AS distance_meters,
 ts_rank_cd(to_tsvector('simple',coalesce(title,'')||' '||coalesce(description,'')),plainto_tsquery('simple',$3)) AS text_score FROM issues
 WHERE is_public AND status NOT IN ('RESOLVED','REJECTED') AND ST_DWithin(geom::geography,ST_SetSRID(ST_MakePoint($2,$1),4326)::geography,300))
 SELECT id,public_id,title,category,status,round(distance_meters::numeric)::int AS distance_meters,(category::text=$4) AS category_match,text_score>0 AS text_match
 FROM nearby ORDER BY (CASE WHEN category::text=$4 THEN 2 ELSE 0 END + LEAST(text_score,1)*2 + (1-distance_meters/300)) DESC,distance_meters,id LIMIT 5`,
    [input.latitude, input.longitude, input.note, input.category ?? null],
  );
  return {
    items: r.rows,
    method: "proximity_category_keywords",
    radiusMeters: 300,
    automaticallyMerged: false,
  };
}
export function municipalExport(input: unknown) {
  const i = z
    .object({
      publicId: z.string(),
      category: z.string(),
      status: z.string(),
      createdAt: z.coerce.date(),
      updatedAt: z.coerce.date(),
      latitude: z.number(),
      longitude: z.number(),
    })
    .parse(input);
  return {
    format: "Open311 GeoReport v2 field mapping",
    sentToMunicipality: false,
    requiresJurisdictionMapping: true,
    notice:
      "Download only. Map the service code and jurisdiction to the receiving city before importing. No photo, free text or exact location is included.",
    request: {
      service_request_id: i.publicId,
      status: ["RESOLVED", "REJECTED"].includes(i.status) ? "closed" : "open",
      status_notes: `FieldIssue status: ${i.status}; human review required.`,
      service_name: i.category,
      service_code: i.category,
      description: `FieldIssue ${i.publicId}: ${i.category}`,
      requested_datetime: i.createdAt,
      updated_datetime: i.updatedAt,
      lat: Math.round(i.latitude * 100) / 100,
      long: Math.round(i.longitude * 100) / 100,
    },
  };
}
export const publicApiSpec = {
  openapi: "3.1.0",
  info: {
    title: "FieldIssue public read API",
    version: "1.0.0",
    description:
      "Public reports only on the public deployment. Same-origin browser writes require explicit consent and a signed guest or account session; administrative writes require the private operator bearer token. All endpoints are rate-limited. Municipal exports require destination-specific service-code mapping.",
  },
  paths: Object.fromEntries(
    [
      [
        "/v1/issues",
        "List public issues",
        [
          {
            name: "search",
            in: "query",
            schema: { type: "string", maxLength: 120 },
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", minimum: 1, maximum: 100 },
          },
        ],
      ],
      [
        "/v1/issues/{id}",
        "Read one public issue",
        [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
      ],
      [
        "/v1/issues/{id}/timeline",
        "Read issue history",
        [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
      ],
      [
        "/v1/issues/{id}/export",
        "Download a redacted Open311 field mapping",
        [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
      ],
      ["/v1/integrations/status", "Read configured integrations", []],
    ].map(([path, summary, parameters]) => [
      path,
      {
        get: {
          summary,
          parameters,
          responses: {
            "200": { description: "Successful JSON response" },
            "404": { description: "Missing or private record" },
            "429": { description: "Rate limit reached" },
          },
        },
      },
    ]),
  ),
};
