// ============================================
// Config — Validated environment variables
// ============================================

import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().min(10),
  REDIS_URL: z.string().optional().default(''),
  ANTHROPIC_API_KEY: z.string().min(10),
  JWT_SECRET: z.string().min(16),
  JWT_REFRESH_SECRET: z.string().min(16),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  PORT: z.coerce.number().default(4000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(100),
  RECIPE_SEARCH_LIMIT_PER_HOUR: z.coerce.number().default(10),
  RECIPE_SEARCH_LIMIT_PER_HOUR_PREMIUM: z.coerce.number().default(100),
  RESEND_API_KEY: z.string().min(5),
  EMAIL_FROM: z.string().default('MatKompass <noreply@matkompass.se>'),
});

function loadConfig() {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error('❌ Invalid environment variables:');
    console.error(result.error.flatten().fieldErrors);
    process.exit(1);
  }

  return result.data;
}

export const config = loadConfig();
export const isProd = config.NODE_ENV === 'production';
export const isDev = config.NODE_ENV === 'development';
