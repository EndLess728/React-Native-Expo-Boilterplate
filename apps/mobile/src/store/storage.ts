import { create, StateCreator } from 'zustand';
import { createJSONStorage, persist, PersistOptions } from 'zustand/middleware';

import type { StorageAdapter } from '@repo/shared';

import { storage } from '@/storage';

/**
 * MMKV storage adapter satisfying the shared StorageAdapter interface.
 * Pass this to createUserStore() and other shared store factories.
 */
export const mmkvStorageAdapter: StorageAdapter = {
  getItem: (name: string): string | null => storage.getString(name) ?? null,
  setItem: (name: string, value: string): void => storage.set(name, value),
  removeItem: (name: string): void => storage.remove(name),
};

export const mmkvStorage = createJSONStorage(() => mmkvStorageAdapter);

/**
 * Creates a Zustand store with MMKV persistence pre-configured.
 * For stores defined locally in mobile — for shared stores use createUserStore() from @repo/shared.
 */
export function createPersistedStore<T>(
  name: string,
  storeCreator: StateCreator<T, [], [['zustand/persist', unknown]]>,
  options?: Omit<PersistOptions<T>, 'name' | 'storage'>,
) {
  return create<T>()(
    persist(storeCreator, {
      name,
      storage: mmkvStorage,
      ...options,
    }),
  );
}
