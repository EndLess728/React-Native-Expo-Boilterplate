import { useSyncExternalStore } from 'react';

// How many screens currently want the app-wide loader. A count rather than a
// boolean, so one screen finishing can't hide the loader for another.
let activeRequests = 0;
const listeners = new Set<() => void>();

const notify = () => listeners.forEach((listener) => listener());

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

/** Shows the app-wide loader until the returned function is called. */
export function requestAppLoader(): () => void {
  activeRequests += 1;
  notify();

  let released = false;
  return () => {
    if (released) return;
    released = true;
    activeRequests -= 1;
    notify();
  };
}

export function useIsAppLoaderVisible(): boolean {
  return useSyncExternalStore(subscribe, () => activeRequests > 0);
}
