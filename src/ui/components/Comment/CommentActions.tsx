import { View } from 'react-native';
import { CounterButton } from '../Post/CounterButton';
import { IconButton } from 'react-native-paper';
import React from 'react';
import type { CommentView } from 'lemmy-js-client/dist/types/CommentView';
import { useAccountsStore } from '../../../stores/AccountsStore';
import { optimisticUpdate } from '../../../api/optimisticUpdate';
import { useCommentMoreDialog } from '../../hooks/useCommentMoreDialog';
import { useComments, useLemmyClient } from '../../../api/lemmy';
import { useCommentEditorDialog } from '../../hooks/useCommentEditorDialog';

export interface CommentActionsProps {
  comment: CommentView;
  replyToComment?: boolean;
}

const iconSize = undefined;

export function CommentActions({ comment, replyToComment }: CommentActionsProps) {
  const { selectedAccount } = useAccountsStore(state => ({
    selectedAccount: state.selectedAccount,
  }));

  const { data, mutate } = useComments(comment.post.id);
  const { client } = useLemmyClient();

  const { showDialog: showMoreDialog, component } = useCommentMoreDialog(comment);
  const {
    component: commentEditor,
    showDialog: openCommentEditor,
    hideDialog: closeCommentEditor,
  } = useCommentEditorDialog(comment.post, comment.comment);

  const hasUpvoted = comment.my_vote === 1;
  const hasDownvoted = comment.my_vote === -1;
  const isSaved = comment.saved;

  const handlePressUpvote = React.useCallback(() => {
    if (!selectedAccount?.jwt || !data) return;

    const targetCommentPage = data?.findIndex(c => c.comments.find(c => c.comment.id === comment.comment.id));
    const targetCommentIndex = data?.[targetCommentPage ?? 0].comments.findIndex(
      c => c.comment.id === comment.comment.id
    );
    const targetComment = data?.[targetCommentPage ?? 0].comments[targetCommentIndex ?? 0];

    if (!targetComment) return;

    targetComment.my_vote = hasUpvoted ? 0 : 1;
    targetComment.counts.upvotes += hasUpvoted ? -1 : 1;
    targetComment.counts.score += hasUpvoted ? -1 : 1;

    optimisticUpdate(
      data,
      mutate,
      () => {
        return client.likeComment({
          comment_id: comment.comment.id,
          auth: selectedAccount.jwt,
          score: hasUpvoted ? 0 : 1,
        });
      },
      false
    );
  }, [client, comment, data, hasUpvoted, mutate, selectedAccount]);

  const handlePressDownvote = React.useCallback(() => {
    if (!selectedAccount?.jwt || !data) return;

    const targetCommentPage = data?.findIndex(c => c.comments.find(c => c.comment.id === comment.comment.id));
    const targetCommentIndex = data?.[targetCommentPage ?? 0].comments.findIndex(
      c => c.comment.id === comment.comment.id
    );
    const targetComment = data?.[targetCommentPage ?? 0].comments[targetCommentIndex ?? 0];

    if (!targetComment) return;

    targetComment.my_vote = hasDownvoted ? 0 : -1;
    targetComment.counts.downvotes += hasDownvoted ? -1 : 1;
    targetComment.counts.score += hasDownvoted ? 1 : -1;

    optimisticUpdate(
      data,
      mutate,
      () => {
        return client.likeComment({
          comment_id: comment.comment.id,
          auth: selectedAccount.jwt,
          score: hasDownvoted ? 0 : -1,
        });
      },
      false
    );
  }, [client, comment, data, hasDownvoted, mutate, selectedAccount]);

  const handlePressMore = React.useCallback(() => {
    showMoreDialog();
  }, [showMoreDialog]);

  const handlePressGoToTop = React.useCallback(() => {
    console.log('TODO go to top');
  }, []);

  const handlePressSave = React.useCallback(() => {
    if (!selectedAccount?.jwt || !data) return;

    const targetCommentPage = data?.findIndex(c => c.comments.find(c => c.comment.id === comment.comment.id));
    const targetCommentIndex = data?.[targetCommentPage ?? 0].comments.findIndex(
      c => c.comment.id === comment.comment.id
    );
    const targetComment = data?.[targetCommentPage ?? 0].comments[targetCommentIndex ?? 0];

    if (!targetComment) return;

    targetComment.saved = !isSaved;

    optimisticUpdate(
      data,
      mutate,
      () => {
        return client.saveComment({
          comment_id: comment.comment.id,
          auth: selectedAccount.jwt,
          save: !isSaved,
        });
      },
      false
    );
  }, [client, comment, data, isSaved, mutate, selectedAccount]);

  const handlePressReply = React.useCallback(() => {
    openCommentEditor();
  }, [openCommentEditor]);

  return (
    <>
      {component}
      {commentEditor}
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          flex: 1,
          gap: 16,
        }}
      >
        <CounterButton
          onPress={handlePressUpvote}
          pressed={hasUpvoted}
          size={iconSize}
          icon={'arrow-up'}
          counter={comment.counts.upvotes}
          disabled={!selectedAccount?.jwt || comment.comment.deleted}
        />
        <CounterButton
          onPress={handlePressDownvote}
          pressed={hasDownvoted}
          size={iconSize}
          icon={'arrow-down'}
          counter={comment.counts.downvotes}
          disabled={!selectedAccount?.jwt || comment.comment.deleted}
        />
      </View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <IconButton
          onPress={handlePressMore}
          size={iconSize}
          icon={'dots-vertical'}
          disabled={comment.comment.deleted}
        />
        {/*<IconButton onPress={handlePressGoToTop} size={iconSize} icon={'chevron-up'} />*/}
        <IconButton
          onPress={handlePressSave}
          size={iconSize}
          icon={isSaved ? 'heart' : 'heart-outline'}
          disabled={!selectedAccount?.jwt || comment.comment.deleted}
        />
        <IconButton
          onPress={handlePressReply}
          size={iconSize}
          icon={'reply'}
          disabled={!selectedAccount?.jwt || comment.comment.deleted}
        />
      </View>
    </>
  );
}
