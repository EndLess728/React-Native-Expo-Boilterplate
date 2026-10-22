export type StateLibrary = 'zustand' | 'redux';
export type ReduxMiddleware = 'thunk' | 'saga';
export type Navigation = 'expo-router' | 'react-navigation';
export type Language = 'ts' | 'js';
export type PackageManager = 'yarn' | 'npm' | 'pnpm' | 'bun';

export interface ProjectOptions {
  /** Directory name, also used for the npm package name. */
  projectName: string;
  /** Absolute path of the directory the project is generated into. */
  targetDir: string;
  /** Human-readable app name shown under the icon. */
  displayName: string;
  /** iOS bundle identifier and Android package name. */
  bundleId: string;
  state: StateLibrary;
  /** Only set when `state` is `redux`. */
  reduxMiddleware: ReduxMiddleware | null;
  navigation: Navigation;
  language: Language;
  eslint: boolean;
  husky: boolean;
  packageManager: PackageManager;
  install: boolean;
  git: boolean;
}

export const DEFAULTS = {
  state: 'zustand',
  reduxMiddleware: 'thunk',
  navigation: 'expo-router',
  language: 'ts',
  eslint: true,
  husky: true,
} as const;

export const CHOICES = {
  state: ['zustand', 'redux'],
  reduxMiddleware: ['thunk', 'saga'],
  navigation: ['expo-router', 'react-navigation'],
  language: ['ts', 'js'],
  packageManager: ['yarn', 'npm', 'pnpm', 'bun'],
} as const;

// ─────────────────────────────────────────────────────────────
//  Name helpers
// ─────────────────────────────────────────────────────────────

/** `My Cool App` / `my_cool.app` → `my-cool-app` (valid npm name and Expo slug). */
export function toPackageName(input: string): string {
  return input
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

/** `my-cool-app` → `My Cool App`. */
export function toDisplayName(input: string): string {
  return toPackageName(input)
    .split('-')
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ');
}

/** `my-cool-app` → `mycoolapp` (deep-link scheme, last bundle-id segment). */
export function toScheme(input: string): string {
  const scheme = toPackageName(input).replace(/-/g, '');
  // A scheme / Java package segment must start with a letter.
  return /^[a-z]/.test(scheme) ? scheme : `app${scheme}`;
}

export function defaultBundleId(projectName: string): string {
  return `com.${toScheme(projectName)}`;
}

const BUNDLE_ID_RE = /^[a-zA-Z][a-zA-Z0-9_]*(\.[a-zA-Z][a-zA-Z0-9_]*)+$/;

export function validateBundleId(value: string): string | undefined {
  if (!BUNDLE_ID_RE.test(value)) {
    return 'Use reverse-DNS form with at least two segments, e.g. com.company.app (letters, digits, underscores).';
  }
  return undefined;
}

export function validateProjectName(value: string): string | undefined {
  if (!value.trim()) return 'Project name is required.';
  if (!toPackageName(value)) return 'Project name needs at least one letter or digit.';
  return undefined;
}
