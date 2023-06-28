import type { Community } from 'lemmy-js-client';
import { Avatar, useTheme } from 'react-native-paper';
import React from 'react';

export interface CommunityAvatarProps {
  community: Community;
}
export function CommunityAvatar({ community }: CommunityAvatarProps) {
  const { colors } = useTheme();
  return <Avatar.Image size={32} source={{ uri: community.icon }} style={{ backgroundColor: colors.background }} />;
}
