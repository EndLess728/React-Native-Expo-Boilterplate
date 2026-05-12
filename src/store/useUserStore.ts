import { clearTokens } from '@/storage/token';

import { createPersistedStore } from './storage';

export interface User {
  email: string;
  [key: string]: unknown;
}

interface UserState {
  isLoggedIn: boolean;
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

export const useUserStore = createPersistedStore<UserState>(
  'user-storage', // Just the key name - storage is pre-configured!
  (set) => ({
    isLoggedIn: false,
    user: null,

    login: (user: User) => {
      set({ isLoggedIn: true, user });
    },

    logout: () => {
      // Only clear auth tokens — not all MMKV data (e.g. language preference)
      clearTokens();
      set({ isLoggedIn: false, user: null });
    },
  }),
);
