import { NavigationContainer } from "@react-navigation/native";
import React, { useCallback } from "react";
import { useColorScheme } from "react-native";
import { AppNavigator } from "@/navigation/AppNavigator";
import { AuthNavigator } from "@/navigation/AuthNavigator";
import { theme } from "@/theme";
import * as SplashScreen from "expo-splash-screen";
import { customFontsToLoad } from "@/theme/fonts";
import { useFonts } from "expo-font";

// keep the splash screen visible while complete fetching resources
SplashScreen.preventAutoHideAsync();

export function RootNavigator() {
  const scheme = useColorScheme();

  const [fontsLoaded, fontError] = useFonts(customFontsToLoad);

  const onReady = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <NavigationContainer onReady={onReady} theme={theme[scheme]}>
      {false ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
