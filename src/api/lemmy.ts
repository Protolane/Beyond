import type { GetPersonDetails } from 'lemmy-js-client';
import { LemmyHttp } from 'lemmy-js-client';
import useSWRInfinite from 'swr/infinite';
import type { Account } from '../stores/AccountsStore';
import { useAccountsStore } from '../stores/AccountsStore';
import React from 'react';
import useSWR from 'swr';
import { usePostsStore } from '../stores/PostsStore';

const anonymousInstance = 'lemmy.ml';

export function useLemmyClient() {
  const { selectedAccount } = useAccountsStore(state => ({
    selectedAccount: state.selectedAccount,
    setSelectedAccount: state.setSelectedAccount,
    accounts: state.accounts,
    removeAccount: state.removeAccount,
  }));

  const baseUrl = React.useMemo(() => selectedAccount?.instance ?? anonymousInstance, [selectedAccount]);
  const client: LemmyHttp = React.useMemo(
    () =>
      new LemmyHttp(
        `https://${baseUrl}`,
        selectedAccount?.jwt
          ? {
              Cookie: `jwt=${selectedAccount.jwt}`,
            }
          : undefined
      ),
    [baseUrl, selectedAccount]
  );

  return { baseUrl, client, jwt: selectedAccount?.jwt };
}

export function usePosts() {
  const { baseUrl, client } = useLemmyClient();
  const { sort, type_ } = usePostsStore(state => ({
    sort: state.sort,
    type_: state.type,
  }));

  return useSWRInfinite(
    page => ['posts', baseUrl, sort, type_, page],
    ([, , , , page]) => {
      return client.getPosts({
        limit: 10,
        sort,
        type_,
        page,
      });
    },
    {
      initialSize: 2,
    }
  );
}

export function usePost(postId: number) {
  const { baseUrl, client, jwt } = useLemmyClient();

  return useSWR(['posts', baseUrl, postId], ([, , page]) => {
    return client.getPost({
      id: postId,
      auth: jwt,
    });
  });
}

export function usePersonDetails(account?: Pick<Account, 'username' | 'instance'>) {
  const { baseUrl, client, jwt } = useLemmyClient();

  const username = React.useMemo(() => (account ? `${account.username}@${account.instance}` : null), [account]);

  return useSWR(username ? ['personDetails', username] : null, () => {
    return client.getPersonDetails({
      auth: jwt,
      username: username!,
    });
  });
}
