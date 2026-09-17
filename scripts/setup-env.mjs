#!/usr/bin/env node
/**
 * scripts/setup-env.mjs
 *
 * Create the three local env files on first install, from `.env.example`.
 *
 * `.env.development`, `.env.staging` and `.env.production` are gitignored —
 * they hold real API URLs and keys, so they are never committed. That leaves a
 * fresh clone with no env files at all, and `env.ts` failing Zod validation
 * with a message about missing variables rather than the actual problem, which
 * is that nobody told you to create three files.
 *
 * So the postinstall hook creates them, seeded from `.env.example`, with
 * `EXPO_PUBLIC_APP_ENV` already set per file. Placeholder URLs, but a valid
 * shape — the app boots and tells you which values to replace.
 *
 * ─── The one rule ────────────────────────────────────────────────────────────
 * This script NEVER writes to a file that already exists. It runs on every
 * `yarn install`, and silently overwriting the env file holding your staging
 * credentials would be a far worse bug than the one it fixes. Existing files
 * are only ever read, to report keys they are missing.
 *
 * ─── Usage ───────────────────────────────────────────────────────────────────
 *   yarn install        # runs automatically via postinstall
 *   yarn env:init       # run by hand, e.g. after adding a key to .env.example
 *
 * Skipped entirely on EAS and in CI: both inject env vars into `process.env`
 * directly (see eas.json `environment` and scripts/eas-pre-install.sh), so
 * writing placeholder files there adds nothing and risks masking a real value.
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const EXAMPLE = join(ROOT, '.env.example');
const ENVIRONMENTS = ['development', 'staging', 'production'];

/** The key whose value differs per generated file. */
const APP_ENV_KEY = 'EXPO_PUBLIC_APP_ENV';

const KEY_LINE = /^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=/;

/** The key a line declares, or undefined for a comment or blank line. */
const keyOf = (line) => line.match(KEY_LINE)?.[1];

// Tested per line, never against a whole block: KEY_LINE is anchored with `^`
// and carries no `m` flag, so matching it against multi-line text only ever
// looks at the first line and silently reports false for the rest.
const declaresKey = (block) => block.split('\n').some((line) => keyOf(line) !== undefined);

// ─── skip conditions ──────────────────────────────────────────────────────────

// EAS injects env vars into process.env from the `environment` set per profile
// in eas.json; CI does the same from its own secret store. In both cases the
// files are beside the point, and a placeholder EXPO_PUBLIC_API_URL sitting on
// disk is one more thing that could shadow a real value.
if (process.env.EAS_BUILD === 'true' || process.env.CI === 'true') {
  process.exit(0);
}

if (!existsSync(EXAMPLE)) {
  console.warn('[env] .env.example not found — skipping env file generation.');
  process.exit(0);
}

// ─── read the template ────────────────────────────────────────────────────────

const example = readFileSync(EXAMPLE, 'utf8');

/** Every key declared in .env.example, in order. */
const exampleKeys = example.split('\n').map(keyOf).filter(Boolean);

if (exampleKeys.length === 0) {
  console.warn('[env] .env.example declares no variables — skipping env file generation.');
  process.exit(0);
}

/**
 * Strip the banner from .env.example.
 *
 * The template opens with a long comment block explaining the copy workflow and
 * the dotenv resolution order. That is documentation for the template itself,
 * not for the files it seeds, so it is dropped. Comment blocks that document an
 * actual variable sit directly above it and are kept — they are the useful half.
 */
function stripBanner(text) {
  const blocks = text.trimEnd().split(/\n\s*\n/);
  const firstWithKey = blocks.findIndex(declaresKey);
  // -1 is unreachable: a template with no keys at all exits before this runs.
  return blocks.slice(Math.max(firstWithKey, 0)).join('\n\n');
}

const body = stripBanner(example);

/** Rewrite `EXPO_PUBLIC_APP_ENV=…` to the environment this file is for. */
function withAppEnv(text, environment) {
  const line = new RegExp(`^\\s*${APP_ENV_KEY}\\s*=.*$`, 'm');
  return line.test(text)
    ? text.replace(line, `${APP_ENV_KEY}=${environment}`)
    : `${APP_ENV_KEY}=${environment}\n\n${text}`;
}

function header(environment) {
  return [
    `# .env.${environment} — created by scripts/setup-env.mjs from .env.example.`,
    '#',
    '# Gitignored, and never overwritten: re-running `yarn install` leaves your',
    '# edits alone. Replace the placeholder values below with real ones.',
    '#',
    '# Adding a variable? Add it to .env.example first, then run `yarn env:init`',
    '# to find out which of your local files are missing it.',
    '',
    '',
  ].join('\n');
}

// ─── generate ─────────────────────────────────────────────────────────────────

const created = [];
const drifted = [];

for (const environment of ENVIRONMENTS) {
  const target = join(ROOT, `.env.${environment}`);

  if (existsSync(target)) {
    // Never written to — only inspected. A key present in .env.example but
    // absent here means someone added a variable and this machine's file
    // predates it, which surfaces later as a confusing Zod failure at build
    // time. Cheaper to say so now.
    const current = readFileSync(target, 'utf8');
    const present = new Set(current.split('\n').map(keyOf).filter(Boolean));
    const missing = exampleKeys.filter((key) => !present.has(key));
    if (missing.length > 0) drifted.push({ environment, missing });
    continue;
  }

  writeFileSync(target, header(environment) + withAppEnv(body, environment) + '\n', 'utf8');
  created.push(environment);
}

// ─── report ───────────────────────────────────────────────────────────────────
//
// Silent when there is nothing to say. This runs on every single `yarn install`,
// and a script that prints a banner each time is a script people stop reading.

if (created.length > 0) {
  console.log(`\n[env] Created ${created.map((e) => `.env.${e}`).join(', ')} from .env.example.`);
  console.log('[env] These hold placeholder values — edit them before running the app.\n');
}

for (const { environment, missing } of drifted) {
  console.warn(
    `[env] .env.${environment} is missing ${missing.length > 1 ? 'keys' : 'a key'} ` +
      `declared in .env.example: ${missing.join(', ')}`,
  );
}
