import { execFileSync } from 'node:child_process';

export function gitEnvironment (cwd) {
  const env = { ...process.env, LC_ALL: 'C' };
  const names = new Set(execFileSync('git', ['rev-parse', '--local-env-vars'], {
    cwd, env, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'],
  }).trim().split(/\r?\n/));
  for (const name of Object.keys(env)) {
    if (names.has(name.toUpperCase())) delete env[name];
  }
  return env;
}
