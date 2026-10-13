import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Secrets (the session token) go to the Keychain / Keystore; on web, plain storage.
export const secure = {
  async get(key: string) {
    if (Platform.OS === 'web') {
      return AsyncStorage.getItem(key);
    }
    return SecureStore.getItemAsync(key);
  },
  async set(key: string, value: string | null) {
    if (Platform.OS === 'web') {
      return value == null ? AsyncStorage.removeItem(key) : AsyncStorage.setItem(key, value);
    }
    return value == null ? SecureStore.deleteItemAsync(key) : SecureStore.setItemAsync(key, value);
  },
};

export const prefs = {
  get: (key: string) => AsyncStorage.getItem(key),
  set: (key: string, value: string | null) =>
    value == null ? AsyncStorage.removeItem(key) : AsyncStorage.setItem(key, value),
};
