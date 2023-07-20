import type { PostCardProps } from './PostCard';
import { getImagePostURL, getLinkPostURL, usePostType } from '../../hooks/usePostType';
import { Badge, Card, useTheme } from 'react-native-paper';
import React from 'react';
import { PostTag } from './PostTag';
import { PostName } from './PostName';
import { A } from '@expo/html-elements';
import { styles } from './PostCard';
import { PostImage } from './PostImage';
import { PostActions } from './PostActions';
import { PostContent } from './PostCardContent';
import { useComments, useRefreshCommentsCache } from '../../../api/lemmy';
import type { CommentView } from 'lemmy-js-client';
import { InfiniteScrollingList } from '../../InfiniteScrollingList';
import { Comment } from '../Comment/Comment';
import { View } from 'react-native';

export function PostView({ postView }: PostCardProps) {
  const { data, setSize, isLoading } = useComments(postView.post.id);
  const { refresh } = useRefreshCommentsCache();
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

  const handleRefresh = React.useCallback(
    async function handleRefresh() {
      if (isLoading || !data) return;
      await refresh();
      setInternalSize(2);
    },
    [isLoading, data, refresh]
  );

  const commentsResponse = React.useMemo(() => {
    return data?.reduce(
      (acc, curr) => [
        ...acc,
        ...curr.comments.filter(comment => {
          return acc.findIndex(c => c.comment.id === comment.comment.id) === -1;
        }),
      ],
      [] as CommentView[]
    );
  }, [data]);

  const rootComments = React.useMemo(
    () => commentsResponse?.filter(comment => comment.comment.path.split('.').length === 2),
    [commentsResponse]
  );

  return (
    <InfiniteScrollingList<CommentView>
      showsVerticalScrollIndicator
      header={<ListHeader postView={postView} />}
      data={rootComments}
      onLoadMore={handleLoadMore}
      onRefresh={handleRefresh}
      renderItem={({ item }) => <Comment comment={item} comments={commentsResponse} />}
      keyExtractor={item => item.comment.id.toString()}
    />
  );
}

function ListHeader({ postView }: PostCardProps) {
  const postType = usePostType(postView);
  const url = getLinkPostURL(postView);
  const image = getImagePostURL(postView);
  const { colors } = useTheme();

  return (
    <View>
      <Card.Content>
        <PostTag postView={postView} />
        <PostName postView={postView} />

        <View style={styles.tags}>
          <Badge>{postType}</Badge>
          {postView.post.nsfw && <Badge>NSFW</Badge>}
          {postView.post.locked && <Badge>Locked</Badge>}
          {image?.toLowerCase().endsWith('.gif') && <Badge>GIF</Badge>}
        </View>
        {postType === 'link' && (
          <View style={styles.tags}>
            <A style={{ color: colors.tertiary }} href={url}>
              {url}
            </A>
          </View>
        )}
        {!image && <PostContent postView={postView} />}
      </Card.Content>

      {image && <PostImage postView={postView} />}

      <Card.Actions
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingTop: 0,
          paddingBottom: 0,
        }}
      >
        <PostActions postView={postView} writeComment />
      </Card.Actions>
    </View>
  );
}
