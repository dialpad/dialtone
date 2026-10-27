import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, symlinkSync, copyFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync, spawnSync } from 'node:child_process';
import { matchChangedPaths, loadMap } from './check-doc-review.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const command = join(root, 'scripts/check-doc-review.mjs');
const fixtureMap = {
  version: 1,
  families: [
    { id: 'a', prefixes: ['a/'] },
    { id: 'b', prefixes: ['b/'] },
    { id: 'other', prefixes: ['unmapped/'] },
  ],
  mappings: [
    { id: 'a', prefixes: ['a/'], targets: [{ path: 'guide-a.md', section: 'API', reason: 'Review API explanation' }] },
    {
      id: 'b',
      prefixes: ['b/'],
      targets: [{ path: 'guide-b.md', section: 'Build', reason: 'Review build explanation' }],
    },
  ],
};
function fixture(t) {
  const cwd = mkdtempSync(join(tmpdir(), 'doc-review-'));
  t.after(() => rmSync(cwd, { recursive: true, force: true }));
  const git = (...args) => execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
  const put = (path, text = 'initial\n') => {
    mkdirSync(dirname(join(cwd, path)), { recursive: true });
    writeFileSync(join(cwd, path), text);
  };
  const commit = () => {
    git('add', '--', '.');
    git('-c', 'core.hooksPath=/dev/null', 'commit', '-qm', 'fixture');
    return git('rev-parse', 'HEAD');
  };
  git('init', '-q');
  git('config', 'user.name', 'Fixture');
  git('config', 'user.email', 'fixture@example.invalid');
  put('.agents/resources/source-docs-map.json', JSON.stringify(fixtureMap));
  put('.gitignore', '.temp/\n');
  put('guide-a.md');
  put('guide-b.md');
  put('a/source');
  put('b/source');
  const base = commit();
  const run = (args) => spawnSync(process.execPath, [command, ...args], { cwd, encoding: 'utf8' });
  const report = (args) => {
    const result = run([...args, '--format', 'json']);
    assert.equal(result.status, 0, result.stderr);
    return JSON.parse(result.stdout);
  };
  return { cwd, git, put, commit, base, run, report };
}

test('mapping covers current lookup sources without substring false positives or silent unknown families', () => {
  const map = loadMap(root);
  assert.deepEqual(matchChangedPaths(['notes/release-thoughts.md'], map).candidates, []);
  assert.deepEqual(matchChangedPaths(['packages/language-server/new.ts'], map).unmapped, [
    'packages/language-server/new.ts',
  ]);
});

test('commit modes require explicit boundaries and return operational errors distinctly', (t) => {
  const f = fixture(t);
  for (const args of [
    [],
    ['--base', 'HEAD', '--head', 'HEAD'],
    ['--base', 'HEAD', '--head', 'HEAD', '--direct', '--merge-base'],
    ['--staged', '--worktree'],
    ['--staged', '--include-untracked'],
    ['--base', 'absent', '--head', 'HEAD', '--merge-base'],
  ]) {
    const result = f.run(args);
    assert.equal(result.status, 2, JSON.stringify(args));
    assert.match(result.stderr, /doc-review:/);
  }
});

test('merge-base excludes upstream-only changes while direct comparison reports chosen endpoints', (t) => {
  const f = fixture(t);
  f.git('checkout', '-qb', 'feature');
  f.put('a/source', 'feature\n');
  const head = f.commit();
  f.git('checkout', '-qb', 'upstream', f.base);
  f.put('b/source', 'upstream\n');
  const upstream = f.commit();
  const merge = f.report(['--base', upstream, '--head', head, '--merge-base']);
  assert.equal(merge.boundary.mergeBase, f.base);
  assert.equal(merge.boundary.effectiveBase, f.base);
  assert.deepEqual(
    merge.changes.map((c) => c.path),
    ['a/source'],
  );
  const mergeText = f.run(['--base', upstream, '--head', head, '--merge-base']).stdout;
  assert.ok(mergeText.includes(f.base), 'default report shows the effective merge base');
  assert.ok(mergeText.includes(head), 'default report shows the resolved head');
  const direct = f.report(['--base', upstream, '--head', head, '--direct']);
  assert.deepEqual(
    direct.changes.map((c) => c.path),
    ['a/source', 'b/source'],
  );
  const directText = f.run(['--base', upstream, '--head', head, '--direct']).stdout;
  assert.ok(directText.includes(upstream), 'direct report shows the chosen base');
  assert.ok(directText.includes(head), 'direct report shows the resolved head');
});

