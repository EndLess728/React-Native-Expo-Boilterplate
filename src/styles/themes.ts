/**
 * References:
 * - Introduction: https://www.unistyl.es/v3/start/getting-started
 * - Migration from Unistyle v2 to v3: https://www.unistyl.es/v3/start/migration-guide
 */

const constantsColors = {
  danger: "#dc3545",
  grey: "#B0B0B0",
  black: "#000000",
  white: "#ffffff",
  blue: "#001EB9",
  light: "#f8f9fa",
  green: "#62EA9F",
  cancel: "#EB5757",
};
export const lightTheme = {
  colors: {
    ...constantsColors,
    typography: "#000000",
    background: "#ffffff",
    barStyle: "dark-content",
    opacity50: "rgba(1,1,1,0.5)",
    textInputColor: "rgba(217, 217, 217,0.2)",
    placeholder: "rgba(1,1,1,0.52)",
    darkwhite: "#000000",
    primary: "#00BFFF",
    primaryTransparent: "#E1F8FF",
    textGray: "#6B7F85",
    primaryText: "#394347",
    fadedWhite: "#F7F8F9",
    borderGray: "#E8ECF4",
    iconGray: "#8BA1A8",
  },
  margins: {
    sm: 2,
    md: 4,
    lg: 8,
    xl: 12,
  },
} as const;

export const darkTheme = {
  colors: {
    ...constantsColors,
    typography: "#ffffff",
    background: "#000000",
    barStyle: "light-content",
    opacity50: "rgba(201, 201, 201,0.5)",
    textInputColor: "#000000",
    placeholder: "#f8f9fa",
    darkwhite: "#ffffff",
    primary: "#00BFFF",
    textGray: "#6B7F85",
    primaryText: "#394347",
    fadedWhite: "#F7F8F9",
    borderGray: "#E8ECF4",
    iconGray: "#8BA1A8",
  },
  margins: {
    sm: 2,
    md: 4,
    lg: 8,
    xl: 12,
  },
} as const;
