import { describe, test, expect, onTestFinished } from 'vitest';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const CLI = fileURLToPath(new URL('../build/index.js', import.meta.url));
// Any debug tag, not just the ones silenceDebug knows, so a new core tag that leaks fails here.
const DEBUG_TAG = /DEBUG\]|\[FILTER\]/;

// Runs the built CLI, by default on its bundled data, so results don't depend on what's installed.
// stderr can also carry an "Update available" notice, so stderr checks use toContain.
function run(args: string[], { cwd = process.cwd(), bundled = true, env = {} as NodeJS.ProcessEnv } = {}) {
  const r = spawnSync(process.execPath, [CLI, ...(bundled ? ['--bundled'] : []), ...args], {
    cwd,
    encoding: 'utf-8',
    // spawnSync blocks, so the test timeout can't interrupt it. This bounds a hung CLI.
    timeout: 15000,
    // A developer's own DIALTONE_DEBUG=1 would otherwise print the debug lines the last test checks for.
    env: { ...process.env, DIALTONE_DEBUG: '', ...env },
  });
  // Surface a timeout or spawn failure as itself, not as a wrong exit code.
  if (r.error) throw r.error;
  return r;
}

function write(path: string, content: unknown) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(content));
}

// A temp app that doesn't declare @dialpad/dialtone, with only @dialpad/dialtone-vue installed,
// the way pnpm installs it: the package lives under node_modules/.pnpm and is symlinked into place.
function appWithDialtoneVue(verifiedEntry = true): string {
  const root = mkdtempSync(join(tmpdir(), 'dialtone-cli-smoke-'));
  onTestFinished(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(join(root, '.git')); // so a package.json above tmpdir can't declare Dialtone for it
  write(join(root, 'package.json'), { name: 'fixture-app' });
  const vue = join(root, 'node_modules/.pnpm/@dialpad+dialtone-vue@4.0.2/node_modules/@dialpad/dialtone-vue');
  // Like the real package: the data file sits in dist/, reached through the exports map.
  write(join(vue, 'package.json'), { name: '@dialpad/dialtone-vue', version: '4.0.2', exports: { '.': { import: './dist/dialtone-vue.js' }, './component-documentation.json': './dist/component-documentation.json' } });
  write(join(vue, 'dist/component-documentation.json'), [{ displayName: 'DtButton' }]);
  if (verifiedEntry) writeFileSync(join(vue, 'dist/dialtone-vue.js'), "import button from './button.js'; export { button as DtButton };");
  mkdirSync(join(root, 'node_modules/@dialpad'));
  symlinkSync(vue, join(root, 'node_modules/@dialpad/dialtone-vue'), 'dir');
  return root;
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

  // prompt builds its JSON import field itself, not through a formatter, so formatters.test.ts can't cover it.
  test('prompt --format json uses the source-verified standalone route on bundled data', () => {
    const r = run(['prompt', 'DtButton', '--format', 'json']);
    expect(r.status).toBe(0);
    expect(JSON.parse(r.stdout).import).toBe("import { DtButton } from '@dialpad/dialtone-vue'");
  });

  test('prompt --format json imports from the project\'s own @dialpad/dialtone-vue', () => {
    const r = run(['prompt', 'DtButton', '--format', 'json'], { cwd: appWithDialtoneVue(), bundled: false });
    expect(r.status).toBe(0);
    expect(JSON.parse(r.stdout).import).toBe("import { DtButton } from '@dialpad/dialtone-vue'");
    expect(JSON.parse(r.stdout).identity.imports[0]).toMatchObject({ verification: 'installed-export', version: '4.0.2' });
  });

  test('prompt JSON withholds imports when the installed export entry cannot be verified', () => {
    const r = run(['prompt', 'DtButton', '--format', 'json'], { cwd: appWithDialtoneVue(false), bundled: false });
    expect(r.status).toBe(0);
    expect(JSON.parse(r.stdout).import).toBeNull();
    expect(JSON.parse(r.stdout).identity).toMatchObject({ kind: 'unknown', imports: [] });
  });

  test('reads the project\'s own @dialpad/dialtone-vue when Node preserves symlinks', () => {
    // Node then resolves files through the pnpm symlink instead of the package's real path.
    const r = run(['prompt', 'DtButton', '--format', 'json'], { cwd: appWithDialtoneVue(), bundled: false, env: { NODE_PRESERVE_SYMLINKS: '1' } });
    expect(r.status).toBe(0);
    expect(JSON.parse(r.stdout).import).toBe("import { DtButton } from '@dialpad/dialtone-vue'");
  });

  test('names the project\'s own @dialpad/dialtone-vue as the data source on stderr', () => {
    const r = run(['prompt', 'DtButton'], { cwd: appWithDialtoneVue(), bundled: false });
    expect(r.status).toBe(0);
    expect(r.stderr).toContain('Using local Dialtone data: @dialpad/dialtone-vue@4.0.2 (utilities: bundled, tokens: bundled, icons: bundled, docs: bundled)');
  });

  test('token --name accepts a canonical CSS token identifier', () => {
    const r = run(['token', '--name=--dt-spacing-100', '--values', '--format', 'json']);
    expect(r.status).toBe(0);
    expect(JSON.parse(r.stdout).name).toBe('--dt-spacing-100');
  });

  test('explicit legacy token warns and preserves qualified migration metadata in JSON', () => {
    const r = run(['token', '--name=--dt-space-400', '--values', '--format', 'json']);
    expect(r.status).toBe(0);
    expect(JSON.parse(r.stdout)).toMatchObject({ name: '--dt-space-400', metadata: { deprecated: true, alternatives: ['--dt-spacing-100'] } });
    expect(r.stderr).toContain('--dt-spacing-100');
  });

  test('prints no debug lines by default', () => {
    const r = run(['search', 'button']);
    expect(r.status).toBe(0);
    expect(r.stderr).not.toMatch(DEBUG_TAG);
  });
});
