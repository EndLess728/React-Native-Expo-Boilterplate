/**
 * Centralized, Zod-validated environment configuration.
 *
 * This file is the single source of truth for ALL per-environment config:
 * app name, bundle IDs, packages, schemes, and runtime variables.
 *
 * Flow:
 *   1. `cp .env.staging .env.local` writes the active env file
 *   2. Expo CLI loads EXPO_PUBLIC_* vars from .env.local (highest priority)
 *   3. This file builds a typed env object with both process.env vars and computed per-env values
 *   4. `app.config.ts` imports Env for native config (name, bundle ID, package)
 *   5. Runtime code imports Env via `@env` alias for API URLs etc.
 *
 * Validation:
 *   - Set STRICT_ENV_VALIDATION=1 (in prebuild/build scripts) to throw on invalid vars
 *   - In dev, validation errors are logged as warnings but don't crash the app
 */

import { z } from 'zod';

import packageJSON from './package.json';

// ─────────────────────────────────────────────────────────────
//  Schema
// ─────────────────────────────────────────────────────────────

const envSchema = z.object({
  // App identity (computed from EXPO_PUBLIC_APP_ENV)
  EXPO_PUBLIC_APP_ENV: z.enum(['development', 'staging', 'production']),
  EXPO_PUBLIC_NAME: z.string(),
  EXPO_PUBLIC_PACKAGE_NAME: z.string(),
  EXPO_PUBLIC_VERSION: z.string(),

  // Runtime variables (from .env.* files)
  EXPO_PUBLIC_API_URL: z.string().url('EXPO_PUBLIC_API_URL must be a valid URL'),
  EXPO_PUBLIC_SOCKET_URL: z.string().url('EXPO_PUBLIC_SOCKET_URL must be a valid URL'),
});

// ─────────────────────────────────────────────────────────────
//  Per-environment config maps
// ─────────────────────────────────────────────────────────────

type AppEnvironment = z.infer<typeof envSchema>['EXPO_PUBLIC_APP_ENV'];

const EXPO_PUBLIC_APP_ENV = (process.env.EXPO_PUBLIC_APP_ENV ?? 'development') as AppEnvironment;

const APP_NAMES: Record<AppEnvironment, string> = {
  development: 'ExpoTemplate (Dev)',
  staging: 'ExpoTemplate (Staging)',
  production: 'ExpoTemplate',
};

const PACKAGE_NAMES: Record<AppEnvironment, string> = {
  development: 'com.expo.template.dev',
  staging: 'com.expo.template.staging',
  production: 'com.expo.template',
};

// ─────────────────────────────────────────────────────────────
//  Build env object
// ─────────────────────────────────────────────────────────────

// Note: process.env.EXPO_PUBLIC_* must be referenced statically (dot notation)
// so Metro can inline them at bundle time. Do NOT use bracket notation or destructure.
const _env: z.infer<typeof envSchema> = {
  EXPO_PUBLIC_APP_ENV,
  EXPO_PUBLIC_NAME: APP_NAMES[EXPO_PUBLIC_APP_ENV],
  EXPO_PUBLIC_PACKAGE_NAME: PACKAGE_NAMES[EXPO_PUBLIC_APP_ENV],
  EXPO_PUBLIC_VERSION: packageJSON.version,
  EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL ?? '',
  EXPO_PUBLIC_SOCKET_URL: process.env.EXPO_PUBLIC_SOCKET_URL ?? '',
};

// ─────────────────────────────────────────────────────────────
//  Validation
// ─────────────────────────────────────────────────────────────

const STRICT_ENV_VALIDATION = process.env.STRICT_ENV_VALIDATION === '1';

function getValidatedEnv(env: z.infer<typeof envSchema>) {
  const parsed = envSchema.safeParse(env);

  if (!parsed.success) {
    const errorMessage =
      `❌ Invalid environment variables:\n${JSON.stringify(parsed.error.flatten().fieldErrors, null, 2)}` +
      `\n❌ Missing variables in .env file for APP_ENV=${EXPO_PUBLIC_APP_ENV}` +
      `\n💡 Tip: If you recently updated the .env file, try restarting with -c flag to clear the cache.`;

    if (STRICT_ENV_VALIDATION) {
      console.error(errorMessage);
      throw new Error('Invalid environment variables');
    }

    console.warn(errorMessage);
  } else {
    console.log('✅ Environment variables validated successfully');
  }

  return parsed.success ? parsed.data : env;
}

const Env = getValidatedEnv(_env);

export default Env;

export type AppEnv = typeof Env.EXPO_PUBLIC_APP_ENV;
