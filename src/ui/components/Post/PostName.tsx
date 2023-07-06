import { Text } from 'react-native-paper';
import React from 'react';
import type { PostCardProps } from './PostCard';

export function PostName({ postView }: PostCardProps) {
  return (
    <Text
      variant="titleMedium"
      style={{
        marginTop: 16,
        marginBottom: 16,
      }}
    >
      {postView.post.name}
    </Text>
  );
}
