import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { existsSync, writeFileSync, rmSync } from 'node:fs';

const MODULE = fileURLToPath(new URL('./target.mjs', import.meta.url));

// target.mjs is a side-effect module that reads process.argv and the environment, so each case
// runs it in a child process. PREVIEW/MAIN keys are fake; nothing here reaches Figma.
function resolveTarget (args, env = {}) {
  const script = `
    await import(${JSON.stringify(MODULE)});
    const { TARGET } = await import(${JSON.stringify(MODULE)});
    console.log(JSON.stringify({ name: TARGET.name, fileKey: TARGET.fileKey, argv: process.argv.slice(2),
      env: [process.env.SYNC_TARGET, process.env.FILE_KEY, process.env.HOME_COLLECTION] }));`;
  // With -e, argv is [node, ...args]; target.mjs reads from index 2 as it does for a script file,
  // so a placeholder fills the script slot. `--` keeps `--target` from being read as a node flag.
  const r = spawnSync(process.execPath, ['--input-type=module', '-e', script, '--', '<script>', ...args], {
    encoding: 'utf8',
    env: {
      PATH: process.env.PATH,
      // dotenv/config would otherwise load the developer's own .env (SYNC_TARGET, *_FILE_KEY).
      DOTENV_CONFIG_PATH: '/nonexistent/.env',
      SYNC_TARGET: '',
      PREVIEW_FILE_KEY: 'preview-key',
      MAIN_FILE_KEY: 'main-key',
      ...env,
    },
  });
  return { status: r.status, out: r.stdout, err: r.stderr };
}

test('resolves --target and strips it from argv so component names are untouched', () => {
  const r = resolveTarget(['loader', '--target', 'preview', 'button']);
  assert.equal(r.status, 0, r.err);
  const got = JSON.parse(r.out.trim().split('\n').pop());
  assert.equal(got.name, 'preview');
  assert.equal(got.fileKey, 'preview-key');
  assert.deepEqual(got.argv, ['loader', 'button']);
  assert.deepEqual(got.env, ['preview', 'preview-key', 'Dialtone 2026 Preview']);
});

test('accepts --target=name and falls back to SYNC_TARGET', () => {
  const eq = resolveTarget(['--target=main']);
  assert.equal(JSON.parse(eq.out.trim().split('\n').pop()).fileKey, 'main-key');
  const viaEnv = resolveTarget([], { SYNC_TARGET: 'preview' });
  assert.equal(JSON.parse(viaEnv.out.trim().split('\n').pop()).name, 'preview');
});

test('refuses to choose a file when no target is given', () => {
  const r = resolveTarget([]);
  assert.notEqual(r.status, 0);
  assert.match(r.err, /no target: pass --target/);
});

test('refuses an unknown target and a target whose file key is missing', () => {
  assert.match(resolveTarget(['--target', 'nope']).err, /unknown target "nope"/);
  const noKey = resolveTarget(['--target', 'preview'], { PREVIEW_FILE_KEY: '' });
  assert.notEqual(noKey.status, 0);
  assert.match(noKey.err, /needs PREVIEW_FILE_KEY/);
});

test('--target with no value throws and never falls back to SYNC_TARGET', () => {
  for (const args of [['--target'], ['--target='], ['--target', '--other']]) {
    const r = resolveTarget(args, { SYNC_TARGET: 'preview' });
    assert.notEqual(r.status, 0, args.join(' '));
    assert.match(r.err, /--target needs a value/);
  }
});

// targets.local.mjs is gitignored and personal: never overwrite a real one.
const LOCAL_FILE = fileURLToPath(new URL('./targets.local.mjs', import.meta.url));
const SKIP_LOCAL = existsSync(LOCAL_FILE) && 'a real targets.local.mjs exists; not overwriting it';
function expectLocalFileError (source) {
  writeFileSync(LOCAL_FILE, source);
  try {
    const r = resolveTarget(['--target', 'preview']);
    assert.notEqual(r.status, 0);
    assert.match(r.err, /could not load sync-scripts\/targets\.local\.mjs/);
  } finally {
    rmSync(LOCAL_FILE, { force: true });
  }
}
test('a targets.local.mjs with a syntax error is reported by name, not hidden', { skip: SKIP_LOCAL }, () => {
  expectLocalFileError('export const TARGETS = {;\n');
});
test('a targets.local.mjs that imports a missing module is reported, not hidden', { skip: SKIP_LOCAL }, () => {
  expectLocalFileError("import './does-not-exist.mjs';\nexport const TARGETS = {};\n");
});
