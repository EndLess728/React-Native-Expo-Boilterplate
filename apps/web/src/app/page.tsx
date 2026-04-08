'use client';

import { usePosts } from '@repo/business-logic';

export default function HomePage() {
  const { data: posts, isLoading, error } = usePosts();

  if (isLoading) return <p>Loading posts...</p>;
  if (error) return <p>Error loading posts.</p>;

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Posts</h1>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {posts?.map((post) => (
          <li key={post.id} style={{ marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
            <h3>{post.title}</h3>
            <p>{post.body}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
