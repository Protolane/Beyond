import { Appbar, Button, Surface, Text, useTheme } from 'react-native-paper';
import { getHeaderTitle } from '@react-navigation/elements';
import React from 'react';
import type { DrawerHeaderProps } from '@react-navigation/drawer';
import { StyleSheet, View } from 'react-native';
import { APP_NAME, ListingTypes, ListingTypesLabels, SortTypesLabels } from '../../../core/consts';
import { useSortPostsDialog } from '../../hooks/useSortPostsDialog';
import { usePostsStore } from '../../../stores/PostsStore';

export function CustomNavigationBar({ navigation, route, options }: DrawerHeaderProps) {
  const { colors } = useTheme();
  const { sort, showDialog, component: dialog } = useSortPostsDialog();
  const { type, setType } = usePostsStore(state => ({
    type: state.type,
    setType: state.setType,
  }));

  const title = getHeaderTitle(options, route.name);

  const handleOpenDrawer = React.useCallback(() => {
    navigation.openDrawer();
  }, [navigation]);

  const handleOpenSortDialog = React.useCallback(() => {
    showDialog();
  }, [showDialog]);

  return (
    <Surface>
      {dialog}
      <Appbar.Header>
        <Appbar.Action icon={'menu'} onPress={handleOpenDrawer} />
        {title == APP_NAME ? (
          <View style={styles.appBarContent}>
            <Appbar.Content title={title} />
            <Text>{SortTypesLabels[sort]}</Text>
          </View>
        ) : (
          <Appbar.Content title={title} />
        )}
        {title == APP_NAME && <Appbar.Action icon={'sort'} onPress={handleOpenSortDialog} />}
      </Appbar.Header>
      {title == APP_NAME && (
        <View style={{ ...styles.listingTypeContainer, backgroundColor: colors.background }}>
          {ListingTypes.map(listingType => (
            <Button
              key={listingType}
              mode={type === listingType ? 'contained-tonal' : undefined}
              onPress={() => setType(listingType)}
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
