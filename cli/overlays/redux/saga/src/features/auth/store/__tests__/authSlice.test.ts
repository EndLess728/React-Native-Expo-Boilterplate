import { STATUS } from '@/shared/constants/status';

import {
  authReducer,
  initialState,
  loginFailure,
  loginRequest,
  loginSuccess,
  logout,
} from '../authSlice';

const credentials = { email: 'test@example.com', password: 'secret123' };

describe('authSlice', () => {
  it('starts with user logged out', () => {
    expect(authReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  it('loginRequest marks the request as loading', () => {
    const state = authReducer(initialState, loginRequest(credentials));
    expect(state.status).toBe(STATUS.LOADING);
    expect(state.isLoggedIn).toBe(false);
  });

  it('loginSuccess sets isLoggedIn and user', () => {
    const state = authReducer(initialState, loginSuccess({ email: 'test@example.com' }));
    expect(state.isLoggedIn).toBe(true);
    expect(state.user?.email).toBe('test@example.com');
    expect(state.status).toBe(STATUS.SUCCESS);
  });

  it('loginFailure stores the error', () => {
    const state = authReducer(initialState, loginFailure('Invalid credentials'));
    expect(state.status).toBe(STATUS.ERROR);
    expect(state.error).toBe('Invalid credentials');
  });

  it('logout() clears isLoggedIn and user', () => {
    const loggedIn = authReducer(initialState, loginSuccess({ email: 'test@example.com' }));
    expect(authReducer(loggedIn, logout())).toEqual(initialState);
  });
});
