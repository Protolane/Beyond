import { usePosts, useRefreshPostsCache } from '../../api/lemmy';
import React from 'react';
import type { PostView } from 'lemmy-js-client';
import { PostsView } from '../../ui/components/Post/PostsView';
import { useFiltersStore } from '../../stores/FiltersStore';

export interface PostsScreenProps {
  communityName?: string;
}

export function PostsScreen({ communityName }: PostsScreenProps) {
  const { data, error, size, setSize, isLoading } = usePosts(communityName);
  const { refresh } = useRefreshPostsCache();
  const [internalSize, setInternalSize] = React.useState(2);
  const { nsfw } = useFiltersStore(state => ({
    nsfw: state.nsfw,
  }));

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

  const handleRefresh = React.useCallback(
    async function handleRefresh() {
      if (isLoading || !data) return;
      await refresh();
      setInternalSize(2);
    },
    [isLoading, data, refresh]
  );

  const posts = React.useMemo(() => {
    return data
      ?.reduce(
        (acc, curr) => [
          ...acc,
          ...curr.posts.filter(post => {
            return acc.findIndex(p => p.post.id === post.post.id) === -1;
          }),
        ],
        [] as PostView[]
      )
      .filter(post => {
        return post.post.nsfw === nsfw || !post.post.nsfw;
      });
  }, [data, nsfw]);

  return <PostsView posts={posts} onLoadMore={handleLoadMore} onRefresh={handleRefresh} />;
}
