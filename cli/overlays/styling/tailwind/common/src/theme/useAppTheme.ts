import { useUniwind } from 'uniwind';

import { darkTheme, lightTheme } from '@/styles/themes';

export type AppTheme = typeof lightTheme | typeof darkTheme;

/**
 * The active theme's tokens as JS values (`theme.colors.*`).
 *
 * Style with `className` wherever you can. Use this only where a color has to
 * be passed as a prop — icon colors, tab bar tints, `placeholderTextColor`,
 * Reanimated color animations.
 */
export function useAppTheme(): AppTheme {
  const { theme } = useUniwind();
  return theme === 'dark' ? darkTheme : lightTheme;
}
