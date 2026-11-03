import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { FLUSH, PAUSE, PERSIST, persistReducer, PURGE, REGISTER, REHYDRATE } from 'redux-persist';

// src/store is app-level wiring: it may import feature reducers directly.
import { authReducer } from '@/features/auth/store/authSlice';

import { reduxStorage } from './persistStorage';

const rootReducer = combineReducers({
  // Persist the session only — request status and errors start fresh.
  auth: persistReducer(
    { key: 'auth', storage: reduxStorage, whitelist: ['isLoggedIn', 'user'] },
    authReducer,
  ),
  // Add feature reducers here as the app grows.
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // redux-persist dispatches non-serializable actions by design.
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
