import type { ProjectFiles } from './files.js';

type DepField = 'dependencies' | 'devDependencies';

interface PackageJson {
  name?: string;
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  [key: string]: unknown;
}

const sortKeys = (record: Record<string, string>) =>
  Object.fromEntries(Object.entries(record).sort(([a], [b]) => a.localeCompare(b)));

/** Buffered package.json editor — call `save()` once all edits are queued. */
export class PackageJsonEditor {
  private constructor(
    private readonly files: ProjectFiles,
    readonly data: PackageJson,
  ) {}

  static async load(files: ProjectFiles): Promise<PackageJsonEditor> {
    return new PackageJsonEditor(files, JSON.parse(await files.read('package.json')));
  }

  addDeps(deps: Record<string, string>, field: DepField = 'dependencies'): this {
    this.data[field] = sortKeys({ ...(this.data[field] ?? {}), ...deps });
    return this;
  }

  /** Removes packages by exact name or by `prefix*` pattern, from both dependency fields. */
  removeDeps(...names: string[]): this {
    for (const field of ['dependencies', 'devDependencies'] as const) {
      const deps = this.data[field];
      if (!deps) continue;
      for (const key of Object.keys(deps)) {
        const match = names.some((name) =>
          name.endsWith('*') ? key.startsWith(name.slice(0, -1)) : key === name,
        );
        if (match) delete deps[key];
      }
    }
    return this;
  }

  setScripts(scripts: Record<string, string>): this {
    this.data.scripts = { ...(this.data.scripts ?? {}), ...scripts };
    return this;
  }

  removeScripts(...names: string[]): this {
    for (const name of names) delete this.data.scripts?.[name];
    return this;
  }

  mapScripts(fn: (value: string, name: string) => string): this {
    for (const [name, value] of Object.entries(this.data.scripts ?? {})) {
      this.data.scripts![name] = fn(value, name);
    }
    return this;
  }

  async save(): Promise<void> {
    await this.files.write('package.json', `${JSON.stringify(this.data, null, 2)}\n`);
  }
}
