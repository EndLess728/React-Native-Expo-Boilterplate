import { createQuery } from 'react-query-kit';
import type { AxiosError } from 'axios';

import { client } from '../common';
import type { Post } from './types';

type Variables = { id: string };
type Response = Post;

export const usePost = createQuery<Response, Variables, AxiosError>({
  queryKey: ['post'],
  fetcher: (variables, { signal }) => {
    // `signal` is an AbortSignal provided by React Query.
    // Passing it to Axios lets React Query cancel the in-flight HTTP request
    // automatically when the component unmounts or the query key changes —
    // preventing state updates on unmounted components and wasted bandwidth.
    return client.get(`posts/${variables.id}`, { signal }).then((response) => response.data);
  },
});
