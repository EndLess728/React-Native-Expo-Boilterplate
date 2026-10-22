import { clearTokens } from '@/storage/token';
import { store } from '@/store';

import { logout } from './store/authSlice';

/**
 * Ends the session from outside React (e.g. the Axios client on a 401).
 * Components should use `useLogout()` instead.
 */
export function signOut(): void {
  // Only clear auth tokens — not all MMKV data (e.g. language preference)
  clearTokens();
  store.dispatch(logout());
}
