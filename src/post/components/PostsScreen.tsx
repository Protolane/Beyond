import { usePosts, useRefreshPostsCache } from '../../api/lemmy';
import React from 'react';
import type { PostView } from 'lemmy-js-client';
import { PostsView } from '../../ui/components/Post/PostsView';
import { useFiltersStore } from '../../stores/FiltersStore';
import type { PostType } from '../../ui/hooks/usePostType';
import { getPostType } from '../../ui/hooks/usePostType';

export interface PostsScreenProps {
  communityName?: string;
}

export function PostsScreen({ communityName }: PostsScreenProps) {
  const { data, error, size, setSize, isLoading } = usePosts(communityName);
  const { refresh } = useRefreshPostsCache();
  const [internalSize, setInternalSize] = React.useState(2);
  const { nsfw, filters } = useFiltersStore(state => ({
    nsfw: state.nsfw,
    filters: state.filters,
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
    return (data ?? [])
      ?.reduce(
        (acc, curr) => [
          ...acc,
          ...(curr.posts ?? []).filter(post => {
            return acc.findIndex(p => p.post.id === post.post.id) === -1;
          }),
        ],
        [] as PostView[]
      )
      ?.filter(post => {
        return post.post.nsfw === nsfw || !post.post.nsfw;
      })
      ?.filter(post => {
        const postTypes = getPostType(post);
        return filters?.every(filter => {
          console.log(filter);

          if (!post.post.nsfw && filter.applyOnlyToNSFW === true) return true;

          const filterType: PostType[] = [];
          if (filter.filterText) filterType.push('text');
          if (filter.filterLink) filterType.push('link');
          if (filter.filterImage) filterType.push('image');
          if (filter.filterGIF) filterType.push('gif');
          if (filter.filterVideo) filterType.push('video');

          if (filterType.length === 0) return true;
          if (!postTypes.some(type => filterType.includes(type))) return true;

          let status = true;

          if (filter.titleKeyWordsExclude)
            status =
              status &&
              filter.titleKeyWordsExclude?.every(word => !post.post.name.toLowerCase().includes(word.toLowerCase())) ===
                true;

          console.log('titleKeyWordsExclude', status, filter.titleKeyWordsExclude, post.post.name);

          if (filter.titleKeyWordsContains)
            status =
              status &&
              filter.titleKeyWordsContains?.every(word => post.post.name.toLowerCase().includes(word.toLowerCase())) ===
                true;

          console.log('titleKeyWordsContains', status, filter.titleKeyWordsContains, post.post.name);

          if (filter.titleRegexExclude) {
            status = status && !new RegExp(filter.titleRegexExclude).test(post.post.name);
          }

          if (filter.titleRegexContains) {
            status = status && new RegExp(filter.titleRegexContains).test(post.post.name);
          }

          if (filter.excludeCommunities)
            status =
              status &&
              filter.excludeCommunities?.every(
                community => !post.community.name.toLowerCase().includes(community.toLowerCase())
              ) === true;

          if (filter.excludeUsers)
            status =
              status &&
              filter.excludeUsers?.every(user => !post.creator.name.toLowerCase().includes(user.toLowerCase())) ===
                true;

          if (filter.excludeDomains)
            status =
              status &&
              filter.excludeDomains?.every(domain => !post.post.url?.toLowerCase().includes(domain.toLowerCase())) ===
                true;

          if (filter.containDomains)
            status =
              status &&
              filter.containDomains?.every(domain => post.post.url?.toLowerCase().includes(domain.toLowerCase())) ===
                true;

          status =
            status &&
            filter.minVote !== undefined &&
            (post.counts.upvotes - post.counts.downvotes >= filter.minVote || filter.minVote === -1);

          status =
            status &&
            filter.maxVote !== undefined &&
            (post.counts.upvotes - post.counts.downvotes < filter.maxVote || filter.maxVote === -1);

          status =
            status &&
            filter.minComment !== undefined &&
            (post.counts.comments >= filter.minComment || filter.minComment === -1);

          status =
            status &&
            filter.maxComment !== undefined &&
            (post.counts.comments < filter.maxComment || filter.maxComment === -1);

          // TODO: languages

          console.log('final status', status, post.post.name);

          return status;
        });
      });
  }, [data, filters, nsfw]);

  console.log(posts);

  return <PostsView posts={posts} onLoadMore={handleLoadMore} onRefresh={handleRefresh} />;
}
