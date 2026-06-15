import { create } from 'zustand';
import { loadJSON, saveJSON } from '@/lib/persist';

export interface CartItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  shade?: string;
  img?: string;
  qty: number;
}

interface CartState {
  items: CartItem[];
  hydrate: () => Promise<void>;
  add: (item: Omit<CartItem, 'qty'>) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  count: () => number;
  subtotal: () => number;
}

const KEY = 'cart';
const persist = (items: CartItem[]) => saveJSON(KEY, items);

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  hydrate: async () => set({ items: await loadJSON<CartItem[]>(KEY, []) }),
  add: (item) =>
    set((s) => {
      const existing = s.items.find((i) => i.id === item.id);
      const items = existing
        ? s.items.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i))
        : [...s.items, { ...item, qty: 1 }];
      persist(items);
      return { items };
    }),
  remove: (id) =>
    set((s) => {
      const items = s.items.filter((i) => i.id !== id);
      persist(items);
      return { items };
    }),
  setQty: (id, qty) =>
    set((s) => {
      const items = qty <= 0 ? s.items.filter((i) => i.id !== id) : s.items.map((i) => (i.id === id ? { ...i, qty } : i));
      persist(items);
      return { items };
    }),
  clear: () => { persist([]); set({ items: [] }); },
  count: () => get().items.reduce((n, i) => n + i.qty, 0),
  subtotal: () => get().items.reduce((n, i) => n + i.price * i.qty, 0),
}));
