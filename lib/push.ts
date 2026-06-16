import { Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { devicesApi } from '@/lib/data/endpoints';
import { storage } from '@/lib/storage';

const TOKEN_KEY = 'expoPushToken';

/**
 * Acquire the device's Expo push token (requesting permission if needed) and
 * register it with the backend so the server can send real push notifications.
 * Safe to call on every launch — it no-ops on web, simulators, denied
 * permission, or when no push service is available, and never throws.
 */
export async function registerPushToken({ prompt = false }: { prompt?: boolean } = {}): Promise<string | null> {
  try {
    if (Platform.OS === 'web') return null;

    const existing = await Notifications.getPermissionsAsync();
    let status = existing.status;
    if (status !== 'granted') {
      // Only surface the OS prompt where the user opted in (onboarding); on
      // silent calls (e.g. login) we register only if already permitted.
      if (!prompt) return null;
      status = (await Notifications.requestPermissionsAsync()).status;
    }
    if (status !== 'granted') return null;

    // projectId is required by EAS builds; in Expo Go it can be inferred.
    const projectId =
      (Constants.expoConfig as any)?.extra?.eas?.projectId ??
      (Constants as any)?.easConfig?.projectId;

    const { data: token } = await Notifications.getExpoPushTokenAsync(projectId ? { projectId } : undefined);
    if (!token) return null;

    await devicesApi.register({ expoPushToken: token, platform: Platform.OS as 'ios' | 'android', appVersion: Constants.expoConfig?.version });
    await storage.setItem(TOKEN_KEY, token);
    return token;
  } catch {
    // No push service (simulator), missing projectId in a bare build, offline — ignore.
    return null;
  }
}

/** Unregister the current device token (e.g. on sign-out). */
export async function unregisterPushToken(): Promise<void> {
  try {
    const token = await storage.getItem(TOKEN_KEY);
    if (token) {
      await devicesApi.unregister(token).catch(() => {});
      await storage.deleteItem(TOKEN_KEY);
    }
  } catch {
    /* ignore */
  }
}
