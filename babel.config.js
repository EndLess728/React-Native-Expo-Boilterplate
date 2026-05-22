module.exports = function (api) {
  // Invalidate the cache when NODE_ENV changes so the production-only
  // transform-remove-console plugin below is picked up correctly.
  api.cache.using(() => process.env.NODE_ENV);
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ios.js', '.android.js', '.js', '.jsx', '.ts', '.tsx', '.json'],
          alias: {
            '@': './src',
            '@env': './env',
          },
        },
      ],
      [
        'react-native-unistyles/plugin',
        {
          root: 'src',
        },
      ],
      'react-native-worklets/plugin',
      // Strip console.log / console.info / console.debug from production
      // bundles. Keep console.error and console.warn so crash reporters
      // (Sentry, Bugsnag, etc.) still receive them.
      ...(isProduction ? [['transform-remove-console', { exclude: ['error', 'warn'] }]] : []),
    ],
  };
};
