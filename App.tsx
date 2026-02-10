import './src/styles/unistyles';
import './src/localization/i18n'; // Initialize i18next with translations

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';

import { APIProvider } from '@/api';
import { RootNavigator } from '@/navigation';
import { toastConfig } from '@/utils/toast-config';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <APIProvider>
        <RootNavigator />
      </APIProvider>
      <Toast config={toastConfig} position="top" />
    </GestureHandlerRootView>
  );
}
