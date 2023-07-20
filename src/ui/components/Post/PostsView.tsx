import { PostCard } from './PostCard';
import React from 'react';
import type { PostView } from 'lemmy-js-client';
import { InfiniteScrollingList } from '../../InfiniteScrollingList';

export interface PostsViewProps {
  posts?: Array<PostView>;
  onLoadMore?: () => void;
  onRefresh?: () => void;
}

export function PostsView({ posts, onLoadMore, onRefresh }: PostsViewProps) {
  return (
    <InfiniteScrollingList<PostView>
      data={posts}
      keyExtractor={item => item.post.id.toString()}
      renderItem={({ item }) => <PostCard postView={item} />}
      onLoadMore={onLoadMore}
      onRefresh={onRefresh}
      itemPadding={8}
    />
  );
}
