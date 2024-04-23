import { persistReducer, persistStore } from "redux-persist";
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "../reducer";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import {storage} from '@/storage';

const persistConfig = {
  key: "temp-root",
  storage: AsyncStorage, // mmkv storage
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// redux store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

// store with persist
const persistor = persistStore(store);

export { store, persistor };
