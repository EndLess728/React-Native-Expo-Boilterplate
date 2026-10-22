import { act, renderHook } from '@testing-library/react-native';

import { useUserStore } from '../useUserStore';

const credentials = { email: 'test@example.com', password: 'secret123' };

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

  it('login() authenticates and sets isLoggedIn and user', async () => {
    const { result } = renderHook(() => useUserStore());

    await act(async () => {
      await result.current.login(credentials);
    });

    expect(result.current.isLoggedIn).toBe(true);
    expect(result.current.user?.email).toBe('test@example.com');
  });

  it('logout() clears isLoggedIn and user', async () => {
    const { result } = renderHook(() => useUserStore());

    await act(async () => {
      await result.current.login(credentials);
    });

    await act(() => {
      result.current.logout();
    });

    expect(result.current.isLoggedIn).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('user does not contain a password field', async () => {
    const { result } = renderHook(() => useUserStore());

    await act(async () => {
      await result.current.login(credentials);
    });

    expect(result.current.user).not.toHaveProperty('password');
  });
});
