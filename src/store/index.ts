// The only place allowed to reach inside features' store folders: it wires
// every feature's persisted store into app start-up.
import { useUserStore } from '@/features/auth/store/useUserStore';

export { StoreProvider } from './StoreProvider';

/**
 * Rehydrates all persisted Zustand stores from MMKV.
 *
 * Called once by `useAppBootstrap()` after `initStorage()` resolves. Stores
 * use `skipHydration: true`, so they hold their initial state until this runs
 * — preventing access to the MMKV instance before it is initialized.
 */
export async function rehydrateStores(): Promise<void> {
  await useUserStore.persist.rehydrate();
  // Add any new persisted stores here as the project grows:
  // await useSettingsStore.persist.rehydrate();
}
