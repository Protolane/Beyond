import type { GetPersonDetails } from 'lemmy-js-client';
import { LemmyHttp } from 'lemmy-js-client';
import useSWRInfinite from 'swr/infinite';
import type { Account } from '../stores/AccountsStore';
import { useAccountsStore } from '../stores/AccountsStore';
import React from 'react';
import useSWR from 'swr';
import { usePostsStore } from '../stores/PostsStore';
import type { CommentSortType } from 'lemmy-js-client/dist/types/CommentSortType';
import { useCommentsStore } from '../stores/CommentsStore';

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

  const limit = 10;

  return useSWRInfinite(
    page => ['posts', baseUrl, sort, type_, limit, page],
    ([, , , , , page]) => {
      return client.getPosts({
        limit,
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

// TODO remove usages, use infinite swr instead
/** @deprecated */
export function usePost(postId: number) {
  const { baseUrl, client, jwt } = useLemmyClient();

  return useSWR(['posts', baseUrl, postId], ([, , page]) => {
    return client.getPost({
      id: postId,
      auth: jwt,
    });
  });
}

export function useComments(postId: number) {
  const { baseUrl, client, jwt } = useLemmyClient();
  const limit = 20;

  const { sort, type_ } = useCommentsStore(state => ({
    sort: state.sort,
    type_: state.type,
  }));

  return useSWRInfinite(
    page => ['comments', baseUrl, postId, limit, sort, type_, page],
    ([, , , , , , page]) => {
      return client.getComments({
        auth: jwt,
        post_id: postId,
        limit,
        page,
        sort,
        type_,
      });
    },
    {
      parallel: true,
      initialSize: 2,
      revalidateAll: true,
      revalidateFirstPage: true,
    }
  );
}

export function usePersonDetails(account?: Pick<Account, 'username' | 'instance'>) {
  const { baseUrl, client, jwt } = useLemmyClient();

  const username = React.useMemo(() => (account ? `${account.username}@${account.instance}` : null), [account]);

  return useSWR(username ? ['personDetails', baseUrl, username] : null, () => {
    return client.getPersonDetails({
      auth: jwt,
      username: username!,
    });
  });
}
