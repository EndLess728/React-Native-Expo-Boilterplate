# AGENTS.md

Project conventions for AI coding agents (Claude Code, Cursor, Copilot, etc.).
Read this **first** before generating any code in this repo. Keep changes
consistent with what is documented here — when in doubt, mirror an existing
sibling file rather than inventing a new pattern.

---

## Stack

- **Expo SDK 55** (`react-native ^0.83`), Hermes default, React Compiler enabled
  (`app.config.ts → experiments.reactCompiler: true`). Typed routes enabled via
  `experiments.typedRoutes: true`.
- **TypeScript** strict mode. Path aliases: `@` → `./src`, `@env` → `./env`.
- **State**: Zustand (atomic selectors — see Rules), persisted via MMKV.
- **Data**: TanStack Query + `react-query-kit` for hook codegen; Axios client.
- **Forms**: React Hook Form + Zod.
- **Styling**: Unistyles v3 (`StyleSheet.create((theme) => ({...}))` only).
- **Navigation**: **Expo Router** (file-based, on top of React Navigation v7).
  Routes live in `app/`; there is no `src/navigation/` or `src/screens/`.
- **i18n**: i18next + `react-i18next`, translations in `src/localization/translations/`. See [`.skills/localization.md`](file://.skills/localization.md) for full instructions.
- **Toast**: `react-native-toast-message` wrapped in `src/utils/toast.tsx`.

This is a **standalone** Expo project (not a monorepo). Do not introduce
`apps/` or `packages/` directories.

---

## Directory map — where things go

```
index.ts                ← custom entry; runs unistyles side-effect before
                          `expo-router/entry` (must remain in this order).
                          i18n is initialized after storage in `_layout.tsx`.
src/
├── app/                ← Expo Router file-based routes
│   ├── _layout.tsx     ← providers (gesture, keyboard, safe-area, API/Query,
│   │                     Toast); splash; fonts; storage + i18n init;
│   │                     <Stack.Protected> auth gating;
│   │                     re-exports `ErrorBoundary` from expo-router
│   ├── +not-found.tsx  ← catch-all 404 route
│   ├── +html.tsx       ← web-only HTML shell (no-op on iOS/Android)
│   ├── (auth)/
│   │   ├── _layout.tsx ← auth `<Stack>` (headerless)
│   │   └── login.tsx   ← /login
│   └── (tabs)/
│       ├── _layout.tsx ← `<Tabs>` using unistyles theme colors
│       ├── index.tsx   ← /
│       └── profile.tsx ← /profile

src/
├── api/
│   ├── common/         ← axios client (interceptors), QueryClientProvider
│   └── <resource>/     ← react-query-kit hooks (use-<resource>.ts)
├── components/         ← reusable UI components only. NO toast helpers, NO screens
├── constants/          ← NAVIGATION tab segments, ApiUrls, deviceInfo, status
├── hooks/              ← reusable hooks (useAppState, useDebounce, …)
├── localization/       ← i18n.ts, resources.ts, translations/*.json
├── storage/            ← MMKV init (index.ts) + token helpers (token.ts)
├── store/              ← Zustand stores (createPersistedStore-based)
├── styles/             ← Unistyles config (themes, breakpoints, unistyles.ts)
├── theme/              ← fonts.ts + TextStyles.ts (style primitives)
└── utils/              ← side-effect helpers (toast.tsx, scale.ts)
```

**Adding a new screen**: create a file under `src/app/` matching the desired URL
(`src/app/foo.tsx` → `/foo`, `src/app/(tabs)/foo.tsx` → tab named `foo`). The default
export is the screen component — put the JSX, hooks, and styles directly in
that file. Do **not** re-add a `src/screens/` folder.

**Adding a new module**: mirror the closest sibling. New API resource → copy
`src/api/posts/` shape. New store → copy `src/store/useUserStore.ts`.

**Navigation**: use `useRouter()` + `router.push('/foo')` for imperative nav,
`<Link href="/foo">` for declarative. Route paths are URL-visible — group
segments like `(tabs)` and `(auth)` are NOT included in `href` strings (use
`/`, not `/(tabs)/index`). Auth gating lives in `src/app/_layout.tsx`'s
`<Stack.Protected>` guard; do not re-implement it inside individual screens.

---

## Hard rules (enforced by ESLint where possible)

### 1. Zustand: atomic selectors only — **enforced**

```ts
// ❌  subscribes to the entire store, re-renders on any state change
const { user, logout } = useUserStore();

// ✅  one selector per field
const user = useUserStore((s) => s.user);
const logout = useUserStore((s) => s.logout);
```

Non-subscribing access (`useFooStore.getState()`,
`useFooStore.persist.rehydrate()`, `useFooStore.subscribe(...)`) is fine and
does not trigger the rule.

### 2. Unistyles: `StyleSheet.create` must use a callback — **enforced**

```ts
// ❌
const styles = StyleSheet.create({ container: { flex: 1 } });

// ✅
const styles = StyleSheet.create((theme) => ({ container: { flex: 1, backgroundColor: theme.colors.bg } }));
```

Import `StyleSheet` **from `react-native-unistyles`**, never from `react-native`
(also ESLint-enforced).

### 3. Use the project's helpers, not direct primitives

| Don't | Use |
|---|---|
| Raw `TextInput` for form fields | `ControlledTextField` (`@/components/ControlledTextField`) |
| `AsyncStorage` | MMKV via `@/storage` (`getItem`/`setItem`/`removeItem`) |
| `Toast.show({...})` directly | `showSuccessToast` / `showErrorToast` etc. from `@/utils/toast` |
| `process.env.EXPO_PUBLIC_*` ad-hoc | `import Env from '@env'` (Zod-validated) |
| Hardcoded route paths | URL-visible literals (`/`, `/login`) — typed by `experiments.typedRoutes`. `NAVIGATION.*` is only for matching `route.name` inside TabBar* helpers. |
| Hardcoded scale values | `ms(n)` / `s(n)` / `vs(n)` from `@/utils/scale` |
| Custom `t()` wrapper | `useTranslate()` from `@/localization/utils` |

### 4. Env vars

- All public runtime config lives in `env.ts`, validated by Zod, exposed via
  `import Env from '@env'`.
- New vars must:
  - Be `EXPO_PUBLIC_*` prefixed (Metro inlines these at bundle time).
  - Be referenced statically in `env.ts` (no bracket notation / destructuring
    of `process.env`).
  - Have a Zod schema entry **and** be set in every `.env.<env>` file.
- Build-time computed values (app name, package id, version) are mapped per
  `EXPO_PUBLIC_APP_ENV` inside `env.ts`, **not** stored in `.env.*` files.

### 5. Persistence

- New persisted store: use `createPersistedStore<T>(name, creator)` from
  `@/store/storage`. Do not call `persist()` manually.
- After creation, **add the store to `rehydrateStores()` in `src/store/index.ts`**
  so it hydrates on app start.
- Stores use `skipHydration: true`; never access `storage` (raw MMKV) before
  `initStorage()` resolves in `src/app/_layout.tsx`.

### 6. API client

- Use the shared axios `client` from `@/api/common/client` — interceptors
  (auth, NetInfo, 401-refresh queue, error toasts) are wired there.
- React Query hooks go under `src/api/<resource>/` using `react-query-kit`:
  ```ts
  // src/api/posts/use-posts.ts
  export const usePosts = createQuery({ queryKey: ['posts'], fetcher: () => client.get(...) });
  ```
- For token-refresh-aware calls, do NOT bypass `client` unless you also need to
  avoid the 401 interceptor loop (only the refresh-token call itself does this).

### 7. Console output

- `console.log` / `info` / `debug` are stripped in production by babel's
  `transform-remove-console`. `console.error` / `warn` are preserved.
- Still wrap noisy diagnostic logs in `if (__DEV__) { ... }` so dev console
  stays scannable.

### 8. Native folders

- **Never** edit `android/` or `ios/` directly. They are regenerated by
  `expo prebuild --clean`.
- Native changes go through an Expo config plugin under `plugins/` or via
  `expo-build-properties` in `app.config.ts`.

### 9. Comments

- Default to **no comments**. Names and types should carry the meaning.
- Add a comment only when the *why* is non-obvious (hidden invariant, subtle
  ordering, library quirk, workaround). Do not narrate *what* the code does.
- No multi-paragraph docstrings; one short line max.

---

## Workflows

### Running

```
yarn start:development    # or :staging / :production
yarn ios:development      # or :staging / :production
yarn android:development  # or :staging / :production
```

Each script copies the matching `.env.<env>` to `.env.local` and sets
`APP_ENV` / `EXPO_PUBLIC_APP_ENV` via `cross-env`. **Don't** run `expo start`
bare — env resolution depends on the scripts.

### Verifying before commit

```
yarn type-check   # tsc --noEmit
yarn lint         # eslint .
yarn test         # jest
```

Husky's `pre-commit` runs lint-staged + type-check. If a hook fails, fix the
underlying cause — **do not** use `--no-verify`.

### Adding a dependency

- Runtime dep → `yarn add <pkg>`.
- Build/lint/test only → `yarn add -D <pkg>`.
- If the dep needs native code, run `yarn prebuild:development` afterward and
  inspect the generated `android/`/`ios/` for sanity; do not commit them.

---

## Things to push back on

If a user request would violate the rules above, **say so first**. Examples:
- "Add a `useEverythingStore()` call destructuring 8 fields" → propose atomic
  selectors instead.
- "Put a toast helper inside `src/components/`" → it belongs in `src/utils/toast.tsx`.
- "Add `process.env.EXPO_PUBLIC_FOO` ad-hoc in a screen" → route via `env.ts`.
- "Edit `android/app/build.gradle`" → use `expo-build-properties` or a plugin.

---

## File-style cheatsheet

A typical screen:

```tsx
import React from 'react';
import { Text } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { useFooQuery } from '@/api/foo/use-foo';
import Button from '@/components/Button';
import ScreenWrapper from '@/components/ScreenWrapper';
import { useTranslate } from '@/localization/utils';
import { useUserStore } from '@/store/useUserStore';
import { TextStyles } from '@/theme';
import { ms } from '@/utils';

const Foo: React.FC = () => {
  const user = useUserStore((s) => s.user);
  const t = useTranslate();
  const { data } = useFooQuery();

  return (
    <ScreenWrapper>
      <Text style={TextStyles.h1}>{t('foo.title')}</Text>
    </ScreenWrapper>
  );
};

export default Foo;

const styles = StyleSheet.create((theme) => ({
  // ...
}));
```

Import order (enforced by `simple-import-sort`):
1. Side-effect imports
2. `react`, third-party packages
3. `@env`, `@/...` aliases
4. Relative `./...`
