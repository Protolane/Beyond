import React from 'react';
import type { PostCardProps } from './PostCard';
import { View } from 'react-native';
import { StyledMarkdown } from '../StyledMarkdown';

export function PostContent({ postView }: PostCardProps) {
  if (!postView?.post?.body) return null;

  return (
    <View>
      <StyledMarkdown>{postView.post.body}</StyledMarkdown>
    </View>
  );
}
