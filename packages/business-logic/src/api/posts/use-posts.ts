import { createQuery } from 'react-query-kit';
import type { AxiosError } from 'axios';

import { client } from '../common';
import type { Post } from './types';

type Response = Post[];
type Variables = void;

export const usePosts = createQuery<Response, Variables, AxiosError>({
  queryKey: ['posts'],
  fetcher: () => {
    return client.get('posts').then((response) => response.data.posts);
  },
});
