import { create } from 'zustand';
import type { User, AuthTokens } from '@/types/auth';
import { storage } from '@/lib/storage';
import { registerPushToken, unregisterPushToken } from '@/lib/push';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User) => void;
  setTokens: (tokens: AuthTokens) => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) => {
    set({ user, isAuthenticated: true });
    storage.setItem('user', JSON.stringify(user)).catch(() => {});
  },

  setTokens: async (tokens) => {
    await storage.setItem('accessToken', tokens.accessToken);
    await storage.setItem('refreshToken', tokens.refreshToken);
    // Associate this device's push token with the now-authenticated user
    // (silent — no OS prompt; only registers if permission was already granted).
    registerPushToken().catch(() => {});
  },

  logout: async () => {
    await unregisterPushToken().catch(() => {});
    await storage.deleteItem('accessToken');
    await storage.deleteItem('refreshToken');
    await storage.deleteItem('user');
    set({ user: null, isAuthenticated: false });
  },

  hydrate: async () => {
    try {
      const token = await storage.getItem('accessToken');
      const userRaw = await storage.getItem('user');
      const user = userRaw ? (JSON.parse(userRaw) as User) : null;
      set({ isLoading: false, isAuthenticated: !!token, user });
    } catch {
      set({ isLoading: false, isAuthenticated: false });
    }
  },
}));
