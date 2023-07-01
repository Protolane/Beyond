import { ActivityIndicator, Avatar, Divider, Text, useTheme } from 'react-native-paper';
import { Dimensions, StyleSheet, View } from 'react-native';
import React from 'react';
import { useAccountsStore } from '../../../stores/AccountsStore';
import { useComments, useLemmyClient, usePersonDetails, useRefreshCommentsCache } from '../../../api/lemmy';
import { CreatorLabel } from '../user/CreatorLabel';
import { FieldTypes, Form } from '../../../core/form/components/Form';
import { optimisticUpdate } from '../../../api/optimisticUpdate';
import type { Comment } from 'lemmy-js-client';
import type { CommentView } from 'lemmy-js-client/dist/types/CommentView';
import Toast from 'react-native-root-toast';

export interface CommentEditorProps {
  postId: number;
  parentId?: number;
  editingId?: number;
  hideDialog?: () => void;
}

export function CommentEditor({ postId, parentId, editingId, hideDialog }: CommentEditorProps) {
  const { accounts, selectedAccount, setSelectedAccount, removeAccount } = useAccountsStore(state => ({
    selectedAccount: state.selectedAccount,
    setSelectedAccount: state.setSelectedAccount,
    accounts: state.accounts,
    removeAccount: state.removeAccount,
  }));

  const [loading, setLoading] = React.useState<boolean>(false);

  // TODO: implement an account selector for the comment editor (do not swap current account though)

  const { client } = useLemmyClient();
  const { data, mutate } = useComments(postId);
  const { data: personDetails } = usePersonDetails(selectedAccount);
  const { refresh } = useRefreshCommentsCache();

  const handleSubmit = React.useCallback(
    async (values: { comment: string }) => {
      if (!selectedAccount?.jwt || !data || !personDetails) return;

      // const parentComment = data
      //   .find(commentResponse => commentResponse.comments.find(comment => comment.comment.id === parentId))
      //   ?.comments.find(comment => comment.comment.id === parentId)?.comment;
      //
      // const newComment: CommentView = {
      //   comment: {
      //     id: 0,
      //     content: values.comment,
      //     creator_id: personDetails.person_view.person.id,
      //     post_id: postId,
      //     path: (parentComment?.path ?? '0') + '.0',
      //     published: Date.now().toString(),
      //     deleted: false,
      //     distinguished: false,
      //     local: true,
      //     removed: false,
      //     updated: undefined,
      //     ap_id: '0',
      //     language_id: 0,
      //   },
      //   post: data[0].comments[0].post,
      //   saved: false,
      //   my_vote: undefined,
      //   counts: {
      //     downvotes: 0,
      //     upvotes: 0,
      //     score: 0,
      //     child_count: 0,
      //     id: 0,
      //     comment_id: 0,
      //     published: Date.now().toString(),
      //   },
      //   community: data[0].comments[0].community,
      //   creator: personDetails.person_view.person,
      //   subscribed: 'NotSubscribed',
      //   creator_blocked: false,
      //   creator_banned_from_community: false,
      // };
      //
      // data[data.length - 1].comments.push(newComment);

      // optimisticUpdate(
      //   data,
      //   mutate,
      //   async () =>
      //     client.createComment({
      //       auth: selectedAccount.jwt,
      //       content: values.comment,
      //       post_id: postId,
      //       parent_id: parentId,
      //     }),
      //   false
      // );

      setLoading(true);

      client
        .createComment({
          auth: selectedAccount.jwt,
          content: values.comment,
          post_id: postId,
          parent_id: parentId,
        })
        .then(
          () => refresh(),
          () => Toast.show('There was an error creating your comment, please try again later.')
        )
        .then(() => mutate())
        .then(() => {
          setLoading(false);
          hideDialog?.();
        });

      // hideDialog?.();

      // TODO: get lemmy client
      //   define whether replying to post or comment in post
      //   submit comment
      //   update swr cache
      //   close dialog
    },
    [client, data, hideDialog, mutate, parentId, personDetails, postId, selectedAccount]
  );

  const { colors } = useTheme();

  const { data: personResponse } = usePersonDetails(selectedAccount);
  const { height } = Dimensions.get('window');

  if (!personResponse || loading) {
    return <ActivityIndicator />;
  }

  // TODO: save comment in a store for accidental close, restore on open from same parent comment, delete on submit or from new parent comment

  return (
    <View>
      <View style={styles.userView}>
        <Avatar.Image
          size={20}
          source={{ uri: personResponse.person_view.person.avatar }}
          style={{ backgroundColor: colors.background }}
        />
        <CreatorLabel person={personResponse.person_view.person} />
      </View>
      <View>
        <Form
          schema={[
            {
              type: FieldTypes.Text,
              name: 'comment',
              label: 'Comment',
              rules: {
                required: true,
              },
              props: {
                multiline: true,
                style: {
                  maxHeight: Math.ceil(height * 0.7),
                },
              },
            },
          ]}
          onSubmit={handleSubmit}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  userView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
});
