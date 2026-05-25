import { Platform } from 'react-native';
import Constants from 'expo-constants';

function getExpoDevHost(): string | null {
  const uris = [
    Constants.expoConfig?.hostUri,
    (Constants.expoGoConfig as { debuggerHost?: string } | undefined)?.debuggerHost,
    (Constants.manifest2 as { extra?: { expoClient?: { hostUri?: string } } } | undefined)
      ?.extra?.expoClient?.hostUri,
  ];

  for (const uri of uris) {
    if (!uri) continue;
    const host = uri.split(':')[0];
    if (host && host !== 'localhost' && host !== '127.0.0.1') {
      return host;
    }
  }
  return null;
}

/** API base URL — resolved each call so it stays in sync with Expo / .env */
export function getApiBaseUrl(): string {
  const devHost = getExpoDevHost();

  // 1) Same IP as Expo QR code (e.g. 192.168.2.116) — works on a real phone
  if (__DEV__ && devHost) {
    return `http://${devHost}:5000/api`;
  }

  // 2) Manual override in frontend/.env (use when the app wrongly shows 10.0.2.2)
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL.replace(/\/$/, '');
  }

  // 3) Android Studio emulator only — NOT for Expo Go on a physical phone
  if (__DEV__ && Platform.OS === 'android' && !Constants.isDevice) {
    return 'http://10.0.2.2:5000/api';
  }

  return 'http://localhost:5000/api';
}
