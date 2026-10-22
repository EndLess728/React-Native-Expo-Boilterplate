import { useCallback } from 'react';

import { STATUS } from '@/shared/constants/status';
import { useAppDispatch, useAppSelector } from '@/store';

import { signOut } from './session';
import { loginRequest } from './store/authSlice';
import type { LoginCredentials, User } from './types';

// The auth feature's public state API. Screens and other features use these
// hooks instead of reaching into the store, so the state library behind them
// (Redux Toolkit + Redux-Saga here) can change without touching any UI code.

export const useIsLoggedIn = (): boolean => useAppSelector((state) => state.auth.isLoggedIn);

export const useCurrentUser = (): User | null => useAppSelector((state) => state.auth.user);

export const useLogout = (): (() => void) => signOut;

export function useLogin() {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.auth.status === STATUS.LOADING);

  // Fire-and-forget: `authSaga` handles the request, success toast and errors.
  const login = useCallback(
    (credentials: LoginCredentials): void => {
      dispatch(loginRequest(credentials));
    },
    [dispatch],
  );

  return { login, isLoading };
}
