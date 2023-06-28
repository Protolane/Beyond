import type { Community, Person } from 'lemmy-js-client';
import { Avatar, useTheme } from 'react-native-paper';
import React from 'react';

export interface CommentAvatarProps {
  person: Person;
}
export function CommentAvatar({ person }: CommentAvatarProps) {
  const { colors } = useTheme();
  return <Avatar.Image size={20} source={{ uri: person.avatar }} style={{ backgroundColor: colors.background }} />;
}
