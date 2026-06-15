/**
 * React Query hooks — what the screens call. Thin wrappers over endpoints.ts
 * so screens stay declarative and caching/invalidation is centralised.
 */
import { useQuery, useMutation } from '@tanstack/react-query';
import { qk } from './keys';
import {
  feedApi, tutorialsApi, matchApi, recreateApi, productsApi,
  subscriptionApi, meApi, routinesApi,
} from './endpoints';

/* Home */
export const useHomeFeed = () => useQuery({ queryKey: qk.feed, queryFn: feedApi.home });

/* Tutorials */
export const useTutorials = (params?: { category?: string; search?: string }) =>
  useQuery({ queryKey: qk.tutorials(params), queryFn: () => tutorialsApi.list(params) });
export const useFeaturedTutorial = () => useQuery({ queryKey: qk.tutorialFeatured, queryFn: tutorialsApi.featured });
export const useTutorialCategories = () => useQuery({ queryKey: qk.tutorialCategories, queryFn: tutorialsApi.categories });
export const useTutorial = (id: string) => useQuery({ queryKey: qk.tutorial(id), queryFn: () => tutorialsApi.detail(id), enabled: !!id });

/* Match */
export const useRecentMatches = () => useQuery({ queryKey: qk.matchRecent, queryFn: matchApi.recent });
export const useMatchCategories = () => useQuery({ queryKey: qk.matchCategories, queryFn: matchApi.categories });
export const useMatchResult = (id: string) => useQuery({ queryKey: qk.match(id), queryFn: () => matchApi.result(id), enabled: !!id });
export const useMatchHistory = () => useQuery({ queryKey: qk.matchHistory, queryFn: matchApi.history });
export const useScanHistory = () => useQuery({ queryKey: qk.matchScans, queryFn: matchApi.scans });

/* Recreate */
export const useRecreation = (id: string) => useQuery({ queryKey: qk.recreation(id), queryFn: () => recreateApi.detail(id), enabled: !!id });

/* Products */
export const useProducts = (params?: { category?: string; search?: string }) =>
  useQuery({ queryKey: qk.products(params), queryFn: () => productsApi.list(params) });
export const useProductCategories = () => useQuery({ queryKey: qk.productCategories, queryFn: productsApi.categories });
export const useProduct = (id: string) => useQuery({ queryKey: qk.product(id), queryFn: () => productsApi.detail(id), enabled: !!id });

/* Subscription */
export const useSubscription = () => useQuery({ queryKey: qk.subscription, queryFn: subscriptionApi.current });

/* Account */
export const useMeStats = () => useQuery({ queryKey: qk.meStats, queryFn: meApi.stats });

/* Routines */
export const useRoutines = () => useQuery({ queryKey: qk.routines, queryFn: routinesApi.list });

/* Example mutation (selfie scan) — kept for completeness */
export const useSelfieMatch = () => useMutation({ mutationFn: (form: FormData) => matchApi.selfie(form) });
