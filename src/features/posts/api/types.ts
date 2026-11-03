import type { PaginateQuery } from '@/services/types';

export type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

/**
 * One page of `GET posts?limit=&skip=` (https://dummyjson.com/docs/posts):
 * `{ posts: Post[]; total; skip; limit }`.
 */
export type PostsPage = PaginateQuery<'posts', Post>;
