// The one place allowed to import the untyped react-redux hooks.
// eslint-disable-next-line no-restricted-syntax
import { useDispatch, useSelector } from 'react-redux';

import type { AppDispatch, RootState } from './store';

// Typed hooks — use these everywhere instead of `useDispatch` / `useSelector`.
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
