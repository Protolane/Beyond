import type { CommentView } from 'lemmy-js-client/dist/types/CommentView';
import { ActivityIndicator, Card, Text } from 'react-native-paper';
import Markdown from '@ronradtke/react-native-markdown-display';
import { Levels } from '../Levels';
import { CommentTag } from './CommentTag';
import { CommentActions } from './CommentActions';
import { StyleSheet, View } from 'react-native';
import React from 'react';

export interface CommentProps {
  comment: CommentView;
  comments: CommentView[];
}

function DeletedCommentContent() {
  return <Markdown>{'*[deleted]*'}</Markdown>;
}

export function Comment({ comment, comments }: CommentProps) {
  const level = React.useMemo(() => comment?.comment.path.split('.').length - 2, [comment]);

  if (!comment) return <ActivityIndicator />;

  return (
    <Levels level={level}>
      <View style={styles.container}>
        <CommentTag comment={comment} />
        {comment.comment.deleted ? <DeletedCommentContent /> : <Markdown>{comment.comment.content}</Markdown>}
        <Card.Actions>
          <CommentActions comment={comment} />
        </Card.Actions>
      </View>
      <CommentThread parentCommentId={comment.comment.id} comments={comments} />
    </Levels>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
});

interface CommentThreadProps {
  comments: CommentView[];
  parentCommentId: number;
}

function CommentThread({ parentCommentId, comments }: CommentThreadProps) {
  const threads = React.useMemo(
    () =>
      comments.filter(comment => {
        const path = comment.comment.path.split('.');
        return path[path.length - 2] == parentCommentId.toString(10);
      }),
    [comments, parentCommentId]
  );

  // TODO: make collapsable
  return (
    <View>
      {threads.map(t => (
        <Comment key={t.comment.id} comment={t} comments={comments} />
      ))}
    </View>
  );
}
