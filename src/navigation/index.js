import { NavigationContainer } from "@react-navigation/native";
import React, { useCallback } from "react";
import { AppNavigator } from "@/navigation/AppNavigator";
import { AuthNavigator } from "@/navigation/AuthNavigator";
import * as SplashScreen from "expo-splash-screen";
import { customFontsToLoad } from "@/theme/fonts";
import { useFonts } from "expo-font";
import { useSelector } from "react-redux";

// keep the splash screen visible while complete fetching resources
SplashScreen.preventAutoHideAsync();

export function RootNavigator() {
  const [fontsLoaded, fontError] = useFonts(customFontsToLoad);

  const { isLoggedIn, user } = useSelector((state) => state?.user) || {};

  console.log("🚀 ~ RootNavigator ~ user ===> ", user);

  const onReady = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
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
