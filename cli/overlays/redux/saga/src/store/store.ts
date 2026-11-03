import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { FLUSH, PAUSE, PERSIST, persistReducer, PURGE, REGISTER, REHYDRATE } from 'redux-persist';
import createSagaMiddleware from 'redux-saga';

// src/store is app-level wiring: it may import feature reducers directly.
import { authReducer } from '@/features/auth/store/authSlice';

import { reduxStorage } from './persistStorage';
import { rootSaga } from './rootSaga';

const rootReducer = combineReducers({
  // Persist the session only — request status and errors start fresh.
  auth: persistReducer(
    { key: 'auth', storage: reduxStorage, whitelist: ['isLoggedIn', 'user'] },
    authReducer,
  ),
  // Add feature reducers here as the app grows.
});

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Side effects live in sagas, not thunks.
      thunk: false,
      serializableCheck: {
        // redux-persist dispatches non-serializable actions by design.
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
