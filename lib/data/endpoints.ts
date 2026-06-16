/**
 * Typed endpoint client — the app's view of the backend, grouped by domain to
 * mirror dollface-backend/API_SPEC.md.
 *
 * Everything flows through `http` (lib/data/request.ts), which unwraps the
 * `{ success, data }` envelope and talks to the real backend at
 * EXPO_PUBLIC_API_URL.
 */
import { http } from './request';
import type {
  HomeFeed, TutorialSummary, FeaturedTutorial, TutorialDetail, RecentMatch,
  MatchResult, Recreation, ProductSummary, ProductDetail, SubscriptionState,
  Plan, MeStats, MatchHistoryItem, ScanHistoryItem, Routine,
  ServerCart, ServerCartItem, CartEstimate, Order, Address, PaymentMethod,
  ShippingOption, Brand, Review, ServerNotification,
} from './types';

/* ── 3.23 Home feed ─────────────────────────────────────── */
export const feedApi = {
  home: () => http.get<HomeFeed>('/feed/home'),
};

/* ── 3.8 Tutorials & learning ───────────────────────────── */
export const tutorialsApi = {
  list: (params?: { category?: string; level?: string; search?: string }) => http.get<TutorialSummary[]>('/tutorials', params),
  featured: () => http.get<FeaturedTutorial>('/tutorials/featured'),
  categories: () => http.get<string[]>('/tutorials/categories'),
  detail: (id: string) => http.get<TutorialDetail>(`/tutorials/${id}`),
  save: (id: string) => http.post<{ saved: boolean }>(`/tutorials/${id}/save`),
  unsave: (id: string) => http.del<{ saved: boolean }>(`/tutorials/${id}/save`),
  saved: () => http.get<TutorialSummary[]>('/tutorials/saved'),
  complete: (id: string) => http.post<{ ok: true }>(`/tutorials/${id}/complete`),
};

/* ── 3.5 Shade match ────────────────────────────────────── */
export const matchApi = {
  selfie: (form: FormData) => http.postForm<MatchResult>('/match/selfie', form),
  manual: (body: { shade: string; brand?: string; category: string }) => http.post<MatchResult>('/match/manual', body),
  result: (id: string) => http.get<MatchResult>(`/match/${id}`),
  recent: () => http.get<RecentMatch[]>('/match/recent'),
  categories: () => http.get<string[]>('/match/categories'),
  history: () => http.get<MatchHistoryItem[]>('/match/history'),
  scans: () => http.get<ScanHistoryItem[]>('/match/scans'),
  save: (id: string) => http.post<{ saved: boolean }>(`/match/${id}/save`),
};

/* ── 3.7 Recreate / look analysis ───────────────────────── */
export const recreateApi = {
  upload: (form: FormData) => http.postForm<{ id: string; status: string }>('/recreate/upload', form),
  status: (id: string) => http.get<{ id: string; status: string }>(`/recreate/${id}/status`),
  detail: (id: string) => http.get<Recreation>(`/recreate/${id}`),
  save: (id: string) => http.post<{ saved: boolean }>(`/recreate/${id}/save`),
  history: () => http.get<Recreation[]>('/recreate/history'),
};

/* ── Devices / push registration ────────────────────────── */
export const devicesApi = {
  register: (body: { expoPushToken: string; platform: 'ios' | 'android' | 'web'; appVersion?: string }) =>
    http.post<{ id: string; registered: boolean }>('/devices', body),
  unregister: (token: string) => http.del<{ unregistered: boolean }>(`/devices/${encodeURIComponent(token)}`),
  testPush: () => http.post<{ sent: number }>('/devices/test-push', {}),
};

/* ── 3.9 Products / catalog ─────────────────────────────── */
export const productsApi = {
  list: (params?: { category?: string; search?: string }) => http.get<ProductSummary[]>('/products', params),
  categories: () => http.get<string[]>('/products/categories'),
  detail: (id: string) => http.get<ProductDetail>(`/products/${id}`),
};

/* ── 3.17 Subscription & billing ────────────────────────── */
export const subscriptionApi = {
  current: () => http.get<SubscriptionState>('/subscription'),
  plans: () => http.get<Plan[]>('/subscription/plans'),
  checkout: (planId: string) => http.post<{ status: string }>('/subscription/checkout', { planId }),
};

/* ── 3.2 / 3.4 Account & beauty profile ─────────────────── */
export const meApi = {
  stats: () => http.get<MeStats>('/me/stats'),
  update: (body: { name?: string; bio?: string; avatarUrl?: string }) => http.patch<{ id: string; name: string; email: string; avatarUrl?: string; bio?: string }>('/me', body),
};

export interface UserSettings {
  push: boolean;
  email: boolean;
  tips: boolean;
  analytics: boolean;
  personalisation: boolean;
  storeScans: boolean;
}
export const settingsApi = {
  get: () => http.get<UserSettings>('/me/settings'),
  update: (body: Partial<UserSettings>) => http.patch<UserSettings>('/me/settings', body),
};

/* ── 3.22 Search ────────────────────────────────────────── */
export interface SearchResults {
  products: import('./types').ProductSummary[];
  tutorials: import('./types').TutorialSummary[];
  looks: import('./types').TrendingLook[];
  brands: { id: string; name: string; logo?: string }[];
}
export const searchApi = {
  global: (q: string) => http.get<SearchResults>('/search', { q }),
};

/* ── 3.1 Social auth ────────────────────────────────────── */
export const authApi = {
  social: (provider: 'google' | 'apple', idToken: string) =>
    http.post<{ user: import('@/types/auth').User; tokens: import('@/types/auth').AuthTokens; isNewUser: boolean }>(`/auth/social/${provider}`, { idToken }),
  verifyEmail: (code: string) => http.post<{ verified: boolean }>('/auth/email/verify', { code }),
  resendEmailCode: () => http.post<{ sent: boolean; devCode?: string }>('/auth/email/resend', {}),
};

