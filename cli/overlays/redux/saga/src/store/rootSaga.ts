import type { SagaIterator } from 'redux-saga';
import { all, fork } from 'redux-saga/effects';

// src/store is app-level wiring: it may import feature sagas directly.
import { authSaga } from '@/features/auth/store/authSaga';

export function* rootSaga(): SagaIterator {
  yield all([
    fork(authSaga),
    // Fork new feature sagas here as the app grows.
  ]);
}
