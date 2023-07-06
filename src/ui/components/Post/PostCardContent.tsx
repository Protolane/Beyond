import React from 'react';
import type { PostCardProps } from './PostCard';
import Markdown from '@ronradtke/react-native-markdown-display';
import { View } from 'react-native';

export function PostContent({ postView }: PostCardProps) {
  if (!postView?.post?.body) return null;

  return (
    <View>
      <Markdown>{postView.post.body}</Markdown>
    </View>
  );
}