test('index and worktree inputs remain separate; touched prose never clears a review candidate', (t) => {
  const f = fixture(t);
  f.put('a/source', 'staged\n');
  f.git('add', 'a/source');
  f.put('b/source', 'unstaged\n');
  f.put('guide-a.md', 'touched prose\n');
  f.git('add', 'guide-a.md');
  assert.deepEqual(
    f.report(['--staged']).candidates.map((c) => c.id),
    ['a'],
  );
  assert.equal(f.report(['--staged']).candidates[0].status, 'review-needed');
  assert.deepEqual(
    f.report(['--worktree']).candidates.map((c) => c.id),
    ['b'],
  );
});

test('rename old/new paths, deletion and unusual filenames retain their mappings', (t) => {
  const f = fixture(t);
  const old = 'a/name with\nnewline\t.txt';
  const next = 'b/name with\nnewline\t.txt';
  f.put(old);
  f.commit();
  f.git('mv', old, next);
  const renamed = f.report(['--staged']);
  assert.deepEqual(
    renamed.candidates.map((c) => c.id),
    ['a', 'b'],
  );
  assert.equal(renamed.changes[0].oldPath, old);
  assert.equal(renamed.changes[0].path, next);
  rmSync(join(f.cwd, next));
  assert.deepEqual(
    f.report(['--worktree']).candidates.map((c) => c.id),
    ['b'],
  );
});

test('missing targets are determined from the selected head rather than the checkout', (t) => {
  const f = fixture(t);
  f.put('a/source', 'changed\n');
  rmSync(join(f.cwd, 'guide-a.md'));
  const head = f.commit();
  f.git('checkout', '--detach', f.base);
  const report = f.report(['--base', f.base, '--head', head, '--direct']);
  assert.equal(report.candidates[0].targets[0].state, 'missing');
  assert.equal(report.targetContext, head);
});

test('untracked selection is explicit, ignores ignored paths and never follows target symlinks', (t) => {
  const f = fixture(t);
  f.put('a/new', 'untracked\n');
  f.put('.temp/private', 'ignored\n');
  const excluded = f.report(['--worktree']);
  assert.equal(excluded.candidates.length, 0);
  assert.deepEqual(excluded.outsideBoundary.untracked, ['a/new']);
  rmSync(join(f.cwd, 'guide-a.md'));
  symlinkSync('/outside/not-read', join(f.cwd, 'guide-a.md'));
  const included = f.report(['--worktree', '--include-untracked']);
  assert.equal(included.candidates[0].targets[0].state, 'symlink-not-read');
  f.put('unmapped/new');
  assert.deepEqual(f.report(['--worktree', '--include-untracked']).unmapped, ['unmapped/new']);
});

test('Claude adapter reports without a session cache or marker and never makes a permission decision', (t) => {
  const f = fixture(t);
  for (const name of [
    'scripts/check-doc-review.mjs',
    '.claude/hooks/pre-push-pr-guard.sh',
    '.claude/hooks/doc-review-adapter.mjs',
  ]) {
    mkdirSync(dirname(join(f.cwd, name)), { recursive: true });
    copyFileSync(join(root, name), join(f.cwd, name));
  }
  f.git('update-ref', 'refs/remotes/origin/staging', f.base);
  f.put('a/source', 'changed\n');
  const invoke = (command) =>
    spawnSync('bash', [join(f.cwd, '.claude/hooks/pre-push-pr-guard.sh')], {
      cwd: f.cwd,
      encoding: 'utf8',
      input: JSON.stringify({ tool_name: 'Bash', tool_input: { command }, cwd: f.cwd }),
      env: { ...process.env, CLAUDE_PROJECT_DIR: f.cwd },
    });
  const response = invoke('git push');
  assert.equal(response.status, 0, response.stderr);
  const output = JSON.parse(response.stdout);
  assert.equal(output.hookSpecificOutput.hookEventName, 'PreToolUse');
  assert.equal(output.hookSpecificOutput.permissionDecision, undefined);
  assert.match(output.hookSpecificOutput.additionalContext, /guide-a.md/);
  for (let i = 0; i < 400; i++) f.put(`a/large-change-${i}-${'x'.repeat(30)}`);
  f.git('add', 'a/');
  const bounded = JSON.parse(invoke('git push').stdout).hookSpecificOutput.additionalContext;
  assert.ok(bounded.length <= 9000);
  assert.match(bounded, /truncated; run scripts\/check-doc-review\.mjs/);
  assert.match(bounded, /Use \.agents\/resources\/doc-sync\.md/);
  f.git('update-ref', '-d', 'refs/remotes/origin/staging');
  const error = invoke('gh pr create');
  assert.equal(error.status, 0);
  assert.match(JSON.parse(error.stdout).hookSpecificOutput.additionalContext, /unavailable|error/i);
  assert.equal(invoke('git stash push').stdout, '');
});
