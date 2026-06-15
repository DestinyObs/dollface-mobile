/**
 * React Query cache keys — one place so invalidation stays consistent.
 */
export const qk = {
  feed: ['feed', 'home'] as const,

  tutorials: (params?: Record<string, unknown>) => ['tutorials', params ?? {}] as const,
  tutorialCategories: ['tutorials', 'categories'] as const,
  tutorialFeatured: ['tutorials', 'featured'] as const,
  tutorial: (id: string) => ['tutorials', id] as const,

  matchRecent: ['match', 'recent'] as const,
  matchCategories: ['match', 'categories'] as const,
  match: (id: string) => ['match', id] as const,
  matchHistory: ['match', 'history'] as const,
  matchScans: ['match', 'scans'] as const,

  recreation: (id: string) => ['recreate', id] as const,
  recreateHistory: ['recreate', 'history'] as const,

  products: (params?: Record<string, unknown>) => ['products', params ?? {}] as const,
  productCategories: ['products', 'categories'] as const,
  product: (id: string) => ['products', id] as const,

  subscription: ['subscription'] as const,
  plans: ['subscription', 'plans'] as const,

  me: ['me'] as const,
  meStats: ['me', 'stats'] as const,
  beautyProfile: ['beauty-profile'] as const,

  routines: ['routines'] as const,
  notifications: ['notifications'] as const,
};
