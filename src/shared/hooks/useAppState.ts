import { useEffect, useRef, useState } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

/**
 * Tracks the current React Native app state (active, background, inactive).
 *
 * @returns The current AppState status string.
 *
 * @example
 * const appState = useAppState();
 * // appState === 'active' | 'background' | 'inactive'
 */
export function useAppState(): AppStateStatus {
  const [appState, setAppState] = useState<AppStateStatus>(
    // RN 0.87 types `currentState` as a plain string; it is always an AppStateStatus at runtime.
    (AppState.currentState as AppStateStatus | null | undefined) ?? 'unknown',
  );

  useEffect(() => {
    const subscription = AppState.addEventListener('change', setAppState);
    return () => subscription.remove();
  }, []);

  return appState;
}

/**
 * Calls a callback whenever the app returns to the foreground (background → active).
 *
 * @example
 * useOnAppForeground(() => {
 *   queryClient.invalidateQueries();
 * });
 */
export function useOnAppForeground(callback: () => void): void {
  const appState = useAppState();
  const prevState = useRef<AppStateStatus>(appState);

  useEffect(() => {
    if (prevState.current === 'background' && appState === 'active') {
      callback();
    }
    prevState.current = appState;
  }, [appState, callback]);
}
