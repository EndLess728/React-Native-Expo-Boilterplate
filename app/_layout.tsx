// Unistyles config side-effect runs in `./index.ts` BEFORE expo-router scans
// any route — required because route modules transitively load components
// that call `StyleSheet.create` at import time. i18next is initialized below
// in `prepare()` because its language preference is stored in MMKV, which
// isn't available until `initStorage()` resolves.

import React, { useCallback, useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

import { APIProvider } from '@/api/common/api-provider';
import { initI18n } from '@/localization/i18n';
import { initStorage } from '@/storage';
import { rehydrateStores } from '@/store';
import { useUserStore } from '@/store/useUserStore';
import { toastConfig } from '@/utils/toast';

// Re-export expo-router's built-in ErrorBoundary so render-phase exceptions in
// the route tree surface with full router-aware stack frames.
export { ErrorBoundary } from 'expo-router';

// Hint expo-router which screen to show at `/` when deep-linked into the root.
export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({ duration: 500, fade: true });

function AuthGate(): React.JSX.Element {
  const isLoggedIn = useUserStore((s) => s.isLoggedIn);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';

    if (!isLoggedIn && !inAuthGroup) {
      router.replace('/login');
    } else if (isLoggedIn && inAuthGroup) {
      router.replace('/home');
    }
  }, [isLoggedIn, segments, router]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout(): React.JSX.Element | null {
  const [storageReady, setStorageReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await initStorage();
        await rehydrateStores();
        // initI18n() must run AFTER initStorage — it reads the saved language
        // from MMKV. Initializing earlier would always fall back to the
        // device locale.
        await initI18n();
      } catch (error) {
        if (__DEV__) console.error('[RootLayout] App initialization failed:', error);
      } finally {
        setStorageReady(true);
      }
    }
    prepare();
  }, []);

  const onLayoutReady = useCallback(async () => {
    if (storageReady) {
      await SplashScreen.hideAsync();
    }
  }, [storageReady]);

  useEffect(() => {
    onLayoutReady();
  }, [onLayoutReady]);

  if (!storageReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardProvider>
        <SafeAreaProvider>
          <APIProvider>
            <AuthGate />
          </APIProvider>
        </SafeAreaProvider>
      </KeyboardProvider>
      <Toast config={toastConfig} position="top" />
    </GestureHandlerRootView>
  );
}
