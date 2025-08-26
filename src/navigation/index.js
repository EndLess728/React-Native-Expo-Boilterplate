import { NavigationContainer } from "@react-navigation/native";
import React, { useCallback, useEffect } from "react";
import { AppNavigator } from "@/navigation/AppNavigator";
import { AuthNavigator } from "@/navigation/AuthNavigator";
import * as SplashScreen from "expo-splash-screen";
import { customFontsToLoad } from "@/theme/fonts";
import { useFonts } from "expo-font";
import { useSelector } from "react-redux";

// keep the splash screen visible while complete fetching resources
SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  duration: 100,
  fade: true,
});

export function RootNavigator() {
  const [fontsLoaded, fontError] = useFonts(customFontsToLoad);

  const { isLoggedIn, user } = useSelector((state) => state?.user) || {};

  const onReady = useCallback(async () => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <NavigationContainer onReady={onReady}>
      {isLoggedIn ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
