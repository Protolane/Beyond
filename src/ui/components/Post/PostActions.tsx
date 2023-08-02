import { View } from 'react-native';
import { CounterButton } from './CounterButton';
import { IconButton, useTheme } from 'react-native-paper';
import React from 'react';
import type { PostCardProps } from './PostCard';
import { useAccountsStore } from '../../../stores/AccountsStore';
import { useComments, useLemmyClient, usePosts, useSite } from '../../../api/lemmy';
import { useNavigation } from '@react-navigation/native';
import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-root-toast';
import type { DrawerNavigationProp } from '@react-navigation/drawer';
import type { NavigationList } from '../../NavigationList';
import { useCommentEditorDialog } from '../../hooks/useCommentEditorDialog';
import type { GetPostsResponse, PostResponse, PostView } from 'lemmy-js-client';
import type { GetCommentsResponse } from 'lemmy-js-client';

const iconSize = undefined;

export function PostActions({
  postView,
  writeComment = false,
}: PostCardProps & {
  writeComment?: boolean;
}) {
  const { colors } = useTheme();

  const {
    hasUpvoted,
    hasDownvoted,
    isSaved,
    handlePressUpvote,
    handlePressDownvote,
    handlePressComment,
    handlePressSave,
    handlePressShare,
    commentEditor,
    isDisabled,
    upvotes,
    downvotes,
    comments,
    downvotesAllowed,
  } = usePostActions(postView, writeComment);

  return (
    <>
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
          disabled={isDisabled}
        />
        {downvotesAllowed && (
          <CounterButton
            onPress={handlePressDownvote}
            pressed={hasDownvoted}
            size={iconSize}
            icon={'arrow-down'}
            counter={downvotes}
            disabled={isDisabled}
          />
        )}
        <CounterButton
          onPress={handlePressComment}
          size={iconSize}
          icon={'comment-text-outline'}
          counter={comments}
          disabled={writeComment && isDisabled}
        />
      </View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <IconButton
          onPress={handlePressSave}
          size={iconSize}
          iconColor={isSaved ? colors.tertiary : undefined}
          disabled={isDisabled}
          icon={isSaved ? 'heart' : 'heart-outline'}
        />
        <IconButton onPress={handlePressShare} size={iconSize} icon={'share-outline'} />
      </View>
    </>
  );
}

