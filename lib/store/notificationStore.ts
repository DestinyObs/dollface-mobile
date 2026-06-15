import { create } from 'zustand';
import { Ionicons } from '@expo/vector-icons';
import { loadJSON, saveJSON } from '@/lib/persist';

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

const SEED: AppNotification[] = [
  { id: 'n1', icon: 'color-palette', bg: '#F5EAEF', color: '#753248', title: 'New shade match ready', body: 'We found 3 new foundations matching your tone.', time: '2h', read: false, route: '/(tabs)/match' },
  { id: 'n2', icon: 'book', bg: '#EAF7EF', color: '#2F7D52', title: 'Tutorial picked for you', body: '"The Glass Skin Method" matches your goals.', time: '5h', read: false, route: '/(tabs)/learn' },
  { id: 'n3', icon: 'sparkles', bg: '#EAF0FB', color: '#3B5BDB', title: 'Your recreation is done', body: 'Tap to see your personalised look breakdown.', time: '1d', read: false, route: '/(tabs)/recreate' },
  { id: 'n4', icon: 'diamond', bg: '#FBF1E6', color: '#A06A2C', title: 'Try DollFace Pro free', body: 'Unlock unlimited matches for 7 days, on us.', time: '2d', read: true, route: '/premium' },
];

const KEY = 'notifications';

interface NotifState {
  notifications: AppNotification[];
  hydrate: () => Promise<void>;
  unread: () => number;
  markRead: (id: string) => void;
  markAllRead: () => void;
}

export const useNotificationStore = create<NotifState>((set, get) => ({
  notifications: SEED,
  hydrate: async () => set({ notifications: await loadJSON<AppNotification[]>(KEY, SEED) }),
  unread: () => get().notifications.filter((n) => !n.read).length,
  markRead: (id) =>
    set((s) => {
      const notifications = s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
      saveJSON(KEY, notifications);
      return { notifications };
    }),
  markAllRead: () =>
    set((s) => {
      const notifications = s.notifications.map((n) => ({ ...n, read: true }));
      saveJSON(KEY, notifications);
      return { notifications };
    }),
}));
