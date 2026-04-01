import { ConfigContext, ExpoConfig } from 'expo/config';

import packageJson from './package.json';

// The build environment is configured via EXPO_PUBLIC_ENVIRONMENT passed via npm scripts or eas.json
// Expo CLI natively loads EXPO_PUBLIC_* vars from .env / .env.local files.
const APP_ENV = (process.env.EXPO_PUBLIC_ENVIRONMENT ?? 'development') as
  | 'development'
  | 'staging'
  | 'production';

type AppEnvironment = 'development' | 'staging' | 'production';

const envConfig: Record<AppEnvironment, { name: string; bundleIdentifier: string }> = {
  development: {
    name: 'ExpoTemplate (Dev)',
    bundleIdentifier: 'com.expo.template.dev',
  },
  staging: {
    name: 'ExpoTemplate (Staging)',
    bundleIdentifier: 'com.expo.template.staging',
  },
  production: {
    name: 'ExpoTemplate',
    bundleIdentifier: 'com.expo.template',
  },
};

const { name, bundleIdentifier } = envConfig[APP_ENV];

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name,
  slug: 'ExpoTemplate',
  version: packageJson.version,
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/icon.png',
      backgroundColor: '#232323',
    },
    edgeToEdgeEnabled: true,
    package: bundleIdentifier,
  },
  web: {
    favicon: './assets/favicon.png',
  },
  plugins: [
    'expo-localization',
    'expo-font',
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
        ios: {
          deploymentTarget: '16.0',
        },
      },
    ],
    ['./plugins/withIosDeploymentTarget.js', { deploymentTarget: '16.0' }],
  ],
});
