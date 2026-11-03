import type { PackageManager, ProjectOptions } from '../options.js';
import type { ProjectFiles } from '../utils/files.js';
import type { PackageJsonEditor } from '../utils/packageJson.js';

interface PmCommands {
  /** Runs a package.json script. */
  run: string;
  /** Runs a binary from node_modules/.bin. */
  exec: string;
  install: string;
  lockfile: string;
}

export const PM: Record<PackageManager, PmCommands> = {
  yarn: { run: 'yarn', exec: 'yarn', install: 'yarn install', lockfile: 'yarn.lock' },
  npm: { run: 'npm run', exec: 'npx', install: 'npm install', lockfile: 'package-lock.json' },
  pnpm: { run: 'pnpm', exec: 'pnpm exec', install: 'pnpm install', lockfile: 'pnpm-lock.yaml' },
  bun: { run: 'bun run', exec: 'bunx', install: 'bun install', lockfile: 'bun.lock' },
};

/** Best guess from how the CLI was launched (`npx`, `yarn create`, `pnpm create`, `bun create`). */
export function detectPackageManager(): PackageManager | undefined {
  const agent = process.env.npm_config_user_agent ?? '';
  if (agent.startsWith('yarn')) return 'yarn';
  if (agent.startsWith('pnpm')) return 'pnpm';
  if (agent.startsWith('bun')) return 'bun';
  if (agent.startsWith('npm')) return 'npm';
  return undefined;
}

// Comments, docs and hooks in the boilerplate say `yarn <script>`.
const TEXT_FILES = [
  '.env.example',
  '.easignore',
  '.husky/pre-commit',
  '.husky/post-merge',
  '.husky/common.sh',
  '.eas/workflows/build.yml',
  '.eas/workflows/build-fast.yml',
  '.eas/workflows/release.yml',
  'scripts/setup-env.mjs',
  'scripts/repack.mjs',
  'scripts/eas-pre-install.sh',
  '.vscode/settings.json',
  '.skills/api-hook-creation.md',
  '.skills/localization.md',
  '.skills/ui-creation.md',
];

/**
 * Rewrites `yarn …` mentions for another package manager. No-op for yarn.
 * `yarn <word>` is only rewritten when <word> is (a prefix of) a package.json
 * script, so prose like "if yarn still isn't on PATH" is left alone.
 */
export function rewriteYarnCommands(text: string, pm: PackageManager, scripts: string[]): string {
  if (pm === 'yarn') return text;
  const cmd = PM[pm];
  return text
    .replace(/\byarn\.lock\b/g, cmd.lockfile)
    .replace(/\byarn install\b/g, cmd.install)
    .replace(
      /\byarn (lint-staged|commitlint|eslint|prettier|tsc|jest|expo|eas)\b/g,
      `${cmd.exec} $1`,
    )
    .replace(/\byarn ([a-z][\w:.-]*)/g, (match, word: string) => {
      const name = word.replace(/[.:]+$/, '');
      return scripts.some((script) => script.startsWith(name)) ? `${cmd.run} ${word}` : match;
    })
    .replace(/command_exists yarn\b/g, `command_exists ${pm}`);
}

export async function applyPackageManager(
  files: ProjectFiles,
  pkg: PackageJsonEditor,
  options: ProjectOptions,
): Promise<void> {
  const scripts = Object.keys(pkg.data.scripts ?? {});
  const pm = options.packageManager;

  // Keep the boilerplate's lockfile only for yarn — it pins the known-good tree.
  if (pm !== 'yarn') {
    await files.remove('yarn.lock');

    for (const rel of TEXT_FILES) {
      if (!files.exists(rel)) continue;
      const content = await files.read(rel);
      const next = rewriteYarnCommands(content, pm, scripts);
      if (next !== content) await files.write(rel, next);
    }

    // EAS picks the package manager from the lockfile; the pinned yarn
    // version would otherwise force yarn on the build server.
    const eas = JSON.parse(await files.read('eas.json'));
    if (eas.build?.base?.yarn) delete eas.build.base.yarn;
    await files.write('eas.json', `${JSON.stringify(eas, null, 2)}\n`);
  }

  // Expo's Metro setup expects a flat node_modules.
  if (pm === 'pnpm') {
    await files.write('.npmrc', 'node-linker=hoisted\n');
  }

  // React Native declares exact-version peers (e.g. @react-native/jest-preset)
  // that drift between Expo patch releases. yarn, pnpm and bun warn; npm
  // refuses to install. Match the other package managers.
  if (pm === 'npm') {
    await files.write(
      '.npmrc',
      [
        '# React Native pins exact peer versions that drift between Expo patch',
        '# releases; yarn/pnpm/bun only warn about them, npm would refuse to install.',
        '# Run `npx expo install --check` to see what Expo recommends.',
        'legacy-peer-deps=true',
        '',
      ].join('\n'),
    );

    // eslint-plugin-react-hooks 7 imports `zod-validation-error/v4` but
    // accepts ^3.5 too; npm dedupes it onto the 3.x that
    // eslint-plugin-react-compiler brings, and ESLint crashes on start.
    if (options.eslint) {
      pkg.data.overrides = {
        ...(pkg.data.overrides as Record<string, unknown> | undefined),
        'eslint-plugin-react-hooks': { 'zod-validation-error': '^4.0.0' },
      };
    }
  }
}
