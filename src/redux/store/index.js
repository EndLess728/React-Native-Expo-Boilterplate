import rootReducer from "../reducer";
import { storage } from "@/storage";
import { baseApi } from "../services/baseApi";
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import { logoutMiddleware } from "./logoutMiddleware";

export const reduxStorage = {
  setItem: (key, value) => {
    storage.set(key, value);
    return Promise.resolve(true);
  },
  getItem: (key) => {
    const value = storage.getString(key);
    return Promise.resolve(value);
  },
  removeItem: (key) => {
    storage.delete(key);
    return Promise.resolve();
  },
};

const persistConfig = {
  key: "root",
  storage: reduxStorage,
  blacklist: [baseApi.reducerPath], // Don't persist the API cache
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// redux store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
      .concat(baseApi.middleware)
      .concat(logoutMiddleware),
});

setupListeners(store.dispatch); // required for refetchOnFocus or refetchOnReconnect

// store with persist
const persistor = persistStore(store);

export { store, persistor };
