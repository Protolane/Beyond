import { StyleSheet, View } from 'react-native';
import React from 'react';
import type { PostCardProps } from './PostCard';
import { CreatorLabel } from '../user/CreatorLabel';
import { CommunityLabel } from '../community/CommunityLabel';
import { CommunityAvatar } from '../community/CommunityAvatar';
import { PostPublishedAge } from './PostPublishedAge';

export function PostTag({ postView }: PostCardProps) {
  return (
    <View style={tagStyles.container}>
      <CommunityAvatar community={postView.community} />
      <View style={tagStyles.labels}>
        <CommunityLabel community={postView.community} />
        <CreatorLabel person={postView.creator} />
      </View>
      <View>
        <PostPublishedAge published={postView.post.published} />
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
