import { getNextPageParam, getPreviousPageParam, normalizePages } from '@/services/utils';

// Shapes taken from https://dummyjson.com/posts?limit=10&skip=… (total: 251).
const page = (skip: number, limit: number) => ({ total: 251, skip, limit });

describe('getNextPageParam', () => {
  it('returns the next skip while items remain', () => {
    expect(getNextPageParam(page(0, 10))).toBe(10);
    expect(getNextPageParam(page(240, 10))).toBe(250);
  });

  it('returns undefined on the last page', () => {
    // The API shrinks `limit` to what is left: skip=250 returns 1 item.
    expect(getNextPageParam(page(250, 1))).toBeUndefined();
  });
});

describe('getPreviousPageParam', () => {
  it('returns undefined on the first page', () => {
    expect(getPreviousPageParam(page(0, 10))).toBeUndefined();
  });

  it('returns the previous skip, never below 0', () => {
    expect(getPreviousPageParam(page(20, 10))).toBe(10);
    expect(getPreviousPageParam(page(5, 10))).toBe(0);
  });
});

describe('normalizePages', () => {
  it('flattens the items of every page in order', () => {
    const pages = [
      { ...page(0, 2), posts: [{ id: 1 }, { id: 2 }] },
      { ...page(2, 2), posts: [{ id: 3 }] },
    ];
    expect(normalizePages(pages, 'posts').map((post) => post.id)).toEqual([1, 2, 3]);
  });

  it('returns an empty array before the first page loads', () => {
    expect(normalizePages(undefined, 'posts')).toEqual([]);
  });
});
