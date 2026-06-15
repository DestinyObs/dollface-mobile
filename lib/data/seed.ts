/**
 * Seed data — the canonical mock content served by lib/mockApi.ts.
 * Relocated out of the screens so there is one source of truth and the screens
 * fetch it through the data layer exactly as they will against a real backend.
 */
import { Img } from '@/constants/images';
import type {
  HomeFeed, TutorialSummary, FeaturedTutorial, TutorialDetail,
  RecentMatch, MatchResult, Recreation, ProductSummary, ProductDetail,
  SubscriptionState, MeStats, BeautyChip, MatchHistoryItem, ScanHistoryItem,
  Routine,
} from './types';

/* ── Home ───────────────────────────────────────────────── */
export const HOME_FEED: HomeFeed = {
  streak: 12,
  matchedShade: { name: 'Warm Ivory 2.0', product: 'NARS Light Reflecting · 92% match', matchPct: 92, hex: '#E8C9A8' },
  trendingLooks: [
    { id: 'soft-glam', label: 'Soft Glam', meta: '2.4k saves', level: 'Easy', img: Img.looks.softGlam },
    { id: 'glass-skin', label: 'Glass Skin', meta: '1.9k saves', level: 'Medium', img: Img.looks.glassSkin },
    { id: 'bold-lip', label: 'Bold Lip', meta: '3.1k saves', level: 'Easy', img: Img.looks.boldLip },
    { id: 'bronzed', label: 'Bronzed', meta: '1.2k saves', level: 'Medium', img: Img.looks.bronzed },
  ],
  continueLearning: [
    { id: '1', title: 'Foundation Basics', meta: '8 min left', pct: 60, img: Img.tutorials.foundation },
    { id: '3', title: 'Winged Liner Master', meta: '12 min left', pct: 25, img: Img.tutorials.smokyEye },
  ],
};

/* ── Tutorials ──────────────────────────────────────────── */
export const TUTORIAL_CATEGORIES = ['All', 'Base', 'Eyes', 'Lips', 'Brows', 'Cheeks'];

export const TUTORIALS: TutorialSummary[] = [
  { id: '1', title: 'Beginner Foundation Routine', cat: 'Base', mins: '12 min', level: 'Beginner', views: '24k', img: Img.tutorials.foundation },
  { id: '2', title: 'Fluffy Natural Brows', cat: 'Brows', mins: '8 min', level: 'Beginner', views: '18k', img: Img.tutorials.brows },
  { id: '3', title: 'Soft Smoky Eye, Deep Tones', cat: 'Eyes', mins: '18 min', level: 'Intermediate', views: '31k', img: Img.tutorials.smokyEye },
  { id: '4', title: 'The Glass Skin Method', cat: 'Base', mins: '15 min', level: 'Intermediate', views: '42k', img: Img.tutorials.glassBase },
  { id: '5', title: 'Bold Cut-Crease', cat: 'Eyes', mins: '22 min', level: 'Advanced', views: '12k', img: Img.tutorials.cutCrease },
];

export const FEATURED_TUTORIAL: FeaturedTutorial = {
  id: '1', eyebrow: "THIS WEEK'S PICK", title: 'Shade Matching Masterclass',
  meta: 'AI-guided · All levels · 20 min', img: Img.heroLook,
};

const TUTORIAL_DETAIL: TutorialDetail = {
  id: '1', title: 'Beginner Foundation Routine', level: 'Beginner', duration: '12 min', views: '24k',
  description: 'A step-by-step guide to applying foundation that looks natural, lasts all day, and works for your skin tone and type.',
  img: Img.tutorials.foundation,
  steps: [
    { title: 'Prep your skin', description: 'Start with clean, moisturised skin. Apply a primer suited for your skin type — mattifying for oily, hydrating for dry.', tip: 'Wait 2 minutes after primer before applying foundation.' },
    { title: 'Choose your tool', description: 'A damp beauty sponge gives the most natural finish. A brush builds more coverage. Fingers give a sheer, skin-like look.', tip: "Always dampen your sponge so it doesn't absorb the product." },
    { title: 'Apply foundation', description: 'Start at the centre of your face and blend outward with gentle pressing motions, not dragging.', tip: 'Less is more — build up in thin layers.' },
    { title: 'Blend the edges', description: 'Check your jawline, hairline and neck. Blend until there are no visible lines.', tip: 'Use a clean sponge edge to soften harsh lines.' },
  ],
};

export function tutorialDetail(id: string): TutorialDetail {
  const summary = TUTORIALS.find(t => t.id === id);
  if (!summary) return TUTORIAL_DETAIL;
  return { ...TUTORIAL_DETAIL, id: summary.id, title: summary.title, level: summary.level, duration: summary.mins, views: summary.views, img: summary.img };
}

