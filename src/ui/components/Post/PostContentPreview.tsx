import { Text } from 'react-native-paper';
import React from 'react';
import type { PostCardProps } from './PostCard';

export function PostContentPreview({ postView }: PostCardProps) {
  return (
    <Text variant="bodySmall" numberOfLines={4} ellipsizeMode="tail">
      {postView.post.body}
    </Text>
  );
}
