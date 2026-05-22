// Mock for @env alias used in source files via babel-plugin-module-resolver
const Env = {
  EXPO_PUBLIC_APP_ENV: 'development' as const,
  EXPO_PUBLIC_NAME: 'ExpoTemplate (Dev)',
  EXPO_PUBLIC_PACKAGE_NAME: 'com.expo.template',
  EXPO_PUBLIC_VERSION: '1.0.0',
  EXPO_PUBLIC_API_URL: 'https://test-api.example.com/',
  EXPO_PUBLIC_SOCKET_URL: 'https://test-socket.example.com',
};

export default Env;
export type AppEnv = typeof Env.EXPO_PUBLIC_APP_ENV;
