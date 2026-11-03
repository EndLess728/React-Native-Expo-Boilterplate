import { toPackageName, toScheme, type ProjectOptions } from '../options.js';
import type { ProjectFiles } from '../utils/files.js';
import type { PackageJsonEditor } from '../utils/packageJson.js';

// Placeholder identity baked into the boilerplate.
const TEMPLATE = {
  displayName: 'ExpoTemplate',
  slug: 'ExpoTemplate',
  scheme: 'expotemplate',
  bundleId: 'com.expo.template',
};

/** Renames the app: package name, display names, slug, scheme and bundle id. */
export async function applyIdentity(
  files: ProjectFiles,
  pkg: PackageJsonEditor,
  options: ProjectOptions,
): Promise<void> {
  const packageName = toPackageName(options.projectName);
  const { displayName, bundleId } = options;

  pkg.data.name = packageName;

  await files.replace('app.config.ts', `slug: '${TEMPLATE.slug}'`, `slug: '${packageName}'`);
  await files.replace(
    'app.config.ts',
    `scheme: '${TEMPLATE.scheme}'`,
    `scheme: '${toScheme(options.projectName)}'`,
  );

  // env.ts — per-environment app names and the bundle id (incl. the
  // commented multi-package example).
  await files.replace('env.ts', `'${TEMPLATE.displayName} (Dev)'`, `'${displayName} (Dev)'`);
  await files.replace(
    'env.ts',
    `'${TEMPLATE.displayName} (Staging)'`,
    `'${displayName} (Staging)'`,
  );
  await files.replace(
    'env.ts',
    `production: '${TEMPLATE.displayName}'`,
    `production: '${displayName}'`,
  );
  await files.replace('env.ts', TEMPLATE.bundleId, bundleId);

  await files.replace(
    '__mocks__/@env.ts',
    `'${TEMPLATE.displayName} (Dev)'`,
    `'${displayName} (Dev)'`,
  );
  await files.replace('__mocks__/@env.ts', `'${TEMPLATE.bundleId}'`, `'${bundleId}'`);

  await files.replace(
    '.env.example',
    '# reactnativetemplateapp env template',
    `# ${packageName} env template`,
    {
      optional: true,
    },
  );
}
