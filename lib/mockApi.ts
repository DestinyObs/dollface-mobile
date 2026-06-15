import type { AxiosAdapter, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { storage } from '@/lib/storage';
import * as seed from '@/lib/data/seed';

/**
 * In-memory + persisted mock backend.
 * Active whenever EXPO_PUBLIC_API_URL is unset (i.e. local FE development).
 * Simulates network latency and the real API response envelope:
 *   { data: { user, tokens } }  /  { data: { ... } }
 *
 * Auth uses a realistic latency; content reads are snappier so the app feels
 * instant while still exercising the real fetch → React Query → render path.
 * A real backend drops in by setting EXPO_PUBLIC_API_URL — no app changes.
 */

const LATENCY = 650;
const CONTENT_LATENCY = 280;

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
  const url = (config.url ?? '').replace(/^\/+/, '');
  const method = (config.method ?? 'get').toLowerCase();
  const body = parseBody(config);

  await wait(url.startsWith('auth/') ? LATENCY : CONTENT_LATENCY);

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

  // Social login — derive a stable demo account per provider.
  const socialMatch = url.match(/^auth\/social\/(google|apple)$/);
  if (socialMatch && method === 'post') {
    const provider = socialMatch[1];
    const email = `${provider}.demo@dollface.app`;
    const users = await readUsers();
    let user = users.find(u => u.email === email);
    let isNewUser = false;
    if (!user) {
      isNewUser = true;
      user = { id: `u_${Date.now()}`, name: `${provider[0].toUpperCase()}${provider.slice(1)} User`, email, password: '', createdAt: new Date().toISOString() };
      users.push(user);
      await writeUsers(users);
    }
    return ok(config, { user: publicUser(user), tokens: makeTokens(user.id), isNewUser });
  }

  // ── ACCOUNT ───────────────────────────────────────────
  if (url === 'me' && method === 'patch') {
    return ok(config, { id: 'me', name: body.name, email: 'you@dollface.app', avatarUrl: body.avatarUrl, bio: body.bio });
  }

  // ── SEARCH ────────────────────────────────────────────
  if (url === 'search' && method === 'get') {
    const q = String(config.params?.q ?? '').toLowerCase();
    const match = (t: string) => t.toLowerCase().includes(q);
    return ok(config, {
      products: q ? seed.PRODUCTS.filter(p => match(p.name) || match(p.brand)) : [],
      tutorials: q ? seed.TUTORIALS.filter(t => match(t.title)) : [],
      looks: q ? seed.HOME_FEED.trendingLooks.filter(l => match(l.label)) : [],
      brands: [],
    });
  }

  // ── BEAUTY PROFILE ────────────────────────────────────
  if (url === 'beauty-profile' && (method === 'put' || method === 'patch')) return ok(config, body);
  if (url === 'beauty-profile' && method === 'get') return ok(config, {});
  if (url === 'beauty-profile/complete' && method === 'post') return ok(config, { onboardingComplete: true });

  // ── HOME FEED ─────────────────────────────────────────
  if (url === 'feed/home' && method === 'get') return ok(config, seed.HOME_FEED);

  // ── TUTORIALS ─────────────────────────────────────────
  if (url === 'tutorials' && method === 'get') {
    const q = String((config.params?.search ?? '')).toLowerCase();
    const cat = String(config.params?.category ?? 'All');
    let list = seed.TUTORIALS;
    if (cat && cat !== 'All') list = list.filter(t => t.cat === cat);
    if (q) list = list.filter(t => t.title.toLowerCase().includes(q));
    return ok(config, list);
  }
  if (url === 'tutorials/featured' && method === 'get') return ok(config, seed.FEATURED_TUTORIAL);
  if (url === 'tutorials/categories' && method === 'get') return ok(config, seed.TUTORIAL_CATEGORIES);
  if (url === 'tutorials/saved' && method === 'get') return ok(config, []);
  if (/^tutorials\/[^/]+\/(save|complete)$/.test(url) && (method === 'post' || method === 'delete')) return ok(config, { saved: method === 'post' });
  if (/^tutorials\/[^/]+$/.test(url) && method === 'get') return ok(config, seed.tutorialDetail(url.split('/')[1]));

  // ── MATCH ─────────────────────────────────────────────
  if (url === 'match/recent' && method === 'get') return ok(config, seed.RECENT_MATCHES);
  if (url === 'match/categories' && method === 'get') return ok(config, seed.MATCH_CATEGORIES);
  if (url === 'match/history' && method === 'get') return ok(config, seed.MATCH_HISTORY);
  if (url === 'match/scans' && method === 'get') return ok(config, seed.SCAN_HISTORY);
  if ((url === 'match/selfie' || url === 'match/manual') && method === 'post') return ok(config, seed.MATCH_RESULT);
  if (/^match\/[^/]+\/save$/.test(url) && method === 'post') return ok(config, { saved: true });
  if (/^match\/[^/]+$/.test(url) && method === 'get') return ok(config, { ...seed.MATCH_RESULT, id: url.split('/')[1] });

  // ── RECREATE ──────────────────────────────────────────
  if (url === 'recreate/upload' && method === 'post') return ok(config, { id: seed.RECREATION.id, status: 'PROCESSING' }, 201);
  if (/^recreate\/[^/]+\/status$/.test(url) && method === 'get') return ok(config, { id: url.split('/')[1], status: 'DONE' });
  if (/^recreate\/[^/]+\/save$/.test(url) && method === 'post') return ok(config, { saved: true });
  if (url === 'recreate/history' && method === 'get') return ok(config, []);
  if (/^recreate\/[^/]+$/.test(url) && method === 'get') return ok(config, { ...seed.RECREATION, id: url.split('/')[1] });

  // ── PRODUCTS ──────────────────────────────────────────
  if (url === 'products' && method === 'get') {
    const q = String((config.params?.search ?? '')).toLowerCase();
    const cat = String(config.params?.category ?? 'All');
    let list = seed.PRODUCTS;
    if (cat && cat !== 'All') list = list.filter(p => p.category === cat);
    if (q) list = list.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
    return ok(config, list);
  }
  if (url === 'products/categories' && method === 'get') return ok(config, seed.PRODUCT_CATEGORIES);
  if (/^products\/[^/]+$/.test(url) && method === 'get') return ok(config, seed.productDetail(url.split('/')[1]));

  // ── SUBSCRIPTION ──────────────────────────────────────
  if (url === 'subscription' && method === 'get') return ok(config, seed.SUBSCRIPTION);
  if (url === 'subscription/plans' && method === 'get') return ok(config, [seed.SUBSCRIPTION.current, seed.SUBSCRIPTION.pro]);
  if (url === 'subscription/checkout' && method === 'post') return ok(config, { status: 'trialing' });

  // ── ACCOUNT & ROUTINES ────────────────────────────────
  if (url === 'me/stats' && method === 'get') return ok(config, seed.ME_STATS);
  if (url === 'routines' && method === 'get') return ok(config, seed.ROUTINES);

  // ── FALLBACK ──────────────────────────────────────────
  // Any other endpoint returns an empty success so screens that
  // fetch optional data don't crash during local FE development.
  return ok(config, {});
};
