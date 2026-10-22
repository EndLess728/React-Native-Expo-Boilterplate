#!/usr/bin/env node
/**
 * Copies the boilerplate (the repo root) into `cli/template/` so it ships
 * inside the npm package. Runs on `prepack`, after `build`.
 *
 * The repo root stays the single source of truth: nobody edits
 * `cli/template/` by hand (it is gitignored).
 */
import { copyFile, mkdir, rm } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { listRepoTemplateFiles, RENAMED_DOTFILES } from '../dist/template.js';

const cliRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = resolve(cliRoot, '..');
const templateDir = join(cliRoot, 'template');

await rm(templateDir, { recursive: true, force: true });

const files = listRepoTemplateFiles(repoRoot);
for (const file of files) {
  const parts = file.split('/');
  const base = parts[parts.length - 1];
  if (RENAMED_DOTFILES[base]) parts[parts.length - 1] = RENAMED_DOTFILES[base];
  const dest = join(templateDir, ...parts);
  await mkdir(dirname(dest), { recursive: true });
  await copyFile(join(repoRoot, file), dest);
}

console.log(`Synced ${files.length} template files into cli/template/`);
