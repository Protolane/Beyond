import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ListingType, CommentSortType } from 'lemmy-js-client';

interface PostsStore {
  sort: CommentSortType;
  type: ListingType;
  setSort: (sort: CommentSortType) => void;
  setType: (type: ListingType) => void;
}

export const useCommentsStore = create(
  persist<PostsStore>(
    (set, get) => ({
      sort: 'Hot',
      type: 'All',
      setSort: (sort: CommentSortType) => set({ sort }),
      setType: (type: ListingType) => set({ type }),
    }),
    {
      name: 'comments',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
