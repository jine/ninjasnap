import { z } from 'zod';

/**
 * Environment configuration schema
 */
const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(3000),

  // Redis/Upstash configuration
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),

  // Rate limiting
  RATE_LIMIT_MAX: z.coerce.number().default(10),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(60000),

  // Screenshot settings
  SCREENSHOT_TIMEOUT: z.coerce.number().default(30000),
  MAX_SCREENSHOT_WIDTH: z.coerce.number().default(1920),
  MAX_SCREENSHOT_HEIGHT: z.coerce.number().default(1080),

  // Security
  ALLOWED_ORIGINS: z.string().default('http://localhost:3000'),

  // Monitoring
  SENTRY_DSN: z.string().url().optional(),
});

/**
 * Validated configuration object
 */
export const config = envSchema.parse(process.env);

/**
 * Type-safe environment variables
 */
export type Config = z.infer<typeof envSchema>;
