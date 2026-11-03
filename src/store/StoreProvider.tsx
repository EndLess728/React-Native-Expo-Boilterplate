import type React from 'react';

/**
 * Zustand needs no context provider — this is a pass-through so the app shell
 * stays identical whichever state library the project was generated with.
 */
export function StoreProvider({ children }: { children: React.ReactNode }) {
  return children;
}
