import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { StorageAdapter } from './types';

export interface User {
  email: string;
  password: string;
  [key: string]: unknown;
}

interface UserState {
  isLoggedIn: boolean;
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

/**
 * Factory that creates the user store with the given storage adapter.
 *
 * Each platform provides its own adapter:
 *   - Mobile: MMKV-backed adapter (see apps/mobile/src/store/storage.ts)
 *   - Web:    localStorage-backed adapter (see apps/web/src/store/storage.ts)
 *
 * @example
 * // Mobile
 * export const useUserStore = createUserStore(mmkvStorageAdapter);
 *
 * // Web
 * export const useUserStore = createUserStore(localStorageAdapter);
 */
export function createUserStore(storageAdapter: StorageAdapter) {
  return create<UserState>()(
    persist(
      (set) => ({
        isLoggedIn: false,
        user: null,
        login: (user: User) => set({ isLoggedIn: true, user }),
        logout: () => set({ isLoggedIn: false, user: null }),
      }),
      {
        name: 'user-storage',
        storage: createJSONStorage(() => storageAdapter),
      },
    ),
  );
}
