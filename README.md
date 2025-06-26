# ExpoTemplate

A modern, customizable React Native template app built with Expo, React Navigation, Redux Toolkit, Unistyles theming, and localization support. This template provides a solid foundation for building cross-platform mobile applications for Android, iOS, and Web.

## Features

- **Authentication Flow**: Login, logout, and user state management with Redux Toolkit.
- **Navigation**: Bottom tab navigation with Home and Profile screens using React Navigation.
- **Custom Theming**: Light and dark themes powered by Unistyles.
- **Localization**: Built-in support for English and Spanish (i18n-js, expo-localization).
- **Reusable Components**: Button, TextField, FullScreenLoader, Toast notifications, and more.
- **API Integration**: Axios-based API client with RTK Query for authentication and user endpoints.
- **Persistent State**: Redux state persistence using redux-persist and MMKV storage.
- **Custom Fonts**: Open Sans font family included and pre-configured.
- **Responsive Design**: Breakpoints and scaling utilities for adaptive layouts.
- **Expo EAS Ready**: Pre-configured for EAS build and deployment.

## Project Structure

```
reactnativetemplateapp/
  ├── android/           # Native Android project
  ├── ios/               # Native iOS project
  ├── src/
  │   ├── assets/        # Fonts and images
  │   ├── components/    # Reusable UI components
  │   ├── constants/     # App-wide constants
  │   ├── localization/  # i18n setup and translations
  │   ├── navigation/    # Navigation stacks and tabs
  │   ├── redux/         # Redux store, slices, services
  │   ├── screens/       # App screens (Home, Login, Profile)
  │   ├── storage/       # Storage utilities
  │   ├── styles/        # Theming and breakpoints
  │   ├── theme/         # Font and text styles
  │   └── utils/         # Helper functions
  ├── App.js             # App entry point
  ├── app.json           # Expo app config
  ├── package.json       # Project dependencies and scripts
  └── ...
```

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [Yarn](https://classic.yarnpkg.com/en/docs/install/) or npm
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

### Installation

1. **Clone the repository:**
   ```sh
   git clone <your-repo-url>
   cd reactnativetemplateapp
   ```
2. **Install dependencies:**
   ```sh
   yarn install
   # or
   npm install
   ```
3. **Start the development server:**
   ```sh
   yarn start
   # or
   npm run start
   ```

### Running on Devices

- **Android:**
  ```sh
  yarn android
  ```
- **iOS:**
  ```sh
  yarn ios
  ```
- **Web:**
  ```sh
  yarn web
  ```

### Build Scripts

- `yarn build:android:staging` / `yarn build:android:development` / `yarn build:android:production`
- `yarn build:ios:staging` / `yarn build:ios:development` / `yarn build:ios:production`

See `package.json` for all available scripts.

## Theming & Customization
- Uses [react-native-unistyles](https://unistyl.es/) for adaptive theming (light/dark).
- Edit `src/styles/themes.ts` to customize colors.
- Responsive breakpoints in `src/styles/breakpoints.ts`.

## Localization
- English and Spanish translations in `src/localization/translations/`.
- Add more languages by extending the translation files and updating `src/localization/i18n.js`.

## API & State Management
- API base URL is set via environment variables (`EXPO_PUBLIC_BASE_URL`).
- Authentication endpoints: `/auth/login`, `/auth/register`, `/auth/logout`.
- Redux Toolkit Query for API calls, with persistent state using MMKV.

## Custom Components
- **Button**: Primary, secondary, and disabled styles, loading state, icons.
- **TextField**: Customizable input with optional icons.
- **FullScreenLoader**: Modal loading indicator.
- **ToastAlert**: Success and error toast notifications.
- **ScreenWrapper**: Handles safe area, scroll, and loading overlay.

## Fonts
- Open Sans font family included in `src/assets/fonts/` and loaded via `src/theme/fonts.js`.

## Technologies Used
- [Expo](https://expo.dev/)
- [React Native](https://reactnative.dev/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React Navigation](https://reactnavigation.org/)
- [Unistyles](https://unistyl.es/)
- [i18n-js](https://github.com/fnando/i18n-js)
- [MMKV Storage](https://github.com/mrousavy/react-native-mmkv)
- [Axios](https://axios-http.com/)

## Environment Variables
- Configure API endpoints in `.env.*` files (see `eas.json` for examples):
  - `EXPO_PUBLIC_BASE_URL`
  - `EXPO_PUBLIC_SOCKET_URL`

## EAS Build
- Pre-configured for [Expo Application Services (EAS)](https://docs.expo.dev/eas/).
- See `eas.json` for build profiles.

## License

This project is provided as a template and does not include a license by default. Add your own license as needed. 
