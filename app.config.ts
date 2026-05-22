import 'tsx/cjs';
// Hydrate process.env from .env files BEFORE evaluating ./env (which validates).
// Without this, EAS CLI's fallback `@expo/config` evaluates this file with an
// empty process.env and zod validation aborts the build. See ./load-env.ts.
import './load-env';

import { ConfigContext, ExpoConfig } from 'expo/config';

import Env from './env';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: Env.EXPO_PUBLIC_NAME,
  slug: 'ExpoTemplate',
  scheme: 'expotemplate',
  experiments: {
    reactCompiler: true,
  },
  version: Env.EXPO_PUBLIC_VERSION,
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: Env.EXPO_PUBLIC_PACKAGE_NAME,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/icon.png',
      backgroundColor: '#232323',
    },
    // SDK 55 removed `edgeToEdgeEnabled` — edge-to-edge is now mandatory and is
    // wired up via the `react-native-edge-to-edge` plugin in the plugins list.
    package: Env.EXPO_PUBLIC_PACKAGE_NAME,
  },
  web: {
    favicon: './assets/favicon.png',
  },
  plugins: [
    'expo-localization',
    'expo-font',
    // Required from SDK 55 onward — registers the SecureStore native module.
    'expo-secure-store',
    'react-native-edge-to-edge',
    [
      'expo-splash-screen',
      {
        backgroundColor: '#232323',
        image: './assets/icon.png',
        imageWidth: 200,
      },
    ],
    [
      'expo-build-properties',
      {
        android: {
          // R8 minifies Java/Kotlin in release builds. Required for
          // `enableShrinkResourcesInReleaseBuilds` (the plugin throws otherwise).
          enableMinifyInReleaseBuilds: true,
          // Strip unused resources (drawables, strings, layouts) from the APK/AAB.
          enableShrinkResourcesInReleaseBuilds: true,
        },
        // ios: { useFrameworks: 'static' },  // opt-in: smaller binary + faster
        //                                       startup but breaks libs that
        //                                       expect dynamic frameworks.
      },
    ],
  ],
});
