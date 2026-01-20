import { storage } from '@/storage';

import { createPersistedStore } from './storage';

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

export const useUserStore = createPersistedStore<UserState>(
  'user-storage', // Just the key name - storage is pre-configured!
  (set) => ({
    isLoggedIn: false,
    user: null,

    login: (user: User) => {
      set({ isLoggedIn: true, user });
    },

    logout: () => {
      storage.clearAll();
      set({ isLoggedIn: false, user: null });
    },
  }),
);
