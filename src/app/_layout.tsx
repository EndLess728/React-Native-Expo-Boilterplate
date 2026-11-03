// Unistyles config side-effect runs in `./index.ts` BEFORE expo-router scans
// any route — required because route modules transitively load components
// that call `StyleSheet.create` at import time.
//
// Route files under `src/app/` stay thin: screens live in `src/features/*`
// and are re-exported here, so the folder only describes URL structure.

import React from 'react';
import { Stack } from 'expo-router';

import { useIsLoggedIn } from '@/features/auth';
import { AppProviders, useAppBootstrap } from '@/providers';

// Re-export expo-router's built-in ErrorBoundary so render-phase exceptions in
// the route tree surface with full router-aware stack frames.
export { ErrorBoundary } from 'expo-router';

// Hint expo-router which screen to show at `/` when deep-linked into the root.
export const unstable_settings = {
  anchor: '(tabs)',
};

function RootNavigator(): React.JSX.Element {
  const isLoggedIn = useIsLoggedIn();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Explicit redirects: without them a failed guard falls back to the anchor,
          which is `(tabs)` — itself guarded when logged out — and lands on +not-found. */}
      <Stack.Protected guard={isLoggedIn} redirectTo="/login">
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>
      <Stack.Protected guard={!isLoggedIn} redirectTo="/">
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout(): React.JSX.Element | null {
  const isReady = useAppBootstrap();

  if (!isReady) {
    return null;
  }

  return (
    <AppProviders>
      <RootNavigator />
    </AppProviders>
  );
}
