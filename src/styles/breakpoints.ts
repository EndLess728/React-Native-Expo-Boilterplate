/**
 * References:
 * - Introduction: https://v2.unistyl.es/start/introduction/
 * - Setup Guide: https://v2.unistyl.es/start/setup/
 * - Basic Usage: https://v2.unistyl.es/start/basic-usage/
 * - Migration from StyleSheet: https://v2.unistyl.es/start/migration-from-stylesheet/
 */

const breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  superLarge: 2000,
  tvLike: 4000,
} as const;

export default breakpoints;
