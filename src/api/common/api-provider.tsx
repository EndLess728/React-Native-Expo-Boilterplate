import * as React from 'react';
import { useReactQueryDevTools } from '@dev-plugins/react-query';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // How long fetched data is considered "fresh". Within this window the
      // same query key is served from cache with no network call. 5 minutes
      // covers most navigation patterns (open a screen, leave, come back)
      // without surprising the user with stale data on longer return trips.
      staleTime: 1000 * 60 * 5,
      // How many times a failed query is retried before the error surfaces
      // to the UI. Combined with React Query's exponential backoff this
      // smooths over transient network blips without holding the spinner
      // forever on a real failure.
      retry: 2,
      // How long inactive (unobserved) cache entries stick around before
      // garbage collection. Longer than staleTime so quickly re-mounting a
      // screen reuses cached data instead of re-fetching from scratch.
      gcTime: 1000 * 60 * 10,
    },
    mutations: {
      // Never auto-retry mutations. They are usually non-idempotent
      // (POST/PUT/DELETE) — silent retries can double-charge a card,
      // duplicate a record, etc. Callers opt in per-mutation when retry
      // is genuinely safe.
      retry: 0,
    },
  },
});

export function APIProvider({ children }: { children: React.ReactNode }) {
  useReactQueryDevTools(queryClient);
  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
