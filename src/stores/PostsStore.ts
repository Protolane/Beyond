import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ListingType, SortType } from 'lemmy-js-client';

interface PostsStore {
  sort: SortType;
  type: ListingType;
  setSort: (sort: SortType) => void;
  setType: (type: ListingType) => void;
}

export const usePostsStore = create(
  persist<PostsStore>(
    (set, get) => ({
      sort: 'Hot',
      type: 'All',
      setSort: (sort: SortType) => set({ sort }),
      setType: (type: ListingType) => set({ type }),
    }),
    {
      name: 'posts',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