function usePostActions(postView?: PostView, writeComment?: boolean) {
  const { data: site } = useSite();
  const { data, mutate } = usePosts();
  const { data: dataComments, mutate: mutateComments } = useComments(postView?.post?.id);

  const pageIndex = data?.findIndex(page => page?.posts.find(p => p.post.id === postView?.post?.id));
  const postIndex =
    pageIndex !== undefined ? data?.[pageIndex]?.posts.findIndex(p => p.post.id === postView?.post?.id) : undefined;
  const postResponse =
    postIndex !== undefined && pageIndex !== undefined ? data?.[pageIndex]?.posts[postIndex] : undefined;

  const navigation = useNavigation<DrawerNavigationProp<NavigationList>>();
  const { client, baseUrl } = useLemmyClient();
  const { selectedAccount } = useAccountsStore(state => ({
    selectedAccount: state.selectedAccount,
  }));

  const hasUpvoted = postResponse?.my_vote === 1;
  const hasDownvoted = postResponse?.my_vote === -1;
  const isSaved = postResponse?.saved;
  const { upvotes, downvotes, comments } = postResponse?.counts ?? {
    upvotes: 0,
    downvotes: 0,
    comments: 0,
  };

  const handleSubmitComment = React.useCallback(
    async (values: { comment: string }) => {
      if (!selectedAccount?.jwt || !data || !postResponse) return;
      const auth = selectedAccount.jwt;

      return client
        .createComment({
          auth,
          content: values.comment,
          post_id: postResponse.post.id,
        })
        .then(response => {
          if (response) {
            if (pageIndex === undefined || postIndex == undefined) return;

            const dataCopy: GetPostsResponse[] = JSON.parse(JSON.stringify(data));
            dataCopy[pageIndex].posts[postIndex].counts.comments += 1;

            const commentsCopy: GetCommentsResponse[] = JSON.parse(JSON.stringify(dataComments));
            commentsCopy[commentsCopy.length - 1].comments.push(response.comment_view);

            return Promise.all([mutate(dataCopy, false), mutateComments(commentsCopy, false)]);
          }
        });
    },
    [client, data, dataComments, mutate, mutateComments, pageIndex, postIndex, postResponse, selectedAccount.jwt]
  );

  const { component: commentEditor, showDialog: openCommentEditor } = useCommentEditorDialog(handleSubmitComment);

  const handlePressUpvote = React.useCallback(() => {
    if (!selectedAccount?.jwt || !data || !postResponse || !postView) return;
    const auth = selectedAccount.jwt;

    client
      .likePost({
        post_id: postView.post.id,
        score: hasUpvoted ? 0 : 1,
        auth,
      })
      .then(response => {
        if (response) {
          if (pageIndex === undefined || postIndex == undefined) return;

          const dataCopy: GetPostsResponse[] = JSON.parse(JSON.stringify(data));
          dataCopy[pageIndex].posts[postIndex] = response.post_view;
          mutate(dataCopy, false);
        }
      });
  }, [selectedAccount.jwt, data, postResponse, postView, client, hasUpvoted, pageIndex, postIndex, mutate]);

  const handlePressDownvote = React.useCallback(() => {
    if (!selectedAccount?.jwt || !data || !postResponse || !postView) return;
    const auth = selectedAccount.jwt;

    client
      .likePost({
        post_id: postView.post.id,
        score: hasDownvoted ? 0 : -1,
        auth,
      })
      .then(response => {
        if (response) {
          if (pageIndex === undefined || postIndex == undefined) return;

          const dataCopy: GetPostsResponse[] = JSON.parse(JSON.stringify(data));
          dataCopy[pageIndex].posts[postIndex] = response.post_view;
          mutate(dataCopy, false);
        }
      });
  }, [selectedAccount.jwt, data, postResponse, postView, client, hasDownvoted, pageIndex, postIndex, mutate]);

  const handlePressComment = React.useCallback(() => {
    if (!writeComment) {
      if (!postView) return;
      return void navigation.navigate('Post', { postView });
    }
    openCommentEditor();
  }, [navigation, openCommentEditor, postView, writeComment]);

  const handlePressSave = React.useCallback(() => {
    if (!selectedAccount?.jwt || !data || !postResponse || !postView) return;
    const auth = selectedAccount.jwt;

    postResponse.saved = !isSaved;

    client
      .savePost({
        post_id: postView.post.id,
        save: !isSaved,
        auth,
      })
      .then(response => {
        if (response) {
          if (pageIndex === undefined || postIndex == undefined) return;

          const dataCopy: GetPostsResponse[] = JSON.parse(JSON.stringify(data));
          dataCopy[pageIndex].posts[postIndex] = response.post_view;
          mutate(dataCopy, false);
        }
      });
  }, [selectedAccount.jwt, data, postResponse, postView, isSaved, client, pageIndex, postIndex, mutate]);

  const handlePressShare = React.useCallback(() => {
    if (!postView) return;
    Clipboard.setStringAsync(`${baseUrl}/post/${postView.post.id}`).then(() => {
      Toast.show('URL copied to clipboard.', {
        duration: Toast.durations.LONG,
      });
    });
  }, [baseUrl, postView]);

  return {
    hasUpvoted,
    hasDownvoted,
    isSaved,
    handlePressUpvote,
    handlePressDownvote,
    handlePressComment,
    handlePressSave,
    handlePressShare,
    commentEditor,
    isDisabled: !selectedAccount?.jwt,
    upvotes,
    downvotes,
    comments,
    downvotesAllowed: site?.site_view?.local_site?.enable_downvotes ?? true,
  };
}
