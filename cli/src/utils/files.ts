import { existsSync } from 'node:fs';
import { cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join, relative, sep } from 'node:path';

/**
 * Small file helpers scoped to the generated project. Every path argument is
 * relative to the project root and uses forward slashes.
 */
export class ProjectFiles {
  constructor(readonly root: string) {}

  abs(rel: string): string {
    return join(this.root, ...rel.split('/'));
  }

  exists(rel: string): boolean {
    return existsSync(this.abs(rel));
  }

  async read(rel: string): Promise<string> {
    return readFile(this.abs(rel), 'utf8');
  }

  async write(rel: string, content: string): Promise<void> {
    const file = this.abs(rel);
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, content);
  }

  async remove(...rels: string[]): Promise<void> {
    for (const rel of rels) {
      await rm(this.abs(rel), { recursive: true, force: true });
    }
  }

  async move(from: string, to: string): Promise<void> {
    const content = await readFile(this.abs(from));
    await mkdir(dirname(this.abs(to)), { recursive: true });
    await writeFile(this.abs(to), content);
    await rm(this.abs(from));
  }

  /**
   * Replaces `search` in a file. Throws when it isn't found so template drift
   * fails loudly (and in CI) instead of silently producing a broken project.
   * Pass `optional: true` for best-effort edits to docs.
   */
  async replace(
    rel: string,
    search: string | RegExp,
    replacement: string,
    { optional = false }: { optional?: boolean } = {},
  ): Promise<boolean> {
    if (!this.exists(rel)) {
      if (optional) return false;
      throw new Error(`[create-expo-boilerplate] Expected file not found: ${rel}`);
    }
    const content = await this.read(rel);
    const found = typeof search === 'string' ? content.includes(search) : search.test(content);
    if (!found) {
      if (optional) return false;
      throw new Error(
        `[create-expo-boilerplate] Template drift: could not find ${String(search)} in ${rel}`,
      );
    }
    const next =
      typeof search === 'string'
        ? content.split(search).join(replacement)
        : content.replace(search, replacement);
    await this.write(rel, next);
    return true;
  }

  /** Copies an overlay directory on top of the project (same relative layout). */
  async overlay(overlayDir: string): Promise<void> {
    await cp(overlayDir, this.root, { recursive: true, force: true });
  }

  /** Lists every file under `dir` (relative, forward slashes), skipping node_modules and .git. */
  async list(dir = ''): Promise<string[]> {
    const out: string[] = [];
    const walk = async (absDir: string) => {
      for (const entry of await readdir(absDir, { withFileTypes: true })) {
        if (entry.name === 'node_modules' || entry.name === '.git') continue;
        const full = join(absDir, entry.name);
        if (entry.isDirectory()) await walk(full);
        else out.push(relative(this.root, full).split(sep).join('/'));
      }
    };
    if (this.exists(dir)) await walk(this.abs(dir));
    return out.sort();
  }

  /**
   * Handles `// @cli:<name>-start` … `// @cli:<name>-end` regions. With
   * `replacement` undefined the markers are stripped and the body kept;
   * otherwise the whole region (markers included) is replaced.
   */
  async region(rel: string, name: string, replacement?: string): Promise<void> {
    const content = await this.read(rel);
    const re = new RegExp(
      `^[ \\t]*// @cli:${name}-start.*\\n([\\s\\S]*?)^[ \\t]*// @cli:${name}-end.*\\n`,
      'm',
    );
    const match = content.match(re);
    if (!match) {
      throw new Error(
        `[create-expo-boilerplate] Template drift: region "${name}" missing in ${rel}`,
      );
    }
    await this.write(rel, content.replace(re, replacement ?? match[1]));
  }
}