export const beautyProfileApi = {
  get: () => http.get<unknown>('/beauty-profile'),
  upsert: (profile: unknown) => http.put<unknown>('/beauty-profile', profile),
  patch: (partial: unknown) => http.patch<unknown>('/beauty-profile', partial),
  complete: () => http.post<{ onboardingComplete: true }>('/beauty-profile/complete'),
};

/* ── 3.21 Routines ──────────────────────────────────────── */
export const routinesApi = {
  list: () => http.get<Routine[]>('/routines'),
};

/* ── 3.13 Cart (server-backed) ──────────────────────────── */
export const cartApi = {
  get: () => http.get<ServerCart>('/cart'),
  addItem: (item: Omit<ServerCartItem, 'id'>) => http.post<ServerCart>('/cart/items', item),
  setQty: (id: string, qty: number) => http.patch<ServerCart>(`/cart/items/${id}`, { qty }),
  remove: (id: string) => http.del<ServerCart>(`/cart/items/${id}`),
  clear: () => http.del<ServerCart>('/cart'),
  applyCoupon: (code: string) => http.post<{ applied: boolean; code: string }>('/cart/coupon', { code }),
  estimate: () => http.get<CartEstimate>('/cart/estimate'),
};

/* ── 3.15 Checkout & orders ─────────────────────────────── */
export const ordersApi = {
  shippingOptions: () => http.get<ShippingOption[]>('/checkout/shipping-options'),
  checkoutSession: () => http.post<{ sessionId: string; clientSecret: string; amount: number; currency: string }>('/checkout/session'),
  place: (addressId?: string) => http.post<Order>('/orders', { addressId }),
  list: () => http.get<Order[]>('/orders'),
  detail: (id: string) => http.get<Order>(`/orders/${id}`),
  tracking: (id: string) => http.get<{ status: string; carrier: string; trackingNo: string; steps: { label: string; done: boolean }[] }>(`/orders/${id}/tracking`),
  cancel: (id: string) => http.post<{ status: string }>(`/orders/${id}/cancel`),
  reorder: (id: string) => http.post<{ reordered: boolean }>(`/orders/${id}/reorder`),
};

/* ── 3.14 Addresses ─────────────────────────────────────── */
export const addressesApi = {
  list: () => http.get<Address[]>('/addresses'),
  create: (body: Omit<Address, 'id' | 'isDefault'> & { isDefault?: boolean }) => http.post<Address>('/addresses', body),
  update: (id: string, body: Partial<Address>) => http.patch<Address>(`/addresses/${id}`, body),
  remove: (id: string) => http.del<{ removed: boolean }>(`/addresses/${id}`),
  setDefault: (id: string) => http.post<{ isDefault: boolean }>(`/addresses/${id}/default`),
};

/* ── 3.16 Payments ──────────────────────────────────────── */
export const paymentsApi = {
  methods: () => http.get<PaymentMethod[]>('/payments/methods'),
  addMethod: (body: { brand?: string; last4: string; expMonth: number; expYear: number; isDefault?: boolean }) => http.post<PaymentMethod>('/payments/methods', body),
  removeMethod: (id: string) => http.del<{ removed: boolean }>(`/payments/methods/${id}`),
  setDefault: (id: string) => http.post<{ isDefault: boolean }>(`/payments/methods/${id}/default`),
};

/* ── 3.10 Brands ────────────────────────────────────────── */
export const brandsApi = {
  list: () => http.get<Brand[]>('/brands'),
  detail: (id: string) => http.get<Brand & { products: ProductSummary[] }>(`/brands/${id}`),
};

/* ── 3.11 Reviews & Q&A ─────────────────────────────────── */
export const reviewsApi = {
  list: (productId: string, sort: 'recent' | 'helpful' = 'recent') => http.get<Review[]>(`/products/${productId}/reviews`, { sort }),
  create: (productId: string, body: { rating: number; title?: string; body: string; photos?: string[] }) => http.post<Review>(`/products/${productId}/reviews`, body),
  helpful: (reviewId: string) => http.post<{ helpful: boolean }>(`/reviews/${reviewId}/helpful`),
};

/* ── 3.19 Notifications (server-backed) ─────────────────── */
export const notificationsApi = {
  list: () => http.get<ServerNotification[]>('/notifications'),
  unreadCount: () => http.get<{ count: number }>('/notifications/unread-count'),
  markRead: (id: string) => http.post<{ ok: true }>(`/notifications/${id}/read`),
  markAllRead: () => http.post<{ ok: true }>('/notifications/read-all'),
};

/* ── 3.12 Saved (server-backed) ─────────────────────────── */
export const savedApi = {
  looks: () => http.get<{ id: string; title: string; subtitle?: string; img?: string }[]>('/saved/looks'),
  saveLook: (item: { id: string; title: string; subtitle?: string; img?: string }) => http.post('/saved/looks', item),
  removeLook: (id: string) => http.del(`/saved/looks/${id}`),
  savedProducts: () => http.get<ProductSummary[]>('/products/saved'),
  saveProduct: (id: string) => http.post(`/products/${id}/save`),
  unsaveProduct: (id: string) => http.del(`/products/${id}/save`),
  savedTutorials: () => http.get<TutorialSummary[]>('/tutorials/saved'),
  saveTutorial: (id: string) => http.post(`/tutorials/${id}/save`),
  unsaveTutorial: (id: string) => http.del(`/tutorials/${id}/save`),
};
