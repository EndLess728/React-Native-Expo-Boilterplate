import type { Storage } from 'redux-persist';

import { storage } from '@/storage';

/**
 * redux-persist storage engine backed by the encrypted MMKV instance.
 *
 * MMKV is synchronous; redux-persist expects promises, so each call resolves
 * immediately. The `storage` guard covers access before `initStorage()` —
 * rehydration is started manually after init, so this is a safety net.
 */
export const reduxStorage: Storage = {
  getItem: (key: string) => Promise.resolve(storage ? (storage.getString(key) ?? null) : null),
  setItem: (key: string, value: string) => {
    storage?.set(key, value);
    return Promise.resolve(true);
  },
  removeItem: (key: string) => {
    storage?.remove(key);
    return Promise.resolve();
  },
};
