/**
 * Platform-agnostic storage adapter interface.
 *
 * Mobile: implement with MMKV
 * Web:    implement with localStorage
 */
export type StorageAdapter = {
  getItem: (name: string) => string | null;
  setItem: (name: string, value: string) => void;
  removeItem: (name: string) => void;
};
