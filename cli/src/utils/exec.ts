import { spawn } from 'node:child_process';

const isWindows = process.platform === 'win32';

/** Runs a command, capturing output; rejects with the tail of stderr/stdout on failure. */
export function run(command: string, args: string[], cwd: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      shell: isWindows, // resolve yarn.cmd / npm.cmd on Windows
      env: { ...process.env, CI: process.env.CI ?? '' },
    });
    let output = '';
    child.stdout.on('data', (chunk) => (output += chunk));
    child.stderr.on('data', (chunk) => (output += chunk));
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) resolve(output);
      else
        reject(
          new Error(`${command} ${args.join(' ')} exited with ${code}\n${output.slice(-4000)}`),
        );
    });
  });
}

export async function commandExists(command: string): Promise<boolean> {
  try {
    await run(command, ['--version'], process.cwd());
    return true;
  } catch {
    return false;
  }
}