/* ── Match ──────────────────────────────────────────────── */
export const RECENT_MATCHES: RecentMatch[] = [
  { id: 'm1', name: 'Warm Ivory 2.0', brand: 'NARS', pct: '92%', color: '#E8C9A8' },
  { id: 'm2', name: 'Honey Beige', brand: 'Fenty', pct: '88%', color: '#D2A878' },
  { id: 'm3', name: 'Golden Sand', brand: 'MAC', pct: '85%', color: '#C99B68' },
];

export const MATCH_CATEGORIES = ['Foundation', 'Concealer', 'Powder', 'Blush', 'Bronzer', 'Lip'];

export const MATCH_RESULT: MatchResult = {
  id: 'mock-result-id',
  tone: { label: 'Medium Tan · Warm Golden', sub: 'Based on your selfie analysis', hex: '#C4875A', confidence: 'High confidence match' },
  items: [
    {
      category: 'Foundation', confidence: 'High', matchedShade: '220 Natural Beige', brand: 'Fenty Beauty',
      product: "Pro Filt'r Soft Matte", hex: '#C4875A',
      reason: "Matched to your medium-tan tone with warm golden undertones across Fenty's inclusive range.",
      alternatives: [
        { brand: 'MAC', product: 'Studio Fix Fluid', shade: 'NC40', hex: '#C48558', price: '£29' },
        { brand: 'NYX', product: "Can't Stop Won't Stop", shade: 'Warm Caramel', hex: '#C28050', price: '£13' },
      ],
    },
    {
      category: 'Concealer', confidence: 'High', matchedShade: '320W', brand: 'Fenty Beauty',
      product: "Pro Filt'r Instant Retouch", hex: '#CAA070',
      reason: 'One shade lighter than your foundation to brighten under-eye coverage.',
      alternatives: [
        { brand: 'Charlotte Tilbury', product: 'Magic Away', shade: '8 Medium', hex: '#C89A60', price: '£28' },
      ],
    },
  ],
};

/* ── Recreate ───────────────────────────────────────────── */
export const RECREATION: Recreation = {
  id: 'mock-recreation-id',
  versions: ['Your Version', 'Beginner', 'Budget'],
  aiNote: 'This version adapts the look for your medium-tan skin tone and warm undertone. All shades re-matched to your profile.',
  sections: [
    { area: 'BASE', icon: 'sparkles-outline', label: 'Base Makeup', description: 'Full-coverage foundation blended seamlessly for a glass-skin effect.', technique: 'Apply with a damp beauty sponge using pressing motions for seamless coverage.', products: [{ name: "Pro Filt'r Soft Matte", brand: 'Fenty Beauty', shade: '220N', price: '£34' }, { name: 'Instant Retouch Concealer', brand: 'Fenty Beauty', shade: '320W', price: '£27' }] },
    { area: 'BROWS', icon: 'pencil-outline', label: 'Brows', description: 'Full, defined brows with a slightly arched shape. Focus definition at the tail.', technique: 'Use feathery strokes to mimic natural hairs. Brush up and set with clear gel.', products: [{ name: 'Gimme Brow+', brand: 'Benefit', shade: '4', price: '£26' }] },
    { area: 'EYES', icon: 'eye-outline', label: 'Eye Look', description: 'Soft brown smoky eye with warm copper in the crease and black liner.', technique: 'Blend matte brown in the crease first, build depth with copper on the lid.', products: [{ name: 'Naked3 Palette', brand: 'Urban Decay', shade: 'Various', price: '£41' }] },
    { area: 'CHEEKS', icon: 'flower-outline', label: 'Cheeks', description: 'Warm bronzer sculpted along the cheekbones. Peachy-pink blush on the apples.', technique: 'Bronzer in a 3-shape from temples to jaw. Blush on apples blended upward.', products: [{ name: 'Hoola Bronzer', brand: 'Benefit', shade: 'Medium', price: '£30' }] },
    { area: 'LIPS', icon: 'heart-outline', label: 'Lips', description: 'Nude-mauve liner with a satin lipstick slightly overlined for fullness.', technique: "Slightly overline the cupid's bow. Fill with liner before applying lipstick.", products: [{ name: 'Lip Cheat Liner', brand: 'Charlotte Tilbury', shade: 'Pillowtalk', price: '£19' }] },
  ],
};

/* ── Products ───────────────────────────────────────────── */
export const PRODUCT_CATEGORIES = ['All', 'Foundation', 'Concealer', 'Blush', 'Bronzer', 'Lips', 'Primer'];

