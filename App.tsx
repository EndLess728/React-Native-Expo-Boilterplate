import './src/styles/unistyles';
import './src/localization/i18n'; // Initialize i18next with translations

import React from 'react';
import ErrorBoundary from 'react-native-error-boundary';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';

import { APIProvider } from '@/api/common/api-provider';
import ErrorFallback from '@/components/ErrorFallback';
import { RootNavigator } from '@/navigation';
import { initStorage } from '@/storage';
import { rehydrateStores } from '@/store';
import { toastConfig } from '@/utils/toast-config';

export default function App() {
  const [storageReady, setStorageReady] = React.useState(false);

  React.useEffect(() => {
    // 1. Initialize encrypted MMKV (generates/loads keychain-backed key).
    // 2. Rehydrate all persisted Zustand stores from MMKV so they reflect
    //    the saved session before any component renders.
    // The splash screen (preventAutoHideAsync in RootNavigator) stays visible
    // during this brief async operation so users never see a blank screen.
    initStorage()
      .then(rehydrateStores)
      .then(() => setStorageReady(true))
      .catch((error) => {
        if (__DEV__) console.error('[App] Storage initialization failed:', error);
        // Proceed without persisted state — app still functions, user will start fresh
        setStorageReady(true);
      });
  }, []);

  if (!storageReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <APIProvider>
          <RootNavigator />
        </APIProvider>
      </ErrorBoundary>
      <Toast config={toastConfig} position="top" />
    </GestureHandlerRootView>
  );
}
