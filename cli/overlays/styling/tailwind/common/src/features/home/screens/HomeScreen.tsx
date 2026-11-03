import React, { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';

import { useCurrentUser } from '@/features/auth';
import { type Post, useAddPost, useInfinitePosts, usePost } from '@/features/posts';
import { useTranslate } from '@/localization/utils';
import { normalizePages } from '@/services';
import Button from '@/shared/components/Button';
import ScreenWrapper from '@/shared/components/ScreenWrapper';
import { showSuccessToast } from '@/shared/utils/toast';
import { useAppTheme } from '@/theme';

/**
 * Home screen — a small, working example of the three API hook shapes in
 * `src/features/posts/api`, all running against `EXPO_PUBLIC_API_URL`
 * (https://dummyjson.com/ in `.env.development`):
 *
 *   1. `useInfinitePosts()` → GET  posts?limit=&skip=  (paginated, infinite scroll)
 *   2. `usePost()`          → GET  posts/:id           (query with variables, lazily enabled)
 *   3. `useAddPost()`       → POST posts/add           (mutation)
 *
 * `usePosts()` (a plain, non-paginated list query) lives next to them as the
 * simplest reference.
 *
 * Network failures and API errors already show a toast from the shared Axios
 * client (`src/services/client.ts`), so screens only render the state.
 */
export function HomeScreen() {
  const theme = useAppTheme();
  const user = useCurrentUser();
  const translate = useTranslate();

  const [selectedId, setSelectedId] = useState<number | null>(null);

  // 1. Infinite query: fetches 10 posts per page and caches every page under
  //    ['posts', 'infinite']. `data.pages` holds one entry per page;
  //    `normalizePages` flattens them for the list. `total` comes from the API.
  const {
    data,
    isPending,
    isError,
    refetch,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfinitePosts();
  const posts = normalizePages(data?.pages, 'posts');
  const total = data?.pages[0]?.total ?? 0;

  // FlatList calls this when the user scrolls near the end. It can fire several
  // times in a row, so only fetch when another page exists and none is loading.
  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  };

  // 2. Detail query: `enabled` keeps it idle until a post is tapped.
  const { data: selectedPost, isFetching: isPostLoading } = usePost({
    variables: { id: String(selectedId) },
    enabled: selectedId !== null,
  });

  // 3. Mutation: nothing is sent until `addPost()` is called.
  const { mutate: addPost, isPending: isAdding } = useAddPost({
    onSuccess: (post) =>
      showSuccessToast({ title: translate('home.post_created', { id: post.id }) }),
  });

  const handleAddPost = () =>
    addPost({
      title: translate('home.demo_post_title'),
      body: translate('home.demo_post_body'),
      userId: 1,
    });

  const renderPost = ({ item }: { item: Post }) => {
    const isSelected = item.id === selectedId;
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ selected: isSelected }}
        className={`bg-surface gap-1 rounded-xl border p-4 ${isSelected ? 'border-primary' : 'border-border-gray'}`}
        onPress={() => setSelectedId(item.id)}
      >
        <Text className="text-body font-opensans-semibold text-typography" numberOfLines={1}>
          {item.title}
        </Text>
        <Text className="text-body-sm font-opensans text-text-gray" numberOfLines={2}>
          {item.body}
        </Text>
      </Pressable>
    );
  };

  const header = (
    <View>
      <Text className="text-h3 font-opensans-bold text-typography">
        {translate('auth.welcome')} {user?.email}
      </Text>
      <Text className="text-body-sm font-opensans text-text-gray mt-1">
        {translate('home.posts_subtitle')}
      </Text>

      <Button
        className="mb-3 mt-5"
        isLoading={isAdding}
        title={translate('home.create_post')}
        onPress={handleAddPost}
      />

      {selectedId !== null && (
        <View className="border-primary bg-primary-transparent gap-1 rounded-xl border p-4">
          <Text className="text-caption font-opensans-semibold text-primary uppercase tracking-widest">
            {translate('home.selected_post')}
          </Text>
          {isPostLoading || !selectedPost ? (
            <ActivityIndicator className="py-3" color={theme.colors.primary} />
          ) : (
            <>
              <Text className="text-body font-opensans-semibold text-typography">
                {selectedPost.title}
              </Text>
              <Text className="text-body-sm font-opensans text-text-gray">{selectedPost.body}</Text>
            </>
          )}
        </View>
      )}

      <Text className="text-body-lg font-opensans-semibold text-typography mt-5">
        {translate('home.posts_title')}
      </Text>
      {total > 0 && (
        <Text className="text-caption font-opensans text-text-gray">
          {translate('home.loaded_count', { loaded: posts.length, total })}
        </Text>
      )}
    </View>
  );

  const emptyState = isPending ? (
    <ActivityIndicator className="py-10" color={theme.colors.primary} size="large" />
  ) : (
    <View className="items-center py-10">
      <Text className="text-body font-opensans text-text-gray">
        {translate(isError ? 'home.load_error' : 'home.empty')}
      </Text>
      {isError && (
        <Button
          className="mt-4"
          title={translate('home.retry')}
          type="secondary"
          onPress={() => refetch()}
        />
      )}
    </View>
  );

  return (
    <ScreenWrapper>
      <FlatList
        contentContainerClassName="gap-3 p-5"
        data={posts}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={emptyState}
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator className="py-4" color={theme.colors.primary} />
          ) : undefined
        }
        ListHeaderComponent={header}
        refreshing={isRefetching}
        renderItem={renderPost}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        onRefresh={refetch}
      />
    </ScreenWrapper>
  );
}
