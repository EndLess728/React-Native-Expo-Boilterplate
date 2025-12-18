import { createMMKV } from 'react-native-mmkv';

// Updated from v3 → v4
// https://github.com/mrousavy/react-native-mmkv/blob/main/docs/V4_UPGRADE_GUIDE.md
export const storage = createMMKV({
  id: 'secureStorage',
  encryptionKey: 'my-super-secret-key', // Use a secure secret key to encrypt the storage
});

export function getItem<T>(key: string): T | null {
  const value = storage.getString(key);
  return value ? JSON.parse(value) || null : null;
}

export function setItem<T>(key: string, value: T) {
  storage.set(key, JSON.stringify(value));
}

export function removeItem(key: string) {
  storage.remove(key);
}
