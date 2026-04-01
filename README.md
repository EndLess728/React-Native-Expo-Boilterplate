# Expo React Native Template

A modern, production-ready React Native boilerplate built with Expo, React Navigation v7, Zustand, TanStack Query, and Unistyles. Designed strictly for performance, optimal developer experience, and scalability across Android, iOS, and Web.

## Key Features

- **State Management**: Zustand for global atomic state (replacing Redux).
- **Data Fetching & Caching**: TanStack React Query (v5) integrated with Axios.
- **Theming**: High-performance light/dark adaptive custom theming powered by `react-native-unistyles`.
- **Navigation**: React Navigation v7 configured with deep-linked Stacks, Drawers, and Bottom Tabs.
- **Localization**: Next-gen `i18next` and `react-i18next` integrations for multi-language logic.
- **Strict Validations**: `zod` paired with `react-hook-form` to ensure zero-compromise form parsing.
- **Environment Typesafety**: Centralized, Zod-validated `env.ts` configuration script prevents malformed variables before bundle.
- **Storage Strategy**: Lightning-fast synchronous `react-native-mmkv` storage.
- **Linting & Formatting**: Strict robust configurations including `simple-import-sort`, `react-compiler`, Prettier, and Husky Git hooks.

## Project Structure

```text
reactnativetemplateapp/
  ├── android/           # Expo prebuild active Android source
  ├── ios/               # Expo prebuild active iOS source
  ├── src/
  │   ├── api/           # API definitions, API Provider, React Query endpoint hooks
  │   ├── assets/        # Local images, specific SVG icon sets, and Fonts
  │   ├── components/    # Dumb / Reusable UI components (Button, ScreenWrapper, etc.)
  │   ├── constants/     # Static app constants, route Enums
  │   ├── localization/  # i18n logic, translation dictionaries
  │   ├── navigation/    # Core router definitions, deep linking Maps, Stack definitions
  │   ├── screens/       # Application views/features (Login, Home)
  │   ├── storage/       # MMKV instance persistence wrapper setup
  │   ├── store/         # Zustand atomic stores (useUserStore, etc)
  │   ├── styles/        # Global style constants, spacing guidelines
  │   ├── theme/         # Unistyles breakpoints, light/dark themes
  │   └── utils/         # Reusable helpers
  ├── .env.*             # Environment-specific configuration files (development, staging, production)
  ├── env.ts             # Static Zod environment validator loaded globally via `@env` path alias
  ├── App.tsx            # Main Application entry point
  ├── app.config.ts      # Dynamic app manifest for Expo/EAS config
  └── eas.json           # Expo Application Services profiles config
```

## Environment Configuration

Strict typings are enforced on your environment keys before Metro builds your app.

Configuration variables should be entered in the corresponding file:

- `.env.development`
- `.env.staging`
- `.env.production`

### Required Variables:

- `EXPO_PUBLIC_ENVIRONMENT` - Must be `development` | `staging` | `production`
- `EXPO_PUBLIC_BASE_URL` - Valid HTTP/S API URL
- `EXPO_PUBLIC_SOCKET_URL` - Valid Socket Endpoint URL

## Scripts and Executables

Run standard scripts configured exactly for your specified `.env` mode:

```bash
# 1. Start Metro Client
yarn start:development   # Local dev (.env.development)
yarn start:staging       # Staging sandbox (.env.staging)
yarn start:production    # Local production sandbox (.env.production)

# 2. Run Built Native App
yarn android:development
yarn ios:development
```

Additional CLI shortcuts:

- `yarn lint` / `yarn lint:fix` - Checks or fixes code against ESLint configurations and specific `@env` alias sortings.
- `yarn type-check` - Strict TypeScript diagnostic checks (`--noEmit`).

## Dependencies Note

With `react-native-unistyles` (to remove inline-stylesheet overhead) and `FlashList` internally optimized, adhere to component rules matching native optimizations. `expo-image` wrappers are highly recommended replacing standard `Image` elements to fully benefit from caching behavior.

## Technologies Used

- [Expo (SDK 54+)](https://expo.dev/)
- [Zustand](https://github.com/pmndrs/zustand)
- [TanStack React Query v5](https://tanstack.com/query/latest)
- [React Navigation v7](https://reactnavigation.org/)
- [React Native Unistyles](https://unistyl.es/)
- [Zod Validations](https://zod.dev/)
- [MMKV Storage](https://github.com/mrousavy/react-native-mmkv)

---

_Created as part of an advanced boilerplate to prioritize maintainable state flow._
