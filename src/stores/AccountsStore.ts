﻿import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Account {
  instance: string;
  username?: string;
  jwt?: string;
}

interface AccountsStore {
  accounts: Account[];
  addAccount: (account: Account) => void;
  removeAccount: (account: Account) => void;
  selectedAccount: Account;
  setSelectedAccount: (account: Account) => void;
}

const defaultAccount: Account = {
  instance: 'lemmy.ml',
};

export const useAccountsStore = create(
  persist<AccountsStore>(
    (set, get) => ({
      accounts: [defaultAccount],
      addAccount: (account: Account) => set(state => ({ accounts: [...state.accounts, account] })),
      removeAccount: (account: Account) => {
        const accountIndex = get().accounts.findIndex(
          a => a.instance === account.instance && a.username === account.username
        );
        if (accountIndex === -1) return;

        const accounts = get().accounts.slice();
        accounts.splice(accountIndex, 1);

        if (accounts.length === 0) {
          accounts.push(defaultAccount);
        }

        let selectedAccount = get().selectedAccount;
        if (selectedAccount.instance === account.instance && selectedAccount.username === account.username) {
          selectedAccount = accounts[0];
        }

        set({ accounts, selectedAccount });
      },
      selectedAccount: defaultAccount,
      setSelectedAccount: (account?: Account) => set({ selectedAccount: account }),
    }),
    {
      name: 'accounts',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
