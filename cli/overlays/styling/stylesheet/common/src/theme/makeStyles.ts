import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { type AppTheme, useAppTheme } from './useAppTheme';

type StyleMap = Parameters<typeof StyleSheet.create>[0];

/**
 * Theme-aware styles, created once per theme:
 *
 *   const useStyles = makeStyles((theme) => ({
 *     container: { backgroundColor: theme.colors.background },
 *   }));
 *
 *   // inside the component
 *   const styles = useStyles();
 *
 * Styles that don't read the theme belong in a plain module-level
 * `StyleSheet.create({ ... })`.
 */
export function makeStyles<T extends StyleMap>(factory: (theme: AppTheme) => T) {
  return function useStyles(): Readonly<T> {
    const theme = useAppTheme();
    return useMemo(() => StyleSheet.create(factory(theme)), [theme]);
  };
}
