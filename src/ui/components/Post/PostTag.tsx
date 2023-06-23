import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Avatar, Text, useTheme } from 'react-native-paper';
import React from 'react';
import type { PostCardProps } from './PostCard';
import { getPostAge } from '../../../core/postAge';
import { usePost } from '../../../api/lemmy';

export function PostTag({ postId }: PostCardProps) {
  const { data: postResponse } = usePost(postId);

  const { colors } = useTheme();

  const communityInstance = postResponse?.post_view.community.actor_id.split('/c/')[0].split('//')[1];
  const communityFullName = `!${postResponse?.post_view.community.name}@${communityInstance}`;

  const creatorInstance = postResponse?.post_view.creator.actor_id.split('/u/')[0].split('//')[1];
  const creatorFullName = `@${postResponse?.post_view.creator.name}@${creatorInstance}`;

  if (!postResponse) return <ActivityIndicator />;

  return (
    <View style={tagStyles.container}>
      <Avatar.Image size={32} source={{ uri: postResponse.post_view.community.icon }} />
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
        }}
      >
        <Text
          variant="labelSmall"
          style={{ color: colors.primary }}
        >{`${postResponse.post_view.community.title} (${communityFullName})`}</Text>
        <Text variant="labelSmall" style={{ color: colors.secondary }}>
          {creatorFullName}
        </Text>
      </View>
      <View>
        <Text variant="bodySmall">{getPostAge(postResponse.post_view)}</Text>
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
});
