import './src/styles/unistyles';
import './src/localization/i18n'; // Initialize i18next with translations

import React from 'react';
import ErrorBoundary from 'react-native-error-boundary';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';

import { APIProvider } from '@/api/common/api-provider';
import ErrorFallback from '@/components/ErrorFallback';
import { RootNavigator } from '@/navigation';
import { toastConfig } from '@/utils/toast-config';

export default function App() {
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
