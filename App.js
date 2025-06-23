import { Provider } from "react-redux";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { RootNavigator } from "@/navigation";
import { persistor, store } from "@/redux/store";
import { PersistGate } from "redux-persist/integration/react";
import Toast from "react-native-toast-message";
import { toastConfig } from "@/utils/helperFunctions";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <RootNavigator />
        </PersistGate>
      </Provider>
      <Toast position="top" config={toastConfig} />
    </GestureHandlerRootView>
  );
}
