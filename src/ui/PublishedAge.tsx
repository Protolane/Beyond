import { Text } from 'react-native-paper';
import React from 'react';
import moment from 'moment/moment';

export interface PublishedAgeProps {
  published: string;
}

const lemmyFormat = `YYYY-MM-DDTHH:mm:ss.SSSSSSZ`;

export function PublishedAge({ published }: PublishedAgeProps) {
  return <Text variant="bodySmall">{moment(published, lemmyFormat).fromNow()}</Text>;
}
