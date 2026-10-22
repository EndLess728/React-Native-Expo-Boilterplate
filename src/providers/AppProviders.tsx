import React from 'react';
import { SystemBars } from 'react-native-edge-to-edge';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { useUnistyles } from 'react-native-unistyles';

import { APIProvider } from '@/services/api-provider';
import { toastConfig } from '@/shared/utils/toast';
import { StoreProvider } from '@/store';

/**
 * Every app-wide provider, in one place. The navigation root (Expo Router's
 * `<Stack>` or React Navigation's `<NavigationContainer>`) renders inside it.
 */
export function AppProviders({ children }: { children: React.ReactNode }): React.JSX.Element {
  const { theme } = useUnistyles();
  const barStyle = theme.colors.barStyle === 'light-content' ? 'light' : 'dark';

  return (
    <>
      <SystemBars style={{ statusBar: barStyle, navigationBar: barStyle }} />
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
