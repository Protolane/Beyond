import { Text, useTheme } from 'react-native-paper';
import React from 'react';
import { useAccountsStore } from '../../../stores/AccountsStore';
import { usePersonDetails } from '../../../api/lemmy';
import { StyleSheet, View } from 'react-native';
import Icon from 'react-native-paper/src/components/Icon';
import type { Person } from 'lemmy-js-client';

export interface CreatorLabelProps {
  person: Person;
  deleted?: boolean;
  isPostOwner?: boolean;
}

export function CreatorLabel({ person, deleted, isPostOwner }: CreatorLabelProps) {
  const { colors } = useTheme();
  const { selectedAccount } = useAccountsStore(state => ({
    selectedAccount: state.selectedAccount,
  }));

  const { data: personDetails } = usePersonDetails(selectedAccount);

  const isCurrentUser = personDetails?.person_view.person.id === person.id;

  const creatorInstance = person.actor_id.split('/u/')[0].split('//')[1];
  const creatorFullName = `@${person.name}@${creatorInstance}`;

  return (
    <View style={styles.container}>
      {isCurrentUser && <Icon size={16} source={'account-circle'} />}
      {isPostOwner && <Icon size={16} source={'microphone'} />}
      <Text
        variant="labelSmall"
        style={{ ...styles.label, color: isPostOwner ? 'orange' : isCurrentUser ? 'blue' : colors.secondary }}
      >
        {deleted ? '@[deleted]' : creatorFullName}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 8,
  },
  label: {
    marginBottom: 3,
  },
});
