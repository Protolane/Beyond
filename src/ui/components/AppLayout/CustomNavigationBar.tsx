import { Appbar, Button, Surface, Text, useTheme } from 'react-native-paper';
import { getHeaderTitle } from '@react-navigation/elements';
import React from 'react';
import type { DrawerHeaderProps } from '@react-navigation/drawer';
import { StyleSheet, View } from 'react-native';
import {
  APP_NAME,
  CommentSortTypesLabels,
  ListingTypes,
  ListingTypesLabels,
  SortTypesLabels,
} from '../../../core/consts';
import { useSortPostsDialog } from '../../hooks/useSortPostsDialog';
import { usePostsStore } from '../../../stores/PostsStore';
import { useAccountsStore } from '../../../stores/AccountsStore';
import { useSortCommentsDialog } from '../../hooks/useSortCommentsDialog';

export function CustomNavigationBar({ navigation, route, options }: DrawerHeaderProps) {
  const { colors } = useTheme();
  const { sort: postSort, showDialog: showSortPosts, component: sortPostsDialog } = useSortPostsDialog();
  const { sort: commentSort, showDialog: showSortComments, component: sortCommentsDialog } = useSortCommentsDialog();
  const { type, setType } = usePostsStore(state => ({
    type: state.type,
    setType: state.setType,
  }));

  const title = getHeaderTitle(options, route.name);

  const handleOpenDrawer = React.useCallback(() => {
    navigation.openDrawer();
  }, [navigation]);

  const handleOpenSortPostsDialog = React.useCallback(() => {
    showSortPosts();
  }, [showSortPosts]);

  const handleOpenSortCommentsDialog = React.useCallback(() => {
    showSortComments();
  }, [showSortComments]);

  const { selectedAccount } = useAccountsStore(state => ({
    selectedAccount: state.selectedAccount,
  }));

  return (
    <Surface>
      {sortPostsDialog}
      {sortCommentsDialog}
      <Appbar.Header>
        {title == APP_NAME ? (
          <>
            <Appbar.Action icon={'menu'} onPress={handleOpenDrawer} />
            <View style={styles.appBarContent}>
              <Appbar.Content title={title} />
              <Text>{SortTypesLabels[postSort]}</Text>
            </View>
          </>
        ) : title == 'Post' ? (
          <>
            <Appbar.BackAction onPress={navigation.goBack} />
            <View style={styles.appBarContent}>
              <Appbar.Content title={title} />
              <Text>{CommentSortTypesLabels[commentSort]}</Text>
            </View>
          </>
        ) : (
          <>
            <Appbar.BackAction onPress={navigation.goBack} />
            <Appbar.Content title={title} />
          </>
        )}
        {title == APP_NAME && <Appbar.Action icon={'sort'} onPress={handleOpenSortPostsDialog} />}
        {title == 'Post' && <Appbar.Action icon={'sort'} onPress={handleOpenSortCommentsDialog} />}
      </Appbar.Header>
      {title == APP_NAME && (
        <View style={{ ...styles.listingTypeContainer, backgroundColor: colors.background }}>
          {ListingTypes.map(listingType => (
            <Button
              key={listingType}
              mode={type === listingType ? 'contained-tonal' : undefined}
              onPress={() => setType(listingType)}
              disabled={listingType === 'Subscribed' && !selectedAccount}
            >
              {ListingTypesLabels[listingType]}
            </Button>
          ))}
        </View>
      )}
    </Surface>
  );
}

const styles = StyleSheet.create({
  appBarContent: {
    display: 'flex',
    flex: 1,
    maxHeight: 48,
  },
  listingTypeContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingBottom: 8,
  },
});
