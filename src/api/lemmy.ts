import { LemmyHttp } from 'lemmy-js-client';
import useSWRInfinite from 'swr/infinite';
import type { Account } from '../stores/AccountsStore';
import { useAccountsStore } from '../stores/AccountsStore';
import React from 'react';
import useSWR from 'swr';
import { usePostsStore } from '../stores/PostsStore';
import { useCommentsStore } from '../stores/CommentsStore';
import { mutate } from 'swr';

const infiniteSWRCacheKeyPrefix = '$inf$@';
const SWRCacheKeyPrefix = '@';

export function useLemmyClient() {
  const { selectedAccount } = useAccountsStore(state => ({
    selectedAccount: state.selectedAccount,
    setSelectedAccount: state.setSelectedAccount,
    accounts: state.accounts,
    removeAccount: state.removeAccount,
  }));

  const baseUrl = React.useMemo(() => selectedAccount?.instance, [selectedAccount]);
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

const postsBaseKey = 'posts';
export function usePosts(community_name?: string) {
  const { baseUrl, client } = useLemmyClient();
  const { sort, type_ } = usePostsStore(state => ({
    sort: state.sort,
    type_: state.type,
  }));

  const limit = 10;

  return useSWRInfinite(
    page => [postsBaseKey, baseUrl, sort, type_, limit, community_name, page],
    ([, , , , , , page]) => {
      return client.getPosts({
        limit,
        sort,
        type_,
        page,
        community_name,
      });
    },
    {
      initialSize: 2,
    }
  );
}

function useRefreshCache(base: string) {
  const refresh = React.useCallback(
    () =>
      mutate(
        key => {
          console.log(key);
          if (typeof key === 'string') {
            return (
              key.startsWith(`${infiniteSWRCacheKeyPrefix}"${base}`) || key.startsWith(`${SWRCacheKeyPrefix}"${base}`)
            );
          }
          if (Array.isArray(key)) {
            return key[0] === base;
          }
        },
        undefined,
        {
          revalidate: true,
        }
      ),
    [base]
  );

  return {
    refresh,
  };
}

export function useRefreshPostsCache() {
  return useRefreshCache(postsBaseKey);
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

const commentsBaseKey = 'comments';
export function useComments(postId: number, parent_id?: number, max_depth?: number) {
  const { baseUrl, client, jwt } = useLemmyClient();
  const limit = 25;

  const { sort, type_ } = useCommentsStore(state => ({
    sort: state.sort,
    type_: state.type,
  }));

  return useSWRInfinite(
    page => [commentsBaseKey, baseUrl, postId, limit, sort, type_, parent_id, max_depth, page],
    ([, , , , , , , , page]) => {
      return client.getComments({
        auth: jwt,
        post_id: postId,
        limit,
        page,
        sort,
        type_,
        parent_id,
        max_depth,
      });
    },
    {
      initialSize: 2,
    }
  );
}

export function useRefreshCommentsCache() {
  return useRefreshCache(commentsBaseKey);
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
