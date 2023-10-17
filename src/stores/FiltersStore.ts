import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { PostFilter } from '../models/PostFilter';

interface FiltersStore {
  nsfw: boolean;
  setNsfw: (nsfw: boolean) => void;
  filters: PostFilter[];
  addFilter: (filter: PostFilter) => void;
  removeFilter: (filter: PostFilter) => void;
}

export const useFiltersStore = create(
  persist<FiltersStore>(
    (set, get) => ({
      nsfw: false,
      setNsfw: (nsfw: boolean) => set({ nsfw }),
      filters: [],
      addFilter: (filter: PostFilter) => set({ filters: [...get().filters, filter] }),
      removeFilter: (filter: PostFilter) => set({ filters: get().filters.filter(f => f !== filter) }),
    }),
    {
      name: 'filter',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
