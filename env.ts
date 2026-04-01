/**
 * Typed, Zod-validated environment client.
 *
 * - `EXPO_PUBLIC_*` vars are inlined by Expo CLI / Metro from .env files.
 *   Locally: loaded from .env.local (overrides .env).
 *   EAS builds: loaded from eas.json `env` block per build profile.
 *
 * Any missing or invalid variable throws at startup with a clear error.
 */

import { z } from 'zod';

const envSchema = z.object({
  EXPO_PUBLIC_ENVIRONMENT: z.enum(['development', 'staging', 'production']).default('development'),
  EXPO_PUBLIC_BASE_URL: z.string().url('EXPO_PUBLIC_BASE_URL must be a valid URL'),
  EXPO_PUBLIC_SOCKET_URL: z.string().url('EXPO_PUBLIC_SOCKET_URL must be a valid URL'),
});

// Note: process.env.EXPO_PUBLIC_* must be referenced statically (dot notation)
// so Metro can inline them at bundle time. Do NOT use bracket notation or destructure.
const processEnv = {
  EXPO_PUBLIC_ENVIRONMENT: process.env.EXPO_PUBLIC_ENVIRONMENT,
  EXPO_PUBLIC_BASE_URL: process.env.EXPO_PUBLIC_BASE_URL,
  EXPO_PUBLIC_SOCKET_URL: process.env.EXPO_PUBLIC_SOCKET_URL,
};

const parsed = envSchema.safeParse(processEnv);

if (!parsed.success) {
  const errors = JSON.stringify(parsed.error.flatten().fieldErrors, null, 2);
  throw new Error(`❌ Invalid environment variables:\n${errors}`);
}

export const Env = parsed.data;

export type AppEnv = typeof Env.EXPO_PUBLIC_ENVIRONMENT;
