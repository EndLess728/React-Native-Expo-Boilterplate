import { join } from 'node:path';

import type { ProjectOptions } from '../options.js';
import { OVERLAYS_DIR } from '../template.js';
import type { ProjectFiles } from '../utils/files.js';
import type { PackageJsonEditor } from '../utils/packageJson.js';
import { pick } from '../versions.js';

/** Expo Router is the base template; React Navigation is an overlay. */
export async function applyNavigation(
  files: ProjectFiles,
  pkg: PackageJsonEditor,
  options: ProjectOptions,
): Promise<void> {
  if (options.navigation === 'expo-router') return;

  // Screens already live in src/features — the route files are just re-exports.
  await files.remove('src/app');
  await files.overlay(join(OVERLAYS_DIR, 'react-navigation'));

  await files.replace(
    'src/shared/hooks/useBlockBackNavigation.ts',
    "import { useNavigation } from 'expo-router';",
    "import { useNavigation } from '@react-navigation/native';",
  );

  await files.replace('app.config.ts', "    'expo-router',\n", '');
  await files.replace('app.config.ts', '    typedRoutes: true,\n', '');

  pkg
    .removeDeps('expo-router')
    .addDeps(
      pick(
        '@react-navigation/native',
        '@react-navigation/native-stack',
        '@react-navigation/bottom-tabs',
      ),
    );

  // AI-assistant docs.
  await files.replace(
    '.skills/ui-creation.md',
    '  app/                     ← Expo Router routes — one-line re-exports of feature screens\n',
    '  navigation/              ← React Navigation navigators, param lists, linking config\n',
    { optional: true },
  );
  await files.replace(
    '.skills/ui-creation.md',
    "The route file under `src/app/` is a single line: `export { SettingsScreen as default } from '@/features/settings';`.",
    'Register it in the right navigator under `src/navigation/` and add its route name to `NAVIGATION` (`src/shared/constants/navigation.ts`) and its params to `src/navigation/types.ts`.',
    { optional: true },
  );
}
