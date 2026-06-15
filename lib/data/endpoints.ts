/**
 * Typed endpoint client — the app's view of the backend, grouped by domain to
 * mirror dollface-backend/API_SPEC.md. Functions used by the current screens
 * are wired now (phase M); later-phase domains are stubbed with the right path
 * + types so they slot in as the backend grows, without changing call sites.
 *
 * Everything flows through `http` (lib/data/request.ts), which unwraps the
 * `{ success, data }` envelope. Swap mock → real backend by setting
 * EXPO_PUBLIC_API_URL — no call-site changes.
 */
import { http } from './request';
import type {
  HomeFeed, TutorialSummary, FeaturedTutorial, TutorialDetail, RecentMatch,
  MatchResult, Recreation, ProductSummary, ProductDetail, SubscriptionState,
  Plan, MeStats, MatchHistoryItem, ScanHistoryItem, Routine,
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
  selfie: (form: FormData) => http.post<MatchResult>('/match/selfie', form),
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
  upload: (form: FormData) => http.post<{ id: string; status: string }>('/recreate/upload', form),
  status: (id: string) => http.get<{ id: string; status: string }>(`/recreate/${id}/status`),
  detail: (id: string) => http.get<Recreation>(`/recreate/${id}`),
  save: (id: string) => http.post<{ saved: boolean }>(`/recreate/${id}/save`),
  history: () => http.get<Recreation[]>('/recreate/history'),
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
