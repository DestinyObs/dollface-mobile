import { create } from 'zustand';
import { Ionicons } from '@expo/vector-icons';
import { loadJSON, saveJSON } from '@/lib/persist';
import { notificationsApi } from '@/lib/data/endpoints';

type IName = React.ComponentProps<typeof Ionicons>['name'];

export interface AppNotification {
  id: string;
  icon: IName;
  bg: string;
  color: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  route?: string;
}

const KEY = 'notifications';

interface NotifState {
  notifications: AppNotification[];
  hydrate: () => Promise<void>;
  unread: () => number;
  markRead: (id: string) => void;
  markAllRead: () => void;
}

/**
 * Server-backed notifications. Hydrates from the API (falls back to the last
 * cached list offline); read-state changes update optimistically + sync.
 */
export const useNotificationStore = create<NotifState>((set, get) => ({
  notifications: [],

  hydrate: async () => {
    try {
      const list = (await notificationsApi.list()) as AppNotification[];
      set({ notifications: list });
      saveJSON(KEY, list);
    } catch {
      set({ notifications: await loadJSON<AppNotification[]>(KEY, []) });
    }
  },

  unread: () => get().notifications.filter((n) => !n.read).length,

  markRead: (id) => {
    const notifications = get().notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    set({ notifications });
    saveJSON(KEY, notifications);
    notificationsApi.markRead(id).catch(() => {});
  },

  markAllRead: () => {
    const notifications = get().notifications.map((n) => ({ ...n, read: true }));
    set({ notifications });
    saveJSON(KEY, notifications);
    notificationsApi.markAllRead().catch(() => {});
  },
}));
