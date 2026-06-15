import { create } from 'zustand';
import { loadJSON, saveJSON } from '@/lib/persist';
import { savedApi } from '@/lib/data/endpoints';

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

/**
 * Server-backed saved collections (looks / tutorials / products). Hydrates from
 * the API (falls back to local cache offline); toggles update optimistically
 * and sync to the matching backend endpoint.
 */
export const useSavedStore = create<SavedState>((set, get) => ({
  looks: [],
  tutorials: [],
  products: [],

  hydrate: async () => {
    try {
      const [looks, tutorials, products] = await Promise.all([
        savedApi.looks(),
        savedApi.savedTutorials(),
        savedApi.savedProducts(),
      ]);
      const data = {
        looks: looks.map((l) => ({ id: l.id, title: l.title, subtitle: l.subtitle, img: l.img })),
        tutorials: tutorials.map((t) => ({ id: t.id, title: t.title, subtitle: `${t.level} · ${t.mins}`, img: t.img })),
        products: products.map((p) => ({ id: p.id, title: p.name, subtitle: p.brand, img: p.img })),
      };
      set(data);
      saveJSON(KEY, data);
    } catch {
      const data = await loadJSON<{ looks: SavedItem[]; tutorials: SavedItem[]; products: SavedItem[] }>(KEY, { looks: [], tutorials: [], products: [] });
      set({ looks: data.looks ?? [], tutorials: data.tutorials ?? [], products: data.products ?? [] });
    }
  },

  isSaved: (c, id) => get()[c].some((i) => i.id === id),

  toggle: (c, item) => {
    const exists = get()[c].some((i) => i.id === item.id);
    set((s) => ({ [c]: exists ? s[c].filter((i) => i.id !== item.id) : [item, ...s[c]] }) as any);
    const { looks, tutorials, products } = get();
    saveJSON(KEY, { looks, tutorials, products });

    // Sync to the matching backend endpoint (best-effort).
    if (c === 'looks') (exists ? savedApi.removeLook(item.id) : savedApi.saveLook(item)).catch(() => {});
    else if (c === 'tutorials') (exists ? savedApi.unsaveTutorial(item.id) : savedApi.saveTutorial(item.id)).catch(() => {});
    else (exists ? savedApi.unsaveProduct(item.id) : savedApi.saveProduct(item.id)).catch(() => {});

    return !exists;
  },
}));
