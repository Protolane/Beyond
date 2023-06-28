import { Text, useTheme } from 'react-native-paper';
import React from 'react';
import type { Person } from 'lemmy-js-client';

export interface CreatorLabelProps {
  person: Person;
  deleted?: boolean;
}

export function CreatorLabel({ person, deleted }: CreatorLabelProps) {
  const { colors } = useTheme();

  const creatorInstance = person.actor_id.split('/u/')[0].split('//')[1];
  const creatorFullName = `@${person.name}@${creatorInstance}`;

  return (
    <Text variant="labelSmall" style={{ color: colors.secondary }}>
      {deleted ? '@[deteled]' : creatorFullName}
    </Text>
  );
}
