import { storage } from '@/lib/storage';

/** Read & parse a JSON value from device storage, with a fallback. */
export async function loadJSON<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await storage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

/** Fire-and-forget JSON write to device storage. */
export function saveJSON(key: string, value: unknown) {
  storage.setItem(key, JSON.stringify(value)).catch(() => {});
}

export function removeKey(key: string) {
  storage.deleteItem(key).catch(() => {});
}
