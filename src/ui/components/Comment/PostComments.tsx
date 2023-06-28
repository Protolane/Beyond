import type { PostCardProps } from '../Post/PostCard';
import { ActivityIndicator, Text } from 'react-native-paper';
import { View } from 'react-native';
import React from 'react';
import { useComments, usePost } from '../../../api/lemmy';
import { Comment } from './Comment';
import type { CommentView } from 'lemmy-js-client/dist/types/CommentView';

export function PostComments({ postId }: PostCardProps) {
  const { data } = useComments(postId);

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
      {rootComments.map(comment => (
        <Comment key={comment.comment.id} comment={comment} comments={commentsResponse} />
      ))}
    </View>
  );
}
