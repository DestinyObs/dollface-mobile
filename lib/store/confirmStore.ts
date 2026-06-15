import { create } from 'zustand';

export interface ConfirmConfig {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
}

interface ConfirmState {
  config: ConfirmConfig | null;
  confirm: (config: ConfirmConfig) => void;
  close: () => void;
}

export const useConfirmStore = create<ConfirmState>((set) => ({
  config: null,
  confirm: (config) => set({ config }),
  close: () => set({ config: null }),
}));

/** Imperative helper. */
export const confirm = (config: ConfirmConfig) => useConfirmStore.getState().confirm(config);
