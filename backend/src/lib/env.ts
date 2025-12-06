import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  CORS_ORIGIN: z.string().default("http://localhost:5173"),
  JWT_SECRET: z.string().min(16),
  JWT_EXPIRES_IN: z.string().default("7d"),
  ANTHROPIC_API_KEY: z.string().optional(),
  POSTGRES_HOST: z.string().default("localhost"),
  POSTGRES_PORT: z.coerce.number().default(5432),
  POSTGRES_USER: z.string().default("reqnexa"),
  POSTGRES_PASSWORD: z.string().default("reqnexa"),
  POSTGRES_DB: z.string().default("reqnexa"),
  MONGODB_URI: z.string().default("mongodb://localhost:27017/reqnexa"),
});

export const env = envSchema.parse(process.env);

