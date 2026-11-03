import { createQuery } from 'react-query-kit';
import type { AxiosError } from 'axios';

import { client } from '@/services';

import type { Post } from './types';

type Response = Post[];
type Variables = void;

export const usePosts = createQuery<Response, Variables, AxiosError>({
  queryKey: ['posts'],
  fetcher: (_, { signal }) => {
    // `signal` is an AbortSignal provided by React Query.
    // Passing it to Axios lets React Query cancel the in-flight HTTP request
    // automatically when the component unmounts or the query key changes —
    // preventing state updates on unmounted components and wasted bandwidth.
    return client.get(`posts`, { signal }).then((response) => response.data.posts);
  },
});
