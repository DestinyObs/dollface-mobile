import { create } from 'zustand';
import type { BeautyProfile } from '@/types/beauty';
import { storage } from '@/lib/storage';

interface BeautyProfileState {
  profile: BeautyProfile | null;
  onboardingStep: number;
  onboardingComplete: boolean;
  setProfile: (profile: BeautyProfile) => void;
  setOnboardingStep: (step: number) => void;
  setOnboardingComplete: (complete: boolean) => void;
  clearProfile: () => void;
  hydrate: () => Promise<void>;
}

export const useBeautyProfileStore = create<BeautyProfileState>((set) => ({
  profile: null,
  onboardingStep: 0,
  onboardingComplete: false,

  setProfile: (profile) => {
    set({ profile });
    storage.setItem('beautyProfile', JSON.stringify(profile)).catch(() => {});
  },
  setOnboardingStep: (step) => set({ onboardingStep: step }),
  setOnboardingComplete: (complete) => {
    set({ onboardingComplete: complete });
    storage.setItem('onboardingComplete', complete ? '1' : '0').catch(() => {});
  },
  clearProfile: () => {
    set({ profile: null, onboardingStep: 0, onboardingComplete: false });
    storage.deleteItem('onboardingComplete').catch(() => {});
    storage.deleteItem('beautyProfile').catch(() => {});
  },

  hydrate: async () => {
    try {
      const done = await storage.getItem('onboardingComplete');
      const profileRaw = await storage.getItem('beautyProfile');
      set({
        onboardingComplete: done === '1',
        profile: profileRaw ? (JSON.parse(profileRaw) as BeautyProfile) : null,
      });
    } catch {
      // keep defaults
    }
  },
}));
