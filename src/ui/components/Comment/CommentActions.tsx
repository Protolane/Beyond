import { View } from 'react-native';
import { CounterButton } from '../Post/CounterButton';
import { IconButton } from 'react-native-paper';
import React from 'react';
import { useAccountsStore } from '../../../stores/AccountsStore';
import { useCommentMoreDialog } from '../../hooks/useCommentMoreDialog';
import { useComments, useLemmyClient, usePosts, useSite } from '../../../api/lemmy';
import { useCommentEditorDialog } from '../../hooks/useCommentEditorDialog';
import type { CommentView, GetCommentsResponse, GetPostsResponse } from 'lemmy-js-client';

export interface CommentActionsProps {
  comment: CommentView;
  replyToComment?: boolean;
}

const iconSize = undefined;

export function CommentActions({ comment, replyToComment }: CommentActionsProps) {
  const {
    hasUpvoted,
    hasDownvoted,
    isSaved,
    handlePressUpvote,
    handlePressDownvote,
    handlePressSave,
    handlePressReply,
    handlePressMore,
    commentEditor,
    component,
    isDisabled,
    upvotes,
    downvotes,
    downvotesAllowed,
  } = useCommentActions(comment);

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
          counter={upvotes}
          disabled={isDisabled || comment.comment.deleted}
        />
        {downvotesAllowed && (
          <CounterButton
            onPress={handlePressDownvote}
            pressed={hasDownvoted}
            size={iconSize}
            icon={'arrow-down'}
            counter={downvotes}
            disabled={isDisabled || comment.comment.deleted}
          />
        )}
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
          disabled={isDisabled || comment.comment.deleted}
        />
        <IconButton
          onPress={handlePressReply}
          size={iconSize}
          icon={'reply'}
          disabled={isDisabled || comment.comment.deleted}
        />
      </View>
    </>
  );
}

