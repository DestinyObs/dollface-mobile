import type { ServerCartItem } from '@/lib/data/types';

/** Pure cart calculations (kept separate so they're trivially testable). */
export const cartCount = (items: ServerCartItem[]): number =>
  items.reduce((n, i) => n + i.qty, 0);

export const cartSubtotal = (items: ServerCartItem[]): number =>
  items.reduce((n, i) => n + i.price * i.qty, 0);
