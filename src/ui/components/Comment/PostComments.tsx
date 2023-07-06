import type { PostCardProps } from '../Post/PostCard';
import { ActivityIndicator, Text } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import React from 'react';
import { useComments } from '../../../api/lemmy';
import { Comment } from './Comment';
import type { CommentView } from 'lemmy-js-client/dist/types/CommentView';
import { InView } from 'react-native-intersection-observer';

const loadMoreFrom = 2;

export function PostComments({ postView }: PostCardProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const { data, setSize, isLoading: isLoadingSWR } = useComments(postView.post.id);
  const [internalSize, setInternalSize] = React.useState(2);

  React.useEffect(() => {
    setSize(internalSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [internalSize]);

  const handleLoadMore = React.useCallback(
    function handleLoadMore() {
      if (isLoadingSWR || !data) return;
      setInternalSize(data.length + 1);
    },
    [isLoadingSWR, data]
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

  React.useEffect(() => {
    setIsLoading(false);
  }, [rootComments]);

  if (!rootComments || !commentsResponse) return <ActivityIndicator />;

  return (
    <View>
      {rootComments.map((comment, i) => (
        <InView
          key={comment.comment.id}
          onChange={inView => {
            if (inView && i >= rootComments.length - 1 - loadMoreFrom) {
              handleLoadMore();
              setIsLoading(true);
            }
          }}
        >
          <Comment comment={comment} comments={commentsResponse} />
        </InView>
      ))}
      {isLoading && (
        <View style={style.container}>
          <ActivityIndicator />
        </View>
      )}
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    marginTop: 8,
    marginBottom: 8,
  },
});
