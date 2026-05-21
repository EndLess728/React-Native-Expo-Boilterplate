import './src/styles/unistyles';
import './src/localization/i18n'; // Initialize i18next with translations

import React, { useEffect, useState } from 'react';
import ErrorBoundary from 'react-native-error-boundary';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import * as SplashScreen from 'expo-splash-screen';

import { APIProvider } from '@/api/common/api-provider';
import ErrorFallback from '@/components/ErrorFallback';
import { RootNavigator } from '@/navigation';
import { initStorage } from '@/storage';
import { rehydrateStores } from '@/store';
import { toastConfig } from '@/utils/toast';

// Hold the native splash screen until storage init + store rehydration finishes,
// so the user never sees a blank screen between native-splash-hide and first paint.
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [storageReady, setStorageReady] = useState(false);

  useEffect(() => {
    // 1. Initialize encrypted MMKV (generates/loads keychain-backed key).
    // 2. Rehydrate all persisted Zustand stores from MMKV so they reflect
    //    the saved session before any component renders.
    // The splash screen (preventAutoHideAsync above) stays visible during
    // this brief async operation so users never see a blank screen.
    async function prepare() {
      try {
        await initStorage();
        await rehydrateStores();
      } catch (error) {
        // Proceed without persisted state — app still functions, user starts fresh
        if (__DEV__) console.error('[App] Storage initialization failed:', error);
      } finally {
        setStorageReady(true);
      }
    }
    prepare();
  }, []);

  if (!storageReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardProvider>
        <SafeAreaProvider>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <APIProvider>
              <RootNavigator />
            </APIProvider>
          </ErrorBoundary>
        </SafeAreaProvider>
      </KeyboardProvider>
      <Toast config={toastConfig} position="top" />
    </GestureHandlerRootView>
  );
}
