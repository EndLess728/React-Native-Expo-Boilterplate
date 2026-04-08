/**
 * Mobile-specific API client setup.
 *
 * Configures the shared axios client from @repo/business-logic with:
 * - NetInfo connectivity check before every request
 * - MMKV token injection
 * - Toast error notifications
 * - Alert-based session expiry → logout
 *
 * Call setupMobileApiClient() once at app startup (e.g. in App.tsx).
 */
import { Alert } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { client, setupApiClient } from '@repo/business-logic';
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

import { showErrorToast } from '@/components/ToastAlert';
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from '@/storage/token';
import { useUserStore } from '@/store/useUserStore';

// ─────────────────────────────────────────────────────────────
//  Configuration
// ─────────────────────────────────────────────────────────────

/**
 * Toggle automatic token refresh on 401 responses.
 *
 * - `false` (default): A 401 clears tokens and shows a
 *   "Session Expired" alert, then logs the user out.
 *
 * - `true`: Attempts to silently refresh the access token
 *   using the stored refresh token.
 */
const ENABLE_TOKEN_REFRESH = false;

const MAX_RETRIES = 1;

// ─────────────────────────────────────────────────────────────
//  Session Expiry
// ─────────────────────────────────────────────────────────────

const forceLogout = () => {
  clearTokens();
  Alert.alert(
    'Session Expired',
    'Your session has expired. Please log in again.',
    [{ text: 'OK', onPress: () => useUserStore.getState().logout() }],
    { cancelable: false },
  );
};

// ─────────────────────────────────────────────────────────────
//  Token Refresh Queue
// ─────────────────────────────────────────────────────────────

interface QueueItem {
  resolve: (token: string) => void;
  reject: (error: Error) => void;
}

let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((item) => {
    if (error) item.reject(error);
    else item.resolve(token!);
  });
  failedQueue = [];
};

const refreshToken = async (): Promise<string> => {
  const currentRefreshToken = getRefreshToken();
  if (!currentRefreshToken) throw new Error('No refresh token available');

  // Use plain axios (not client) to avoid triggering interceptors
  const { data } = await axios.post(`${client.defaults.baseURL}/auth/refresh`, {
    refreshToken: currentRefreshToken,
  });
  setTokens(data.accessToken, data.refreshToken);
  return data.accessToken;
};

// ─────────────────────────────────────────────────────────────
//  Setup
// ─────────────────────────────────────────────────────────────

declare module 'axios' {
  interface InternalAxiosRequestConfig {
    _retryCount?: number;
  }
}

export function setupMobileApiClient(baseURL: string): void {
  // Configure the shared client from @repo/business-logic
  setupApiClient({
    baseURL,
    getAccessToken,
    onError: (message) => showErrorToast({ title: message }),
    onUnauthorized: forceLogout,
  });

  // Add mobile-specific request interceptor (NetInfo + dev logging)
  client.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      const netState = await NetInfo.fetch();
      if (!netState.isConnected) {
        showErrorToast({ title: 'No internet connection' });
        return Promise.reject(new axios.Cancel('No internet connection'));
      }
      if (__DEV__) {
        console.log(`➡️ [${config.method?.toUpperCase()}] ${config.url}`, config.params ?? '');
      }
      return config;
    },
    (error: AxiosError) => Promise.reject(error),
  );

  // Override 401 handling with token refresh support
  if (ENABLE_TOKEN_REFRESH) {
    client.interceptors.response.use(
      (response) => {
        if (__DEV__) {
          console.log(
            `✅ [${response.config.method?.toUpperCase()}] ${response.config.url} — ${response.status}`,
          );
        }
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig;

        if (__DEV__) {
          console.log(
            `❌ [${originalRequest?.method?.toUpperCase()}] ${originalRequest?.url} — ${error.response?.status}`,
            error.response?.data,
          );
        }

        if (error.response?.status === 401 && originalRequest) {
          const retryCount = originalRequest._retryCount ?? 0;
          if (retryCount >= MAX_RETRIES) {
            forceLogout();
            return Promise.reject(error);
          }

          if (isRefreshing) {
            return new Promise<string>((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            }).then((newToken) => {
              originalRequest.headers.set('Authorization', `Bearer ${newToken}`);
              originalRequest._retryCount = retryCount + 1;
              return client(originalRequest);
            });
          }

          isRefreshing = true;
          try {
            const newToken = await refreshToken();
            processQueue(null, newToken);
            originalRequest.headers.set('Authorization', `Bearer ${newToken}`);
            originalRequest._retryCount = retryCount + 1;
            return client(originalRequest);
          } catch (refreshError) {
            processQueue(refreshError as Error);
            forceLogout();
            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        }

        return Promise.reject(error);
      },
    );
  }
}

// Re-export shared client so mobile code can import from here
export { client } from '@repo/business-logic';
