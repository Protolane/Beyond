import { View } from 'react-native';
import { CounterButton } from './CounterButton';
import { IconButton, useTheme } from 'react-native-paper';
import React from 'react';
import type { PostCardProps } from './PostCard';
import { useAccountsStore } from '../../../stores/AccountsStore';
import { useLemmyClient, usePost } from '../../../api/lemmy';
import { optimisticUpdate } from '../../../api/optimisticUpdate';

const iconSize = undefined;

export function PostActions({ postId }: PostCardProps) {
  const { data: postResponse, mutate } = usePost(postId);

  const { colors } = useTheme();
  const { client } = useLemmyClient();

  const { selectedAccount } = useAccountsStore(state => ({
    selectedAccount: state.selectedAccount,
  }));

  const hasUpvoted = postResponse?.post_view.my_vote === 1;
  const hasDownvoted = postResponse?.post_view.my_vote === -1;
  const isSsaved = postResponse?.post_view.saved;

  const handlePressUpvote = React.useCallback(() => {
    if (!selectedAccount || !postResponse) return;

    optimisticUpdate(
      {
        ...postResponse,
        post_view: {
          ...postResponse.post_view,
          my_vote: hasUpvoted ? 0 : 1,
        },
      },
      mutate,
      () => {
        return client.likePost({
          post_id: postId,
          auth: selectedAccount.jwt,
          score: hasUpvoted ? 0 : 1,
        });
      },
      false
    );
  }, [client, hasUpvoted, mutate, postResponse, selectedAccount]);

  const handlePressDownvote = React.useCallback(() => {
    if (!selectedAccount || !postResponse) return;

    optimisticUpdate(
      {
        ...postResponse,
        post_view: {
          ...postResponse.post_view,
          my_vote: hasDownvoted ? 0 : -1,
        },
      },
      mutate,
      () => {
        return client.likePost({
          post_id: postId,
          auth: selectedAccount.jwt,
          score: hasDownvoted ? 0 : -1,
        });
      },
      false
    );
  }, [client, hasDownvoted, mutate, postResponse, selectedAccount]);

  const handlePressComment = React.useCallback(() => {
    console.log('TODO comment');
  }, []);

  const handlePressSave = React.useCallback(() => {
    if (!selectedAccount || !postResponse) return;

    optimisticUpdate(
      {
        ...postResponse,
        post_view: {
          ...postResponse.post_view,
          saved: !isSsaved,
        },
      },
      mutate,
      () => {
        return client.savePost({
          post_id: postId,
          auth: selectedAccount.jwt,
          save: !isSsaved,
        });
      },
      false
    );
  }, [client, isSsaved, mutate, postResponse, selectedAccount]);

  const handlePressShare = React.useCallback(() => {
    console.log('TODO share');
  }, []);

  return (
    <>
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
          counter={postResponse?.post_view.counts.upvotes}
          disabled={!selectedAccount}
        />
        <CounterButton
          onPress={handlePressDownvote}
          pressed={hasDownvoted}
          size={iconSize}
          icon={'arrow-down'}
          counter={postResponse?.post_view.counts.downvotes}
          disabled={!selectedAccount}
        />
        <CounterButton
          onPress={handlePressComment}
          size={iconSize}
          icon={'comment-text-outline'}
          counter={postResponse?.post_view.counts.comments}
        />
      </View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        {selectedAccount && (
          <IconButton
            onPress={handlePressSave}
            size={iconSize}
            iconColor={isSsaved ? colors.tertiary : undefined}
            icon={isSsaved ? 'heart' : 'heart-outline'}
          />
        )}
        <IconButton onPress={handlePressShare} size={iconSize} icon={'share-outline'} />
      </View>
    </>
  );
}
