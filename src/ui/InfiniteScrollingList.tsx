import { View } from 'react-native';
import React from 'react';
import { ActivityIndicator } from 'react-native-paper';
import { swrDefaults } from '../api/lemmy';
import { FlashList } from '@shopify/flash-list';
import type { ListRenderItem } from '@shopify/flash-list/src/FlashListProps';

type FlatListHeader =
  | React.ComponentType<any>
  | React.ReactElement<any, string | React.JSXElementConstructor<any>>
  | null
  | undefined;

export interface InfiniteScrollingListProps<T> {
  data?: Array<T>;
  onLoadMore?: () => void;
  onRefresh?: () => void;
  keyExtractor: (item: T) => string;
  renderItem: ListRenderItem<T> | null | undefined;
  itemPadding?: number;
  header?: FlatListHeader;
  showsVerticalScrollIndicator?: boolean;
}

export function InfiniteScrollingList<T>({
  header,
  data,
  onLoadMore,
  onRefresh,
  keyExtractor,
  renderItem,
  itemPadding,
  showsVerticalScrollIndicator = false,
}: InfiniteScrollingListProps<T>) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = React.useState<boolean>(false);

  React.useEffect(() => {
    setIsLoading(false);
    setIsRefreshing(false);
  }, [data]);

  return (
    <FlashList
      ListHeaderComponent={header}
      data={data}
      ListEmptyComponent={() => <ActivityIndicator />}
      keyExtractor={keyExtractor}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      onEndReachedThreshold={0.6}
      ItemSeparatorComponent={() => (itemPadding ? <View style={{ height: itemPadding }} /> : null)}
      ListFooterComponent={isLoading ? <ActivityIndicator /> : null}
      renderItem={renderItem}
      refreshing={isRefreshing}
      onEndReached={() => {
        if (onLoadMore && data?.length !== undefined) {
          onLoadMore();
          setIsLoading(true);
          setTimeout(() => {
            setIsLoading(false);
          }, swrDefaults.loadingTimeout);
        }
      }}
      onRefresh={() => {
        if (onRefresh && data?.length !== undefined) {
          setIsRefreshing(true);
          onRefresh();
          setTimeout(() => {
            setIsRefreshing(false);
          }, swrDefaults.loadingTimeout);
        }
      }}
    />
  );
}
