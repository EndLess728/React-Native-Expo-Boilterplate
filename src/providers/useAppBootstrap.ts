import { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';

import { initI18n } from '@/localization/i18n';
import { initStorage } from '@/storage';
import { rehydrateStores } from '@/store';

SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({ duration: 500, fade: true });

/**
 * Runs one-time start-up work while the splash screen is visible and returns
 * `true` once the app can render.
 *
 * Order matters:
 *   1. `initStorage()` — creates the encrypted MMKV instance.
 *   2. `rehydrateStores()` — persisted state reads from that instance.
 *   3. `initI18n()` — reads the saved language from MMKV; initializing earlier
 *      would always fall back to the device locale.
 */
export function useAppBootstrap(): boolean {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await initStorage().then(rehydrateStores);
        await initI18n();
      } catch (error) {
        if (__DEV__) console.error('[useAppBootstrap] App initialization failed:', error);
      }
      setIsReady(true);
      SplashScreen.hideAsync();
    }
    prepare();
  }, []);

  return isReady;
}
