import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { fingerprintSourceState } from './source-state.mjs';

test('source provenance includes staged and untracked changes while ignoring excluded files', async () => {
  const root = await mkdtemp(join(tmpdir(), 'dialtone-source-state-'));
  const git = (...args) => execFileSync('git', args, { cwd: root });
  try {
    git('init', '--quiet');
    await writeFile(join(root, '.gitignore'), 'ignored\n');
    await writeFile(join(root, 'source.js'), 'original\n');
    git('add', '.gitignore', 'source.js');
    git(
      '-c',
      'user.name=Fixture',
      '-c',
      'user.email=fixture@example.invalid',
      '-c',
      'commit.gpgsign=false',
      '-c',
      'core.hooksPath=/dev/null',
      'commit',
      '--quiet',
      '-m',
      'initial',
    );
    const clean = fingerprintSourceState(root);
    await writeFile(join(root, 'source.js'), 'changed\n');
    const unstaged = fingerprintSourceState(root);
    assert.notEqual(unstaged.sourceDiffSha256, clean.sourceDiffSha256);
    git('add', 'source.js');
    assert.deepEqual(fingerprintSourceState(root), unstaged);
    await writeFile(join(root, 'new.js'), 'new source\n');
    const added = fingerprintSourceState(root);
    assert.notEqual(added.sourceStateSha256, unstaged.sourceStateSha256);
    assert.deepEqual(
      added.sourceUntrackedFiles.map(({ path }) => path),
      ['new.js'],
    );
    await writeFile(join(root, 'new.js'), 'edited source\n');
    const edited = fingerprintSourceState(root);
    assert.notEqual(edited.sourceStateSha256, added.sourceStateSha256);
    await writeFile(join(root, 'ignored'), 'excluded\n');
    assert.deepEqual(fingerprintSourceState(root), edited);
  } finally {
    await rm(root, {
      recursive: true,
      force: true,
      maxRetries: 5,
      retryDelay: 100,
    });
  }
});
