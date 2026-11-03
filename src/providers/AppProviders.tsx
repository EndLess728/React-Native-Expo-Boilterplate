import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { NavigationBar } from 'expo-navigation-bar';
import { StatusBar } from 'expo-status-bar';

import { APIProvider } from '@/services/api-provider';
import { toastConfig } from '@/shared/utils/toast';
import { StoreProvider } from '@/store';
import { useAppTheme } from '@/theme';

/**
 * Every app-wide provider, in one place. The navigation root (Expo Router's
 * `<Stack>` or React Navigation's `<NavigationContainer>`) renders inside it.
 */
export function AppProviders({ children }: { children: React.ReactNode }): React.JSX.Element {
  const theme = useAppTheme();
  const barStyle = theme.colors.barStyle === 'light-content' ? 'light' : 'dark';

  return (
    <>
      <StatusBar style={barStyle} />
      <NavigationBar style={barStyle} />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <KeyboardProvider>
          <SafeAreaProvider>
            <StoreProvider>
              <APIProvider>{children}</APIProvider>
            </StoreProvider>
          </SafeAreaProvider>
        </KeyboardProvider>
        <Toast config={toastConfig} position="top" />
      </GestureHandlerRootView>
    </>
  );
}
