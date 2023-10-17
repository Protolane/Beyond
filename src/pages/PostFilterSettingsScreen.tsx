import { Button, FAB, List, Text } from 'react-native-paper';
import { Animated, SafeAreaView, StyleSheet, View } from 'react-native';
import type { DrawerScreenProps } from '@react-navigation/drawer';
import type { NavigationList } from '../ui/NavigationList';
import ScrollView = Animated.ScrollView;
import { useFiltersStore } from '../stores/FiltersStore';
import { useRefreshPostsCache } from '../api/lemmy';
import type { PostFilter } from '../models/PostFilter';

export function PostFilterSettingsScreen({
  navigation,
}: DrawerScreenProps<NavigationList, 'PostFilterSettingsScreen'>) {
  const { filters, removeFilter } = useFiltersStore(state => ({
    filters: state.filters,
    removeFilter: state.removeFilter,
  }));

  const { refresh: refreshPosts } = useRefreshPostsCache();

  function handleRemoveFilter(filter: PostFilter) {
    removeFilter(filter);
    refreshPosts();
  }

  return (
    <>
      <SafeAreaView>
        <ScrollView>
          {filters.map((filter, i) => (
            <List.Item
              key={i + '-' + filter.postFilterName}
              title={
                <View>
                  <Text>{filter.postFilterName}</Text>
                  <Button onPress={() => handleRemoveFilter(filter)}>Remove</Button>
                </View>
              }
            />
          ))}
          {filters?.length === 0 && <List.Item title={'No filters'} />}
        </ScrollView>
      </SafeAreaView>
      <FAB style={styles.fab} icon="plus" onPress={() => navigation.navigate('CreateEditFilterScreen')} />
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
