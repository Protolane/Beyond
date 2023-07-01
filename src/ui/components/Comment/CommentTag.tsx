import { StyleSheet, View } from 'react-native';
import { CreatorLabel } from '../user/CreatorLabel';
import React from 'react';
import { CommentAvatar } from './CommentAvatar';
import type { CommentView } from 'lemmy-js-client/dist/types/CommentView';
import { CommentPublishedAge } from './CommentPublishAge';

export interface CommentTagProps {
  comment: CommentView;
}

export function CommentTag({ comment }: CommentTagProps) {
  return (
    <View style={tagStyles.container}>
      <View style={tagStyles.labels}>
        {!comment.comment.deleted && <CommentAvatar person={comment.creator} />}
        <CreatorLabel
          person={comment.creator}
          deleted={comment.comment.deleted}
          isPostOwner={comment.comment.creator_id === comment.post.creator_id}
        />
      </View>
      <View style={{ flex: 1 }} />
      <View>
        <CommentPublishedAge published={comment.comment.published} />
      </View>
    </View>
  );
}

const tagStyles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  labels: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
