import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { STATUS } from '@/shared/constants/status';

import type { LoginCredentials, User } from '../types';

type Status = (typeof STATUS)[keyof typeof STATUS];

export interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  status: Status;
  error: string | null;
}

export const initialState: AuthState = {
  isLoggedIn: false,
  user: null,
  status: STATUS.NOT_STARTED,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Picked up by `authSaga`, which calls the API and dispatches the result.
    loginRequest: (state, _action: PayloadAction<LoginCredentials>) => {
      state.status = STATUS.LOADING;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.status = STATUS.SUCCESS;
      state.isLoggedIn = true;
      state.user = action.payload;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.status = STATUS.ERROR;
      state.error = action.payload;
    },
    // Token cleanup is a side effect, so it lives in `signOut()` / `useLogout()`.
    logout: () => initialState,
  },
});

export const { loginRequest, loginSuccess, loginFailure, logout } = authSlice.actions;
export const authReducer = authSlice.reducer;
