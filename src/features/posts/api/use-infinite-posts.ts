import { createInfiniteQuery } from 'react-query-kit';
import type { AxiosError } from 'axios';

import { client, DEFAULT_LIMIT, getNextPageParam, getPreviousPageParam } from '@/services';

import type { PostsPage } from './types';

type Response = PostsPage;
type Variables = { limit?: number };

/**
 * Paginated posts list for infinite scrolling.
 *
 *   GET posts?limit=10&skip=0   → posts 1–10
 *   GET posts?limit=10&skip=10  → posts 11–20 …
 *
 * `pageParam` is the `skip` value for the page being fetched; the shared
 * helpers in `@/services` compute the next / previous one from the response.
 * React Query stores every page in `data.pages`; flatten them for the list:
 *
 *   const { data, fetchNextPage, hasNextPage } = useInfinitePosts();
 *   const posts = normalizePages(data?.pages, 'posts');
 */
export const useInfinitePosts = createInfiniteQuery<Response, Variables, AxiosError>({
  queryKey: ['posts', 'infinite'],
  fetcher: (variables, { pageParam, signal }) =>
    client
      .get('posts', {
        signal,
        params: {
          limit: variables?.limit ?? DEFAULT_LIMIT,
          skip: pageParam,
        },
      })
      .then((response) => response.data),
  initialPageParam: 0,
  getNextPageParam,
  getPreviousPageParam,
});
