import { getItem, removeItem, setItem } from '@/storage';

// ──────────────────────────────────────────────
//  MMKV Storage Keys
// ──────────────────────────────────────────────

const TOKEN_KEY = 'auth_access_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';

// ──────────────────────────────────────────────
//  Access Token
// ──────────────────────────────────────────────

export const getAccessToken = (): string | null => getItem<string>(TOKEN_KEY);

export const setAccessToken = (token: string): void => setItem(TOKEN_KEY, token);

export const removeAccessToken = (): void => removeItem(TOKEN_KEY);

// ──────────────────────────────────────────────
//  Refresh Token
// ──────────────────────────────────────────────

export const getRefreshToken = (): string | null => getItem<string>(REFRESH_TOKEN_KEY);

export const setRefreshToken = (token: string): void => setItem(REFRESH_TOKEN_KEY, token);

export const removeRefreshToken = (): void => removeItem(REFRESH_TOKEN_KEY);

// ──────────────────────────────────────────────
//  Convenience
// ──────────────────────────────────────────────

/**
 * Store both tokens at once (e.g. after login/signup or token refresh).
 */
export const setTokens = (accessToken: string, refreshToken: string): void => {
  setAccessToken(accessToken);
  setRefreshToken(refreshToken);
};

/**
 * Clear both tokens (e.g. on logout).
 */
export const clearTokens = (): void => {
  removeAccessToken();
  removeRefreshToken();
};
