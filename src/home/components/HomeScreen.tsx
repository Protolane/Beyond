﻿import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { NavigationList } from '../../ui/NavigationList';
import { usePosts } from '../../api/lemmy';
import { ActivityIndicator, Text } from 'react-native-paper';
import type { PostView } from 'lemmy-js-client';
import { PostsView } from '../../ui/components/Post/PostsView';

export function HomeScreen({ navigation }: NativeStackScreenProps<NavigationList, 'Home'>) {
  const { data, error, size, setSize, isLoading } = usePosts();
  const [internalSize, setInternalSize] = React.useState(2);

  React.useEffect(() => {
    setSize(internalSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [internalSize]);

  const handleLoadMore = React.useCallback(
    function handleLoadMore() {
      if (isLoading || !data) return;
      setInternalSize(data.length + 1);
    },
    [isLoading, data]
  );

  const posts = React.useMemo(() => {
    return data?.reduce(
      (acc, curr) => [
        ...acc,
        ...curr.posts.filter(post => {
          return acc.findIndex(p => p.post.id === post.post.id) === -1;
        }),
      ],
      [] as PostView[]
    );
  }, [data]);

  if (!data || !posts) return <ActivityIndicator />;
  return <PostsView posts={posts} onLoadMore={handleLoadMore} />;
}
