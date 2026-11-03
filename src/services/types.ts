/**
 * Pagination fields every DummyJSON list endpoint returns
 * (https://dummyjson.com/docs — "Limit and skip").
 *
 *   GET posts?limit=10&skip=20 → { posts: [...], total: 251, skip: 20, limit: 10 }
 */
export type PaginationMeta = {
  /** Total number of items on the server. */
  total: number;
  /** How many items were skipped before this page. */
  skip: number;
  /** How many items this page holds (smaller than requested on the last page). */
  limit: number;
};

/**
 * One page of a list endpoint. The items sit under a key named after the
 * resource, so it is a type parameter:
 *
 *   PaginateQuery<'posts', Post>    → { posts: Post[]; total; skip; limit }
 *   PaginateQuery<'users', User>    → { users: User[]; total; skip; limit }
 */
export type PaginateQuery<K extends string, T> = PaginationMeta & { [P in K]: T[] };
