# React Native & Next.js Monorepo

This is a full-stack monorepo built using Yarn Workspaces, allowing business logic and state management to be shared between a React Native mobile application and a Next.js web application.

## 📦 Project Structure

```text
├── apps/
│   ├── mobile/               # React Native (Expo) app
│   └── web/                  # Next.js web app
└── packages/
    └── business-logic/       # Shared code (API, hooks, store, localization)
```

## 🧠 Shared Business Logic

We extract all cross-platform domain logic into the `@repo/shared` package to prevent code duplication, including:

- **API Layer**: API hooks powered by React Query (`react-query-kit`).
- **Store**: State management powered by Zustand.
- **Localization**: Shared `i18next` configurations and translations.

### Platform-Specific API Configuration

While all React Query hooks are centralized in `@repo/shared`, the underlying Axios client instance is uniquely configured for each platform:

- **Mobile (`apps/mobile/src/api/common/client.ts`)**: Injects an MMKV-backed token storage adapter, adds connection checks via `NetInfo`, and handles mobile-specific toasts or alerts.
- **Web (`apps/web/src/lib/api-client.ts`)**: Injects a `localStorage`-backed adapter and manages generic web console logging and web redirects for unauthorized states.

This ensures the shared package never imports platform-specific code (like React Native libraries), maintaining a strict boundary between Business Logic and UI platforms.

## 🚀 Getting Started

From the root directory, ensure you have ran `yarn` to install dependencies, then you can use the following commands:

### Run the Mobile App
```bash
yarn mobile
```

### Run the Web App
```bash
yarn web
```
