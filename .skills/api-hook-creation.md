# API conventions for `src/api/` — React Native + Expo

> Source of truth for adding or modifying any API hook in this project. Intended to be read by humans and AI coding assistants alike (Claude Code, Cursor, Copilot, Codex, Aider, etc.). Follow it verbatim — do not invent a parallel structure.

This is a standalone Expo / React Native app. All API access goes through `react-query-kit` hooks under `src/api/`, routed via a single configured Axios client in `src/services/client.ts`. The client does most of the heavy lifting so individual hooks stay short, predictable, and easy to delete.

---

## What `src/services/client.ts` already handles

Do **not** re-implement any of these in a hook:

- **Bearer token injection** — pulled from encrypted MMKV (`src/storage/token.ts`) on every request.
- **Network connectivity check** — requests fail fast with a "No internet" toast (via NetInfo) instead of waiting out the 30s timeout. No need to check `useNetInfo()` from a screen before firing a query.
- **401 handling** — shows a "Session Expired" alert and triggers `useUserStore.logout()`. Or, when `ENABLE_TOKEN_REFRESH = true`, attempts a queued refresh-token flow and retries the original request transparently.
- **FormData detection** — when the request `data` is a `FormData` instance, the client sets `Content-Type: multipart/form-data` automatically. Image / file uploads work without per-call header tweaks.
- **Error toasts** — non-401 errors are parsed from `{ error[] | errors[] | message }` shapes and shown via `showErrorToast`. A mutation can pass an `onError` to suppress or override.
- **Dev request/response logging** — `__DEV__` only, with method + URL + status.

If you genuinely need to bypass one of these (e.g. a silent background sync), handle it at the `mutationFn` / `fetcher` level — do **not** edit `client.ts`.

---

## Step 1 — Gather these facts before writing any code

Do not guess. If the requester has not provided one of these, ask before proceeding.

1. **HTTP method** — `GET`, `POST`, `PUT`, `PATCH`, or `DELETE`.
2. **Endpoint path** — relative to `Env.EXPO_PUBLIC_API_URL` (e.g. `posts`, `users/login`, `posts/{id}`). Never the full URL.
3. **Module** — which folder under `src/api/`. Existing: `posts`. Create one new folder per resource (`auth`, `users`, `events`, …) using kebab-case. If unsure, propose a name and confirm.
4. **Path params** (URL placeholders such as `:id`) — list them.
5. **Query params** (e.g. `?page=1&limit=10`) — list them.
6. **Request body shape** — for non-GET, what fields the backend expects. If it's a file upload, confirm whether the body should be `FormData`.
7. **Response shape** — what the API actually returns. **No enforced envelope** in this project — `src/api/posts/use-posts.ts` unwraps `.data.posts`, others unwrap `.data` directly. Match reality, not an imagined wrapper.
8. **Paginated** — if the response is a list with `count` / `next` / `previous`, use `createInfiniteQuery` and reuse `PaginateQuery<T>` from `src/api/types.ts`.
9. **Auth required** — by default yes (every request carries the Bearer token automatically). The only call that bypasses the 401-interceptor loop is the refresh-token call itself, which is hard-wired in `client.ts`. If you have another genuinely public endpoint, mention it.

---

## Step 2 — File layout (rigid; do not deviate)

```
src/
├── services/                ← HTTP infrastructure (Axios client, QueryClientProvider, pagination utils)
│   ├── index.ts             ← re-exports api-provider, client, utils
│   ├── api-provider.tsx     ← APIProvider (QueryClientProvider) — do not touch unless intentionally changing query defaults
│   ├── client.ts            ← shared Axios instance — never recreate, never `import axios` elsewhere
│   └── utils.ts             ← DEFAULT_LIMIT, getQueryKey, normalizePages, getNextPageParam, getPreviousPageParam
└── api/
    ├── index.tsx            ← re-exports types and every module
    ├── types.ts             ← cross-module types (PaginateQuery<T>)
    └── <module>/
        ├── index.ts         ← exports types + every hook in this folder (alphabetical)
        ├── types.ts         ← request + response interfaces for this module
        ├── use-<action-1>.ts ← one hook per file
        ├── use-<action-2>.ts
        └── ...
```

