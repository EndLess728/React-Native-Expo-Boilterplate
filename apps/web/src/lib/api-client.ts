/**
 * Web-specific API client setup.
 *
 * Configures the shared axios client from @repo/shared with:
 * - localStorage token injection
 * - Console error notifications (replace with your toast library)
 * - Redirect to /login on 401
 */
import { setupApiClient } from '@repo/shared';

const TOKEN_KEY = 'auth_access_token';

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setAccessToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeAccessToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function setupWebApiClient(): void {
  setupApiClient({
    baseURL: process.env.NEXT_PUBLIC_API_URL ?? '',
    getAccessToken,
    onError: (message) => {
      // Replace with your web toast/notification library
      console.error('[API Error]', message);
    },
    onUnauthorized: () => {
      removeAccessToken();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    },
  });
}
