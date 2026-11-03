import { join } from 'node:path';

import type { ProjectOptions } from '../options.js';
import { OVERLAYS_DIR } from '../template.js';
import type { ProjectFiles } from '../utils/files.js';
import type { PackageJsonEditor } from '../utils/packageJson.js';
import { pick } from '../versions.js';

const REDUX_ESLINT_RULE = `        {
          // Typed Redux hooks only — \`useSelector\` / \`useDispatch\` know nothing
          // about RootState. Use useAppSelector / useAppDispatch from '@/store'.
          selector:
            "ImportDeclaration[source.value='react-redux'] > ImportSpecifier[imported.name=/^(useSelector|useDispatch)$/]",
          message:
            "Use the typed hooks instead: import { useAppDispatch, useAppSelector } from '@/store'.",
        },
`;

/** Zustand is the base template; Redux Toolkit (thunk or saga) is an overlay. */
export async function applyState(
  files: ProjectFiles,
  pkg: PackageJsonEditor,
  options: ProjectOptions,
): Promise<void> {
  if (options.state === 'zustand') {
    await files.region('eslint.config.js', 'zustand');
    return;
  }

  const middleware = options.reduxMiddleware ?? 'thunk';

  await files.remove(
    'src/features/auth/store/useUserStore.ts',
    'src/features/auth/store/__tests__/useUserStore.test.ts',
    'src/store/createPersistedStore.ts',
  );
  await files.overlay(join(OVERLAYS_DIR, 'redux', 'common'));
  await files.overlay(join(OVERLAYS_DIR, 'redux', middleware));

  pkg
    .removeDeps('zustand')
    .addDeps(pick('@reduxjs/toolkit', 'react-redux', 'redux-persist'))
    .addDeps(middleware === 'saga' ? pick('redux-saga') : {});

  await files.region('eslint.config.js', 'zustand', REDUX_ESLINT_RULE);

  // Redux packages resolve to ESM builds under jest-expo's react-native
  // conditions, so Jest has to transform them.
  await files.replace(
    'jest.config.js',
    "'react-native-safe-area-context|react-native-toast-message' +",
    "'react-native-safe-area-context|react-native-toast-message|' +\n      'immer|redux|@reduxjs|reselect|react-redux|redux-persist|redux-saga|@redux-saga' +",
  );

  // Docs and editor config that name the Zustand store.
  await files.replace('.vscode/settings.json', '"persistor"', '"persistor", "redux"', {
    optional: true,
  });
}
