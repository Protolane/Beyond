import { useDialog } from '../../core/dialog/hooks/useDialog';
import React from 'react';
import { useAccountsStore } from '../../stores/AccountsStore';
import { Button, Text } from 'react-native-paper';

export function useLogoutDialog() {
  const { accounts, selectedAccount, setSelectedAccount, removeAccount } = useAccountsStore(state => ({
    selectedAccount: state.selectedAccount,
    setSelectedAccount: state.setSelectedAccount,
    accounts: state.accounts,
    removeAccount: state.removeAccount,
  }));
  const { showDialog, component } = useDialog({
    title: 'Logout',
    content: <Text>Are you sure you want to logout?</Text>,
    actions: hideDialog => (
      <>
        <Button icon="cancel" onPress={hideDialog}>
          Cancel
        </Button>
        <Button
          icon="logout"
          onPress={() => {
            removeAccount(selectedAccount);
            hideDialog();
          }}
        >
          Logout
        </Button>
      </>
    ),
  });

  return {
    showDialog,
    component,
  };
}
