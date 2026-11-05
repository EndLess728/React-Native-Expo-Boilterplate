import { act, renderHook } from '@testing-library/react-native';

import { requestAppLoader, useIsAppLoaderVisible } from '@/shared/utils/appLoader';

describe('appLoader', () => {
  it('stays visible until every request is released', () => {
    const { result } = renderHook(() => useIsAppLoaderVisible());
    expect(result.current).toBe(false);

    let releaseFirst = () => {};
    let releaseSecond = () => {};
    act(() => {
      releaseFirst = requestAppLoader();
      releaseSecond = requestAppLoader();
    });
    expect(result.current).toBe(true);

    act(() => releaseFirst());
    expect(result.current).toBe(true);

    act(() => releaseSecond());
    expect(result.current).toBe(false);
  });

  it('ignores a second release of the same request', () => {
    const { result } = renderHook(() => useIsAppLoaderVisible());

    let releaseFirst = () => {};
    let releaseSecond = () => {};
    act(() => {
      releaseFirst = requestAppLoader();
      releaseSecond = requestAppLoader();
    });

    act(() => {
      releaseFirst();
      releaseFirst();
    });
    expect(result.current).toBe(true);

    act(() => releaseSecond());
    expect(result.current).toBe(false);
  });
});
