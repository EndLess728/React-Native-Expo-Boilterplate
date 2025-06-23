/**
 * References:
 * - Introduction: https://v2.unistyl.es/start/introduction/
 * - Setup Guide: https://v2.unistyl.es/start/setup/
 * - Basic Usage: https://v2.unistyl.es/start/basic-usage/
 * - Migration from StyleSheet: https://v2.unistyl.es/start/migration-from-stylesheet/
 */

import { UnistylesRegistry } from "react-native-unistyles";
import breakpoints from "./breakpoints";
import { lightTheme, darkTheme } from "./themes";

type AppBreakpoints = typeof breakpoints;
type AppThemes = {
  light: typeof lightTheme;
  dark: typeof darkTheme;
};

declare module "react-native-unistyles" {
  export interface UnistylesBreakpoints extends AppBreakpoints {}
  export interface UnistylesThemes extends AppThemes {}
}

UnistylesRegistry.addBreakpoints(breakpoints)
  .addThemes({
    light: lightTheme,
    dark: darkTheme,
  })
  .addConfig({
    adaptiveThemes: true,
  });