export const PRODUCTS: ProductSummary[] = [
  { id: '1', name: "Pro Filt'r Soft Matte Foundation", brand: 'Fenty Beauty', category: 'Foundation', price: '£34', rating: '4.8', img: Img.products.a },
  { id: '2', name: 'Studio Fix Fluid SPF15', brand: 'MAC', category: 'Foundation', price: '£31', rating: '4.6', img: Img.products.b },
  { id: '3', name: 'Fit Me Matte + Poreless', brand: 'Maybelline', category: 'Foundation', price: '£10', rating: '4.5', img: Img.products.c },
  { id: '4', name: 'Soft Pinch Liquid Blush', brand: 'Rare Beauty', category: 'Blush', price: '£22', rating: '4.9', img: Img.products.d },
  { id: '5', name: 'Hoola Matte Bronzer', brand: 'Benefit', category: 'Bronzer', price: '£30', rating: '4.7', img: Img.products.a },
  { id: '6', name: 'Pillow Talk Lipstick', brand: 'Charlotte Tilbury', category: 'Lips', price: '£30', rating: '4.8', img: Img.products.b },
];

const PRODUCT_DETAIL_BASE: ProductDetail = {
  id: '1', name: "Pro Filt'r Soft Matte Foundation", brand: 'Fenty Beauty', price: 34, img: Img.products.a,
  rating: '4.8', reviewCount: '2.4k reviews',
  highlights: ['Full coverage', 'Soft matte', 'Oil-free', '50 shades'],
  description: 'A full-coverage, oil-free liquid foundation with a soft matte finish. Builds to full coverage without looking heavy, in 50 inclusive shades.',
  shades: [
    { name: 'Light Ivory', hex: '#F5DCBB' }, { name: '150W', hex: '#E8C49A' },
    { name: '210W', hex: '#D4A070' }, { name: '220N', hex: '#C4875A' },
    { name: '320W', hex: '#B0703A' }, { name: '420W', hex: '#8C5020' },
    { name: '490W', hex: '#5C2C08' },
  ],
};

export function productDetail(id: string): ProductDetail {
  const summary = PRODUCTS.find(p => p.id === id);
  if (!summary) return PRODUCT_DETAIL_BASE;
  return { ...PRODUCT_DETAIL_BASE, id: summary.id, name: summary.name, brand: summary.brand, price: parseFloat(summary.price.replace('£', '')), img: summary.img, rating: summary.rating };
}

/* ── Subscription ───────────────────────────────────────── */
export const SUBSCRIPTION: SubscriptionState = {
  plan: 'free',
  status: 'Active',
  current: { id: 'free', name: 'Free', price: '£0', unit: '', features: ['3 shade matches per day', '2 look recreations per day', 'Beginner tutorials'] },
  pro: { id: 'pro', name: 'DollFace Pro', price: '£49.99', unit: '/ year', features: ['Unlimited shade matching', 'Unlimited recreations', 'Full tutorial library', 'AI beauty advisor', 'Ad-free experience'] },
};

/* ── Account ────────────────────────────────────────────── */
export const ME_STATS: MeStats = { saved: '12', done: '4', matches: '3' };

export const BEAUTY_CHIPS: BeautyChip[] = [
  { label: 'Warm Ivory', sub: 'Shade' },
  { label: 'Neutral', sub: 'Undertone' },
  { label: 'Combination', sub: 'Skin type' },
];

/* ── History & routines (seeded so the populated UI is exercised) ── */
export const MATCH_HISTORY: MatchHistoryItem[] = [
  { id: 'm1', name: 'Warm Ivory 2.0', brand: 'NARS', pct: '92%', color: '#E8C9A8', date: 'Today' },
  { id: 'm2', name: 'Honey Beige', brand: 'Fenty', pct: '88%', color: '#D2A878', date: '3 days ago' },
  { id: 'm3', name: 'Golden Sand', brand: 'MAC', pct: '85%', color: '#C99B68', date: 'Last week' },
];

export const SCAN_HISTORY: ScanHistoryItem[] = [
  { id: 's1', tone: 'Medium Tan · Warm Golden', date: 'Today', confidence: 'High' },
  { id: 's2', tone: 'Medium · Neutral', date: 'Last week', confidence: 'Medium' },
];

export const ROUTINES: Routine[] = [
  { id: 'am', name: 'Morning Glow', time: '7:30 AM', steps: ['Cleanse', 'Primer', 'Foundation', 'Blush', 'Setting spray'] },
  { id: 'pm', name: 'Evening Reset', time: '9:00 PM', steps: ['Remove makeup', 'Cleanse', 'Serum', 'Moisturise'] },
];
