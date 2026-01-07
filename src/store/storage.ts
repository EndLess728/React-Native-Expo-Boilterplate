import { create, StateCreator } from 'zustand';
import { createJSONStorage, persist, PersistOptions } from 'zustand/middleware';

import { storage } from '@/storage';

/**
 * Zustand storage adapter using MMKV
 */
export const zustandStorage = {
  getItem: (name: string): string | null => {
    const value = storage.getString(name);
    return value ?? null;
  },
  setItem: (name: string, value: string): void => {
    storage.set(name, value);
  },
  removeItem: (name: string): void => {
    storage.remove(name);
  },
};

/**
 * Pre-configured JSON storage using MMKV
 */
export const mmkvStorage = createJSONStorage(() => zustandStorage);

/**
 * Creates a Zustand store with MMKV persistence pre-configured.
 * Just pass the store name - no need to configure storage each time.
 *
 * @example
 * const useMyStore = createPersistedStore<MyState>(
 *   'my-store',  // storage key
 *   (set) => ({
 *     count: 0,
 *     increment: () => set((s) => ({ count: s.count + 1 })),
 *   })
 * );
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
