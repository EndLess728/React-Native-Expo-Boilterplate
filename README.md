# React Native Expo Boilerplate

Production-grade React Native starter built on **Expo SDK 57**, **React Native 0.85**, and **React 19**. Ships with **Expo Router** file-based routing, multi-environment builds, type-safe config, encrypted secure storage, and an opinionated architecture so you can skip the setup and start building features.

## Tech Stack

| Category | Library |
|---|---|
| **Framework** | [Expo](https://expo.dev/) (SDK 57) with React Compiler |
| **Navigation** | [Expo Router](https://docs.expo.dev/router/introduction/) — File-based routing on top of [React Navigation v7](https://reactnavigation.org/) (Native Stack, Bottom Tabs, Drawer). Typed routes enabled. |
| **State** | [Zustand](https://github.com/pmndrs/zustand) — Atomic global state with MMKV persistence |
| **Data Fetching** | [TanStack Query v5](https://tanstack.com/query) + [Axios](https://axios-http.com/) + [react-query-kit](https://github.com/nichenqin/react-query-kit) |
| **Forms** | [React Hook Form](https://react-hook-form.com/) + [Zod v4](https://zod.dev/) |
| **Styling** | [Unistyles](https://unistyl.es/) — Compiled stylesheets, light/dark themes |
| **Storage** | [MMKV](https://github.com/mrousavy/react-native-mmkv) — Synchronous, AES-encrypted key-value store |
| **Secure Storage** | [expo-secure-store](https://docs.expo.dev/versions/latest/sdk/securestore/) — iOS Keychain / Android Keystore |
| **i18n** | [i18next](https://www.i18next.com/) + [react-i18next](https://react.i18next.com/) |
| **Animations** | [Reanimated](https://docs.swmansion.com/react-native-reanimated/) + [Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/) |
| **Testing** | [jest-expo](https://github.com/expo/expo/tree/main/packages/jest-expo) + [React Native Testing Library](https://callstack.github.io/react-native-testing-library/) |
| **Icons** | [@react-native-vector-icons/ionicons](https://github.com/oblador/react-native-vector-icons/tree/master/packages/ionicons) — Modular per-family import (replaces deprecated `@expo/vector-icons`) |
| **Linting** | ESLint 9 (flat config) + Prettier + Husky + lint-staged + Commitlint |

## Create a New App (CLI)

Don't clone this repo for a new project — use the CLI. It generates a fresh app from this boilerplate with the stack you pick:

```bash
npx create-expo-boilerplate my-app
```

| Option | Choices (default first) |
|---|---|
| State | Zustand · Redux Toolkit (Thunk or Saga) |
| Navigation | Expo Router · React Navigation |
| Language | TypeScript · JavaScript |
| Tooling | ESLint on/off · Husky on/off |

Everything is also available as flags (`--state redux --redux-middleware saga --navigation react-navigation --js --no-husky --yes`). The CLI lives in [`cli/`](./cli) — see its README for how it works, testing every combination, and publishing.

This repo is the template itself (Expo Router + Zustand + TypeScript), so keep improving it as usual; the CLI picks changes up automatically.

## Quick Start

### Prerequisites

- **Node.js** ≥ 20
- **Yarn** v1
- **Xcode** ≥ 16 (iOS) / **Android Studio** (Android)
- **EAS CLI** — `npm install -g eas-cli` (for cloud builds)

### Setup

```bash
# 1. Clone and install
git clone <your-repo-url>
cd React-Native-Expo-Boilterplate
yarn install

# 2. Fill in your API URLs
#    postinstall already created .env.development / .staging / .production
#    from .env.example — they hold placeholders until you edit them.
$EDITOR .env.development

# 3. Generate native projects and run
yarn android:development   # prebuild + run Android (dev)
yarn ios:development       # prebuild + run iOS (dev)
```

> **Note:** The `android/` and `ios/` directories are **not committed to git**. They are generated on-the-fly by `expo prebuild` with the correct package name and bundle identifier for your target environment.

## Project Structure

```
├── index.ts                  # Custom entry — runs the unistyles side-effect
│                             #   BEFORE expo-router/entry (order matters)
├── src/
│   ├── app/                  # Expo Router routes — THIN files only
│   │   ├── _layout.tsx       #   Root layout: useAppBootstrap() + <AppProviders>,
│   │   │                     #     ErrorBoundary re-export, <Stack.Protected> auth routing
│   │   ├── +not-found.tsx    #   404 catch-all
│   │   ├── +html.tsx         #   Web-only HTML shell (no-op on iOS/Android)
│   │   ├── (auth)/login.tsx  #   `export { LoginScreen as default } from '@/features/auth'`
│   │   └── (tabs)/           #   Tabs group (URL-invisible): index → Home, profile → Profile
│   ├── features/             # One folder per feature — screens, state, API, types
│   │   ├── auth/             #   screens/, store/, api/, hooks.ts, session.ts, types.ts
│   │   │   └── index.ts      #     Public API — the only entry other code may import
│   │   ├── home/             #   screens/HomeScreen.tsx
│   │   ├── posts/            #   api/ — react-query-kit hooks for the posts resource
│   │   └── profile/          #   screens/ProfileScreen.tsx
│   ├── shared/               # Feature-agnostic building blocks
│   │   ├── components/       #   Button, TextField, ControlledTextField, ScreenWrapper, Tab bar bits
│   │   ├── constants/        #   Tab route segments, ApiUrls, deviceInfo, status enums
│   │   ├── hooks/            #   useAppState, useDebounce, useBlockBackNavigation
│   │   └── utils/            #   scale helpers, toast
│   ├── providers/            # AppProviders (all context providers) + useAppBootstrap()
│   ├── services/             # HTTP infrastructure (Axios client, QueryClientProvider, pagination)
│   ├── store/                # App-level store wiring: rehydrateStores(), StoreProvider,
│   │                         #   createPersistedStore() helper
│   ├── storage/              # Encrypted MMKV storage — async init, keychain-backed key
│   ├── localization/         # i18n config, translation JSON files, type-safe hooks
│   ├── styles/               # Unistyles themes, breakpoints, configure call
│   ├── theme/                # Fonts, TextStyles primitives
│   └── assets/               # Fonts and images
├── __mocks__/                # Jest module mocks (@env, empty-module stub)
├── scripts/                  # setup-env.mjs (seeds .env.* on postinstall),
│                             #   repack.mjs, eas-pre-install.sh
├── .env.example              # The only committed env file — seeds the other three
├── env.ts                    # Zod schema — validates env vars at startup
├── app.config.ts             # Dynamic Expo config (name, bundle ID, scheme, plugins)
├── jest.config.js            # Jest configuration (jest-expo preset)
├── jest.setup.ts             # Jest global mocks (MMKV, SecureStore, storage)
├── jest.pre-setup.js         # Pre-setup: neutralises Expo winter-runtime lazy getters
└── tsconfig.test.json        # TypeScript config extended with Jest types
```

> **Feature-based layout.** Screens live in `src/features/<feature>/screens/` and
> each route file under `src/app/` is a one-line re-export. Other code imports a
> feature only through its `index.ts` (`@/features/auth`) — ESLint rejects deep
> imports like `@/features/auth/store/useUserStore`. Inside a feature, use
> relative imports. `src/store/` is the one exception: it wires every feature's
> persisted store into start-up.

## Security

### Encrypted Storage

All persistent data is stored in MMKV, which is AES-encrypted at rest. The encryption key is **never hardcoded** — instead it is:

1. Generated once using `expo-crypto` (cryptographically secure random bytes) on first launch
2. Stored in the OS keychain via `expo-secure-store` (iOS Keychain / Android Keystore-backed EncryptedSharedPreferences)
3. Retrieved on subsequent launches to unlock MMKV

```
First launch:  expo-crypto → 32-byte random key → expo-secure-store (Keychain/Keystore)
Next launches: expo-secure-store → key → unlock MMKV
```

### Credentials

Raw passwords are **never persisted**. The auth store only keeps safe profile data (email, display name, etc.). Auth tokens are stored separately in `src/storage/token.ts`.

### Environment Variables

Real `.env.*` files are **gitignored and untracked**. Only `.env.example` (with
placeholder values) is committed.

You do not create them by hand — `scripts/setup-env.mjs` runs on `postinstall`
and seeds all three from `.env.example`, with `EXPO_PUBLIC_APP_ENV` already set
per file:

```bash
yarn install        # creates .env.development / .staging / .production if absent
yarn env:init       # the same thing, on demand
```

The generator **never writes to a file that already exists**. It runs on every
install, so overwriting the file holding your staging credentials would be a
worse bug than the one it solves — existing files are only read, to report keys
they are missing. It is also skipped entirely on EAS and in CI, where env vars
are injected into `process.env` rather than read from disk.

> **Why untracked, not just gitignored?** Ignore rules do not apply to files git
> already tracks. A tracked-but-ignored env file accepts a real API key and
> commits it with no warning at all — the failure mode is silent, which is the
> worst kind. Keeping them untracked means `git status` has nothing to offer and
> the key cannot leak by accident.

If you ever find one tracked again (`git ls-files | grep '^\.env'` should print
only `.env.example`), un-track it without deleting your values:

```bash
git rm --cached .env.development .env.staging .env.production
```

## Multi-Environment Setup

The app supports three environments, each with its own **app name**, **package name / bundle ID**, and **env variables**:

| Environment | App Name | Android Package | iOS Bundle ID |
|---|---|---|---|
| `development` | ExpoTemplate (Dev) | `com.expo.template` | `com.expo.template` |
| `staging` | ExpoTemplate (Staging) | `com.expo.template` | `com.expo.template` |
| `production` | ExpoTemplate | `com.expo.template` | `com.expo.template` |

> A single package name is used across all environments to keep third-party service setup (Firebase, push notifications, signing) unified.

### Environment Variables

Each `.env.<environment>` file defines:

```bash
EXPO_PUBLIC_APP_ENV=development    # development | staging | production
EXPO_PUBLIC_API_URL=https://api.example.com/
EXPO_PUBLIC_SOCKET_URL=https://ws.example.com/
```

Adding a new variable:
1. Add it to `.env.example` — the committed template every local file is seeded from
2. Run `yarn env:init`. It will not touch your existing files, but it names each
   one missing the new key, so you know exactly what to fill in
3. Add the key to the Zod schema in `env.ts`
4. Reference it statically via `process.env.EXPO_PUBLIC_YOUR_VAR` (Metro requires dot notation) or import from `@env`
5. Push it to EAS for cloud builds — `yarn env:push:staging` and friends

> Step 2 matters more than it looks: a missing key does not fail where you added
> it. It fails later, during someone else's prebuild, as a Zod error about a
> variable they have never heard of.

> **Validation:** `env.ts` validates all variables via Zod on every startup. In development, invalid vars log a warning. During prebuild (`STRICT_ENV_VALIDATION=1`), it throws — catching config errors before native code is generated.

### How Env Switching Works

```
yarn android:staging
  → cp .env.staging .env.local        (writes active env to .env.local)
  → expo run:android                  (Metro starts, reads .env.local)
  → .env.local has highest priority   (wins over .env.development auto-load)
  → env.ts reads EXPO_PUBLIC_APP_ENV=staging, builds typed config
  → app.config.ts uses Env for app name, bundle ID, package name
  → Runtime code imports Env from @env for API URLs etc.
```

## Routing (Expo Router)

Routes live under `src/app/`. The file path becomes the URL — `src/app/(tabs)/home.tsx`
serves `/home` (the `(tabs)` group is URL-invisible). Each route file's default
export is the screen component, re-exported from its feature.

### Conventions used in this boilerplate

| File | Purpose |
|---|---|
| `src/app/_layout.tsx` | Root layout — `useAppBootstrap()` (splash, storage, store rehydration, i18n), `<AppProviders>`, `<Stack.Protected>` auth gating, `ErrorBoundary` re-export |
| `src/app/(tabs)/_layout.tsx` | Bottom `<Tabs>` |
| `src/app/(tabs)/index.tsx` | `/` (Home tab) → `HomeScreen` from `@/features/home` |
| `src/app/(tabs)/profile.tsx` | `/profile` → `ProfileScreen` from `@/features/profile` |

### Adding a new screen

```tsx
// src/features/settings/screens/SettingsScreen.tsx
import { Text } from 'react-native';

import ScreenWrapper from '@/shared/components/ScreenWrapper';

export function SettingsScreen() {
  return (
    <ScreenWrapper>
      <Text>Settings</Text>
    </ScreenWrapper>
  );
}

// src/features/settings/index.ts
export { SettingsScreen } from './screens/SettingsScreen';

// src/app/settings.tsx → /settings
export { SettingsScreen as default } from '@/features/settings';
```

To make it a tab, drop it under `src/app/(tabs)/` and add a `<Tabs.Screen name="settings" />`
entry in `src/app/(tabs)/_layout.tsx`. Also register its icon/label in
`src/shared/components/TabBarIcon.tsx` and `src/shared/components/TabBarLabel.tsx`.

### Navigating

```tsx
import { Link, useRouter } from 'expo-router';

// Declarative
<Link href="/profile">Go to profile</Link>;

// Imperative
const router = useRouter();
router.push('/profile');
router.replace('/login');
router.back();
```

Use URL-visible paths (`/`, `/login`) — not the group form
(`/(tabs)/index`). With `experiments.typedRoutes: true` (set in
`app.config.ts`), all `href` values are typed against the route tree.

### Auth gating

`src/app/_layout.tsx` handles authentication gating directly in the root navigator using `<Stack.Protected>` components:

- `<Stack.Protected guard={isLoggedIn}>` wraps the `(tabs)` group.
- `<Stack.Protected guard={!isLoggedIn}>` wraps the `(auth)` group.

Individual screens **do not** redirect themselves — `useLogin()` / `useLogout()` from `@/features/auth` flip the session state and the navigator automatically mounts/unmounts the correct route tree.

### Error handling

`src/app/_layout.tsx` re-exports expo-router's built-in `ErrorBoundary`:

```ts
export { ErrorBoundary } from 'expo-router';
```

Render-phase errors anywhere in the route tree are caught and shown via the
router-aware default. To customize, replace the re-export with your own
component (signature: `({ error, retry }: { error: Error; retry: () => void })`).

### Initial route

`src/app/_layout.tsx` declares the deep-link / cold-start entry point via
expo-router's `unstable_settings`:

```ts
export const unstable_settings = { initialRouteName: '(tabs)' };
```

This is the screen the router shows when no specific path was requested.

### Custom entry (`index.ts`)

The root `package.json` `"main"` points to `./index.ts`, not directly to
`expo-router/entry`. The custom entry runs the unistyles side-effect **before**
the router starts crawling routes:

```ts
import '@/styles/unistyles';   // StyleSheet.configure() before any create()
import 'expo-router/entry';
```

This is required because route modules transitively load components
(`Button.tsx`, `toast.tsx`) that call `StyleSheet.create((theme) => ...)` at
import time — the theme must be configured first.

i18next is **not** initialized here. Its saved language lives in encrypted
MMKV, which isn't created until `initStorage()` resolves inside
`useAppBootstrap()` (`src/providers/`). `initI18n()` runs there, right after
`rehydrateStores()`.

## API Layer

### HTTP Client (`src/services/client.ts`)

The Axios client handles:

- **Auth token injection** — reads the access token from MMKV on every request
- **Network check** — verifies connectivity before each request (no 30s timeout wait)
- **401 handling** — shows a "Session Expired" alert and logs the user out (or silently refreshes when `ENABLE_TOKEN_REFRESH = true`)
- **Request cancellation** — all query fetchers forward React Query's `AbortSignal` to Axios, so in-flight requests are cancelled automatically when the component unmounts or the query key changes
- **Error toasts** — parses API error shapes and shows user-facing messages
- **Dev logging** — logs every request/response in `__DEV__` mode

### Structure

```
src/
├── services/         ← HTTP infrastructure (never import axios elsewhere)
│   ├── client.ts     ← shared Axios instance with all interceptors
│   ├── api-provider.tsx  ← QueryClientProvider wiring
│   ├── utils.ts      ← pagination helpers (getNextPageParam, normalizePages, …)
│   └── index.ts      ← re-exports everything above
│   └── types.ts      ← PaginateQuery<T> and other cross-feature API types
└── features/
    └── posts/
        ├── api/          ← one api/ folder per feature that talks to the backend
        │   ├── types.ts
        │   ├── use-posts.ts
        │   ├── use-post.ts
        │   └── use-add-post.ts
        └── index.ts      ← re-exports the hooks + types (the feature's public API)
```

### Adding a New Endpoint

```ts
// src/features/todos/api/use-todos.ts  (then export it from src/features/todos/index.ts)
import { createQuery } from 'react-query-kit';
import { client } from '@/services';   // ← always @/services, never ../common

export const useTodos = createQuery({
  queryKey: ['todos'],
  fetcher: (_, { signal }) =>
    client.get('todos', { signal }).then((r) => r.data),
});
```

## State Management

Each feature owns its state in `src/features/<feature>/store/`. The store stays
private to the feature — the rest of the app uses the hooks the feature exports
(`useIsLoggedIn`, `useCurrentUser`, `useLogin`, `useLogout` for auth). That keeps
screens independent of the state library.

Zustand stores are created with `createPersistedStore` (`src/store/createPersistedStore.ts`), which:

- Pre-configures MMKV-backed persistence via `zustandStorage`
- Uses `skipHydration: true` — stores start with their initial state at module-import time (before MMKV is ready)
- Are explicitly rehydrated via `rehydrateStores()` (called by `useAppBootstrap()`) after `initStorage()` resolves, ensuring the correct persisted state (e.g. `isLoggedIn: true`) is loaded before any component renders

### Adding a New Store

```ts
// src/features/settings/store/useSettingsStore.ts
import { createPersistedStore } from '@/store/createPersistedStore';

interface SettingsState {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useSettingsStore = createPersistedStore<SettingsState>(
  'settings-storage',
  (set) => ({
    theme: 'light',
    setTheme: (theme) => set({ theme }),
  }),
);
```

Then register it in `src/store/index.ts`:

```ts
import { useSettingsStore } from '@/features/settings/store/useSettingsStore';

export async function rehydrateStores(): Promise<void> {
  await useUserStore.persist.rehydrate();
  await useSettingsStore.persist.rehydrate();      // ← add here
}
```

## Custom Hooks (`src/shared/hooks/`)

| Hook | Description |
|---|---|
| `useAppState()` | Returns the current `AppState` status (`active`, `background`, `inactive`) |
| `useOnAppForeground(cb)` | Calls `cb` whenever the app returns from background to foreground |
| `useDebounce(value, delay?)` | Debounces a value — useful for search inputs before firing API calls |

## Testing

```bash
yarn test              # Run all tests
yarn test:watch        # Watch mode
yarn test:coverage     # Generate coverage report
```

Tests use **jest-expo** (preset) + **React Native Testing Library**. Example tests are provided for:

- `src/shared/utils/__tests__/scale.test.ts` — pure utility functions
- `src/features/auth/store/__tests__/useUserStore.test.ts` — Zustand store behaviour

### Writing Tests

MMKV and `expo-secure-store` are auto-mocked in `jest.setup.ts` so native modules don't need to be built. Add new store mocks there as needed.

```ts
// Example component test
import { render, screen } from '@testing-library/react-native';
import Button from '@/shared/components/Button';

it('renders the button title', () => {
  render(<Button title="Submit" onPress={() => {}} />);
  expect(screen.getByText('Submit')).toBeOnTheScreen();
});
```

## Available Scripts

### Environment Files

```bash
yarn env:init                  # Create any missing .env.* from .env.example
                               #   (never overwrites; runs on postinstall too)
yarn env:pull:development      # Pull values down from EAS into .env.development
yarn env:pull:staging          # …from the EAS `preview` environment
yarn env:pull:production       # …from the EAS `production` environment
yarn env:push:development      # Push .env.development up to EAS
yarn env:push:staging          # …to the EAS `preview` environment
yarn env:push:production       # …to the EAS `production` environment
```

### Development

```bash
yarn start                     # Start Metro (default dev client)
yarn start:development         # Start Metro with dev env
yarn start:staging             # Start Metro with staging env
yarn start:production          # Start Metro with production env
```

### Run on Device / Simulator

```bash
yarn android:development       # Build + run Android (dev)
yarn ios:development           # Build + run iOS (dev)
yarn android:staging           # Build + run Android (staging)
yarn ios:staging               # Build + run iOS (staging)
yarn android:production        # Build + run Android (production)
yarn ios:production            # Build + run iOS (production)
```

### Prebuild (Generate Native Projects)

```bash
yarn prebuild:development      # Clean prebuild for dev (strict validation)
yarn prebuild:staging          # Clean prebuild for staging
yarn prebuild:production       # Clean prebuild for production
```

### Local Release Builds

```bash
# Android APK
yarn build:android:production  # prebuild --clean → gradlew assembleRelease

# iOS (opens Xcode workspace for archive)
yarn build:ios:production      # prebuild --clean → open .xcworkspace
```

> All build and prebuild scripts use `--clean` and `STRICT_ENV_VALIDATION=1` to ensure fresh native projects with validated env vars.

### Fast Rebuilds (Repack)

`build:android:*` runs `expo prebuild --clean` plus a full Gradle release build every single time — minutes of work even when the only thing that changed is a TypeScript file. Repack takes the APK from the last real native build and swaps in a freshly bundled JS payload instead, which turns that into a few seconds.

```bash
yarn repack:android:staging                    # repack, or full build if stale
yarn repack:android:staging --install          # …and adb install -r onto the device
yarn repack:android:staging --force-build      # ignore the cache, rebuild native
yarn repack:android:staging --no-build         # fail instead of falling back
yarn repack:android:staging --js-bundle-only   # keep the binary's app metadata

yarn repack:ios:staging --source-app path/to/App.app   # seed the cache from an Xcode build
yarn repack:ios:staging                                # repack from the cached artifact
```

All three environments are wired for both platforms (`repack:android:development`, `repack:ios:production`, and so on).

#### When to use it

| Use repack | Use a full build |
|---|---|
| Only JS/TS changed — screens, components, hooks, styles, translations, business logic | You added or removed a native dependency |
| Handing a fresh staging APK to QA or a stakeholder | You edited a config plugin or anything in `app.config.ts` that feeds the native projects |
| Iterating on release-mode behaviour (where Fast Refresh does not apply) | You bumped the Expo SDK or React Native |
| Re-testing the same build with a different `.env` value | You are cutting a store release — those go through EAS Build |

Repack is **not** for the Metro dev client. `yarn start` already loads JS over the network, so Fast Refresh covers that case. This is for release-mode builds you install and hand to someone.

#### The one rule: native must be unchanged

A repacked artifact is only valid while the native half is untouched. Add a native module, change a config plugin, or bump the SDK, and the new JS will call native APIs the old binary does not contain — which fails **at runtime on the device**, not here, where you would notice it.

The script does not trust you to remember. It fingerprints the project with `@expo/fingerprint`, stores the hash next to the cached artifact in `.repack/`, and compares before every repack. On a mismatch it falls back to a full native build instead of producing a broken artifact — or exits with an error if you passed `--no-build`.

This means the **first run seeds the cache** and is therefore slow (full prebuild + Gradle). Every run after that is the fast path, until something native moves.

#### iOS needs one manual step

iOS is deliberately not automated: `yarn build:ios:*` opens Xcode rather than producing an artifact at a known path, so there is nothing for the script to shell out to. Build or archive in Xcode once, seed the cache with `--source-app`, and subsequent `yarn repack:ios:*` runs are fast. Both simulator `.app` bundles and device `.ipa` files work.

#### Signing (Android)

Repack rewrites the archive, so the result must be re-signed — and signing with a different key than the binary already on the device makes the install fail with `INSTALL_FAILED_UPDATE_INCOMPATIBLE`. The default is the debug keystore, which is correct rather than a placeholder: local release builds are debug-signed on purpose (`android/app/build.gradle` signs `release` with `signingConfigs.debug`), while store releases go through EAS Build, which holds the real keystore in the cloud. Override with `--ks`, `--ks-pass`, `--ks-key-alias` and `--ks-key-pass` when repacking an artifact EAS built.

> `.repack/` holds the cached source binaries, their fingerprints and the repacked output. It is gitignored — machine-local build output. The script runs the pinned `@expo/repack-app` devDependency rather than `npx …@latest`, so it behaves the same on every machine and works offline.

### EAS Cloud Builds

```bash
eas build --profile development --platform android
eas build --profile staging --platform ios
eas build --profile production --platform all
```

EAS profiles are defined in `eas.json`. Each profile injects `EXPO_PUBLIC_APP_ENV`
and names an EAS `environment` (`development` / `preview` / `production`) whose
stored variables EAS puts straight into `process.env` on the builder.

`scripts/eas-pre-install.sh` runs before install and copies the matching
`.env.<APP_ENV>` to `.env.local` when that file made it onto the builder —
`.easignore` un-ignores the three env files so they upload from your machine
even though git does not track them. When the file is absent (a CI-triggered
build, or a teammate who has not filled theirs in), the hook exits cleanly and
the EAS-stored variables are the source of truth.

> That fallback is the reason to keep EAS in sync: run `eas env:list` to confirm
> all three environments are populated, and `yarn env:push:<env>` when they are
> not. It is what a cloud build falls back to when there is no file on disk.

Profiles all extend a shared `base` (pinned Node/Yarn, 4 GB heap for Metro):

| Profile | EAS environment | Distribution | Android artifact | Notes |
|---|---|---|---|---|
| `debug` | `development` | internal | apk (implicit) | Dev client build (`developmentClient: true`) |
| `development` | `development` | internal | apk | Standalone dev build, no Metro |
| `staging` | `preview` | internal | apk | QA / stakeholder drops |
| `production` | `production` | store | aab | `autoIncrement: true` — version comes from EAS (`appVersionSource: remote`) |

### EAS Workflows

The three files in `.eas/workflows/` run multi-job pipelines on EAS instead of a single `eas build` call. All three are **manual trigger only** (`workflow_dispatch`) — nothing runs on push, because every run spends paid build minutes and most commits are never installed by anyone.

| Workflow | Script | What it does | Reach for it when |
|---|---|---|---|
| `build.yml` | `yarn eas:workflow:build` | Plain build, Android + iOS **in parallel** | You want an artifact — QA drop, device build, release candidate |
| `build-fast.yml` | `yarn eas:workflow:build:fast` | Fingerprints, reuses a matching build and repacks it; compiles only if none matches | Iterating on JS-only changes and you don't want to pay for a full compile |
| `release.yml` | `yarn eas:workflow:release` | Approval gate → production build → store submission | Cutting an actual release to TestFlight / Play |

Validate all three before pushing changes to them:

```bash
yarn eas:workflow:validate
```

#### Passing inputs

Both build workflows take `profile` and `platform`, and both default to `staging` / `all`. Override with `-F`:

```bash
yarn eas:workflow:build                                   # staging, both platforms
yarn eas:workflow:build -F profile=production             # production, both platforms
yarn eas:workflow:build -F profile=development -F platform=ios
yarn eas:workflow:build:fast -F platform=android

# Convenience wrappers for the common profiles:
yarn eas:workflow:build:development
yarn eas:workflow:build:staging
yarn eas:workflow:build:production
```

> Inputs are declared `required: false` on purpose. Marking one `required: true` makes EAS ignore its `default` and prompt for a value instead, which turns every scripted run into an interactive one.

In `build.yml` the two platform jobs have no dependency between them, so a both-platform run takes as long as the *slower* platform rather than the sum. Single-platform runs skip the other job rather than needing a separate file per platform.

#### `build-fast.yml` — the cloud counterpart to `yarn repack`

Same idea as [Fast Rebuilds (Repack)](#fast-rebuilds-repack), except the cache is every build your team has ever run on EAS rather than one APK on one machine. Per platform it:

1. **Fingerprints** the project's native inputs.
2. **Looks for a finished build** with that exact fingerprint *and* the same profile — profile is part of the query because a build from another profile can share a fingerprint, and repacking it would ship the wrong configuration. If a matching build is still running it waits for it instead of starting a second identical compile.
3. **Repacks** that binary with the new JS if one was found — otherwise **compiles from scratch**.

So the first run after a native change pays full price and becomes the source binary for every JS-only run after it. It offers only `staging` and `development` profiles, and the fingerprint job pins the EAS environment to match (`development` → `development`, `staging` → `preview`) — `app.config.ts` reads `EXPO_PUBLIC_APP_ENV`, so a fingerprint taken under the wrong environment makes every run look like a native change.

**Releases deliberately do not use it.** Expo's guidance is that production builds should go through the complete pipeline for correct symbolication and signing, so what reaches a store is always compiled, never repacked.

#### `release.yml` — production build and submit

```bash
yarn eas:workflow:release                      # both platforms, submit
yarn eas:workflow:release -F platform=ios      # one platform
yarn eas:workflow:release -F submit=false      # build only, don't upload
```

The **approval gate runs first**, before any build. Approving afterwards would waste the minutes it exists to protect, and a production build increments the remote version whether or not anyone wanted it. After approval each platform is an independent build → submit chain, so a failure on one store doesn't hold up the other.

What submission does *not* do is release anything:

- **Android** — the `.aab` goes to the Play `internal` track with `releaseStatus: draft`. Nothing reaches users until someone promotes it in the Play Console.
- **iOS** — the `.ipa` lands in TestFlight once Apple finishes processing (usually 10–15 minutes). Releasing to the App Store stays a deliberate act in App Store Connect.

> **One-time setup.** Submission keys are separate from build signing: a Google Service Account key and an App Store Connect API key, uploaded once via `eas credentials --platform <android|ios>`. Without them the build succeeds and the submit job fails at upload — after the minutes are already spent.

For a one-off release without the workflow, `yarn ios-build-production-auto-submit` and `yarn android-build-production-auto-submit` run `eas build … --auto-submit` directly, skipping the approval gate.

### Code Quality

```bash
yarn lint                      # Run ESLint
yarn lint:fix                  # Auto-fix lint issues
yarn type-check                # TypeScript check (--noEmit)
yarn test                      # Run tests
yarn test:coverage             # Run tests with coverage report
```

## Architecture Decisions

### Why native dirs are not in git

The `android/` and `ios/` folders are generated by `expo prebuild` and are listed in `.gitignore`. This is intentional:

- **Native config changes per environment** — app name and version differ; committing one env's native code causes conflicts with others
- **Prebuild is deterministic** — anyone can regenerate identical native projects from `app.config.ts`
- **Keeps the repo lean** — avoids 65+ generated files in version control

### Storage initialization order

MMKV cannot be created synchronously with a secure key — the key must be retrieved from the keychain first (async). To handle this cleanly:

1. `useAppBootstrap()` (used by `src/app/_layout.tsx`) calls `initStorage()` in a `useEffect` before the navigator renders
2. All Zustand stores use `skipHydration: true` — safe to create before MMKV is ready
3. `rehydrateStores()` is called after `initStorage()` resolves — stores load their persisted values
4. `initI18n()` runs next — it reads the saved language from MMKV, so it must run after storage is ready
5. `useAppBootstrap()` returns `true` — the app renders with the correct session state, then `<Stack.Protected>` mounts the correct route group based on `isLoggedIn`

### Path Aliases

Two aliases are configured in `tsconfig.json` and `babel.config.js`:

| Alias | Maps to | Example |
|---|---|---|
| `@/*` | `./src/*` | `import { Button } from '@/shared/components'` |
| `@env` | `./env.ts` (`./__mocks__/@env.ts` under Jest) | `import Env from '@env'` |

### Commit Conventions

Commits are enforced via [Conventional Commits](https://www.conventionalcommits.org/) using Husky + Commitlint:

```
feat: add biometric auth
fix: resolve token refresh race condition
chore: update Expo SDK to 57
```

The `prepare` script automatically installs Husky Git hooks on `yarn install`.

## AI Agent Skills

This project utilizes a `.skills/` directory to store specialized, task-specific instructions for AI coding assistants (like Claude, Cursor, or Aider). 

These skills ensure that any AI working on the codebase follows the exact same architectural patterns as human developers.

- **`api-hook-creation.md`** — How to create API hooks: file layout (`src/services/` for infrastructure, `src/features/<feature>/api/` for hooks), code templates for mutations/queries/infinite queries, import conventions (`@/services`), and hard rules.
- **`ui-creation.md`** — Rules for building screens, styling with Unistyles, and form validation.
- **`localization.md`** — Strict guidelines on how to add, consume, and modify i18n translations across the app.

When prompting an AI to build a feature, you can explicitly reference these skills (e.g., `@.skills/api-hook-creation.md`) to guarantee adherence to the project's standards.

## Customizing for Your Project

1. **Update the package name** in `env.ts` — change `com.expo.template` to your actual bundle identifier. If you need a distinct package per environment (e.g. to install dev and production side-by-side), see the commented `PACKAGE_NAMES` block in `env.ts`
2. **Update app display names** in `app.config.ts` — change `ExpoTemplate` to your app name
3. **Update the slug** in `app.config.ts` — this is your Expo project identifier
4. **Replace placeholder icons** — update `assets/icon.png` and `assets/favicon.png`
5. **Add your API URLs** to your local `.env.*` files (created for you by `yarn install`; re-runnable with `yarn env:init`)
6. **Update `env.ts`** schema with your project's environment variables
7. **Register new persisted stores** in `src/store/index.ts → rehydrateStores()`

## Author

Built and maintained by [**EndLess728**](https://github.com/EndLess728).

## License

Private — All rights reserved.
