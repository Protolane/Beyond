import { ActivityIndicator, Avatar, useTheme } from 'react-native-paper';
import { Dimensions, StyleSheet, View } from 'react-native';
import React from 'react';
import { useAccountsStore } from '../../../stores/AccountsStore';
import { usePersonDetails } from '../../../api/lemmy';
import { CreatorLabel } from '../user/CreatorLabel';
import { FieldTypes, Form } from '../../../core/form/components/Form';
import Toast from 'react-native-root-toast';

export interface CommentEditorProps {
  hideDialog?: () => void;
  handleSubmit?: (values: { comment: string }) => Promise<void>;
}

export function CommentEditor({ hideDialog, handleSubmit: handleSubmitComment }: CommentEditorProps) {
  const { colors } = useTheme();
  const [loading, setLoading] = React.useState<boolean>(false);

  const { selectedAccount } = useAccountsStore(state => ({
    selectedAccount: state.selectedAccount,
  }));

  const { data: personResponse } = usePersonDetails(selectedAccount);

  const handleSubmit = React.useCallback(
    async (values: { comment: string }) => {
      setLoading(true);

      try {
        await handleSubmitComment?.(values);
      } catch (error) {
        console.error(error);
        Toast.show('There was an error creating your comment, please try again later.');
      } finally {
        setLoading(false);
        hideDialog?.();
      }
    },
    [handleSubmitComment, hideDialog]
  );

  const { height } = Dimensions.get('window');

  if (!personResponse || loading) {
    return <ActivityIndicator />;
  }

  // TODO: implement an account selector for the comment editor (do not swap current account though)
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