function useCommentActions(comment?: CommentView) {
  const { data: site } = useSite();
  const { data, mutate } = useComments(comment?.post?.id);
  const { data: postData, mutate: postMutate } = usePosts();

  const pageIndex = data?.findIndex(c => c.comments.find(c => c.comment.id === comment?.comment?.id));
  const commentIndex =
    pageIndex !== undefined
      ? data?.[pageIndex].comments.findIndex(c => c.comment.id === comment?.comment?.id)
      : undefined;
  const commentResponse =
    pageIndex !== undefined && commentIndex !== undefined ? data?.[pageIndex].comments[commentIndex] : undefined;

  const postPageIndex = postData?.findIndex(page => page?.posts.find(p => p.post.id === comment?.post?.id));
  const postIndex =
    postPageIndex !== undefined
      ? postData?.[postPageIndex]?.posts.findIndex(p => p.post.id === comment?.post.id)
      : undefined;
  const postResponse =
    postPageIndex !== undefined && postIndex !== undefined ? postData?.[postPageIndex]?.posts[postIndex] : undefined;

  const { client } = useLemmyClient();
  const { selectedAccount } = useAccountsStore(state => ({
    selectedAccount: state.selectedAccount,
  }));

  const hasUpvoted = commentResponse?.my_vote === 1;
  const hasDownvoted = commentResponse?.my_vote === -1;
  const isSaved = commentResponse?.saved;
  const { upvotes, downvotes, child_count } = commentResponse?.counts ?? {
    upvotes: 0,
    downvotes: 0,
    child_count: 0,
  };

  const handleSubmitComment = React.useCallback(
    async (values: { comment: string }) => {
      if (!selectedAccount?.jwt || !data || !commentResponse) return;
      const auth = selectedAccount.jwt;

      return client
        .createComment({
          auth,
          content: values.comment,
          post_id: commentResponse.post.id,
          parent_id: commentResponse.comment.id,
        })
        .then(response => {
          if (response) {
            if (postPageIndex === undefined || postIndex == undefined) return;

            const dataCopy: GetCommentsResponse[] = JSON.parse(JSON.stringify(data));
            dataCopy[dataCopy.length - 1].comments.push(response.comment_view);

            const postCopy: GetPostsResponse[] = JSON.parse(JSON.stringify(postData));
            postCopy[postPageIndex].posts[postIndex].counts.comments += 1;

            return Promise.all([mutate(dataCopy, false), postMutate(postCopy, false)]);
          }
        });
    },
    [client, commentResponse, data, mutate, postData, postIndex, postMutate, postPageIndex, selectedAccount.jwt]
  );

  const { showDialog: showMoreDialog, component } = useCommentMoreDialog(comment);
  const {
    component: commentEditor,
    showDialog: openCommentEditor,
    hideDialog: closeCommentEditor,
  } = useCommentEditorDialog(handleSubmitComment);

  const handlePressUpvote = React.useCallback(() => {
    if (!selectedAccount?.jwt || !data || !commentResponse || !comment) return;
    const auth = selectedAccount.jwt;

    client
      .likeComment({
        comment_id: comment.comment.id,
        score: hasUpvoted ? 0 : 1,
        auth,
      })
      .then(response => {
        if (response) {
          if (pageIndex === undefined || commentIndex == undefined) return;

          const dataCopy: GetCommentsResponse[] = JSON.parse(JSON.stringify(data));
          dataCopy[pageIndex].comments[commentIndex] = response.comment_view;
          mutate(dataCopy, false);
        }
      });
  }, [client, comment, commentIndex, commentResponse, data, hasUpvoted, mutate, pageIndex, selectedAccount.jwt]);

  const handlePressDownvote = React.useCallback(() => {
    if (!selectedAccount?.jwt || !data || !commentResponse || !comment) return;
    const auth = selectedAccount.jwt;

    client
      .likeComment({
        comment_id: comment.comment.id,
        score: hasDownvoted ? 0 : -1,
        auth,
      })
      .then(response => {
        if (response) {
          if (pageIndex === undefined || commentIndex == undefined) return;

          const dataCopy: GetCommentsResponse[] = JSON.parse(JSON.stringify(data));
          dataCopy[pageIndex].comments[commentIndex] = response.comment_view;
          mutate(dataCopy, false);
        }
      });
  }, [client, comment, commentIndex, commentResponse, data, hasDownvoted, mutate, pageIndex, selectedAccount.jwt]);

  const handlePressMore = React.useCallback(() => {
    showMoreDialog();
  }, [showMoreDialog]);

  const handlePressGoToTop = React.useCallback(() => {
    // console.log('TODO go to top');
  }, []);

  const handlePressSave = React.useCallback(() => {
    if (!selectedAccount?.jwt || !data || !commentResponse || !comment) return;
    const auth = selectedAccount.jwt;

    commentResponse.saved = !isSaved;

    client
      .saveComment({
        comment_id: comment.comment.id,
        save: !isSaved,
        auth,
      })
      .then(response => {
        if (response) {
          if (pageIndex === undefined || commentIndex == undefined) return;

          const dataCopy: GetCommentsResponse[] = JSON.parse(JSON.stringify(data));
          dataCopy[pageIndex].comments[commentIndex] = response.comment_view;
          mutate(dataCopy, false);
        }
      });
  }, [client, comment, commentIndex, commentResponse, data, isSaved, mutate, pageIndex, selectedAccount.jwt]);

  const handlePressReply = React.useCallback(() => {
    openCommentEditor();
  }, [openCommentEditor]);

  return {
    hasUpvoted,
    hasDownvoted,
    isSaved,
    handlePressUpvote,
    handlePressDownvote,
    handlePressSave,
    handlePressReply,
    handlePressMore,
    handlePressGoToTop,
    commentEditor,
    component,
    isDisabled: !selectedAccount?.jwt,
    upvotes,
    downvotes,
    downvotesAllowed: site?.site_view.local_site.enable_downvotes,
  };
}
