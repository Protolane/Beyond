import { Text, useTheme } from 'react-native-paper';
import React from 'react';
import type { Community, Person } from 'lemmy-js-client';

export interface CommunityLabelProps {
  community: Community;
}

export function CommunityLabel({ community }: CommunityLabelProps) {
  const { colors } = useTheme();

  const communityInstance = community.actor_id.split('/c/')[0].split('//')[1];
  const communityFullName = `!${community.name}@${communityInstance}`;

  return (
    <Text variant="labelSmall" style={{ color: colors.primary }}>{`${community.title} (${communityFullName})`}</Text>
  );
}
