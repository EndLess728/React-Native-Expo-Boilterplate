import { MMKV } from "react-native-mmkv";

export const storage = new MMKV({
  id: "secureStorage",
  encryptionKey: "my-super-secret-key", // Use any secret key to encrypt the storage
});
