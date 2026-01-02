import './src/styles/unistyles';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { APIProvider } from '@/api';
import { RootNavigator } from '@/navigation';
import { persistor, store } from '@/redux/store';
import { toastConfig } from '@/utils/helperFunctions';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <APIProvider>
            <RootNavigator />
          </APIProvider>
        </PersistGate>
      </Provider>
      <Toast config={toastConfig} position="top" />
    </GestureHandlerRootView>
  );
}
