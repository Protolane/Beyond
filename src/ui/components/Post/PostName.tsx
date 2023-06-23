import { ActivityIndicator, Text } from 'react-native-paper';
import React from 'react';
import type { PostCardProps } from './PostCard';
import { usePost } from '../../../api/lemmy';

export function PostName({ postId }: PostCardProps) {
  const { data: postResponse } = usePost(postId);

  if (!postResponse) return <ActivityIndicator />;
  return (
    <Text
      variant="titleMedium"
      style={{
        marginTop: 16,
        marginBottom: 16,
      }}
    >
      {postResponse.post_view.post.name}
    </Text>
  );
}
