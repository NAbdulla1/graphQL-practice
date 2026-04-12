import { z } from "zod";
import dotenv from "dotenv";
import path from "path";

// Load environment variables based on NODE_ENV
const envFile = process.env.NODE_ENV === "production"
  ? ".env.production"
  : (
    process.env.NODE_ENV === "stage"
      ? ".env.stage"
      : ".env.development"
  );

dotenv.config({ path: path.resolve(process.cwd(), envFile) });

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "stage"]).default("development"),
  PORT: z.string("PORT is required. example: 4000").transform((v) => parseInt(v, 10)),
  DATABASE_URL: z.url("DATABASE_URL is required").or(z.string().startsWith("file:")),
  GOOGLE_CLIENT_ID: z.string().min(1, "GOOGLE_CLIENT_ID is required"),
  GOOGLE_CLIENT_SECRET: z.string().min(1, "GOOGLE_CLIENT_SECRET is required"),
  GOOGLE_CALLBACK_URL: z.url("GOOGLE_CALLBACK_URL is required. example: http://localhost:4000/auth/google/callback"),
  SESSION_SECRET: z.string().min(1, "SESSION_SECRET is required"),
  FRONTEND_URL: z.url().default("http://localhost:5173"),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Invalid environment variables:");
  console.error(JSON.stringify(z.treeifyError(_env.error), null, 2));
  process.exit(1);
}

export const config = _env.data;
