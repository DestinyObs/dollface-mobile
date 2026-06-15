/**
 * Domain types — the contract the app consumes from the backend.
 * Shapes mirror what the screens render; the mock (lib/mockApi.ts) and a real
 * backend must both return these under the `{ success, data }` envelope.
 */

export type Level = 'Easy' | 'Medium' | 'Hard';
export type TutorialLevel = 'Beginner' | 'Intermediate' | 'Advanced';

/* ── Home feed (/feed/home) ─────────────────────────────── */
export interface MatchedShadeSummary {
  name: string;
  product: string;
  matchPct: number;
  hex: string;
}
export interface TrendingLook {
  id: string;
  label: string;
  meta: string;
  level: Level;
  img: string;
}
export interface CourseProgress {
  id: string;
  title: string;
  meta: string;
  pct: number;
  img: string;
}
export interface HomeFeed {
  streak: number;
  matchedShade: MatchedShadeSummary | null;
  trendingLooks: TrendingLook[];
  continueLearning: CourseProgress[];
}

/* ── Tutorials (/tutorials) ─────────────────────────────── */
export interface TutorialSummary {
  id: string;
  title: string;
  cat: string;
  mins: string;
  level: TutorialLevel;
  views: string;
  img: string;
}
export interface FeaturedTutorial {
  id: string;
  eyebrow: string;
  title: string;
  meta: string;
  img: string;
}
export interface TutorialStep {
  title: string;
  description: string;
  tip: string;
}
export interface TutorialDetail {
  id: string;
  title: string;
  level: TutorialLevel;
  duration: string;
  views: string;
  description: string;
  img: string;
  steps: TutorialStep[];
}

/* ── Shade match (/match) ───────────────────────────────── */
export interface RecentMatch {
  id: string;
  name: string;
  brand: string;
  pct: string;
  color: string;
}
export interface MatchAlternative {
  brand: string;
  product: string;
  shade: string;
  hex: string;
  price: string;
}
export interface MatchResultItem {
  category: string;
  confidence: string;
  matchedShade: string;
  brand: string;
  product: string;
  hex: string;
  reason: string;
  alternatives: MatchAlternative[];
}
export interface MatchTone {
  label: string;
  sub: string;
  hex: string;
  confidence: string;
}
export interface MatchResult {
  id: string;
  tone: MatchTone;
  items: MatchResultItem[];
}

/* ── Recreate (/recreate) ───────────────────────────────── */
export interface RecreateProduct {
  name: string;
  brand: string;
  shade: string;
  price: string;
}
export interface RecreateSection {
  area: string;
  icon: string;
  label: string;
  description: string;
  technique: string;
  products: RecreateProduct[];
}
export interface Recreation {
  id: string;
  versions: string[];
  aiNote: string;
  sections: RecreateSection[];
}

/* ── Products (/products) ───────────────────────────────── */
export interface ProductSummary {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: string;
  rating: string;
  img: string;
}
export interface ProductShade {
  name: string;
  hex: string;
}
export interface ProductDetail {
  id: string;
  name: string;
  brand: string;
  price: number;
  img: string;
  rating: string;
  reviewCount: string;
  highlights: string[];
  description: string;
  shades: ProductShade[];
}

/* ── Subscription (/subscription) ───────────────────────── */
export interface Plan {
  id: string;
  name: string;
  price: string;
  unit: string;
  features: string[];
}
export interface SubscriptionState {
  plan: 'free' | 'pro';
  status: string;
  current: Plan;
  pro: Plan;
}

/* ── Account (/me) ──────────────────────────────────────── */
export interface MeStats {
  saved: string;
  done: string;
  matches: string;
}
export interface BeautyChip {
  label: string;
  sub: string;
}

/* ── History & routines ─────────────────────────────────── */
export interface MatchHistoryItem {
  id: string;
  name: string;
  brand: string;
  pct: string;
  color: string;
  date: string;
}
export interface ScanHistoryItem {
  id: string;
  tone: string;
  date: string;
  confidence: string;
}
export interface Routine {
  id: string;
  name: string;
  time: string;
  steps: string[];
}

/* ── Commerce (server-backed) ───────────────────────────── */
export interface ServerCartItem {
  id: string;
  productId?: string;
  name: string;
  brand: string;
  price: number;
  shade?: string;
  img?: string;
  qty: number;
}
export interface ServerCart {
  items: ServerCartItem[];
  count: number;
  subtotal: number;
}
export interface CartEstimate {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  currency: string;
}
export interface OrderItem {
  id: string;
  productId?: string;
  name: string;
  brand: string;
  price: number;
  shade?: string;
  img?: string;
  qty: number;
}
export interface Order {
  id: string;
  status: string;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  currency: string;
  trackingNo?: string;
  carrier?: string;
  createdAt: string;
  items: OrderItem[];
}
export interface Address {
  id: string;
  name: string;
  line1: string;
  line2?: string;
  city: string;
  region?: string;
  postcode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}
export interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}
export interface ShippingOption {
  id: string;
  label: string;
  price: number;
  eta: string;
}
export interface Brand {
  id: string;
  name: string;
  logo?: string;
  description?: string;
}
export interface Review {
  id: string;
  author: string;
  rating: number;
  title?: string;
  body: string;
  photos: string[];
  helpfulCount: number;
  createdAt: string;
}
export interface ServerNotification {
  id: string;
  icon: string;
  bg: string;
  color: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  route?: string;
}
