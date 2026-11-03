import { useCallback } from 'react';

import { translate } from '@/localization/utils';
import { STATUS } from '@/shared/constants/status';
import { showSuccessToast } from '@/shared/utils/toast';
import { useAppDispatch, useAppSelector } from '@/store';

import { signOut } from './session';
import { login as loginThunk } from './store/authSlice';
import type { LoginCredentials, User } from './types';

// The auth feature's public state API. Screens and other features use these
// hooks instead of reaching into the store, so the state library behind them
// (Redux Toolkit here) can change without touching any UI code.

export const useIsLoggedIn = (): boolean => useAppSelector((state) => state.auth.isLoggedIn);

export const useCurrentUser = (): User | null => useAppSelector((state) => state.auth.user);

export const useLogout = (): (() => void) => signOut;

export function useLogin() {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.auth.status === STATUS.LOADING);

  const login = useCallback(
    (credentials: LoginCredentials): Promise<void> =>
      dispatch(loginThunk(credentials))
        .unwrap()
        .then(() => {
          showSuccessToast({ title: translate('auth.login_success') });
        })
        .catch((error: unknown) => {
          // API errors are already surfaced as toasts by the Axios client.
          if (__DEV__) console.warn('[auth] login failed', error);
        }),
    [dispatch],
  );

  return { login, isLoading };
}
