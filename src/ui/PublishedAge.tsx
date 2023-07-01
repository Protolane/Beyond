import { Text } from 'react-native-paper';
import React from 'react';
import moment from 'moment-timezone';

export interface PublishedAgeProps {
  published: string;
}

// TODO: Localization.timezone is deprecated
export function PublishedAge({ published }: PublishedAgeProps) {
  return <Text variant="bodySmall">{moment.tz(published, 'UTC').fromNow()}</Text>;
}
