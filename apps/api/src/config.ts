import { z } from "zod";
import { resolve } from "node:path";
import { config as loadEnv } from "dotenv";
loadEnv({ path: resolve(process.cwd(), ".env") });
loadEnv({ path: resolve(process.cwd(), "../../.env") });
export const configSchema = z
  .object({
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    PORT: z.coerce.number().int().min(1).max(65535).default(3000),
    DATABASE_URL: z.string().url(),
    DATABASE_SSL: z.enum(["true", "false"]).default("false"),
    AI_MOCK_MODE: z.enum(["true", "false"]).default("false"),
    INTERNAL_SERVICE_TOKEN: z.string().min(16),
    DATABASE_CA_FILE: z.string().optional(),
    MEDIA_DATABASE_MAX_BYTES: z.coerce
      .number()
      .int()
      .min(1048576)
      .max(1073741824)
      .default(209715200),
    PROVIDER_DAILY_UNITS: z.coerce.number().int().min(1).max(10000).default(60),
    WRITE_REQUESTS_PER_MINUTE: z.coerce
      .number()
      .int()
      .min(1)
      .max(1000)
      .default(30),
    PROVIDER_CONCURRENCY: z.coerce.number().int().min(1).max(10).default(2),
    DATA_RETENTION_DAYS: z.coerce.number().int().min(0).max(3650).default(0),
    DATA_RETENTION_NOTICE: z.string().max(1000).optional(),
    API_ACCESS_TOKEN: z.string().min(32).optional(),
    INTELLIGENCE_URL: z.string().url().default("http://127.0.0.1:8000"),
    PROVIDER_TIMEOUT_MS: z.coerce
      .number()
      .int()
      .min(10)
      .max(120000)
      .default(120000),
    MAX_UPLOAD_BYTES: z.coerce
      .number()
      .int()
      .min(1024)
      .max(10485760)
      .default(10485760),
    STORAGE_PROVIDER: z.enum(["local", "s3", "postgres"]).default("local"),
    LOCAL_STORAGE_PATH: z.string().default(".media"),
    MEDIA_BASE_URL: z.string().url().default("http://localhost:3000/media"),
    S3_ENDPOINT: z.string().url().optional(),
    S3_REGION: z.string().default("us-east-1"),
    S3_BUCKET: z.string().optional(),
    S3_ACCESS_KEY_ID: z.string().optional(),
    S3_SECRET_ACCESS_KEY: z.string().optional(),
    SENTRY_DSN: z.string().url().optional(),
    BACKBOARD_API_KEY: z.string().optional(),
    TIGER_DATABASE_URL: z.string().url().optional(),
    SEMANTIC_SEARCH_ENABLED: z.enum(["true", "false"]).default("false"),
    SERPAPI_API_KEY: z.string().optional(),
    ELEVENLABS_API_KEY: z.string().optional(),
    ELEVENLABS_VOICE_ID: z.string().optional(),
    ELEVENLABS_MODEL_ID: z.string().default("eleven_multilingual_v2"),
    ELEVENLABS_TIMEOUT_MS: z.coerce.number().min(100).max(60000).default(30000),
  })
  .passthrough()
  .superRefine((v, c) => {
    if (
      v.NODE_ENV === "production" &&
      (!v.API_ACCESS_TOKEN || v.API_ACCESS_TOKEN === v.INTERNAL_SERVICE_TOKEN)
    )
      c.addIssue({
        code: "custom",
        message: "Production requires a distinct API access token",
      });
    if (v.NODE_ENV === "production" && v.STORAGE_PROVIDER === "local")
      c.addIssue({
        code: "custom",
        message: "Production requires durable postgres or s3 media storage",
      });
    if (v.NODE_ENV === "production" && v.AI_MOCK_MODE === "true")
      c.addIssue({
        code: "custom",
        message: "AI mock mode is forbidden in production",
      });
    if (
      v.STORAGE_PROVIDER === "s3" &&
      (!v.S3_BUCKET || !v.S3_ACCESS_KEY_ID || !v.S3_SECRET_ACCESS_KEY)
    )
      c.addIssue({
        code: "custom",
        message: "S3 storage credentials and bucket are required",
      });
    if (
      v.NODE_ENV === "production" &&
      v.INTERNAL_SERVICE_TOKEN === "development-only-change-me"
    )
      c.addIssue({
        code: "custom",
        message: "Production requires a private internal service token",
      });
  });
export function readConfig(env: NodeJS.ProcessEnv = process.env) {
  const result = configSchema.safeParse(
    Object.fromEntries(Object.entries(env).filter(([, value]) => value !== "")),
  );
  if (!result.success)
    throw new Error(
      `Invalid configuration: ${result.error.issues.map((x) => `${x.path.join(".")}: ${x.message}`).join("; ")}`,
    );
  return result.data;
}
