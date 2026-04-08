import type { StorageAdapter } from '@repo/business-logic';

/**
 * localStorage-backed storage adapter for the web app.
 * Satisfies the shared StorageAdapter interface from @repo/business-logic.
 */
export const localStorageAdapter: StorageAdapter = {
  getItem: (name: string): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(name);
  },
  setItem: (name: string, value: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(name, value);
    }
  },
  removeItem: (name: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(name);
    }
  },
};
