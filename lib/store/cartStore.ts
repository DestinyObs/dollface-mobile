import { create } from 'zustand';
import { loadJSON, saveJSON } from '@/lib/persist';
import { cartApi } from '@/lib/data/endpoints';
import { cartCount, cartSubtotal } from '@/lib/cartMath';
import type { ServerCartItem } from '@/lib/data/types';

/**
 * Server-backed cart. Mutations update local state optimistically, then
 * reconcile against the API response (the source of truth). Falls back to a
 * persisted offline cache when the network/API is unavailable.
 */
export type CartItem = ServerCartItem;

interface AddInput { id: string; name: string; brand: string; price: number; shade?: string; img?: string }

interface CartState {
  items: ServerCartItem[];
  hydrate: () => Promise<void>;
  add: (item: AddInput) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  count: () => number;
  subtotal: () => number;
}

const KEY = 'cart';
const cache = (items: ServerCartItem[]) => saveJSON(KEY, items);

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  hydrate: async () => {
    try {
      const cart = await cartApi.get();
      set({ items: cart.items });
      cache(cart.items);
    } catch {
      set({ items: await loadJSON<ServerCartItem[]>(KEY, []) });
    }
  },

  add: (item) => {
    const match = get().items.find(i => i.productId === item.id && (i.shade ?? undefined) === item.shade);
    const items = match
      ? get().items.map(i => (i === match ? { ...i, qty: i.qty + 1 } : i))
      : [...get().items, { id: `tmp_${Date.now()}`, productId: item.id, name: item.name, brand: item.brand, price: item.price, shade: item.shade, img: item.img, qty: 1 }];
    set({ items });
    cache(items);
    cartApi.addItem({ productId: item.id, name: item.name, brand: item.brand, price: item.price, shade: item.shade, img: item.img, qty: 1 })
      .then(c => { set({ items: c.items }); cache(c.items); })
      .catch(() => {});
  },

  remove: (id) => {
    const items = get().items.filter(i => i.id !== id);
    set({ items });
    cache(items);
    cartApi.remove(id).then(c => { set({ items: c.items }); cache(c.items); }).catch(() => {});
  },

  setQty: (id, qty) => {
    const items = qty <= 0 ? get().items.filter(i => i.id !== id) : get().items.map(i => (i.id === id ? { ...i, qty } : i));
    set({ items });
    cache(items);
    cartApi.setQty(id, qty).then(c => { set({ items: c.items }); cache(c.items); }).catch(() => {});
  },

  clear: () => {
    set({ items: [] });
    cache([]);
    cartApi.clear().catch(() => {});
  },

  count: () => cartCount(get().items),
  subtotal: () => cartSubtotal(get().items),
}));
