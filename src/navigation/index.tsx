import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

import { AppNavigator } from '@/navigation/AppNavigator';
import { AuthNavigator } from '@/navigation/AuthNavigator';
import { useUserStore } from '@/store/useUserStore';
import { customFontsToLoad } from '@/theme/fonts';

// Keep the splash screen visible while complete fetching resources
SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  duration: 100,
  fade: true,
});

export function RootNavigator(): React.JSX.Element | null {
  const [fontsLoaded, fontError] = useFonts(customFontsToLoad);

  const isLoggedIn = useUserStore((state) => state.isLoggedIn);

  const onReady = async (): Promise<void> => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  };

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <NavigationContainer onReady={onReady}>
      {isLoggedIn ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
