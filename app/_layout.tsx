// Unistyles config side-effect runs in `./index.ts` BEFORE expo-router scans
// any route — required because route modules transitively load components
// that call `StyleSheet.create` at import time. i18next is initialized below
// in `prepare()` because its language preference is stored in MMKV, which
// isn't available until `initStorage()` resolves.

import React, { useEffect, useState } from 'react';
import { SystemBars } from 'react-native-edge-to-edge';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { useUnistyles } from 'react-native-unistyles';
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
    } else {
      // We are already on the correct route for the current auth state —
      // safe to hide the splash now. Hiding it earlier (in RootLayout, on
      // storageReady) would briefly reveal the wrong screen before the
      // redirect above lands, causing an auth-flash on cold launch.
      // hideAsync() is idempotent, so repeat calls on later renders no-op.
      SplashScreen.hideAsync();
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
  const { theme } = useUnistyles();

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
        // On init failure we still need to release the splash — otherwise
        // the user sees the splash screen forever. AuthGate normally owns
        // the hide once it lands on the correct route, but it will never
        // mount if storageReady stays false.
        SplashScreen.hideAsync();
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
    <>
      <SystemBars
        style={{
          statusBar: theme.colors.barStyle === 'light-content' ? 'light' : 'dark',
          navigationBar: theme.colors.barStyle === 'light-content' ? 'light' : 'dark',
        }}
      />
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
    </>
  );
}
