import { configureStore } from '@reduxjs/toolkit';

import { STATUS } from '@/shared/constants/status';

import { authReducer, initialState, login, logout } from '../authSlice';

const credentials = { email: 'test@example.com', password: 'secret123' };

const createTestStore = () => configureStore({ reducer: { auth: authReducer } });

describe('authSlice', () => {
  it('starts with user logged out', () => {
    expect(authReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  it('login thunk authenticates and sets isLoggedIn and user', async () => {
    const store = createTestStore();

    await store.dispatch(login(credentials));

    const { auth } = store.getState();
    expect(auth.isLoggedIn).toBe(true);
    expect(auth.user?.email).toBe('test@example.com');
    expect(auth.status).toBe(STATUS.SUCCESS);
  });

  it('marks the request as loading while pending', () => {
    const state = authReducer(initialState, { type: login.pending.type });
    expect(state.status).toBe(STATUS.LOADING);
  });

  it('stores the error when login fails', () => {
    const state = authReducer(initialState, {
      type: login.rejected.type,
      error: { message: 'Invalid credentials' },
    });
    expect(state.status).toBe(STATUS.ERROR);
    expect(state.error).toBe('Invalid credentials');
    expect(state.isLoggedIn).toBe(false);
  });

  it('logout() clears isLoggedIn and user', async () => {
    const store = createTestStore();
    await store.dispatch(login(credentials));

    store.dispatch(logout());

    expect(store.getState().auth).toEqual(initialState);
  });

  it('user does not contain a password field', async () => {
    const store = createTestStore();
    await store.dispatch(login(credentials));

    expect(store.getState().auth.user).not.toHaveProperty('password');
  });
});
