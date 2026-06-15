import { create } from 'zustand';
import { loadJSON, saveJSON } from '@/lib/persist';

export interface SavedItem {
  id: string;
  title: string;
  subtitle?: string;
  img?: string;
}

type Collection = 'looks' | 'tutorials' | 'products';

interface SavedState {
  looks: SavedItem[];
  tutorials: SavedItem[];
  products: SavedItem[];
  hydrate: () => Promise<void>;
  isSaved: (c: Collection, id: string) => boolean;
  toggle: (c: Collection, item: SavedItem) => boolean;
}

const KEY = 'saved';

export const useSavedStore = create<SavedState>((set, get) => ({
  looks: [],
  tutorials: [],
  products: [],
  hydrate: async () => {
    const data = await loadJSON<{ looks: SavedItem[]; tutorials: SavedItem[]; products: SavedItem[] }>(KEY, { looks: [], tutorials: [], products: [] });
    set({ looks: data.looks ?? [], tutorials: data.tutorials ?? [], products: data.products ?? [] });
  },
  isSaved: (c, id) => get()[c].some((i) => i.id === id),
  toggle: (c, item) => {
    const exists = get()[c].some((i) => i.id === item.id);
    set((s) => ({ [c]: exists ? s[c].filter((i) => i.id !== item.id) : [item, ...s[c]] }) as any);
    const { looks, tutorials, products } = get();
    saveJSON(KEY, { looks, tutorials, products });
    return !exists;
  },
}));
