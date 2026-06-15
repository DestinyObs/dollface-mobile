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

// Generic persisted mock state (cart, orders, addresses, payments, notifications…)
async function readJSON<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await storage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
const writeJSON = (key: string, val: unknown) => storage.setItem(key, JSON.stringify(val));

type MockCartItem = { id: string; productId?: string; name: string; brand: string; price: number; shade?: string; img?: string; qty: number };
const cartShape = (items: MockCartItem[]) => ({
  items,
  count: items.reduce((n, i) => n + i.qty, 0),
  subtotal: items.reduce((n, i) => n + i.price * i.qty, 0),
});

const SEED_REVIEWS = [
  { id: 'rs1', author: 'Amara O.', rating: 5, title: 'Perfect match', body: 'The shade match was spot on — best foundation I\'ve found for my undertone.', photos: [], helpfulCount: 24, createdAt: new Date(Date.now() - 3 * 86400000).toISOString() },
  { id: 'rs2', author: 'Priya S.', rating: 4, title: 'Great coverage', body: 'Lasts all day and doesn\'t look cakey. Wish it had more shades in the deep range.', photos: [], helpfulCount: 11, createdAt: new Date(Date.now() - 9 * 86400000).toISOString() },
  { id: 'rs3', author: 'Jess M.', rating: 5, title: 'Holy grail', body: 'Repurchased three times now. The satin finish is unreal.', photos: [], helpfulCount: 7, createdAt: new Date(Date.now() - 20 * 86400000).toISOString() },
];

const SEED_BRANDS = [
  { id: 'fenty-beauty', name: 'Fenty Beauty', description: 'Inclusive beauty for all skin tones.' },
  { id: 'mac', name: 'MAC', description: 'Professional makeup artistry.' },
  { id: 'rare-beauty', name: 'Rare Beauty', description: 'Makeup made to feel good in.' },
  { id: 'charlotte-tilbury', name: 'Charlotte Tilbury', description: 'Red-carpet glamour.' },
];

