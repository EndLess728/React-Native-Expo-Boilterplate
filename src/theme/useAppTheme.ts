import { useUnistyles } from 'react-native-unistyles';

/**
 * The active theme's tokens (`theme.colors.*`, `theme.margins.*`).
 *
 * Use it where a color has to be passed as a prop rather than a style — icon
 * colors, tab bar tints, `placeholderTextColor`. It's the one theme API that
 * every styling option the create CLI offers implements the same way.
 */
export const useAppTheme = () => useUnistyles().theme;