Rules:
- **One hook per file.** Name: `use-<kebab-action>.ts` (e.g. `use-post.ts`, `use-add-post.ts`, `use-posts.ts`, `use-upload-avatar.ts`).
- **Types live in the module's `types.ts`.** Never inline a non-trivial request or response type in the hook file. Tiny one-line `Variables` aliases (`{ id: string }`) at the top of the hook are fine.
- **Module's `index.ts` re-exports** every sibling alphabetically: `export * from './types'; export * from './use-<action>';`.
- **New module folder** → add `export * from './<module>';` to `src/api/index.tsx`.
- **Hooks import `client` and helpers from `@/services`**, never from a relative `../common` path (that folder no longer exists).

---

## Step 3 — Endpoint strings

Inline the relative URL with a template literal — this project does **not** use a central `ENDPOINTS` constant. See `src/api/posts/use-post.ts`:

```ts
client.get(`posts/${variables.id}`, { signal })
```

Conventions:
- Always template literals — never `'posts/' + id` string concatenation.
- Always **relative** to `Env.EXPO_PUBLIC_API_URL` — never include the host. The base URL is configured once in `client.ts`.
- If a URL fragment is genuinely shared by several hooks in a module, lift it to a `const` at the top of the file that defines it, not into a cross-cutting helper.

---

## Step 4 — Types in `<module>/types.ts`

Each endpoint's types are separated by a section divider comment so the file scans easily. No enforced response envelope — define types that match the actual API shape.

```ts
// ─────────────────────────────────────────────────────────────
//  Post API types
// ─────────────────────────────────────────────────────────────

export type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

// Request body for the create endpoint
export interface AddPostRequest {
  title: string;
  body: string;
  userId: number;
}
```

**Naming:**
- Resource entity → `<Resource>` (e.g. `Post`, `User`).
- Request body → `<Action>Request` (e.g. `AddPostRequest`, `UpdatePostRequest`).
- Response data shape → reuse the entity (`Post`, `Post[]`) when possible; name it `<Action>Response` only when it's non-trivial.

**Paginated lists** reuse `PaginateQuery<T>` from `src/api/types.ts`:

```ts
import type { PaginateQuery } from '../types';

export type PostsListResponse = PaginateQuery<Post>;
```

`PaginateQuery<T>` is `{ results: T[]; count: number; next: string | null; previous: string | null }` — offset/URL-based, matching the DRF default. If the backend uses a different pagination shape, define a new helper in `src/api/types.ts` rather than diverging per module.

**File uploads:** the request type is `FormData`, not a specific interface. Document the expected fields in a comment above the hook.

Reference: `src/api/posts/types.ts`.

> **Note:** `PaginateQuery<T>` is imported from `src/api/types.ts`, not from `@/services`.

---

## Step 5 — Hook file template

Import order is fixed. Put `Variables` and `Response` type aliases at the top. Always end the request chain with `.then((response) => response.data)` — the SDK never returns the raw Axios response to consumers.

For any `GET` that backs UI, accept the second argument from `react-query-kit` and **forward `signal`** to Axios. That's how React Query cancels in-flight requests on unmount / key change — critical on mobile where users navigate away mid-fetch all the time.

### 5a. Mutation (POST / PUT / PATCH / DELETE)

Reference: `src/api/posts/use-add-post.ts`.

```ts
import { createMutation } from 'react-query-kit';
import type { AxiosError } from 'axios';

import { client } from '@/services';
import type { AddPostRequest, Post } from './types';

type Variables = AddPostRequest;
type Response = Post;

export const useAddPost = createMutation<Response, Variables, AxiosError>({
  mutationFn: async (variables) =>
    client({
      url: 'posts/add',
      method: 'POST',
      data: variables,
    }).then((response) => response.data),
});
```

### 5b. Mutation with a path param

Destructure the path param out of `variables`; send the rest as the body.

```ts
import { createMutation } from 'react-query-kit';
import type { AxiosError } from 'axios';

import { client } from '@/services';
import type { Post, UpdatePostRequest } from './types';

type Variables = UpdatePostRequest; // { id: string; ...rest }
type Response = Post;

export const useUpdatePost = createMutation<Response, Variables, AxiosError>({
  mutationFn: async (variables) => {
    const { id, ...payload } = variables;
    return client({
      url: `posts/${id}`,
      method: 'PUT',
      data: payload,
    }).then((response) => response.data);
  },
});
```

