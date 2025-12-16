import { createMMKV } from 'react-native-mmkv';

// Updated from v3 → v4
// https://github.com/mrousavy/react-native-mmkv/blob/main/docs/V4_UPGRADE_GUIDE.md
export const storage = createMMKV({
  id: 'secureStorage',
  encryptionKey: 'my-super-secret-key', // Use a secure secret key to encrypt the storage
});
