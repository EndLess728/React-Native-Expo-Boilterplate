import React, { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { useCurrentUser } from '@/features/auth';
import { type Post, useAddPost, useInfinitePosts, usePost } from '@/features/posts';
import { useTranslate } from '@/localization/utils';
import { normalizePages } from '@/services';
import Button from '@/shared/components/Button';
import ScreenWrapper from '@/shared/components/ScreenWrapper';
import { ms } from '@/shared/utils';
import { showSuccessToast } from '@/shared/utils/toast';
import { TextStyles } from '@/theme';

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
  const { theme } = useUnistyles();
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
        style={[styles.card, isSelected && styles.cardSelected]}
        onPress={() => setSelectedId(item.id)}
      >
        <Text numberOfLines={1} style={[TextStyles.bodySemiBold, styles.text]}>
          {item.title}
        </Text>
        <Text numberOfLines={2} style={[TextStyles.bodySmall, styles.mutedText]}>
          {item.body}
        </Text>
      </Pressable>
    );
  };

  const header = (
    <View>
      <Text style={[TextStyles.h3, styles.text]}>
        {translate('auth.welcome')} {user?.email}
      </Text>
      <Text style={[TextStyles.bodySmall, styles.mutedText, styles.subtitle]}>
        {translate('home.posts_subtitle')}
      </Text>

      <Button
        isLoading={isAdding}
        style={styles.addButton}
        title={translate('home.create_post')}
        onPress={handleAddPost}
      />

      {selectedId !== null && (
        <View style={[styles.card, styles.detailCard]}>
          <Text style={[TextStyles.overline, styles.primaryText]}>
            {translate('home.selected_post')}
          </Text>
          {isPostLoading || !selectedPost ? (
            <ActivityIndicator color={theme.colors.primary} style={styles.detailLoader} />
          ) : (
            <>
              <Text style={[TextStyles.bodySemiBold, styles.text]}>{selectedPost.title}</Text>
              <Text style={[TextStyles.bodySmall, styles.mutedText]}>{selectedPost.body}</Text>
            </>
          )}
        </View>
      )}

      <Text style={[TextStyles.bodyLargeSemiBold, styles.text, styles.sectionTitle]}>
        {translate('home.posts_title')}
      </Text>
      {total > 0 && (
        <Text style={[TextStyles.caption, styles.mutedText]}>
          {translate('home.loaded_count', { loaded: posts.length, total })}
        </Text>
      )}
    </View>
  );

  const emptyState = isPending ? (
    <ActivityIndicator color={theme.colors.primary} size="large" style={styles.stateBox} />
  ) : (
    <View style={styles.stateBox}>
      <Text style={[TextStyles.body, styles.mutedText]}>
        {translate(isError ? 'home.load_error' : 'home.empty')}
      </Text>
      {isError && (
        <Button
          style={styles.retryButton}
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
        contentContainerStyle={styles.list}
        data={posts}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={emptyState}
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator color={theme.colors.primary} style={styles.footerLoader} />
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

const styles = StyleSheet.create((theme) => ({
  list: {
    padding: ms(20),
    gap: ms(12),
  },
  text: {
    color: theme.colors.typography,
  },
  mutedText: {
    color: theme.colors.textGray,
  },
  primaryText: {
    color: theme.colors.primary,
  },
  subtitle: {
    marginTop: ms(4),
  },
  addButton: {
    marginTop: ms(20),
    marginBottom: ms(12),
  },
  card: {
    gap: ms(4),
    padding: ms(16),
    borderRadius: ms(12),
    borderWidth: 1,
    borderColor: theme.colors.borderGray,
    backgroundColor: theme.colors.surface,
  },
  cardSelected: {
    borderColor: theme.colors.primary,
  },
  detailCard: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryTransparent,
  },
  detailLoader: {
    paddingVertical: ms(12),
  },
  sectionTitle: {
    marginTop: ms(20),
  },
  stateBox: {
    paddingVertical: ms(40),
    alignItems: 'center',
  },
  retryButton: {
    marginTop: ms(16),
  },
  footerLoader: {
    paddingVertical: ms(16),
  },
}));
