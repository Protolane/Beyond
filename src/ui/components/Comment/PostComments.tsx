import type { PostCardProps } from '../Post/PostCard';
import { ActivityIndicator, Text } from 'react-native-paper';
import { View } from 'react-native';
import React from 'react';
import { useComments, usePost } from '../../../api/lemmy';
import { Comment } from './Comment';
import type { CommentView } from 'lemmy-js-client/dist/types/CommentView';
import { InView } from 'react-native-intersection-observer';
import { useCommentEditorDialog } from '../../hooks/useCommentEditorDialog';

const loadMoreFrom = 2;

export function PostComments({ postId }: PostCardProps) {
  const { data, setSize, isLoading } = useComments(postId);
  const [internalSize, setInternalSize] = React.useState(2);

  React.useEffect(() => {
    setSize(internalSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [internalSize]);

  const handleLoadMore = React.useCallback(
    function handleLoadMore() {
      if (isLoading || !data) return;
      console.log('load more');
      setInternalSize(data.length + 1);
    },
    [isLoading, data]
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

  if (!rootComments || !commentsResponse) return <ActivityIndicator />;

  return (
    <View>
      {rootComments.map((comment, i) => (
        <InView
          key={comment.comment.id}
          onChange={inView => {
            if (inView && i >= rootComments.length - 1 - loadMoreFrom) {
              handleLoadMore();
            }
          }}
        >
          <Comment comment={comment} comments={commentsResponse} />
        </InView>
      ))}
    </View>
  );
}
