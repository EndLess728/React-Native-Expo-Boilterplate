import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { STATUS } from '@/shared/constants/status';

import { authenticate } from '../api/authenticate';
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

/** Async login — dispatch it and `.unwrap()` the result to await success. */
export const login = createAsyncThunk('auth/login', (credentials: LoginCredentials) =>
  authenticate(credentials),
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Token cleanup is a side effect, so it lives in `signOut()` / `useLogout()`.
    logout: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = STATUS.LOADING;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = STATUS.SUCCESS;
        state.isLoggedIn = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = STATUS.ERROR;
        state.error = action.error.message ?? null;
      });
  },
});

export const { logout } = authSlice.actions;
export const authReducer = authSlice.reducer;
