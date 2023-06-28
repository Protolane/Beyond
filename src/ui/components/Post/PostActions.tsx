import { View } from 'react-native';
import { CounterButton } from './CounterButton';
import { IconButton, useTheme } from 'react-native-paper';
import React from 'react';
import type { PostCardProps } from './PostCard';
import { useAccountsStore } from '../../../stores/AccountsStore';
import { useLemmyClient, usePost } from '../../../api/lemmy';
import { optimisticUpdate } from '../../../api/optimisticUpdate';
import { useNavigation } from '@react-navigation/native';
import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-root-toast';
import type { DrawerNavigationProp } from '@react-navigation/drawer';
import type { NavigationList } from '../../NavigationList';

const iconSize = undefined;

export function PostActions({
  postId,
  writeComment = false,
}: PostCardProps & {
  writeComment?: boolean;
}) {
  const { data: postResponse, mutate } = usePost(postId);

  const { colors } = useTheme();
  const { client, baseUrl } = useLemmyClient();

  const navigation = useNavigation<DrawerNavigationProp<NavigationList>>();

  const { selectedAccount } = useAccountsStore(state => ({
    selectedAccount: state.selectedAccount,
  }));

  const hasUpvoted = postResponse?.post_view.my_vote === 1;
  const hasDownvoted = postResponse?.post_view.my_vote === -1;
  const isSaved = postResponse?.post_view.saved;

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
  }, [postId, client, hasUpvoted, mutate, postResponse, selectedAccount]);

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
  }, [postId, client, hasDownvoted, mutate, postResponse, selectedAccount]);

  const handlePressComment = React.useCallback(() => {
    if (!writeComment) return void navigation.navigate('Post', { postId });
  }, [navigation, postId, writeComment]);

  const handlePressSave = React.useCallback(() => {
    if (!selectedAccount || !postResponse) return;

    optimisticUpdate(
      {
        ...postResponse,
        post_view: {
          ...postResponse.post_view,
          saved: !isSaved,
        },
      },
      mutate,
      () => {
        return client.savePost({
          post_id: postId,
          auth: selectedAccount.jwt,
          save: !isSaved,
        });
      },
      false
    );
  }, [client, isSaved, mutate, postId, postResponse, selectedAccount]);

  const handlePressShare = React.useCallback(() => {
    Clipboard.setStringAsync(`${baseUrl}/post/${postResponse?.post_view?.post.id}`).then(() => {
      Toast.show('URL copied to clipboard.', {
        duration: Toast.durations.LONG,
      });
    });
  }, [baseUrl, postResponse?.post_view?.post.id]);

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
            iconColor={isSaved ? colors.tertiary : undefined}
            icon={isSaved ? 'heart' : 'heart-outline'}
          />
        )}
        <IconButton onPress={handlePressShare} size={iconSize} icon={'share-outline'} />
      </View>
    </>
  );
}
