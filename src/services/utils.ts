import type { PaginateQuery, PaginationMeta } from '@/services/types';

type KeyParams = {
  [key: string]: any;
};

/** Default page size sent as `limit` by infinite queries. */
export const DEFAULT_LIMIT = 10;

export function getQueryKey<T extends KeyParams>(key: string, params?: T) {
  return [key, ...(params ? [params] : [])];
}

// ─────────────────────────────────────────────────────────────
//  Infinite-query helpers for limit / skip pagination
// ─────────────────────────────────────────────────────────────
//
//  `pageParam` is the `skip` value of the page to fetch. Pass these straight
//  to `createInfiniteQuery` (see src/features/posts/api/use-infinite-posts.ts):
//
//    initialPageParam: 0,
//    getNextPageParam,
//    getPreviousPageParam,
//
//  Returning `undefined` tells React Query there is no such page, which is
//  what turns `hasNextPage` / `hasPreviousPage` false.

/** `skip` for the page after `page`, or `undefined` once every item is loaded. */
export const getNextPageParam = (page: PaginationMeta): number | undefined => {
  const nextSkip = page.skip + page.limit;
  return nextSkip < page.total ? nextSkip : undefined;
};

/** `skip` for the page before `page`, or `undefined` on the first page. */
export const getPreviousPageParam = (page: PaginationMeta): number | undefined =>
  page.skip > 0 ? Math.max(page.skip - page.limit, 0) : undefined;

/**
 * Flattens infinite-query pages into one array for a FlatList / FlashList.
 *
 *   const posts = normalizePages(data?.pages, 'posts');
 */
export function normalizePages<K extends string, T>(
  pages: PaginateQuery<K, T>[] | undefined,
  key: K,
): T[] {
  return pages?.flatMap((page) => page[key] as T[]) ?? [];
}
