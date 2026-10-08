import { readFile } from "node:fs/promises";
import {
  landingPageHtml,
  landingPageScript,
  landingPageCsp,
} from "./landing-page.js";
import type { RequestGuard } from "./request-guard.js";
import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { secureHeaders } from "hono/secure-headers";
import { randomUUID, timingSafeEqual } from "node:crypto";
import { z, ZodError } from "zod";
import pino from "pino";
import {
  createIssueSchema,
  observationInputSchema,
  patchIssueSchema,
  categorySchema,
  severitySchema,
  statusSchema,
} from "@fieldissue/shared";
import type { IssueService } from "./service.js";
import type { IssueRepository } from "./repository.js";
import { validateImage, type StorageProvider, type Media } from "./storage.js";
import { AppError } from "./errors.js";
import { trace, reportFailure } from "./telemetry.js";
import { demoPageCsp, demoPageHtml, demoPageScript } from "./demo-page.js";
const logger = pino({ level: process.env.LOG_LEVEL ?? "info" });
const numeric = (min: number, max: number) =>
  z
    .string()
    .trim()
    .min(1)
    .transform(Number)
    .pipe(z.number().finite().min(min).max(max));
const querySchema = z
  .object({
    status: statusSchema.optional(),
    category: categorySchema.optional(),
    severity: severitySchema.optional(),
    limit: numeric(1, 100).pipe(z.number().int()).default(20),
    cursor: z.string().max(500).optional(),
    search: z.string().trim().max(120).optional(),
    near_lat: numeric(-90, 90).optional(),
    near_lon: numeric(-180, 180).optional(),
    radius_meters: numeric(1, 50000).optional(),
  })
  .strict()
  .refine(
    (v) =>
      [v.near_lat, v.near_lon, v.radius_meters].every((x) => x === undefined) ||
      [v.near_lat, v.near_lon, v.radius_meters].every((x) => x !== undefined),
    "Proximity requires near_lat, near_lon and radius_meters",
  );
const cursorSchema = z
  .object({ createdAt: z.iso.datetime({ offset: true }), id: z.uuid() })
  .strict();
