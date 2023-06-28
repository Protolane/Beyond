import { ActivityIndicator, Text } from 'react-native-paper';
import React from 'react';
import type { PostCardProps } from './PostCard';
import { usePost } from '../../../api/lemmy';
import Markdown from '@ronradtke/react-native-markdown-display';
import { View } from 'react-native';

export function PostContent({ postId }: PostCardProps) {
  const { data } = usePost(postId);

  if (!data || !data.post_view.post.body) return <ActivityIndicator />;

  return (
    <View>
      <Markdown>{data.post_view.post.body}</Markdown>
    </View>
  );
}
