import { useColorScheme } from 'react-native';

import { darkTheme, lightTheme } from '@/styles/themes';

export type AppTheme = typeof lightTheme | typeof darkTheme;

/**
 * The active theme's tokens (`theme.colors.*`, `theme.margins.*`).
 *
 * Follows the device color scheme. `app.config.ts` pins
 * `userInterfaceStyle: 'light'`, so this is the light theme until you change
 * that setting.
 */
export function useAppTheme(): AppTheme {
  return useColorScheme() === 'dark' ? darkTheme : lightTheme;
}
