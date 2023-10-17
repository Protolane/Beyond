import type { GetCommentsResponse, GetPostsResponse } from 'lemmy-js-client';
import { LemmyHttp } from 'lemmy-js-client';
import type { SWRInfiniteResponse } from 'swr/infinite';
import useSWRInfinite from 'swr/infinite';
import type { Account } from '../stores/AccountsStore';
import { useAccountsStore } from '../stores/AccountsStore';
import React from 'react';
import type { SWRConfiguration } from 'swr';
import useSWR, { mutate } from 'swr';
import { usePostsStore } from '../stores/PostsStore';
import { useCommentsStore } from '../stores/CommentsStore';
import { sessionExpiredForm } from '../ui/UI';

const infiniteSWRCacheKeyPrefix = '$inf$@';
const SWRCacheKeyPrefix = '@';
export const swrDefaults: SWRConfiguration = {
  refreshInterval: 0,
  // auto revalidate when window gets focused
  revalidateOnFocus: false,
  // enable or disable automatic revalidation when component is mounted
  // (by default revalidation occurs on mount when fallbackData is not set, use this flag to force behavior)
  revalidateOnMount: true,
  revalidateIfStale: false,
  keepPreviousData: false,
  // automatically revalidate when the browser regains a network connection (via navigator.onLine)
  revalidateOnReconnect: false,
  // polling when the window is invisible
  refreshWhenOffline: false,
  // polling when the browser is offline
  refreshWhenHidden: false,
  // retry on errors (including timeouts)
  shouldRetryOnError: true,
  loadingTimeout: 6000,
};

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

  return {
    baseUrl,
    jwt: selectedAccount?.jwt,
    client: lemmyClientInterceptor(client),
  };
}

const postsBaseKey = 'posts';
export function usePosts(community_name?: string): SWRInfiniteResponse<GetPostsResponse> {
  const { baseUrl, client, jwt } = useLemmyClient();
  const { sort, type_ } = usePostsStore(state => ({
    sort: state.sort,
    type_: state.type,
  }));

  const limit = 10;

  return useSWRInfinite(
    page => [postsBaseKey, baseUrl, sort, type_, limit, community_name, page],
    ([, , , , , , page]) => {
      return client.getPosts({
        auth: jwt,
        limit,
        sort,
        type_,
        page,
        community_name,
      });
    },
    {
      ...swrDefaults,
      initialSize: 2,
      revalidateAll: true,
      parallel: true,
    }
  );
}

function useRefreshCache(base: string) {
  const refresh = React.useCallback(
    () =>
      mutate(
        key => {
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

export function useSite() {
  const { baseUrl, client, jwt } = useLemmyClient();

  return useSWR(['site', baseUrl], () => {
    return client.getSite({
      auth: jwt,
    });
  });
}

const commentsBaseKey = 'comments';
export function useComments(
  postId?: number,
  parent_id?: number,
  max_depth?: number
): SWRInfiniteResponse<GetCommentsResponse> {
  const { baseUrl, client, jwt } = useLemmyClient();
  const limit = 25;

  const { sort, type_ } = useCommentsStore(state => ({
    sort: state.sort,
    type_: state.type,
  }));

  return useSWRInfinite(
    page =>
      postId !== null ? [commentsBaseKey, baseUrl, postId, limit, sort, type_, parent_id, max_depth, page] : null,
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
      ...swrDefaults,
      initialSize: 2,
      revalidateAll: true,
      parallel: true,
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

function lemmyClientInterceptor(client: LemmyHttp) {
  return new Proxy(client, {
    get(target, prop, receiver) {
      const reflection = Reflect.get(target, prop, receiver);
      if (typeof reflection !== 'function') return reflection;

      // @ts-ignore
      return (...args) => {
        const promise = reflection.apply(target, args);

        if (promise.then !== undefined) {
          return promise.then((response: any) => {
            const user = useAccountsStore.getState().selectedAccount;

            if (response.error === 'not_logged_in' && user?.jwt) {
              return sessionExpiredForm().then(sessionExpiredFormResponse => {
                if (sessionExpiredFormResponse.password && user?.username) {
                  return client
                    .login({
                      username_or_email: user.username,
                      password: sessionExpiredFormResponse.password,
                    })
                    .then(loginResponse => {
                      if (loginResponse.jwt) {
                        useAccountsStore.getState().setSelectedAccount({
                          ...useAccountsStore.getState().selectedAccount,
                          jwt: loginResponse.jwt,
                        });

                        const newArgs: typeof args = JSON.parse(JSON.stringify(args));
                        if (newArgs?.[0]?.auth) newArgs[0].auth = loginResponse.jwt;
                        return reflection.apply(target, newArgs);
                      }

                      throw new Error('Could not login, wrong credentials?');
                    });
                }

                throw new Error('Could not log in.');
              });
            }

            return response;
          });
        }

        return promise;
      };
    },
  }) as LemmyHttp;
}
