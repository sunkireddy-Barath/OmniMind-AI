import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type AppMode = 'live' | 'demo';

interface AppState {
  mode: AppMode;
  apiKey: string | null;
  setMode: (mode: AppMode) => void;
  setApiKey: (key: string | null) => void;
  reset: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      mode: 'demo',
      apiKey: null,
      setMode: (mode) => set({ mode }),
      setApiKey: (apiKey) => set({ apiKey }),
      reset: () => set({ mode: 'demo', apiKey: null }),
    }),
    {
      name: 'omnimind-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
