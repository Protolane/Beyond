import { ActivityIndicator, Text } from 'react-native-paper';
import React from 'react';
import type { PostCardProps } from './PostCard';
import { usePost } from '../../../api/lemmy';

export function PostContentPreview({ postId }: PostCardProps) {
  const { data } = usePost(postId);

  if (!data) return <ActivityIndicator />;

  return (
    <Text variant="bodySmall" numberOfLines={4} ellipsizeMode="tail">
      {data.post_view.post.body}
    </Text>
  );
}
