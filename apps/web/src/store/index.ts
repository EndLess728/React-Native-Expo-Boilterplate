import { createUserStore } from '@repo/business-logic';

import { localStorageAdapter } from './storage';

/**
 * User store backed by localStorage for the web app.
 * The store shape and actions are defined in @repo/business-logic.
 */
export const useUserStore = createUserStore(localStorageAdapter);
