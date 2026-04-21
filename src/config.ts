import { z } from "zod";
import dotenv from "dotenv";
import path from "path";

// Load environment variables based on NODE_ENV
const nodeEnv = process.env.NODE_ENV || "development";
const envFile = nodeEnv === "production"
  ? ".env.production"
  : (
    nodeEnv === "stage"
      ? ".env.stage"
      : ".env.development"
  );

// In production/IIS, the env file might be in the same directory as the compiled JS
const envPath = path.resolve(process.cwd(), envFile);
dotenv.config({ path: envPath });

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "stage"]).default("development"),
  PORT: z.string().default("4000"), // Accept string for named pipes or port numbers
  DATABASE_URL: z.url("DATABASE_URL is required").or(z.string().startsWith("file:")),
  GOOGLE_CLIENT_ID: z.string().min(1, "GOOGLE_CLIENT_ID is required"),
  GOOGLE_CLIENT_SECRET: z.string().min(1, "GOOGLE_CLIENT_SECRET is required"),
  GOOGLE_CALLBACK_URL: z.url("GOOGLE_CALLBACK_URL is required. example: http://localhost:4000/auth/google/callback"),
  SESSION_SECRET: z.string().min(1, "SESSION_SECRET is required"),
  FRONTEND_URL: z.url().default("http://localhost:5173"),
  REDIS_URL: z.url().default("redis://localhost:6379"),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Invalid environment variables:");
  console.error(JSON.stringify(z.treeifyError(_env.error), null, 2));
  process.exit(1);
}

// Convert PORT to number only if it's a numeric string
const rawPort = _env.data.PORT;
const parsedPort = parseInt(rawPort, 10);
const finalPort = isNaN(parsedPort) ? rawPort : parsedPort;

export const config = {
  ..._env.data,
  PORT: finalPort,
};
