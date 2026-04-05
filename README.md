# React Native Expo Boilerplate

Production-grade React Native starter built on **Expo SDK 54**, **React Native 0.81**, and **React 19**. Ships with multi-environment builds, type-safe config, and an opinionated architecture so you can skip the setup and start building features.

## Tech Stack

| Category | Library |
|---|---|
| **Framework** | [Expo](https://expo.dev/) (SDK 54) with React Compiler |
| **Navigation** | [React Navigation v7](https://reactnavigation.org/) — Native Stack, Bottom Tabs, Drawer |
| **State** | [Zustand](https://github.com/pmndrs/zustand) — Atomic global state |
| **Data Fetching** | [TanStack Query v5](https://tanstack.com/query) + [Axios](https://axios-http.com/) + [react-query-kit](https://github.com/nichenqin/react-query-kit) |
| **Forms** | [React Hook Form](https://react-hook-form.com/) + [Zod v4](https://zod.dev/) |
| **Styling** | [Unistyles](https://unistyl.es/) — Compiled stylesheets, light/dark themes |
| **Storage** | [MMKV](https://github.com/mrousavy/react-native-mmkv) — Synchronous, encrypted key-value store |
| **i18n** | [i18next](https://www.i18next.com/) + [react-i18next](https://react.i18next.com/) |
| **Animations** | [Reanimated](https://docs.swmansion.com/react-native-reanimated/) + [Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/) |
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

# 2. Generate native projects for your target environment
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
│   ├── localization/         # i18n config, translation JSON files, type-safe hooks
│   ├── navigation/           # Navigator definitions (Stack, Tabs, Drawer)
│   ├── screens/              # Feature screens (Login, Home, Profile)
│   ├── storage/              # MMKV storage instance + helpers
│   ├── store/                # Zustand stores (useUserStore, etc.)
│   ├── styles/               # Global spacing, sizing constants
│   ├── theme/                # Unistyles themes, fonts, text styles
│   └── utils/                # Pure utility functions
├── .env.development          # Dev environment variables
├── .env.staging              # Staging environment variables
├── .env.production           # Production environment variables
├── env.ts                    # Zod schema — validates env vars at startup
├── app.config.ts             # Dynamic Expo config (name, bundle ID, version)
├── eas.json                  # EAS Build profiles
├── App.tsx                   # Entry point
└── plugins/                  # Custom Expo config plugins
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
1. Add it to all three `.env.*` files
2. Add the key to the Zod schema in `env.ts`
3. Reference it statically: `process.env.EXPO_PUBLIC_YOUR_VAR` (Metro requires dot notation)
4. Import from `@env`: `import Env from '@env'`

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
```

## Architecture Decisions

### Why native dirs are not in git

The `android/` and `ios/` folders are generated by `expo prebuild` and are listed in `.gitignore`. This is intentional:

- **Native config changes per environment** — app name and version differ; committing one env's native code causes conflicts with others
- **Prebuild is deterministic** — anyone can regenerate identical native projects from `app.config.ts`
- **Keeps the repo lean** — avoids 65+ generated files in version control

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
5. **Add your API URLs** to the `.env.*` files
6. **Update `env.ts`** schema with your project's environment variables

## Author

Built and maintained by [**EndLess728**](https://github.com/EndLess728).

## License

Private — All rights reserved.