### 5c. Mutation with file upload (FormData)

The client auto-detects `FormData` and sets the correct `Content-Type` with the multipart boundary — do not set headers yourself.

```ts
import { createMutation } from 'react-query-kit';
import type { AxiosError } from 'axios';

import { client } from '@/services';

// Expected FormData fields:
//   - `file`: { uri, name, type } — the image/document blob
//   - `userId`: string
type Variables = FormData;
type Response = { url: string };

export const useUploadAvatar = createMutation<Response, Variables, AxiosError>({
  mutationFn: async (variables) =>
    client({
      url: 'users/avatar',
      method: 'POST',
      data: variables,
    }).then((response) => response.data),
});
```

### 5d. Query — no variables

Reference: `src/api/posts/use-posts.ts`.

```ts
import { createQuery } from 'react-query-kit';
import type { AxiosError } from 'axios';

import { client } from '@/services';
import type { Post } from './types';

type Variables = void;
type Response = Post[];

export const usePosts = createQuery<Response, Variables, AxiosError>({
  queryKey: ['posts'],
  fetcher: (_, { signal }) =>
    client.get('posts', { signal }).then((response) => response.data.posts),
});
```

`signal` is React Query's `AbortSignal`. Forwarding it to Axios is how the in-flight HTTP request is cancelled when the component unmounts or the query key changes — preventing both "setState on unmounted component" warnings and wasted bandwidth on cellular networks. **Forward `signal` on every UI-backing `GET`.**

### 5e. Query — with path param or query params

Reference: `src/api/posts/use-post.ts`.

```ts
import { createQuery } from 'react-query-kit';
import type { AxiosError } from 'axios';

import { client } from '@/services';
import type { Post } from './types';

type Variables = { id: string };
type Response = Post;

export const usePost = createQuery<Response, Variables, AxiosError>({
  queryKey: ['post'],
  fetcher: (variables, { signal }) =>
    client.get(`posts/${variables.id}`, { signal }).then((response) => response.data),
});
```

### 5f. Infinite query (paginated list)

Use `createInfiniteQuery`. Import `DEFAULT_LIMIT`, `getNextPageParam`, `getPreviousPageParam` from `@/services`. Our pagination shape is offset/URL-based — the helpers read the `next` / `previous` URLs from the page and extract `offset`.

```ts
import { createInfiniteQuery } from 'react-query-kit';
import type { AxiosError } from 'axios';

import { client, DEFAULT_LIMIT, getNextPageParam, getPreviousPageParam } from '@/services';
import type { PaginateQuery } from '../types';
import type { Post } from './types';

type Response = PaginateQuery<Post>;
type Variables = { search?: string; limit?: number };

export const usePostsInfinite = createInfiniteQuery<Response, Variables, AxiosError>({
  queryKey: ['postsInfinite'],
  fetcher: (variables, { pageParam, signal }) =>
    client
      .get('posts', {
        signal,
        params: {
          ...variables,
          limit: variables.limit ?? DEFAULT_LIMIT,
          offset: pageParam,
        },
      })
      .then((response) => response.data),
  initialPageParam: 0,
  getNextPageParam,
  getPreviousPageParam,
});
```

In the consumer, flatten pages with `normalizePages(data?.pages)` from `@/services` before passing to `FlatList` / `FlashList`.

---

## Step 6 — Wire up the exports

In `<module>/index.ts`, add the new file in **alphabetical** order:

```ts
export * from './types';
export * from './use-add-post';
export * from './use-post';
export * from './use-posts';
```

If a new module folder was created, add `export * from './<module>';` to `src/api/index.tsx`.

---

## Step 7 — Verify

After writing the code:

```bash
yarn type-check   # tsc --noEmit
yarn lint         # eslint .
yarn test         # jest — only if you added tests
```

Surface any failures explicitly before reporting the work as done.

---

## Consumer patterns (for the screens that call these hooks)

These are the call-site idioms you'll see in `app/(tabs)/home.tsx` etc. — repeat them so screens stay consistent.

