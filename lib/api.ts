import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { storage } from '@/lib/storage';
import { mockAdapter } from '@/lib/mockApi';

const REAL_API_URL = process.env.EXPO_PUBLIC_API_URL;
export const USE_MOCK_API = !REAL_API_URL;
export const API_BASE_URL = REAL_API_URL ?? 'http://localhost:4200/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
  // When no backend is configured, serve everything from the in-app mock.
  ...(USE_MOCK_API ? { adapter: mockAdapter } : {}),
});

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await storage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refreshToken = await storage.getItem('refreshToken');
        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh-token`, { refreshToken });
        await storage.setItem('accessToken', data.data.accessToken);
        original.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return api(original);
      } catch {
        await storage.deleteItem('accessToken');
        await storage.deleteItem('refreshToken');
      }
    }
    return Promise.reject(error);
  },
);
