import { create } from 'zustand';

interface UiState {
  toastMessage: string | null;
  toastType: 'success' | 'error' | 'info' | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  toastMessage: null,
  toastType: null,

  showToast: (message, type = 'info') =>
    set({ toastMessage: message, toastType: type }),

  hideToast: () => set({ toastMessage: null, toastType: null }),
}));
