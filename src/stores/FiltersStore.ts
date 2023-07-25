import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FiltersStore {
  nsfw: boolean;
  setNsfw: (nsfw: boolean) => void;
}

export const useFiltersStore = create(
  persist<FiltersStore>(
    (set, get) => ({
      nsfw: false,
      setNsfw: (nsfw: boolean) => set({ nsfw }),
    }),
    {
      name: 'filter',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
