import { publicResponse } from "./public-coordinates.js";
import { serviceWorker } from "./offline-shell.js";
import { duplicates, municipalExport, publicApiSpec } from "./public-tools.js";
import {
  Accounts,
  accountCookie,
  sessionSeconds,
  type Account,
} from "./accounts.js";
import { Community } from "./community.js";
import { demoFeaturesSchema, type TabPFNDemoService } from "./tabpfn-demo.js";
import { safeErrorKind } from "./telemetry.js";
import type { TinkerNoteService } from "./tinker.js";
import { getCookie, setCookie } from "hono/cookie";
import {
  guestCookie,
  guestLifetime,
  signGuest,
  verifyGuest,
  guestAllowance,
} from "./guest-access.js";
import { publicSummary } from "./public-summary.js";
import { readFile } from "node:fs/promises";
import { comparisonModels, type ModelComparisonService } from "./backboard.js";
import type { SemanticSearch } from "./semantic.js";
import { evaluations } from "./model-lab.js";
import { tinkerExamples } from "./tinker-examples.js";
import { loadWebBundle } from "./web-bundle.js";
import {
  landingPageHtml,
  landingPageScript,
  landingPageCsp,
} from "./landing-page.js";
import { RequestGuard } from "./request-guard.js";
import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { secureHeaders } from "hono/secure-headers";
import { createHash, randomUUID, timingSafeEqual } from "node:crypto";
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
  publicAccess?: boolean;
  publicOrigin?: string;
  secureGuestCookie?: boolean;
  guard?: RequestGuard;
  capabilities?: {
    accessRequired: boolean;
    publicAccess?: boolean;
    storage: string;
    retentionNotice: string;
    audio: boolean;
    mock: boolean;
  };
  ready?: () => Promise<boolean>;
  audio?: (id: string) => Promise<unknown>;
  webDirectory?: string;
  semantic?: SemanticSearch;
  tabpfnDemo?: TabPFNDemoService;
  tinkerNotes?: TinkerNoteService;
  modelComparison?: ModelComparisonService;
  consumeSearch?: () => Promise<void>;
  integrations?: { id: string; name: string; status: string; detail: string }[];
}
export function createApp(deps: Dependencies) {
  if (deps.publicAccess && !deps.accessToken)
    throw new Error("Public access requires an operator secret");
  const web = deps.webDirectory ? loadWebBundle(deps.webDirectory) : undefined;
  let activeAuth = 0;
  const accounts = new Accounts(deps.repository.pool);
  const community = new Community(deps.repository.pool);
  const app = new Hono<{
    Variables: {
      requestId: string;
      admin: boolean;
      guestId: string | undefined;
      account: Account | undefined;
    };
  }>();
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
    const expectedAuth = Buffer.from(`Bearer ${deps.accessToken}`);
    const suppliedAuth = Buffer.from(c.req.header("Authorization") ?? "");
    const admin =
      !deps.accessToken ||
      (expectedAuth.length === suppliedAuth.length &&
        timingSafeEqual(expectedAuth, suppliedAuth));
    c.set("admin", admin);
    if (
      deps.accessToken &&
      !(
        deps.publicAccess &&
        !c.req.header("Authorization") &&
        (c.req.path.startsWith("/v1/") || c.req.path.startsWith("/media/"))
      ) &&
      !(
        (["GET", "HEAD"].includes(c.req.method) &&
          [
            "/",
            "/demo",
            "/demo.js",
            "/landing.js",
            "/favicon.ico",
            "/app-config",
            "/sw.js",
            "/manifest.webmanifest",
            "/offline-shell",
            "/app",
            "/health",
            "/ready",
            "/about",
            "/methodology",
            "/privacy",
          ].includes(c.req.path)) ||
        (["GET", "HEAD"].includes(c.req.method) &&
          (c.req.path.startsWith("/app/") ||
            !!web?.assets.has(c.req.path) ||
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
    if (
      ["/v1/account/logout", "/v1/account/logout-all"].includes(c.req.path) ||
      !deps.guard ||
      !["POST", "PATCH", "DELETE"].includes(c.req.method)
    )
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
  const publicReads = new RequestGuard(async () => {}, 300, 12);
  app.use("*", async (c, next) => {
    if (
      !deps.publicAccess ||
      c.get("admin") ||
      !["GET", "HEAD"].includes(c.req.method) ||
      !(c.req.path.startsWith("/v1/") || c.req.path.startsWith("/media/"))
    )
      return next();
    const release = await publicReads.enter(0);
    try {
      await next();
    } finally {
      release();
    }
  });
  app.use("*", async (c, next) => {
    if (!(
      c.req.path.startsWith("/v1/") ||
      c.req.path.startsWith("/media/") ||
      c.req.path === "/app-config"
    ))
      return next();
    c.set(
      "account",
      deps.publicAccess
        ? await accounts.current(getCookie(c, accountCookie))
        : undefined,
    );
    if (!deps.publicAccess || c.get("admin")) return next();
    if (!deps.accessToken)
      throw new Error("Public access requires an operator secret");
    let guestId = verifyGuest(deps.accessToken, getCookie(c, guestCookie));
    if (
      guestId &&
      !c.get("account") &&
      (
        await deps.repository.pool.query(
          "SELECT 1 FROM accounts WHERE guest_id=$1 UNION ALL SELECT 1 FROM account_guest_links WHERE guest_id=$1",
          [guestId],
        )
      ).rowCount
    )
      guestId = undefined;
    if (c.req.path === "/app-config" && c.req.method === "GET" && !guestId) {
      const cookie = signGuest(deps.accessToken);
      guestId = verifyGuest(deps.accessToken, cookie);
      setCookie(c, guestCookie, cookie, {
        httpOnly: true,
        secure: !!deps.secureGuestCookie,
        sameSite: "Strict",
        path: "/",
        maxAge: guestLifetime,
      });
    }
    guestId = c.get("account")?.guest_id ?? guestId;
    c.set("guestId", guestId);
    const path = c.req.path;
    if (!path.startsWith("/v1/") && !path.startsWith("/media/")) return next();
    c.header("Cache-Control", "private, no-store");
    const write = !["GET", "HEAD"].includes(c.req.method);
    const forbidden = () => {
      throw new AppError(
        "OWNER_REQUIRED",
        403,
        "Only the reporting browser or an operator can change this report's status or details.",
      );
    };
    if (write) {
      if (!guestId)
        throw new AppError(
          "GUEST_SESSION_REQUIRED",
          403,
          "Open the app first to start a guest session. Enable first-party cookies to report.",
        );
      if (
        c.req.header("Origin") !==
        (deps.publicOrigin ?? new URL(c.req.url).origin)
      )
        throw new AppError(
          "INVALID_ORIGIN",
          403,
          "Submit from this app's own page.",
        );
    }
    if (
      path.startsWith("/v1/account/") ||
      path.startsWith("/v1/community/") ||
      path === "/v1/duplicates" ||
      path === "/v1/openapi"
    ) {
      if (
        write &&
        !["/v1/account/logout", "/v1/account/logout-all"].includes(path)
      )
        await guestAllowance(deps.repository.pool, guestId!, false);
      return next();
    }
    let ownsIssue = false;
    const match = path.match(/^\/v1\/issues\/([^/]+)(?:\/(.*))?$/);
    if (match && match[1] !== "map") {
      const issue = await deps.repository.issue(
        deps.repository.pool,
        issueId(match[1]!),
      );
      if (!issue.is_public)
        throw new AppError("NOT_FOUND", 404, "Issue not found");
      ownsIssue = !!guestId && issue.guest_owner === guestId;
      const suffix = match[2] ?? "";
      if (
        write &&
        (c.req.method === "PATCH" ||
          /^observations\/[^/]+\/correction$/.test(suffix) ||
          ["resolve", "revisit-review", "revisit-prediction"].includes(
            suffix,
          )) &&
        issue.guest_owner !== guestId
      )
        forbidden();
      if (
        write &&
        !(c.req.method === "PATCH" && !suffix) &&
        !(
          c.req.method === "POST" &&
          (["observations", "diff", "resolve", "audio-summary"].includes(
            suffix,
          ) ||
            /^observations\/[^/]+\/correction$/.test(suffix))
        )
      )
        forbidden();
    } else if (path.startsWith("/media/")) {
      if (write) forbidden();
      const key = decodeURIComponent(path.slice(7));
      const visible = await deps.repository.pool.query(
        "SELECT 1 FROM issues i WHERE i.is_public AND (EXISTS(SELECT 1 FROM observations o WHERE o.issue_id=i.id AND o.storage_key=$1) OR EXISTS(SELECT 1 FROM audio_summaries a WHERE a.issue_id=i.id AND a.storage_key=$1)) LIMIT 1",
        [key],
      );
      if (!visible.rowCount)
        throw new AppError("NOT_FOUND", 404, "Media not found");
    } else {
      const allowed = write
        ? c.req.method === "POST" &&
          [
            "/v1/issues",
            "/v1/model-lab/compare",
            "/v1/model-lab/interpret-note",
            "/v1/model-lab/revisit-demo",
          ].includes(path)
        : [
            "/v1/issues",
            "/v1/issues/map",
            "/v1/walks/suggestions",
            "/v1/search/semantic",
            "/v1/model-lab/evaluations",
            "/v1/integrations/status",
          ].includes(path);
      if (!allowed) forbidden();
    }
    if (write)
      await guestAllowance(
        deps.repository.pool,
        guestId!,
        path === "/v1/issues" || path.endsWith("/observations"),
      );
    await next();
    if (c.res.headers.get("Content-Type")?.includes("application/json")) {
      const body = publicResponse(await c.res.json(), guestId, ownsIssue);
      c.res.headers.delete("Content-Length");
      c.res = new Response(JSON.stringify(body), {
        status: c.res.status,
        headers: c.res.headers,
      });
    }
  });
  const isGuest = (c: { get: (key: "admin") => boolean }) =>
    !!deps.publicAccess && !c.get("admin");
  const scopedKey = (key: string | undefined, guestId: string | undefined) =>
    key && guestId
      ? createHash("sha256").update(`guest:${guestId}:${key}`).digest("hex")
      : key;
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
      error instanceof AppError
        ? error.code
        : error instanceof ZodError
          ? "VALIDATION_ERROR"
          : "REQUEST_FAILED",
      c.req.path.startsWith("/v1/model-lab/")
        ? "model_lab"
        : c.req.path.startsWith("/v1/issues")
          ? "issues"
          : "api",
      c.get("requestId"),
      {
        errorKind: safeErrorKind(error),
        httpStatus:
          error instanceof AppError
            ? error.status
            : error instanceof ZodError
              ? 400
              : 500,
      },
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
  if (web) {
    app.get("/sw.js", (c) => {
      c.header("Content-Type", "text/javascript; charset=utf-8");
      c.header("Cache-Control", "no-cache");
      c.header("Service-Worker-Allowed", "/");
      return c.body(serviceWorker(web.html, [...web.assets.keys()]));
    });
    app.get("/offline-shell", (c) => {
      c.header("Content-Security-Policy", web.csp);
      c.header("Cache-Control", "no-cache");
      return c.html(web.html);
    });
    app.get("/manifest.webmanifest", (c) =>
      c.json({
        id: "/app",
        name: "FieldIssue",
        short_name: "FieldIssue",
        start_url: "/app",
        scope: "/",
        display: "standalone",
        background_color: "#F4F1E8",
        theme_color: "#F4F1E8",
        icons: [
          {
            src: "/assets/favicon.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any",
          },
        ],
      }),
    );
    for (const path of [
      "/",
      "/app",
      "/app/*",
      "/about",
      "/methodology",
      "/privacy",
    ])
      app.get(path, (c) => {
        c.header("Content-Security-Policy", web.csp);
        c.header("Cache-Control", "no-cache");
        return c.html(web.html);
      });
    // Only the exact build manifest is public; never serve arbitrary filesystem paths.
    app.get("/assets/*", (c) => {
      const asset = web.assets.get(c.req.path);
      if (!asset) return c.notFound();
      c.header("Content-Type", asset.mime);
      c.header("Cache-Control", "public, max-age=31536000, immutable");
      return c.body(new Uint8Array(asset.bytes));
    });
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
  app.get("/app-config", (c) => {
    c.header("Cache-Control", "private, no-store");
    return c.json({
      captureAccountId: c.get("account")?.id ?? null,
      captureScope: c.get("guestId")
        ? createHash("sha256")
            .update(`capture:${c.get("guestId")}`)
            .digest("hex")
        : "operator",
      storage: "unknown",
      retentionNotice: "",
      audio: !!deps.audio,
      tinkerNotes: !!deps.tinkerNotes?.available,
      mock: false,
      ...deps.capabilities,
      publicAccess: !!deps.publicAccess,
      accessRequired: !!deps.accessToken && !deps.publicAccess,
    });
  });
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
  app.get("/v1/search/semantic", async (c) => {
    const q = z
      .object({
        q: z.string().trim().min(2).max(300),
        limit: numeric(1, 20).pipe(z.number().int()).default(10),
        category: categorySchema.optional(),
        status: statusSchema.optional(),
        latitude: numeric(-90, 90).optional(),
        longitude: numeric(-180, 180).optional(),
        radius_meters: numeric(1, 50000).optional(),
      })
      .strict()
      .refine(
        (v) =>
          [v.latitude, v.longitude, v.radius_meters].every(
            (x) => x === undefined,
          ) ||
          [v.latitude, v.longitude, v.radius_meters].every(
            (x) => x !== undefined,
          ),
      )
      .parse(c.req.query());
    if (!deps.semantic)
      throw new AppError(
        "SEMANTIC_SEARCH_UNAVAILABLE",
        503,
        "Semantic search is not configured.",
      );
    await deps.consumeSearch?.();
    return c.json(await deps.semantic.search({ ...q, publicOnly: isGuest(c) }));
  });
  app.post("/v1/model-lab/compare", async (c) => {
    const input = z
      .object({
        observationId: z.uuid(),
        models: z
          .array(z.enum(comparisonModels))
          .length(2)
          .refine((v) => new Set(v).size === 2),
        consentToExternalProcessing: z.literal(true),
      })
      .strict()
      .parse(await json(c.req.raw));
    if (isGuest(c)) {
      const visible = await deps.repository.pool.query(
        "SELECT 1 FROM observations o JOIN issues i ON i.id=o.issue_id WHERE o.id=$1 AND i.is_public AND i.guest_owner=$2",
        [input.observationId, c.get("guestId")],
      );
      if (!visible.rowCount)
        throw new AppError(
          "OWNER_REQUIRED",
          403,
          "Compare models on a report created in this browser.",
        );
    }
    if (!deps.modelComparison)
      throw new AppError(
        "BACKBOARD_UNAVAILABLE",
        503,
        "Model comparison is not configured.",
      );
    return c.json(
      await deps.modelComparison.compare(input.observationId, input.models),
    );
  });
  app.post("/v1/model-lab/interpret-note", async (c) => {
    const input = z
      .object({
        observationId: z.uuid(),
        consentToExternalProcessing: z.literal(true),
      })
      .strict()
      .parse(await json(c.req.raw));
    if (isGuest(c)) {
      const owned = await deps.repository.pool.query(
        "SELECT 1 FROM observations o JOIN issues i ON i.id=o.issue_id WHERE o.id=$1 AND i.is_public AND i.guest_owner=$2",
        [input.observationId, c.get("guestId")],
      );
      if (!owned.rowCount)
        throw new AppError(
          "OWNER_REQUIRED",
          403,
          "Interpret notes on a report created in this browser.",
        );
    }
    if (!deps.tinkerNotes)
      throw new AppError(
        "TINKER_UNAVAILABLE",
        503,
        "Trained note interpretation is not configured.",
      );
    return c.json(
      await deps.tinkerNotes.interpret(
        input.observationId,
        isGuest(c) ? c.get("guestId") : undefined,
      ),
    );
  });
  app.post("/v1/model-lab/revisit-demo", async (c) => {
    const input = z
      .object({
        features: demoFeaturesSchema,
        syntheticDemoAcknowledged: z.literal(true),
      })
      .strict()
      .parse(await json(c.req.raw));
    if (!deps.tabpfnDemo)
      throw new AppError(
        "TABPFN_UNAVAILABLE",
        503,
        "The synthetic scenario demo is not configured.",
      );
    return c.json(
      await deps.tabpfnDemo.predict(
        input.features,
        isGuest(c) ? c.get("guestId") : undefined,
      ),
    );
  });
  app.get("/v1/model-lab/evaluations", (c) =>
    c.json({
      tinkerExamples,
      evaluations: evaluations.map((e) => ({
        ...e,
        serving:
          e.serving &&
          !!deps.tinkerNotes?.available &&
          e.modelVersion === deps.tinkerNotes.checkpoint,
      })),
    }),
  );
  app.get("/v1/integrations/status", async (c) => {
    let coreReady = false;
    try {
      await deps.repository.pool.query("SELECT 1 FROM issues LIMIT 1");
      coreReady = deps.ready ? await deps.ready() : true;
    } catch {}
    return c.json({
      coreReady,
      integrations: (deps.integrations ?? []).map((i) =>
        i.id === "tinker" && deps.tinkerNotes && !deps.tinkerNotes.available
          ? {
              ...i,
              status: "expired",
              detail:
                "The trained checkpoint has expired. Saved interpretations remain available through the API; renew the checkpoint to make new predictions.",
            }
          : i,
      ),
    });
  });
  app.get("/v1/duplicates", async (c) => {
    const q = z
      .object({
        latitude: numeric(-90, 90),
        longitude: numeric(-180, 180),
        note: z.string().max(5000).default(""),
        category: categorySchema.optional(),
      })
      .strict()
      .parse(c.req.query());
    return c.json(await duplicates(deps.repository.pool, q));
  });
  app.get("/v1/openapi", (c) => c.json(publicApiSpec));
  app.get("/v1/issues/:id/export", async (c) => {
    const i = await deps.repository.get(issueId(c.req.param("id")));
    return c.json(municipalExport(i));
  });
  const accountRequired = (c: {
    get: (key: "account") => Account | undefined;
  }) => {
    const a = c.get("account");
    if (!a)
      throw new AppError(
        "ACCOUNT_REQUIRED",
        403,
        "Sign in to use saved walks and community workspaces.",
      );
    return a;
  };
  app.get("/v1/account/me", (c) =>
    c.json({
      account: c.get("account")
        ? { id: c.get("account")!.id, username: c.get("account")!.username }
        : null,
    }),
  );
  for (const action of ["signup", "login", "recover"] as const)
    app.post(`/v1/account/${action}`, async (c) => {
      if (!deps.publicAccess)
        throw new AppError(
          "ACCOUNT_UNAVAILABLE",
          503,
          "Accounts require the public deployment.",
        );
      if (c.get("account"))
        throw new AppError(
          "ALREADY_SIGNED_IN",
          409,
          "Sign out before changing accounts.",
        );
      if (activeAuth >= 2)
        throw new AppError(
          "AUTH_BUSY",
          429,
          "Sign-in is busy. Try again in a moment.",
        );
      activeAuth++;
      try {
        const data = await json(c.req.raw);
        const result =
          action === "signup"
            ? await accounts.signup(data, c.get("guestId"))
            : action === "login"
              ? await accounts.login(data, c.get("guestId"))
              : await accounts.recover(data, c.get("guestId"));
        setCookie(c, accountCookie, result.token, {
          httpOnly: true,
          secure: !!deps.secureGuestCookie,
          sameSite: "Strict",
          path: "/",
          maxAge: sessionSeconds,
        });
        // Once ownership belongs to an account, do not leave a guest cookie that bypasses sign-in.
        if (deps.accessToken)
          setCookie(c, guestCookie, signGuest(deps.accessToken), {
            httpOnly: true,
            secure: !!deps.secureGuestCookie,
            sameSite: "Strict",
            path: "/",
            maxAge: guestLifetime,
          });
        return c.json({
          account: { id: result.account.id, username: result.account.username },
          ...("recovery" in result ? { recovery: result.recovery } : {}),
        });
      } finally {
        activeAuth--;
      }
    });
  app.post("/v1/account/logout", async (c) => {
    await accounts.logout(getCookie(c, accountCookie));
    setCookie(c, accountCookie, "", {
      httpOnly: true,
      secure: !!deps.secureGuestCookie,
      sameSite: "Strict",
      path: "/",
      maxAge: 0,
    });
    return c.json({ ok: true });
  });
  app.post("/v1/account/logout-all", async (c) => {
    const a = accountRequired(c);
    await accounts.pool.query(
      "DELETE FROM account_sessions WHERE account_id=$1",
      [a.id],
    );
    setCookie(c, accountCookie, "", {
      httpOnly: true,
      secure: !!deps.secureGuestCookie,
      sameSite: "Strict",
      path: "/",
      maxAge: 0,
    });
    return c.json({ ok: true });
  });
  app.get("/v1/account/walk", async (c) =>
    c.json({ walk: await community.savedWalk(accountRequired(c)) }),
  );
  app.post("/v1/account/walk", async (c) =>
    c.json(await community.saveWalk(accountRequired(c), await json(c.req.raw))),
  );
  app.delete("/v1/account/walk", async (c) => {
    await accounts.pool.query("DELETE FROM saved_walks WHERE account_id=$1", [
      accountRequired(c).id,
    ]);
    return c.json({ ok: true });
  });
  app.get("/v1/account/notifications", async (c) =>
    c.json({ items: await community.notifications(accountRequired(c)) }),
  );
  app.post("/v1/account/notifications/read", async (c) => {
    const { id } = z
      .object({ id: z.uuid() })
      .strict()
      .parse(await json(c.req.raw));
    await accounts.pool.query(
      "UPDATE account_notifications SET read_at=now() WHERE id=$1 AND account_id=$2",
      [id, accountRequired(c).id],
    );
    return c.json({ ok: true });
  });
  app.post("/v1/account/reminders", async (c) =>
    c.json(await community.reminder(accountRequired(c), await json(c.req.raw))),
  );
  app.post("/v1/account/subscriptions", async (c) =>
    c.json(
      await community.subscribe(accountRequired(c), await json(c.req.raw)),
    ),
  );
  app.get("/v1/community/list", async (c) =>
    c.json({ items: await community.list(accountRequired(c)) }),
  );
  app.post("/v1/community/create", async (c) =>
    c.json(await community.create(accountRequired(c), await json(c.req.raw))),
  );
  app.post("/v1/community/join", async (c) =>
    c.json(await community.join(accountRequired(c), await json(c.req.raw))),
  );
  app.get("/v1/community/:id", async (c) =>
    c.json(await community.detail(accountRequired(c), c.req.param("id"))),
  );
  app.post("/v1/community/:id/members", async (c) =>
    c.json(
      await community.removeMember(
        accountRequired(c),
        c.req.param("id"),
        await json(c.req.raw),
      ),
    ),
  );
  app.post("/v1/community/:id/revoke-invites", async (c) =>
    c.json(
      await community.revokeInvites(accountRequired(c), c.req.param("id")),
    ),
  );
  app.post("/v1/community/:id/invite", async (c) =>
    c.json(await community.invite(accountRequired(c), c.req.param("id"))),
  );
  app.post("/v1/community/:id/issues", async (c) =>
    c.json(
      await community.addIssue(
        accountRequired(c),
        c.req.param("id"),
        await json(c.req.raw),
      ),
    ),
  );
  app.post("/v1/community/:id/assign", async (c) =>
    c.json(
      await community.assign(
        accountRequired(c),
        c.req.param("id"),
        await json(c.req.raw),
      ),
    ),
  );
  app.post("/v1/community/:id/propose", async (c) =>
    c.json(
      await community.propose(
        accountRequired(c),
        c.req.param("id"),
        await json(c.req.raw),
      ),
    ),
  );
  app.post("/v1/community/:id/vote", async (c) =>
    c.json(
      await community.vote(
        accountRequired(c),
        c.req.param("id"),
        await json(c.req.raw),
      ),
    ),
  );
  app.post("/v1/issues", async (c) => {
    const { media, fields } = await upload(c.req.raw);
    if (isGuest(c) && fields.publicConsent !== "true")
      throw new AppError(
        "PUBLIC_CONSENT_REQUIRED",
        400,
        "Confirm that this photo, note and location may be published.",
      );
    delete fields.publicConsent;
    if (isGuest(c)) delete fields.reporterId;
    const input = createIssueSchema.parse(fields);
    const key = c.req.header("Idempotency-Key");
    if (key && !/^[a-zA-Z0-9:_-]{1,128}$/.test(key))
      throw new AppError(
        "INVALID_IDEMPOTENCY_KEY",
        400,
        "Invalid idempotency key",
      );
    const result = await deps.service.create(
      input,
      media,
      scopedKey(key, c.get("guestId")),
      isGuest(c) ? c.get("guestId") : undefined,
    );
    return c.json(result, result.replayed ? 200 : 201);
  });
  app.get("/v1/walks/suggestions", async (c) => {
    const q = z
      .object({
        latitude: numeric(-90, 90),
        longitude: numeric(-180, 180),
        radius_meters: numeric(1, 50000).default(2000),
        limit: numeric(1, 5).pipe(z.number().int()).default(5),
      })
      .strict()
      .parse(c.req.query());
    return c.json(
      await deps.repository.walkSuggestions(
        q.latitude,
        q.longitude,
        q.radius_meters,
        q.limit,
        isGuest(c),
      ),
    );
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
        publicOnly: isGuest(c),
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
    return c.json(await deps.repository.map(bbox, q.limit, isGuest(c)));
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
    if (isGuest(c) && fields.publicConsent !== "true")
      throw new AppError(
        "PUBLIC_CONSENT_REQUIRED",
        400,
        "Confirm that this revisit may be published.",
      );
    delete fields.publicConsent;
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
    const result = await deps.service.addObservation(
      id,
      input,
      media,
      scopedKey(key, c.get("guestId")),
    );
    return c.json(result, result.replayed ? 200 : 201);
  });
  app.get("/v1/issues/:id/observations", async (c) =>
    c.json(await deps.repository.observations(issueId(c.req.param("id")))),
  );
  app.post(
    "/v1/issues/:id/observations/:observationId/correction",
    async (c) => {
      const input = z
        .object({
          exclusionType: z
            .enum(["WRONG_LOCATION", "WRONG_PHOTOGRAPH", "NOT_SUITABLE"])
            .nullable(),
          reason: z.string().trim().max(1000).default(""),
        })
        .strict()
        .parse(await json(c.req.raw));
      const ownerId = c.get("guestId");
      return c.json(
        await deps.repository.correctObservation(
          issueId(c.req.param("id")),
          z.uuid().parse(c.req.param("observationId")),
          input,
          {
            kind: isGuest(c) ? "owner" : "operator",
            id: isGuest(c)
              ? createHash("sha256")
                  .update(`correction:${ownerId}`)
                  .digest("hex")
                  .slice(0, 20)
              : "operator",
            ownerId,
          },
        ),
      );
    },
  );
  app.post("/v1/issues/:id/diff", async (c) => {
    const body = z
      .object({
        beforeObservationId: z.uuid().optional(),
        afterObservationId: z.uuid().optional(),
        mode: z
          .enum(["manual", "latest_eligible", "original_latest"])
          .default("manual"),
      })
      .strict()
      .parse(await json(c.req.raw));
    return c.json(
      await deps.service.compareSelected(issueId(c.req.param("id")), body),
      201,
    );
  });
  app.get("/v1/issues/:id/share-summary", async (c) => {
    const issue = await deps.repository.get(issueId(c.req.param("id")));
    const precise =
      !isGuest(c) ||
      (!!c.get("guestId") && issue.guestOwner === c.get("guestId"));
    return c.json(publicSummary(issue, precise));
  });
  app.get("/v1/issues/:id/diffs", async (c) =>
    c.json(await deps.repository.diffs(issueId(c.req.param("id")))),
  );
  app.get("/v1/issues/:id/timeline", async (c) =>
    c.json(await deps.repository.timeline(issueId(c.req.param("id")))),
  );
  app.post("/v1/issues/:id/resolve", async (c) => {
    const body = z
      .object({
        note: z.string().max(5000).default(""),
        basis: z
          .enum(["latest_observation", "manual_confirmation"])
          .default("manual_confirmation"),
        observationId: z.uuid().optional(),
      })
      .strict()
      .refine(
        (v) =>
          v.basis === "latest_observation"
            ? !!v.observationId
            : !v.observationId,
        "Observation reference must match resolution basis",
      )
      .parse(await json(c.req.raw, true));
    return c.json(
      await deps.service.resolve(issueId(c.req.param("id")), body.note, {
        basis: body.basis,
        observationId: body.observationId,
      }),
    );
  });
  app.post("/v1/issues/:id/revisit-review", async (c) => {
    const body = z
      .object({
        beforeObservationId: z.uuid(),
        afterObservationId: z.uuid(),
        materialChange: z.boolean(),
        note: z.string().trim().min(10).max(2000),
        evidenceIsGenuine: z.literal(true),
      })
      .strict()
      .parse(await json(c.req.raw));
    return c.json(
      await deps.repository.reviewRevisit(issueId(c.req.param("id")), body),
    );
  });
  app.get("/v1/revisit-training-data", async (c) => {
    const data = await deps.repository.trainingData();
    c.header("Content-Type", "text/csv; charset=utf-8");
    c.header(
      "Content-Disposition",
      'attachment; filename="fieldissue-revisit-training.csv"',
    );
    c.header("Cache-Control", "private, no-store");
    return c.body(data);
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
