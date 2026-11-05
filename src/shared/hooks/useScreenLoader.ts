import { useEffect } from 'react';
import { useIsFocused } from 'expo-router';

import { requestAppLoader } from '@/shared/utils/appLoader';

/**
 * Shows the app-wide loader while `active` is true and this screen is focused,
 * so a tab or screen loading in the background never blocks the one in view.
 */
export function useScreenLoader(active: boolean): void {
  const isFocused = useIsFocused();
  const shouldShow = active && isFocused;

  useEffect(() => {
    if (!shouldShow) return;
    return requestAppLoader();
  }, [shouldShow]);
}
