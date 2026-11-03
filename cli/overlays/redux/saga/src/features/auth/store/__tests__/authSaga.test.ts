import type { UnknownAction } from '@reduxjs/toolkit';
import { runSaga } from 'redux-saga';

import { authenticate } from '../../api/authenticate';
import { handleLogin } from '../authSaga';
import { loginFailure, loginRequest, loginSuccess } from '../authSlice';

jest.mock('@/shared/utils/toast', () => ({ showSuccessToast: jest.fn() }));
jest.mock('@/localization/utils', () => ({ translate: (key: string) => key }));
jest.mock('../../api/authenticate', () => ({ authenticate: jest.fn() }));

const credentials = { email: 'test@example.com', password: 'secret123' };

async function run(action: ReturnType<typeof loginRequest>) {
  const dispatched: UnknownAction[] = [];
  await runSaga(
    { dispatch: (a: UnknownAction) => dispatched.push(a) },
    handleLogin,
    action,
  ).toPromise();
  return dispatched;
}

describe('authSaga', () => {
  it('dispatches loginSuccess with the authenticated user', async () => {
    jest.mocked(authenticate).mockResolvedValue({ email: credentials.email });

    const dispatched = await run(loginRequest(credentials));

    expect(authenticate).toHaveBeenCalledWith(credentials);
    expect(dispatched).toContainEqual(loginSuccess({ email: credentials.email }));
  });

  it('dispatches loginFailure when authentication throws', async () => {
    jest.mocked(authenticate).mockRejectedValue(new Error('Invalid credentials'));

    const dispatched = await run(loginRequest(credentials));

    expect(dispatched).toContainEqual(loginFailure('Invalid credentials'));
  });
});
