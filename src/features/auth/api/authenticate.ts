import type { LoginCredentials, User } from '../types';

/**
 * Exchanges credentials for a user session.
 *
 * Placeholder — swap the body for your real endpoint, e.g.
 *
 *   const { data } = await client.post('auth/login', credentials);
 *   setTokens(data.accessToken, data.refreshToken);
 *   return data.user;
 *
 * Raw passwords are never persisted: only the returned `User` reaches the
 * store, and tokens go to `@/storage/token`.
 */
export async function authenticate(credentials: LoginCredentials): Promise<User> {
  return { email: credentials.email };
}
