import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(5000),
  DATABASE_URL: z.string().min(1),
  CORS_ORIGIN: z.string().min(1),
  N8N_WEBHOOK_URL: z.string().url(),
  N8N_CALLBACK_URL: z.string().url(),
  N8N_WEBHOOK_SECRET: z.string().min(16),
  CEREBRAS_API_KEY: z.string().min(1),
  SERPAPI_API_KEY: z.string().optional().default(""),
  BROWSERLESS_API_KEY: z.string().optional().default(""),
  ALPHA_VANTAGE_KEY: z.string().optional().default(""),
  USE_DIRECT_AGENTS: z
    .enum(["true", "false"])
    .default("true")
    .transform((v) => v === "true"),
  JWT_SECRET: z.string().min(16).default("development_jwt_secret_change_me_123"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  ANALYZE_RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60000),
  ANALYZE_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(5),
  ANALYZE_COOLDOWN_MINUTES: z.coerce.number().int().positive().default(5),
  CACHE_TTL_SECONDS: z.coerce.number().int().positive().default(86400)
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const message = parsed.error.issues
    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
    .join("; ");
  throw new Error(`Invalid environment configuration: ${message}`);
}

export const env = parsed.data;