**Loading + error states:**
```tsx
const { data, isLoading, error } = usePosts();
if (isLoading) return <FullScreenLoader />;
// Error toast is already shown by the Axios interceptor; render an empty/retry state if needed.
```

**Pull-to-refresh:**
```tsx
const { data, refetch, isRefetching } = usePosts();
return (
  <FlatList
    data={data}
    refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
    ...
  />
);
```

**Mutations — let the interceptor handle errors:**
```tsx
const { mutate, isPending } = useAddPost();
const onSubmit = (values: AddPostRequest) => mutate(values, {
  onSuccess: () => router.back(),
  // No onError needed for a generic API error — the toast is automatic.
});
```

**Mutations — when you DO want to suppress the global toast:**
```tsx
const { mutate } = useSyncDraft();
mutate(draft, {
  onError: () => {/* silent — background sync */},
});
```

**Optimistic update for a snappier UI:** use `onMutate` + `queryClient.setQueryData` from `useQueryClient`. Document the rollback in `onError`.

---

## Hard rules — never violate these

- **Never `import axios` directly** in a hook. Always use `client` from `@/services`.
- **Never import from a relative `../common` path** — that folder no longer exists. The infrastructure lives in `src/services/`; always import via the `@/services` alias.
- **Never inline a non-trivial request or response type in the hook file.** Declare it in the module's `types.ts`. Tiny one-line `Variables` aliases are fine.
- **Never use `useQuery` / `useMutation` directly from `@tanstack/react-query`.** The convention is `createQuery` / `createMutation` / `createInfiniteQuery` from `react-query-kit`.
- **Never add interceptors, headers, or auth-token logic in a hook.** That all lives in `src/services/client.ts`. The only header you'll ever set manually is when you genuinely need a non-standard one for a single endpoint (rare).
- **Never bypass the response unwrap.** Always end the chain with `.then((response) => response.data)` (or `response.data.<field>` when the API nests, see `use-posts.ts`). Consumers must never see the raw Axios wrapper.
- **Never multiplex two endpoints in one file.** One hook per file.
- **Never reference `Env.EXPO_PUBLIC_API_URL` or any `process.env.*` in a hook.** The base URL lives in `client`. Hooks pass relative paths only.
- **Always forward `signal`** to Axios on `GET`s that back UI — request cancellation is non-negotiable on mobile.
- **Never use `fetch`** for an API call. Even quick prototypes go through `client`, so the auth / offline / 401 machinery applies uniformly.

---

## Final checklist before reporting done

- [ ] Hook file at `src/api/<module>/use-<kebab-action>.ts` follows the right template (mutation / query / infinite query)
- [ ] Imports `client` from `@/services` — no direct `axios`, no recreated instance, no `../common` path
- [ ] Relative URL only — no `Env.EXPO_PUBLIC_API_URL` reference, no `http(s)://...` literal
- [ ] Request and response interfaces in `<module>/types.ts` with a section divider comment
- [ ] Type aliases `type Variables = ...; type Response = ...;` at the top
- [ ] `.then((response) => response.data)` closes the request chain
- [ ] `signal` forwarded on every UI-backing `GET`
- [ ] `<module>/index.ts` re-exports the new hook (alphabetical)
- [ ] If a new module was created: `src/api/index.tsx` re-exports it
- [ ] Paginated list uses `createInfiniteQuery` + `PaginateQuery<T>` + `getNextPageParam` / `getPreviousPageParam` (imported from `@/services`)
- [ ] FormData upload relies on the client's auto-detection — no manual `Content-Type` header
- [ ] `yarn type-check` passes
- [ ] `yarn lint` passes

---

## Reference index

| Pattern | File to read |
|---|---|
| Static GET, no params | `src/api/posts/use-posts.ts` |
| GET with path param | `src/api/posts/use-post.ts` |
| Plain POST mutation | `src/api/posts/use-add-post.ts` |
| Cross-module response / pagination types | `src/api/types.ts` |
| Shared Axios client (auth, network, 401, FormData, toasts, dev logs) | `src/services/client.ts` |
| Pagination + query-key helpers | `src/services/utils.ts` |
| QueryClientProvider wiring | `src/services/api-provider.tsx` |
| Token read/write/clear | `src/storage/token.ts` |
