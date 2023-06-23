import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Account {
  instance: string;
  username: string;
  jwt: string;
}

interface AccountsStore {
  accounts: Account[];
  addAccount: (account: Account) => void;
  removeAccount: (account: Account) => void;
  selectedAccount?: Account;
  setSelectedAccount: (account?: Account) => void;
}

export const useAccountsStore = create(
  persist<AccountsStore>(
    (set, get) => ({
      accounts: [],
      addAccount: (account: Account) => set(state => ({ accounts: [...state.accounts, account] })),
      removeAccount: (account: Account) =>
        set(state => ({ accounts: state.accounts.filter(a => a.jwt !== account.jwt) })),
      selectedAccount: undefined,
      setSelectedAccount: (account?: Account) => set({ selectedAccount: account }),
    }),
    {
      name: 'accounts',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
