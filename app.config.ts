import dotenv from 'dotenv';
import { ConfigContext, ExpoConfig } from 'expo/config';
import path from 'path';

import packageJson from './package.json';

// Load the correct .env file based on EXPO_PUBLIC_ENVIRONMENT from eas.json
// Falls back to 'development' when running locally
const APP_ENV = process.env.EXPO_PUBLIC_ENVIRONMENT || 'development';
dotenv.config({
  path: path.resolve(__dirname, `.env.${APP_ENV}`),
  override: true,
});

const APP_NAME = 'ExpoTemplate';
const APP_SLUG = 'ExpoTemplate';
const APP_BUNDLE_IDENTIFIER = 'com.expo.template';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: APP_NAME,
  slug: APP_SLUG,
  version: packageJson.version,
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: APP_BUNDLE_IDENTIFIER,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/icon.png',
      backgroundColor: '#232323',
    },
    edgeToEdgeEnabled: true,
    package: APP_BUNDLE_IDENTIFIER,
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
