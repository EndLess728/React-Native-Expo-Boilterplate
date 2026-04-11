# React Native Expo Boilerplate

Production-grade React Native starter built on **Expo SDK 54**, **React Native 0.81**, and **React 19**. Ships with multi-environment builds, type-safe config, encrypted secure storage, and an opinionated architecture so you can skip the setup and start building features.

## Tech Stack

| Category | Library |
|---|---|
| **Framework** | [Expo](https://expo.dev/) (SDK 54) with React Compiler |
| **Navigation** | [React Navigation v7](https://reactnavigation.org/) — Native Stack, Bottom Tabs, Drawer |
| **State** | [Zustand](https://github.com/pmndrs/zustand) — Atomic global state with MMKV persistence |
| **Data Fetching** | [TanStack Query v5](https://tanstack.com/query) + [Axios](https://axios-http.com/) + [react-query-kit](https://github.com/nichenqin/react-query-kit) |
| **Forms** | [React Hook Form](https://react-hook-form.com/) + [Zod v4](https://zod.dev/) |
| **Styling** | [Unistyles](https://unistyl.es/) — Compiled stylesheets, light/dark themes |
| **Storage** | [MMKV](https://github.com/mrousavy/react-native-mmkv) — Synchronous, AES-encrypted key-value store |
| **Secure Storage** | [expo-secure-store](https://docs.expo.dev/versions/latest/sdk/securestore/) — iOS Keychain / Android Keystore |
| **i18n** | [i18next](https://www.i18next.com/) + [react-i18next](https://react.i18next.com/) |
| **Animations** | [Reanimated](https://docs.swmansion.com/react-native-reanimated/) + [Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/) |
| **Testing** | [jest-expo](https://github.com/expo/expo/tree/main/packages/jest-expo) + [React Native Testing Library](https://callstack.github.io/react-native-testing-library/) |
| **Linting** | ESLint 9 (flat config) + Prettier + Husky + lint-staged + Commitlint |

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

# 2. Copy and fill in the env file for your target environment
cp .env.example .env.development
# Edit .env.development with your API URLs

# 3. Generate native projects and run
yarn android:development   # prebuild + run Android (dev)
yarn ios:development       # prebuild + run iOS (dev)
```

> **Note:** The `android/` and `ios/` directories are **not committed to git**. They are generated on-the-fly by `expo prebuild` with the correct package name and bundle identifier for your target environment.

## Project Structure

```
├── src/
│   ├── api/                  # Axios client, React Query hooks, endpoint definitions
│   │   ├── common/           #   Base HTTP client, interceptors, query provider
│   │   └── posts/            #   Example domain — CRUD hooks via react-query-kit
│   ├── components/           # Shared UI primitives
│   │   ├── Button.tsx        #   Themed pressable button
│   │   ├── TextField.tsx     #   Text input with label, error, icons
│   │   ├── ControlledTextField.tsx  # RHF-connected TextField
│   │   ├── ScreenWrapper.tsx #   SafeArea + StatusBar wrapper
│   │   ├── ErrorFallback.tsx #   Error boundary fallback UI
│   │   └── ...
│   ├── constants/            # Route enums, static values
│   ├── hooks/                # Shared custom hooks (useAppState, useDebounce, …)
│   ├── localization/         # i18n config, translation JSON files, type-safe hooks
│   ├── navigation/           # Navigator definitions (Stack, Tabs)
│   ├── screens/              # Feature screens (Login, Home, Profile)
│   ├── storage/              # Encrypted MMKV storage — async init, keychain-backed key
│   ├── store/                # Zustand stores (useUserStore, …) + rehydration helper
│   ├── styles/               # Global spacing, sizing constants
│   ├── theme/                # Unistyles themes, fonts, text styles
│   └── utils/                # Pure utility functions
├── __mocks__/                # Jest module mocks (@env, empty-module stub)
├── .env.example              # Template — copy to .env.development/staging/production
├── env.ts                    # Zod schema — validates env vars at startup
├── app.config.ts             # Dynamic Expo config (name, bundle ID, scheme, version)
├── jest.config.js            # Jest configuration (jest-expo preset)
├── jest.setup.ts             # Jest global mocks (MMKV, SecureStore, storage)
├── jest.pre-setup.js         # Pre-setup: neutralises Expo winter-runtime lazy getters
├── tsconfig.test.json        # TypeScript config extended with Jest types
├── App.tsx                   # Entry point — storage init, store rehydration
└── plugins/                  # Custom Expo config plugins
```

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

Raw passwords are **never persisted**. `useUserStore` only stores safe profile data (email, display name, etc.). Auth tokens are stored separately in `src/storage/token.ts`.

### Environment Variables

Real `.env.*` files are **gitignored**. Only `.env.example` (with placeholder values) is committed.

```bash
# Copy and fill in for each environment — never commit the real files
cp .env.example .env.development
cp .env.example .env.staging
cp .env.example .env.production

# If you already committed the real files, un-track them:
git rm --cached .env .env.development .env.staging .env.production
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
1. Add it to `.env.example` and all your local `.env.*` files
2. Add the key to the Zod schema in `env.ts`
3. Reference it statically via `process.env.EXPO_PUBLIC_YOUR_VAR` (Metro requires dot notation) or import from `@env`

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

## API Layer

### HTTP Client (`src/api/common/client.ts`)

The Axios client handles:

- **Auth token injection** — reads the access token from MMKV on every request
- **Network check** — verifies connectivity before each request (no 30s timeout wait)
- **401 handling** — shows a "Session Expired" alert and logs the user out (or silently refreshes when `ENABLE_TOKEN_REFRESH = true`)
- **Request cancellation** — all query fetchers forward React Query's `AbortSignal` to Axios, so in-flight requests are cancelled automatically when the component unmounts or the query key changes
- **Error toasts** — parses API error shapes and shows user-facing messages
- **Dev logging** — logs every request/response in `__DEV__` mode

### Adding a New Endpoint

```ts
// src/api/todos/use-todos.ts
import { createQuery } from 'react-query-kit';
import { client } from '../common';

export const useTodos = createQuery({
  queryKey: ['todos'],
  fetcher: (_, { signal }) =>
    client.get('todos', { signal }).then((r) => r.data),
});
```

## State Management

Zustand stores are created with `createPersistedStore`, which:

- Pre-configures MMKV-backed persistence via `zustandStorage`
- Uses `skipHydration: true` — stores start with their initial state at module-import time (before MMKV is ready)
- Are explicitly rehydrated via `rehydrateStores()` in `App.tsx` after `initStorage()` resolves, ensuring the correct persisted state (e.g. `isLoggedIn: true`) is loaded before any component renders

### Adding a New Store

```ts
// src/store/useSettingsStore.ts
import { createPersistedStore } from './storage';

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
export async function rehydrateStores(): Promise<void> {
  await useUserStore.persist.rehydrate();
  await useSettingsStore.persist.rehydrate(); // ← add here
}
```

## Custom Hooks (`src/hooks/`)

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

- `src/utils/__tests__/scale.test.ts` — pure utility functions
- `src/store/__tests__/useUserStore.test.ts` — Zustand store behaviour

### Writing Tests

MMKV and `expo-secure-store` are auto-mocked in `jest.setup.ts` so native modules don't need to be built. Add new store mocks there as needed.

```ts
// Example component test
import { render, screen } from '@testing-library/react-native';
import Button from '@/components/Button';

it('renders the button title', () => {
  render(<Button title="Submit" onPress={() => {}} />);
  expect(screen.getByText('Submit')).toBeOnTheScreen();
});
```

## Available Scripts

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

### EAS Cloud Builds

```bash
eas build --profile development --platform android
eas build --profile staging --platform ios
eas build --profile production --platform all
```

EAS profiles are defined in `eas.json`. Each profile injects `EXPO_PUBLIC_APP_ENV`, and the `eas-build-pre-install` script copies the matching `.env` file to `.env.local`.

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

1. `App.tsx` calls `initStorage()` in a `useEffect` before rendering anything
2. All Zustand stores use `skipHydration: true` — safe to create before MMKV is ready
3. `rehydrateStores()` is called after `initStorage()` resolves — stores load their persisted values
4. `storageReady` becomes `true` — the app renders with the correct session state

### Path Aliases

Two aliases are configured in `tsconfig.json` and `babel.config.js`:

| Alias | Maps to | Example |
|---|---|---|
| `@/*` | `./src/*` | `import { Button } from '@/components'` |
| `@env` | `./env.ts` | `import Env from '@env'` |

### Commit Conventions

Commits are enforced via [Conventional Commits](https://www.conventionalcommits.org/) using Husky + Commitlint:

```
feat: add biometric auth
fix: resolve token refresh race condition
chore: update Expo SDK to 54
```

The `prepare` script automatically installs Husky Git hooks on `yarn install`.

## Customizing for Your Project

1. **Update the package name** in `env.ts` — change `com.expo.template` to your actual bundle identifier. If you need a distinct package per environment (e.g. to install dev and production side-by-side), see the commented `PACKAGE_NAMES` block in `env.ts`
2. **Update app display names** in `app.config.ts` — change `ExpoTemplate` to your app name
3. **Update the slug** in `app.config.ts` — this is your Expo project identifier
4. **Replace placeholder icons** — update `assets/icon.png` and `assets/favicon.png`
5. **Add your API URLs** to your local `.env.*` files (copied from `.env.example`)
6. **Update `env.ts`** schema with your project's environment variables
7. **Register new stores** in `src/store/index.ts → rehydrateStores()`

## Author

Built and maintained by [**EndLess728**](https://github.com/EndLess728).

## License

Private — All rights reserved.
