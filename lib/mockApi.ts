import type { AxiosAdapter, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { storage } from '@/lib/storage';

/**
 * In-memory + persisted mock backend.
 * Active whenever EXPO_PUBLIC_API_URL is unset (i.e. local FE development).
 * Simulates network latency and the real API response envelope:
 *   { data: { user, tokens } }  /  { data: { ... } }
 */

const LATENCY = 650;

const wait = (ms: number) => new Promise(r => setTimeout(r, ms));

type StoredUser = { id: string; name: string; email: string; password: string; avatarUrl?: string; createdAt: string };

const USERS_KEY = 'mock_users';

async function readUsers(): Promise<StoredUser[]> {
  try {
    const raw = await storage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

async function writeUsers(users: StoredUser[]) {
  await storage.setItem(USERS_KEY, JSON.stringify(users));
}

function makeTokens(userId: string) {
  return {
    accessToken: `mock.access.${userId}.${Date.now()}`,
    refreshToken: `mock.refresh.${userId}.${Date.now()}`,
  };
}

function publicUser(u: StoredUser) {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    avatarUrl: u.avatarUrl,
    role: 'USER' as const,
    createdAt: u.createdAt,
  };
}

function ok(config: InternalAxiosRequestConfig, data: any, status = 200): AxiosResponse {
  return {
    data: { success: true, data },
    status,
    statusText: 'OK',
    headers: {},
    config,
  };
}

function fail(config: InternalAxiosRequestConfig, message: string, status = 400): never {
  const error: any = new Error(message);
  error.isAxiosError = true;
  error.config = config;
  error.response = {
    data: { success: false, message },
    status,
    statusText: 'Error',
    headers: {},
    config,
  };
  throw error;
}

function parseBody(config: InternalAxiosRequestConfig): any {
  if (!config.data) return {};
  if (typeof config.data === 'string') {
    try { return JSON.parse(config.data); } catch { return {}; }
  }
  return config.data;
}

export const mockAdapter: AxiosAdapter = async (config) => {
  await wait(LATENCY);

  const url = (config.url ?? '').replace(/^\/+/, '');
  const method = (config.method ?? 'get').toLowerCase();
  const body = parseBody(config);

  // ── AUTH ──────────────────────────────────────────────
  if (url === 'auth/register' && method === 'post') {
    const users = await readUsers();
    const exists = users.find(u => u.email.toLowerCase() === String(body.email).toLowerCase());
    if (exists) fail(config, 'An account with this email already exists.', 409);

    const user: StoredUser = {
      id: `u_${Date.now()}`,
      name: body.name,
      email: body.email,
      password: body.password,
      createdAt: new Date().toISOString(),
    };
    users.push(user);
    await writeUsers(users);
    return ok(config, { user: publicUser(user), tokens: makeTokens(user.id) }, 201);
  }

  if (url === 'auth/login' && method === 'post') {
    const users = await readUsers();
    const user = users.find(u => u.email.toLowerCase() === String(body.email).toLowerCase());
    // Lenient demo login: accept any known email, or auto-provision an account.
    if (!user) {
      // Auto-create so demo sign-in always works.
      const demo: StoredUser = {
        id: `u_${Date.now()}`,
        name: String(body.email).split('@')[0].replace(/[^a-zA-Z]/g, ' ').trim() || 'DollFace User',
        email: body.email,
        password: body.password,
        createdAt: new Date().toISOString(),
      };
      users.push(demo);
      await writeUsers(users);
      return ok(config, { user: publicUser(demo), tokens: makeTokens(demo.id) });
    }
    if (user.password !== body.password) fail(config, 'Incorrect password.', 401);
    return ok(config, { user: publicUser(user), tokens: makeTokens(user.id) });
  }

  if (url === 'auth/forgot-password' && method === 'post') {
    return ok(config, { message: 'If that email exists, a reset link has been sent.' });
  }

  if (url === 'auth/reset-password' && method === 'post') {
    return ok(config, { message: 'Password updated.' });
  }

  if (url === 'auth/refresh-token' && method === 'post') {
    return ok(config, { accessToken: `mock.access.refreshed.${Date.now()}` });
  }

  if (url === 'auth/me' && method === 'get') {
    const users = await readUsers();
    const last = users[users.length - 1];
    if (!last) fail(config, 'Not authenticated', 401);
    return ok(config, { user: publicUser(last) });
  }

  // ── FALLBACK ──────────────────────────────────────────
  // Any other endpoint returns an empty success so screens that
  // fetch optional data don't crash during local FE development.
  return ok(config, {});
};
