# Architecture

How the boilerplate is put together: folder layout, routing, the API layer, state, storage and the decisions behind them. Back to the [README](../README.md).

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
│   │   └── (tabs)/           #   Tabs group (URL-invisible): index → Home, settings → Settings
│   ├── features/             # One folder per feature — screens, state, API, types
│   │   ├── auth/             #   screens/, store/, api/, hooks.ts, session.ts, types.ts
│   │   │   └── index.ts      #     Public API — the only entry other code may import
│   │   ├── home/             #   screens/HomeScreen.tsx
│   │   ├── posts/            #   api/ — react-query-kit hooks for the posts resource
│   │   └── settings/         #   screens/SettingsScreen.tsx (language picker)
│   ├── shared/               # Feature-agnostic building blocks
│   │   ├── components/       #   Button, TextField, ControlledTextField, ScreenWrapper, Tab bar bits
│   │   ├── constants/        #   Tab route segments
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
| `src/app/(tabs)/settings.tsx` | `/settings` → `SettingsScreen` from `@/features/settings` |

### Adding a new screen

```tsx
// src/features/about/screens/AboutScreen.tsx
import { Text } from 'react-native';

import ScreenWrapper from '@/shared/components/ScreenWrapper';

export function AboutScreen() {
  return (
    <ScreenWrapper>
      <Text>About</Text>
    </ScreenWrapper>
  );
}

// src/features/about/index.ts
export { AboutScreen } from './screens/AboutScreen';

// src/app/about.tsx → /about
export { AboutScreen as default } from '@/features/about';
```

To make it a tab, drop it under `src/app/(tabs)/` and add a `<Tabs.Screen name="about" />`
entry in `src/app/(tabs)/_layout.tsx`. Also register its icon/label in
`src/shared/components/TabBarIcon.tsx` and `src/shared/components/TabBarLabel.tsx`.

### Navigating

```tsx
import { Link, useRouter } from 'expo-router';

// Declarative
<Link href="/settings">Go to settings</Link>;

// Imperative
const router = useRouter();
router.push('/settings');
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

`src/app/_layout.tsx` declares the root stack's anchor — the screen the router
puts at the bottom of the stack and shows when no specific path was requested —
via expo-router's `unstable_settings`:

```ts
export const unstable_settings = { anchor: '(tabs)' };
```

Every `<Stack.Protected>` group also sets `redirectTo`. Without it, a failed
guard falls back to the anchor — and `(tabs)` is itself guarded when logged
out, so the app would land on `+not-found`:

```tsx
<Stack.Protected guard={isLoggedIn} redirectTo="/login">
  <Stack.Screen name="(tabs)" />
</Stack.Protected>
<Stack.Protected guard={!isLoggedIn} redirectTo="/">
  <Stack.Screen name="(auth)" />
</Stack.Protected>
```

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
│   └── types.ts      ← PaginateQuery<K, T> (limit/skip pages) and other cross-feature API types
└── features/
    └── posts/
        ├── api/          ← one api/ folder per feature that talks to the backend
        │   ├── types.ts
        │   ├── use-posts.ts            ← plain list query
        │   ├── use-infinite-posts.ts   ← paginated list (limit / skip)
        │   ├── use-post.ts             ← detail by id
        │   └── use-add-post.ts         ← POST mutation
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
- `src/services/__tests__/utils.test.ts` — pagination helpers

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

## Storage & Security

### Encrypted storage

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

