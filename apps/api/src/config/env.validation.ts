import { z } from 'zod';

/**
 * V1 Environment Validation Schema (No Database)
 *
 * Minimal schema for V1 deployment without database, auth, or email features.
 * These features will be re-added in V2 once database provisioning is implemented.
 */
export const envSchema = z.object({
  // Application
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3001'),
  APP_URL: z.string().url(),
  API_URL: z.string().url(),

  // CORS
  CORS_ORIGINS: z.string().default('http://localhost:3000'),

  // Logging
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),

  // Rate Limiting
  RATE_LIMIT_TTL: z.string().default('900'),
  RATE_LIMIT_MAX: z.string().default('100'),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(config: Record<string, unknown>): Env {
  try {
    return envSchema.parse(config);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`);
      throw new Error(
        `Environment validation failed:\n${missingVars.join('\n')}\n\nPlease check your .env file.`,
      );
    }
    throw error;
  }
}
