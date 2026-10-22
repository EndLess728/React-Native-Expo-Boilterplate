import { useUserStore } from './store/useUserStore';

/**
 * Ends the session from outside React (e.g. the Axios client on a 401).
 * Components should use `useLogout()` instead.
 */
export function signOut(): void {
  useUserStore.getState().logout();
}
