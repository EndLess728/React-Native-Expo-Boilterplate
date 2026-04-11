import { useUserStore } from './useUserStore';

export type { User } from './useUserStore';
export { useUserStore } from './useUserStore';

/**
 * Rehydrates all persisted Zustand stores from MMKV.
 *
 * Call this once in App.tsx after initStorage() resolves.
 * Stores use skipHydration:true so they hold initial state until this runs,
 * preventing access to the MMKV instance before it is initialized.
 */
export async function rehydrateStores(): Promise<void> {
  await useUserStore.persist.rehydrate();
  // Add any new persisted stores here as the project grows:
  // await useSettingsStore.persist.rehydrate();
}
