import { clearTokens } from '@/storage/token';

import { createPersistedStore } from './storage';

// Extend with real fields as the app grows (id, displayName, avatarUrl, …).
// Avoid an index signature here — `[key: string]: unknown` would let any
// property compile, defeating the point of having a typed user object.
export interface User {
  email: string;
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