interface Dependencies {
  service: IssueService;
  repository: IssueRepository;
  storage: StorageProvider;
  maxUploadBytes: number;
  accessToken?: string;
  guard?: RequestGuard;
  capabilities?: {
    accessRequired: boolean;
    storage: string;
    retentionNotice: string;
    audio: boolean;
    mock: boolean;
  };
  ready?: () => Promise<boolean>;
  audio?: (id: string) => Promise<unknown>;
}
export function createApp(deps: Dependencies) {
  const app = new Hono<{ Variables: { requestId: string } }>();
  app.use(
    "*",
    secureHeaders({ referrerPolicy: "strict-origin-when-cross-origin" }),
  );
  app.use("*", async (c, next) => {
    const candidate = c.req.header("X-Request-ID");
    const id =
      candidate &&
      /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(
        candidate,
      )
        ? candidate
        : randomUUID();
    c.set("requestId", id);
    c.header("X-Request-ID", id);
    const start = Date.now();
    await trace("API request", "http.server", next, {
      requestId: id,
      method: c.req.method,
      route: "FieldIssue API",
    });
    logger.info(
      {
        requestId: id,
        method: c.req.method,
        path: c.req.routePath || "unknown",
        status: c.res.status,
        durationMs: Date.now() - start,
      },
      "request",
    );
  });
  const assets: Record<string, [string, string]> = {
    "field-walk.png": ["field-walk.png", "image/png"],
    "leaflet.js": ["leaflet.js", "text/javascript; charset=utf-8"],
    "leaflet.css": ["leaflet.css", "text/css; charset=utf-8"],
  };
  // Deployment gateway: protect reports, media and inference before parsing bodies.
  // This is shared demo access, not end-user identity or tenant authorization.
  app.use("*", async (c, next) => {
    if (
      deps.accessToken &&
      !(
        (["GET", "HEAD"].includes(c.req.method) &&
          [
            "/",
            "/demo",
            "/demo.js",
            "/landing.js",
            "/favicon.ico",
            "/app-config",
            "/app",
            "/health",
            "/ready",
          ].includes(c.req.path)) ||
        (["GET", "HEAD"].includes(c.req.method) &&
          (c.req.path.startsWith("/app/") ||
            (Object.hasOwn(assets, c.req.path.replace(/^\/assets\//, "")) &&
              c.req.path.startsWith("/assets/"))))
      )
    ) {
      const expected = Buffer.from(`Bearer ${deps.accessToken}`);
      const supplied = Buffer.from(c.req.header("Authorization") ?? "");
      if (
        supplied.length !== expected.length ||
        !timingSafeEqual(supplied, expected)
      ) {
        c.header("WWW-Authenticate", "Bearer");
        c.header("Cache-Control", "no-store");
        return c.json(
          {
            error: {
              code: "UNAUTHORIZED",
              message: "Access token required",
              requestId: c.get("requestId"),
            },
          },
          401,
        );
      }
      c.header("Cache-Control", "private, no-store");
    }
    await next();
  });
  app.use("/v1/*", async (c, next) => {
    if (!deps.guard || !["POST", "PATCH", "DELETE"].includes(c.req.method))
      return next();
    let release: (() => void) | undefined;
    try {
      release = await deps.guard.enter(0);
      await next();
    } catch (error) {
      if (error instanceof AppError && error.status === 429)
        c.header("Retry-After", "60");
      throw error;
    } finally {
      release?.();
    }
  });
  app.use(
    "*",
    bodyLimit({
      maxSize: deps.maxUploadBytes + 65536,
      onError: (c) =>
        c.json(
          {
            error: {
              code: "PAYLOAD_TOO_LARGE",
              message: "Request exceeds upload limit",
              requestId: c.get("requestId"),
            },
          },
          413,
        ),
    }),
  );
  app.onError((error, c) => {
    reportFailure(
      error instanceof AppError ? error.code : "REQUEST_FAILED",
      "api",
      c.get("requestId"),
    );
    if (error instanceof ZodError)
      return c.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid request or structured provider output",
            requestId: c.get("requestId"),
          },
        },
        400,
      );
    if (error instanceof AppError)
      return c.json(
        {
          error: {
            code: error.code,
            message: error.message,
            requestId: c.get("requestId"),
          },
        },
        error.status as 400,
      );
    logger.error(
      { requestId: c.get("requestId"), code: "UNEXPECTED_FAILURE" },
      "request failed",
    );
    return c.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "Request failed",
          requestId: c.get("requestId"),
        },
      },
      500,
    );
  });
  app.notFound((c) =>
    c.json(
      {
        error: {
          code: "NOT_FOUND",
          message: "Route not found",
          requestId: c.get("requestId"),
        },
      },
      404,
    ),
  );
  const issueId = (id: string) => {
    if (
      !/^(?:[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}|FI-\d{6,})$/i.test(
        id,
      )
    )
      throw new AppError("INVALID_ISSUE_ID", 400, "Invalid issue ID");
    return /^fi-/i.test(id) ? id.toUpperCase() : id.toLowerCase();
  };
  async function upload(request: Request) {
    if (!request.headers.get("content-type")?.startsWith("multipart/form-data"))
      throw new AppError(
        "INVALID_CONTENT_TYPE",
        400,
        "Use multipart/form-data with an image",
      );
    let form: FormData;
    try {
      form = await request.formData();
    } catch {
      throw new AppError("INVALID_MULTIPART", 400, "Malformed upload");
    }
    const file = form.get("image");
    if (form.getAll("image").length !== 1 || !(file instanceof File))
      throw new AppError(
        "IMAGE_REQUIRED",
        400,
        "An uploaded image is required",
      );
    const media: Media = {
      bytes: Buffer.from(await file.arrayBuffer()),
      mime: file.type,
      filename: file.name,
    };
    validateImage(media, deps.maxUploadBytes);
    const fields: Record<string, string> = {};
    for (const [key, value] of form) {
      if (key === "image") continue;
      if (typeof value !== "string" || fields[key] !== undefined)
        throw new AppError(
          "INVALID_FORM",
          400,
          "Duplicate or invalid form field",
        );
      fields[key] = value;
    }
    return { media, fields };
  }
  async function json(request: Request, optional = false) {
    try {
      const text = await request.text();
      return optional && !text.trim() ? {} : JSON.parse(text);
    } catch {
      throw new AppError(
        "INVALID_JSON",
        400,
        "Request body must be valid JSON",
      );
    }
  }
  // The landing/demo page and its scripts are static and contain no secrets, so they
  // stay public; every API call they make still passes the access gateway.
  app.get("/", (c) => {
    c.header("Content-Security-Policy", landingPageCsp);
    c.header("Cache-Control", "no-cache");
    return c.html(landingPageHtml);
  });
  app.get("/demo.js", (c) => {
    c.header("Content-Type", "text/javascript; charset=utf-8");
    c.header("Cache-Control", "no-cache");
    return c.body(demoPageScript);
  });
  app.get("/landing.js", (c) => {
    c.header("Content-Type", "text/javascript; charset=utf-8");
    c.header("Cache-Control", "no-cache");
    return c.body(landingPageScript);
  });
  // The demo lives in the landing page's #try section; keep a short link.
  app.get("/demo", (c) => c.redirect("/app", 302));
  for (const route of ["/app", "/app/report", "/app/issues/:id"])
    app.get(route, (c) => {
      c.header("Content-Security-Policy", demoPageCsp);
      c.header("Referrer-Policy", "strict-origin-when-cross-origin");
      c.header("Cache-Control", "no-cache");
      return c.html(demoPageHtml);
    });
  app.get("/app-config", (c) =>
    c.json(
      deps.capabilities ?? {
        accessRequired: !!deps.accessToken,
        storage: "unknown",
        retentionNotice: "",
        audio: !!deps.audio,
        mock: false,
      },
    ),
  );
  app.get("/assets/:name", async (c) => {
    const asset = assets[c.req.param("name")];
    if (!asset || !Object.hasOwn(assets, c.req.param("name")))
      return c.notFound();
    c.header("Content-Type", asset[1]);
    c.header("Cache-Control", "public, max-age=3600");
    return c.body(
      new Uint8Array(
        await readFile(
          new URL(`../public/assets/${asset[0]}`, import.meta.url),
        ),
      ),
    );
  });
  app.get("/favicon.ico", (c) => c.body(null, 204));
  app.get("/health", (c) =>
    c.json({ status: "ok", service: "fieldissue-api" }),
  );
  app.get("/ready", async (c) => {
    let ok = false;
    try {
      await deps.repository.pool.query("SELECT 1 FROM issues LIMIT 1");
      ok = deps.ready ? await deps.ready() : true;
    } catch {}
    return c.json({ status: ok ? "ready" : "not_ready" }, ok ? 200 : 503);
  });
  app.post("/v1/issues", async (c) => {
    const { media, fields } = await upload(c.req.raw);
    const input = createIssueSchema.parse(fields);
    const key = c.req.header("Idempotency-Key");
    if (key && !/^[a-zA-Z0-9:_-]{1,128}$/.test(key))
      throw new AppError(
        "INVALID_IDEMPOTENCY_KEY",
        400,
        "Invalid idempotency key",
      );
    const result = await deps.service.create(input, media, key);
    return c.json(result, result.replayed ? 200 : 201);
  });
  app.get("/v1/issues", async (c) => {
    const q = querySchema.parse(c.req.query());
    let cursor: z.infer<typeof cursorSchema> | undefined;
    if (q.cursor) {
      try {
        cursor = cursorSchema.parse(
          JSON.parse(Buffer.from(q.cursor, "base64url").toString()),
        );
      } catch {
        throw new AppError("INVALID_CURSOR", 400, "Invalid pagination cursor");
      }
    }
    return c.json(
      await deps.repository.list({
        search: q.search,
        status: q.status,
        category: q.category,
        severity: q.severity,
        limit: q.limit,
        cursor,
        nearLat: q.near_lat,
        nearLon: q.near_lon,
        radius: q.radius_meters,
      }),
    );
  });
  app.get("/v1/issues/map", async (c) => {
    const q = z
      .object({
        bbox: z.string().max(150),
        limit: numeric(1, 1000).pipe(z.number().int()).default(500),
      })
      .strict()
      .parse(c.req.query());
    const bbox = z
      .tuple([
        z.number().min(-180).max(180),
        z.number().min(-90).max(90),
        z.number().min(-180).max(180),
        z.number().min(-90).max(90),
      ])
      .refine((v) => v[1] < v[3] && v[0] !== v[2], "Invalid bounding box")
      .parse(q.bbox.split(",").map(Number));
    if (q.bbox.split(",").some((x) => !x.trim()))
      throw new AppError("INVALID_BBOX", 400, "Invalid bounding box");
    return c.json(await deps.repository.map(bbox, q.limit));
  });
  app.get("/v1/issues/:id", async (c) =>
    c.json(await deps.repository.get(issueId(c.req.param("id")))),
  );
  app.patch("/v1/issues/:id", async (c) =>
    c.json(
      await deps.service.patch(
        issueId(c.req.param("id")),
        patchIssueSchema.parse(await json(c.req.raw)),
      ),
    ),
  );
  app.post("/v1/issues/:id/observations", async (c) => {
    const id = issueId(c.req.param("id"));
    const { media, fields } = await upload(c.req.raw);
    delete fields.title;
    const issue = await deps.repository.get(id);
    if ((fields.latitude === undefined) !== (fields.longitude === undefined))
      throw new AppError(
        "INVALID_LOCATION",
        400,
        "Send both latitude and longitude, or neither",
      );
    const input = observationInputSchema.parse({
      ...fields,
      locationSource:
        fields.latitude === undefined
          ? "inherited"
          : (fields.locationSource ?? "manual"),
      latitude: fields.latitude ?? issue.latitude,
      longitude: fields.longitude ?? issue.longitude,
    });
    const key = c.req.header("Idempotency-Key");
    if (key && !/^[a-zA-Z0-9:_-]{1,128}$/.test(key))
      throw new AppError(
        "INVALID_IDEMPOTENCY_KEY",
        400,
        "Invalid idempotency key",
      );
    const result = await deps.service.addObservation(id, input, media, key);
    return c.json(result, result.replayed ? 200 : 201);
  });
  app.get("/v1/issues/:id/observations", async (c) =>
    c.json(await deps.repository.observations(issueId(c.req.param("id")))),
  );
  app.post("/v1/issues/:id/diff", async (c) => {
    const body = z
      .object({ beforeObservationId: z.uuid(), afterObservationId: z.uuid() })
      .strict()
      .parse(await json(c.req.raw));
    return c.json(
      await deps.service.diff(
        issueId(c.req.param("id")),
        body.beforeObservationId,
        body.afterObservationId,
      ),
      201,
    );
  });
  app.get("/v1/issues/:id/diffs", async (c) =>
    c.json(await deps.repository.diffs(issueId(c.req.param("id")))),
  );
  app.get("/v1/issues/:id/timeline", async (c) =>
    c.json(await deps.repository.timeline(issueId(c.req.param("id")))),
  );
  app.post("/v1/issues/:id/resolve", async (c) => {
    const body = z
      .object({ note: z.string().max(5000).default("") })
      .strict()
      .parse(await json(c.req.raw, true));
    return c.json(
      await deps.service.resolve(issueId(c.req.param("id")), body.note),
    );
  });
  app.post("/v1/issues/:id/revisit-prediction", async (c) =>
    c.json(await deps.service.predict(issueId(c.req.param("id")))),
  );
  app.post("/v1/issues/:id/audio-summary", async (c) => {
    if (!deps.audio)
      throw new AppError(
        "PROVIDER_NOT_CONFIGURED",
        503,
        "Audio summaries are not configured",
      );
    return c.json(await deps.audio(issueId(c.req.param("id"))));
  });
  app.get("/media/:key", async (c) => {
    const media = await deps.storage.read(c.req.param("key"));
    c.header("Content-Type", media.mime);
    c.header(
      "Cache-Control",
      deps.accessToken
        ? "private, no-store"
        : "public, max-age=86400, immutable",
    );
    return c.body(new Uint8Array(media.bytes));
  });
  return app;
}
