import 'tsx/cjs';

import { ConfigContext, ExpoConfig } from 'expo/config';

import Env from './env';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: Env.EXPO_PUBLIC_NAME,
  slug: 'ExpoTemplate',
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
    edgeToEdgeEnabled: true,
    package: Env.EXPO_PUBLIC_PACKAGE_NAME,
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
