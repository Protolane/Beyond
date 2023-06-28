import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Avatar, Text, useTheme } from 'react-native-paper';
import React from 'react';
import type { PostCardProps } from './PostCard';
import { usePost } from '../../../api/lemmy';
import { CreatorLabel } from '../user/CreatorLabel';
import { CommunityLabel } from '../community/CommunityLabel';
import { CommunityAvatar } from '../community/CommunityAvatar';
import { PostPublishedAge } from './PostPublishedAge';

export function PostTag({ postId }: PostCardProps) {
  const { data: postResponse } = usePost(postId);

  if (!postResponse) return <ActivityIndicator />;

  return (
    <View style={tagStyles.container}>
      <CommunityAvatar community={postResponse.post_view.community} />
      <View style={tagStyles.labels}>
        <CommunityLabel community={postResponse.post_view.community} />
        <CreatorLabel person={postResponse.post_view.creator} />
      </View>
      <View>
        <PostPublishedAge published={postResponse.post_view.post.published} />
      </View>
    </View>
  );
}

const tagStyles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  labels: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
});
