import { useState } from 'react';

import { translate } from '@/localization/utils';
import { showSuccessToast } from '@/shared/utils/toast';

import { useUserStore } from './store/useUserStore';
import type { LoginCredentials, User } from './types';

// The auth feature's public state API. Screens and other features use these
// hooks instead of reaching into the store, so the state library behind them
// (Zustand here) can change without touching any UI code.

export const useIsLoggedIn = (): boolean => useUserStore((s) => s.isLoggedIn);

export const useCurrentUser = (): User | null => useUserStore((s) => s.user);

export const useLogout = (): (() => void) => useUserStore((s) => s.logout);

export function useLogin() {
  const loginAction = useUserStore((s) => s.login);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    setIsLoading(true);
    try {
      await loginAction(credentials);
      showSuccessToast({ title: translate('auth.login_success') });
    } catch (error) {
      // API errors are already surfaced as toasts by the Axios client.
      if (__DEV__) console.warn('[auth] login failed', error);
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading };
}
