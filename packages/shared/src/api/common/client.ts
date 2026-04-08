/**
 * Shared Axios client for all apps in the monorepo.
 *
 * This is a bare axios instance with no platform-specific interceptors.
 * Each app (mobile, web) configures it with its own interceptors by calling
 * `setupApiClient` at bootstrap time.
 *
 * Mobile: adds Alert + NetInfo + MMKV token interceptors
 * Web:    adds localStorage token interceptors
 */
import axios from 'axios';

export const client = axios.create({
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export type ApiClientConfig = {
  baseURL: string;
  /**
   * Called before each request — return the Bearer token or null.
   */
  getAccessToken: () => string | null;
  /**
   * Called on any response error so the app can show a toast / alert.
   */
  onError?: (message: string) => void;
  /**
   * Called when a 401 is received and token refresh is not configured.
   * Typically triggers a logout flow.
   */
  onUnauthorized?: () => void;
};

/**
 * Configure the shared axios client.
 * Call this once at app startup before any API calls are made.
 */
export function setupApiClient(config: ApiClientConfig): void {
  client.defaults.baseURL = config.baseURL;

  // Request interceptor — attach auth token
  client.interceptors.request.use(async (axiosConfig) => {
    const token = config.getAccessToken();
    if (token) {
      axiosConfig.headers.set('Authorization', `Bearer ${token}`);
    }
    if (axiosConfig.data instanceof FormData) {
      axiosConfig.headers.set('Content-Type', 'multipart/form-data');
    }
    return axiosConfig;
  });

  // Response interceptor — handle errors
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        config.onUnauthorized?.();
        return Promise.reject(error);
      }

      if (error.response?.data) {
        const { error: apiError, errors, message } = error.response.data;
        const errorList = apiError ?? errors;
        const errorMessage = errorList ? errorList.join(', ') : message || 'Something went wrong';
        config.onError?.(errorMessage);
      } else if (!error.response) {
        config.onError?.('Network error. Please try again.');
      }

      return Promise.reject(error);
    },
  );
}