const NOTIF_SEED = [
  { id: 'n1', icon: 'color-palette', bg: '#F5EAEF', color: '#753248', title: 'New shade match ready', body: 'We found 3 new foundations matching your tone.', time: '2h', read: false, route: '/(tabs)/match' },
  { id: 'n2', icon: 'book', bg: '#EAF7EF', color: '#2F7D52', title: 'Tutorial picked for you', body: '"The Glass Skin Method" matches your goals.', time: '5h', read: false, route: '/(tabs)/learn' },
  { id: 'n3', icon: 'sparkles', bg: '#EAF0FB', color: '#3B5BDB', title: 'Your recreation is done', body: 'Tap to see your personalised look breakdown.', time: '1d', read: false, route: '/(tabs)/recreate' },
  { id: 'n4', icon: 'diamond', bg: '#FBF1E6', color: '#A06A2C', title: 'Try DollFace Pro free', body: 'Unlock unlimited matches for 7 days, on us.', time: '2d', read: true, route: '/premium' },
];

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

  // ── CART ──────────────────────────────────────────────
  if (url === 'cart' && method === 'get') return ok(config, cartShape(await readJSON<MockCartItem[]>('mock_cart', [])));
  if (url === 'cart/items' && method === 'post') {
    const items = await readJSON<MockCartItem[]>('mock_cart', []);
    const ex = items.find(i => i.productId === body.productId && (i.shade ?? null) === (body.shade ?? null));
    if (ex) ex.qty += body.qty ?? 1;
    else items.push({ id: `ci_${Date.now()}`, productId: body.productId, name: body.name, brand: body.brand, price: body.price, shade: body.shade, img: body.img, qty: body.qty ?? 1 });
    await writeJSON('mock_cart', items);
    return ok(config, cartShape(items), 201);
  }
  if (/^cart\/items\/[^/]+$/.test(url) && method === 'patch') {
    const id = url.split('/')[2];
    let items = await readJSON<MockCartItem[]>('mock_cart', []);
    items = body.qty <= 0 ? items.filter(i => i.id !== id) : items.map(i => (i.id === id ? { ...i, qty: body.qty } : i));
    await writeJSON('mock_cart', items);
    return ok(config, cartShape(items));
  }
  if (/^cart\/items\/[^/]+$/.test(url) && method === 'delete') {
    const id = url.split('/')[2];
    const items = (await readJSON<MockCartItem[]>('mock_cart', [])).filter(i => i.id !== id);
    await writeJSON('mock_cart', items);
    return ok(config, cartShape(items));
  }
  if (url === 'cart' && method === 'delete') { await writeJSON('mock_cart', []); return ok(config, cartShape([])); }
  if (url === 'cart/coupon' && method === 'post') return ok(config, { applied: true, code: body.code });
  if (url === 'cart/estimate' && method === 'get') {
    const items = await readJSON<MockCartItem[]>('mock_cart', []);
    const subtotal = items.reduce((n, i) => n + i.price * i.qty, 0);
    const shipping = subtotal > 40 || subtotal === 0 ? 0 : 3.95;
    const tax = Math.round(subtotal * 0.2 * 100) / 100;
    return ok(config, { subtotal, discount: 0, shipping, tax, total: Math.round((subtotal + shipping + tax) * 100) / 100, currency: 'GBP' });
  }

  // ── CHECKOUT & ORDERS ─────────────────────────────────
  if (url === 'checkout/shipping-options' && method === 'get') return ok(config, [
    { id: 'standard', label: 'Standard (3–5 days)', price: 3.95, eta: '3–5 working days' },
    { id: 'express', label: 'Express (1–2 days)', price: 6.95, eta: '1–2 working days' },
    { id: 'free', label: 'Free over £40', price: 0, eta: '3–5 working days' },
  ]);
  if (url === 'checkout/session' && method === 'post') {
    const items = await readJSON<MockCartItem[]>('mock_cart', []);
    const subtotal = items.reduce((n, i) => n + i.price * i.qty, 0);
    const shipping = subtotal > 40 || subtotal === 0 ? 0 : 3.95;
    const total = Math.round((subtotal + shipping + subtotal * 0.2) * 100) / 100;
    return ok(config, { sessionId: `sess_${Date.now()}`, clientSecret: 'mock_secret', amount: total, currency: 'GBP' });
  }
  if (url === 'orders' && method === 'post') {
    const items = await readJSON<MockCartItem[]>('mock_cart', []);
    if (!items.length) fail(config, 'Your bag is empty', 400);
    const subtotal = items.reduce((n, i) => n + i.price * i.qty, 0);
    const shipping = subtotal > 40 ? 0 : 3.95;
    const tax = Math.round(subtotal * 0.2 * 100) / 100;
    const order = { id: `o_${Date.now()}`, status: 'PAID', subtotal, shipping, tax, total: Math.round((subtotal + shipping + tax) * 100) / 100, currency: 'GBP', createdAt: new Date().toISOString(), items: items.map(i => ({ ...i })) };
    const orders = await readJSON<any[]>('mock_orders', []);
    orders.unshift(order);
    await writeJSON('mock_orders', orders);
    await writeJSON('mock_cart', []);
    return ok(config, order, 201);
  }
  if (url === 'orders' && method === 'get') return ok(config, await readJSON('mock_orders', []));
  if (/^orders\/[^/]+\/tracking$/.test(url) && method === 'get') {
    const id = url.split('/')[1];
    return ok(config, { status: 'PAID', carrier: 'Royal Mail', trackingNo: `DF${id.slice(-8).toUpperCase()}`, steps: [{ label: 'Order placed', done: true }, { label: 'Preparing', done: true }, { label: 'Shipped', done: false }, { label: 'Delivered', done: false }] });
  }
  if (/^orders\/[^/]+\/cancel$/.test(url) && method === 'post') {
    const id = url.split('/')[1];
    const orders = (await readJSON<any[]>('mock_orders', [])).map(o => (o.id === id ? { ...o, status: 'CANCELLED' } : o));
    await writeJSON('mock_orders', orders);
    return ok(config, { status: 'CANCELLED' });
  }
  if (/^orders\/[^/]+\/reorder$/.test(url) && method === 'post') {
    const id = url.split('/')[1];
    const order = (await readJSON<any[]>('mock_orders', [])).find(o => o.id === id);
    if (order) {
      const cart = await readJSON<MockCartItem[]>('mock_cart', []);
      order.items.forEach((it: MockCartItem) => cart.push({ ...it, id: `ci_${Date.now()}_${Math.round(Math.random() * 1e6)}` }));
      await writeJSON('mock_cart', cart);
    }
    return ok(config, { reordered: true });
  }
  if (/^orders\/[^/]+$/.test(url) && method === 'get') {
    const order = (await readJSON<any[]>('mock_orders', [])).find(o => o.id === url.split('/')[1]);
    return order ? ok(config, order) : fail(config, 'Order not found', 404);
  }

  // ── ADDRESSES ─────────────────────────────────────────
  if (url === 'addresses' && method === 'get') return ok(config, await readJSON('mock_addresses', []));
  if (url === 'addresses' && method === 'post') {
    const list = await readJSON<any[]>('mock_addresses', []);
    const addr = { id: `a_${Date.now()}`, ...body, isDefault: body.isDefault || list.length === 0 };
    if (addr.isDefault) list.forEach(a => (a.isDefault = false));
    list.push(addr);
    await writeJSON('mock_addresses', list);
    return ok(config, addr, 201);
  }
  if (/^addresses\/[^/]+\/default$/.test(url) && method === 'post') {
    const id = url.split('/')[1];
    const list = (await readJSON<any[]>('mock_addresses', [])).map(a => ({ ...a, isDefault: a.id === id }));
    await writeJSON('mock_addresses', list);
    return ok(config, { isDefault: true });
  }
  if (/^addresses\/[^/]+$/.test(url) && (method === 'patch')) {
    const id = url.split('/')[1];
    const list = (await readJSON<any[]>('mock_addresses', [])).map(a => (a.id === id ? { ...a, ...body } : a));
    await writeJSON('mock_addresses', list);
    return ok(config, list.find(a => a.id === id));
  }
  if (/^addresses\/[^/]+$/.test(url) && method === 'delete') {
    const id = url.split('/')[1];
    await writeJSON('mock_addresses', (await readJSON<any[]>('mock_addresses', [])).filter(a => a.id !== id));
    return ok(config, { removed: true });
  }

  // ── PAYMENTS ──────────────────────────────────────────
  if (url === 'payments/methods' && method === 'get') return ok(config, await readJSON('mock_payments', []));
  if (url === 'payments/methods' && method === 'post') {
    const list = await readJSON<any[]>('mock_payments', []);
    const m = { id: `pm_${Date.now()}`, brand: body.brand ?? 'visa', last4: body.last4, expMonth: body.expMonth, expYear: body.expYear, isDefault: body.isDefault || list.length === 0 };
    if (m.isDefault) list.forEach(x => (x.isDefault = false));
    list.push(m);
    await writeJSON('mock_payments', list);
    return ok(config, m, 201);
  }
  if (/^payments\/methods\/[^/]+$/.test(url) && method === 'delete') {
    const id = url.split('/')[2];
    await writeJSON('mock_payments', (await readJSON<any[]>('mock_payments', [])).filter(m => m.id !== id));
    return ok(config, { removed: true });
  }

  // ── NOTIFICATIONS ─────────────────────────────────────
  if (url === 'notifications' && method === 'get') {
    let n = await readJSON<any[] | null>('mock_notifications', null);
    if (!n) { n = NOTIF_SEED; await writeJSON('mock_notifications', n); }
    return ok(config, n);
  }
  if (url === 'notifications/unread-count' && method === 'get') {
    const n = await readJSON<any[]>('mock_notifications', NOTIF_SEED);
    return ok(config, { count: n.filter(x => !x.read).length });
  }
  if (url === 'notifications/read-all' && method === 'post') {
    const n = (await readJSON<any[]>('mock_notifications', NOTIF_SEED)).map(x => ({ ...x, read: true }));
    await writeJSON('mock_notifications', n);
    return ok(config, { ok: true });
  }
  if (/^notifications\/[^/]+\/read$/.test(url) && method === 'post') {
    const id = url.split('/')[1];
    const n = (await readJSON<any[]>('mock_notifications', NOTIF_SEED)).map(x => (x.id === id ? { ...x, read: true } : x));
    await writeJSON('mock_notifications', n);
    return ok(config, { ok: true });
  }

  // ── REVIEWS ───────────────────────────────────────────
  if (/^products\/[^/]+\/reviews$/.test(url) && method === 'get') {
    const pid = url.split('/')[1];
    const all = await readJSON<Record<string, any[]>>('mock_reviews', {});
    return ok(config, all[pid] ?? SEED_REVIEWS);
  }
  if (/^products\/[^/]+\/reviews$/.test(url) && method === 'post') {
    const pid = url.split('/')[1];
    const all = await readJSON<Record<string, any[]>>('mock_reviews', {});
    const review = { id: `r_${Date.now()}`, author: 'You', rating: body.rating, title: body.title, body: body.body, photos: body.photos ?? [], helpfulCount: 0, createdAt: new Date().toISOString() };
    all[pid] = [review, ...(all[pid] ?? SEED_REVIEWS)];
    await writeJSON('mock_reviews', all);
    return ok(config, review, 201);
  }
  if (/^reviews\/[^/]+\/helpful$/.test(url) && method === 'post') return ok(config, { helpful: true });

  // ── BRANDS ────────────────────────────────────────────
  if (url === 'brands' && method === 'get') return ok(config, SEED_BRANDS);

  // ── FALLBACK ──────────────────────────────────────────
  // Any other endpoint returns an empty success so screens that
  // fetch optional data don't crash during local FE development.
  return ok(config, {});
};
