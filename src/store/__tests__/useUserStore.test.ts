import { act, renderHook } from '@testing-library/react-native';

import { useUserStore } from '../useUserStore';

// Reset store state between tests to prevent bleed-through
beforeEach(async () => {
  await act(() => {
    useUserStore.setState({ isLoggedIn: false, user: null });
  });
});

describe('useUserStore', () => {
  it('starts with user logged out', () => {
    const { result } = renderHook(() => useUserStore());
    expect(result.current.isLoggedIn).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('login() sets isLoggedIn and user', async () => {
    const { result } = renderHook(() => useUserStore());

    await act(() => {
      result.current.login({ email: 'test@example.com' });
    });

    expect(result.current.isLoggedIn).toBe(true);
    expect(result.current.user?.email).toBe('test@example.com');
  });

  it('logout() clears isLoggedIn and user', async () => {
    const { result } = renderHook(() => useUserStore());

    await act(() => {
      result.current.login({ email: 'test@example.com' });
    });

    await act(() => {
      result.current.logout();
    });

    expect(result.current.isLoggedIn).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('user does not contain a password field', async () => {
    const { result } = renderHook(() => useUserStore());

    await act(() => {
      result.current.login({ email: 'test@example.com' });
    });

    expect(result.current.user).not.toHaveProperty('password');
  });
});
