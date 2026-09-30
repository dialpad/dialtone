import { describe, test, expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const CLI = fileURLToPath(new URL('../build/index.js', import.meta.url));
// Any debug tag, not just the ones silenceDebug knows, so a new core tag that leaks fails here.
const DEBUG_TAG = /DEBUG\]|\[FILTER\]/;

// Runs the built CLI on its bundled data, so results don't depend on what's installed.
// stderr can also carry an "Update available" notice, so stderr checks use toContain.
function run(args: string[]) {
  const r = spawnSync(process.execPath, [CLI, '--bundled', ...args], {
    encoding: 'utf-8',
    // spawnSync blocks, so the test timeout can't interrupt it. This bounds a hung CLI.
    timeout: 15000,
    // A developer's own DIALTONE_DEBUG=1 would otherwise print the debug lines the last test checks for.
    env: { ...process.env, DIALTONE_DEBUG: '' },
  });
  // Surface a timeout or spawn failure as itself, not as a wrong exit code.
  if (r.error) throw r.error;
  return r;
}

// Longer than the spawn timeout, so a hung CLI fails as ETIMEDOUT.
describe('dialtone CLI (built)', { timeout: 30_000 }, () => {
  test.each(['component', 'prompt'])('%s: a non-exact name exits 1 with empty stdout and candidates on stderr', (command) => {
    const r = run([command, 'list', '--format', 'json']);
    expect(r.status).toBe(1);
    expect(r.stdout).toBe('');
    expect(r.stderr).toContain('No component named "list". Did you mean:');
  });

  test.each(['component', 'prompt'])('%s: a deprecated exact name keeps JSON stdout clean and warns on stderr', (command) => {
    const r = run([command, 'DtIcon', '--format', 'json']);
    expect(r.status).toBe(0);
    expect(JSON.parse(r.stdout).name).toBe('DtIcon');
    expect(r.stderr).toContain('Note: DtIcon is deprecated.');
  });

  test('prints no debug lines by default', () => {
    const r = run(['search', 'button']);
    expect(r.status).toBe(0);
    expect(r.stderr).not.toMatch(DEBUG_TAG);
  });
});
