module.exports = function (api) {
  api.cache(true);
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
    ],
  };
};
