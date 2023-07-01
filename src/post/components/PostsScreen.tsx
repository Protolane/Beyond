import { usePosts } from '../../api/lemmy';
import React from 'react';
import type { PostView } from 'lemmy-js-client';
import { ActivityIndicator } from 'react-native-paper';
import { PostsView } from '../../ui/components/Post/PostsView';

export interface PostsScreenProps {
  communityName?: string;
}

export function PostsScreen({ communityName }: PostsScreenProps) {
  const { data, error, size, setSize, isLoading } = usePosts(communityName);
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
