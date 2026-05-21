// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Note: Metro tree-shaking and `experimentalImportSupport` are enabled by default
// in Expo SDK 54+. No extra config required here.
// https://docs.expo.dev/guides/tree-shaking/

module.exports = config;
