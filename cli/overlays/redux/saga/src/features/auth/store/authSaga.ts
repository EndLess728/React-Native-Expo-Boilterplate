import type { PayloadAction } from '@reduxjs/toolkit';
import type { SagaIterator } from 'redux-saga';
import { call, put, takeLatest } from 'redux-saga/effects';

import { translate } from '@/localization/utils';
import { showSuccessToast } from '@/shared/utils/toast';

import { authenticate } from '../api/authenticate';
import type { LoginCredentials, User } from '../types';
import { loginFailure, loginRequest, loginSuccess } from './authSlice';

export function* handleLogin(action: PayloadAction<LoginCredentials>): SagaIterator {
  try {
    const user: User = yield call(authenticate, action.payload);
    yield put(loginSuccess(user));
    yield call(showSuccessToast, { title: translate('auth.login_success') });
  } catch (error) {
    // API errors are already surfaced as toasts by the Axios client.
    yield put(loginFailure(error instanceof Error ? error.message : String(error)));
  }
}

export function* authSaga(): SagaIterator {
  // takeLatest: a second tap on "Sign in" cancels the in-flight attempt.
  yield takeLatest(loginRequest.type, handleLogin);
}
