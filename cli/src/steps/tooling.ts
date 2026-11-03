import type { ProjectOptions } from '../options.js';
import type { ProjectFiles } from '../utils/files.js';
import type { PackageJsonEditor } from '../utils/packageJson.js';

const PRETTIER_GLOB = '"**/*.{js,jsx,ts,tsx,json}"';

/** ESLint and Husky toggles. Runs before the TS → JS pass. */
export async function applyTooling(
  files: ProjectFiles,
  pkg: PackageJsonEditor,
  options: ProjectOptions,
): Promise<void> {
  if (!options.eslint) await removeEslint(files, pkg);
  if (!options.husky) await removeHusky(files, pkg);
  else if (!options.eslint) {
    // Hooks stay, but lint-staged can only format now.
    await files.write(
      '.lintstagedrc',
      `${JSON.stringify({ '*.{js,jsx,ts,tsx,json}': ['prettier --write'] }, null, 2)}\n`,
    );
  }
}

async function removeEslint(files: ProjectFiles, pkg: PackageJsonEditor): Promise<void> {
  await files.remove('eslint.config.js');

  pkg
    .removeDeps('eslint', 'eslint-*', '@typescript-eslint/*', 'typescript-eslint')
    .removeScripts('lint', 'lint:fix')
    // Prettier stays: formatting is independent of linting.
    .setScripts({
      format: `prettier --write ${PRETTIER_GLOB}`,
      'format:check': `prettier --check ${PRETTIER_GLOB}`,
    });

  // VS Code: format JS/TS with Prettier instead of the ESLint extension.
  if (files.exists('.vscode/settings.json')) {
    const settings = JSON.parse(await files.read('.vscode/settings.json'));
    delete settings['eslint.format.enable'];
    delete settings['eslint.useFlatConfig'];
    settings['[javascript][javascriptreact][typescript][typescriptreact]'] = {
      'editor.formatOnSave': true,
      'editor.defaultFormatter': 'esbenp.prettier-vscode',
      'editor.codeActionsOnSave': { 'source.addMissingImports': 'explicit' },
    };
    await files.write('.vscode/settings.json', `${JSON.stringify(settings, null, 2)}\n`);
  }
  if (files.exists('.vscode/extensions.json')) {
    const extensions = JSON.parse(await files.read('.vscode/extensions.json'));
    extensions.recommendations = extensions.recommendations.filter(
      (id: string) => id !== 'dbaeumer.vscode-eslint',
    );
    await files.write('.vscode/extensions.json', `${JSON.stringify(extensions, null, 2)}\n`);
  }
}

async function removeHusky(files: ProjectFiles, pkg: PackageJsonEditor): Promise<void> {
  await files.remove('.husky', '.lintstagedrc', 'commitlint.config.js');
  pkg.removeDeps('husky', 'lint-staged', '@commitlint/*').removeScripts('prepare');
}
