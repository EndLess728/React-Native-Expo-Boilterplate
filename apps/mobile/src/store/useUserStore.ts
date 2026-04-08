import { createUserStore } from '@repo/business-logic';

import { storage } from '@/storage';

import { mmkvStorageAdapter } from './storage';

/**
 * User store backed by MMKV for the mobile app.
 * The store shape and actions are defined in @repo/business-logic.
 */
export const useUserStore = createUserStore(mmkvStorageAdapter);

// Re-export User type for convenience
export type { User } from '@repo/business-logic';

/**
 * Wraps logout to also clear all MMKV storage (tokens, cached data, etc.).
 * Call this instead of useUserStore.getState().logout() for a full sign-out.
 */
export function fullLogout() {
  storage.clearAll();
  useUserStore.getState().logout();
}
