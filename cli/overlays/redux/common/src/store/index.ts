import { type Persistor, persistStore } from 'redux-persist';

import { store } from './store';

export { useAppDispatch, useAppSelector } from './hooks';
export type { AppDispatch, RootState } from './store';
export { store } from './store';
export { StoreProvider } from './StoreProvider';

let persistor: Persistor | null = null;

/**
 * Rehydrates persisted Redux state from MMKV.
 *
 * Called once by `useAppBootstrap()` after `initStorage()` resolves. The
 * persistor is only created here — the encrypted MMKV instance doesn't exist
 * any earlier — and the promise resolves once redux-persist has bootstrapped.
 */
export function rehydrateStores(): Promise<void> {
  return new Promise((resolve) => {
    if (persistor) {
      resolve();
      return;
    }
    persistor = persistStore(store, null, resolve);
  });
}

/** The persistor, once `rehydrateStores()` has run — e.g. for `getPersistor()?.purge()`. */
export const getPersistor = (): Persistor | null => persistor;
