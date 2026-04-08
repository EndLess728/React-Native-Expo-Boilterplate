import { createUserStore } from '@repo/shared';

import { localStorageAdapter } from './storage';

/**
 * User store backed by localStorage for the web app.
 * The store shape and actions are defined in @repo/shared.
 */
export const useUserStore = createUserStore(localStorageAdapter);
