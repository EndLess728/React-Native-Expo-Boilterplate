import { clearTokens } from '@/storage/token';
import { createPersistedStore } from '@/store/createPersistedStore';

import { authenticate } from '../api/authenticate';
import type { LoginCredentials, User } from '../types';

interface UserState {
  isLoggedIn: boolean;
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

// Private to the auth feature — screens and other features go through the
// hooks in `../hooks.ts`, so swapping the state library never touches them.
export const useUserStore = createPersistedStore<UserState>(
  'user-storage', // Just the key name - storage is pre-configured!
  (set) => ({
    isLoggedIn: false,
    user: null,

    login: async (credentials: LoginCredentials) => {
      const user = await authenticate(credentials);
      set({ isLoggedIn: true, user });
    },

    logout: () => {
      // Only clear auth tokens — not all MMKV data (e.g. language preference)
      clearTokens();
      set({ isLoggedIn: false, user: null });
    },
  }),
);
