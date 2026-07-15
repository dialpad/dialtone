/**
 * dialtone-migrate (master orchestrator) tests.
 *
 * Exercises migration selection via the CLI in --dry-run against an empty temp
 * directory, asserting which categories each flag selects.
 * Run: node --test packages/dialtone-css/lib/build/js/dialtone_migrate/test.mjs
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const cli = path.join(path.dirname(fileURLToPath(import.meta.url)), 'index.mjs');

// Run the CLI in --dry-run against an empty temp dir and return stdout.
function runDryRun (flags) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'dlt-master-'));
  try {
    return execFileSync(
      process.execPath,
      [cli, '--dry-run', '--cwd', tmp, ...flags],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] },
    );
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

function selectedCount (output) {
  const m = output.match(/Migrations to run \((\d+)\)/);
  return m ? Number(m[1]) : null;
}

describe('migration selection', () => {
  it('--all selects the required migrations only (excludes opt-in)', () => {
    const output = runDryRun(['--all']);
    assert.equal(selectedCount(output), 12);
    assert.ok(!output.includes('[OPT-IN]'), '--all must not select opt-in migrations');
  });

  it('--all --include-opt-in selects every migration', () => {
    const output = runDryRun(['--all', '--include-opt-in']);
    assert.equal(selectedCount(output), 20);
    assert.ok(output.includes('[OPT-IN]'), 'opt-in migrations should be selected');
  });

  it('--include-opt-in on its own also selects every migration', () => {
    const output = runDryRun(['--include-opt-in']);
    assert.equal(selectedCount(output), 20);
  });
});

describe('--package validation', () => {
  // Run the CLI with the given args and return { status, stderr }; never throws.
  function run (extraArgs) {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'dlt-master-'));
    try {
      execFileSync(process.execPath, [cli, '--dry-run', '--cwd', tmp, ...extraArgs],
        { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
      return { status: 0, stderr: '' };
    } catch (err) {
      return { status: err.status, stderr: String(err.stderr ?? '') };
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
    }
  }

  it('rejects --package with no value', () => {
    const { status, stderr } = run(['--all', '--package']);
    assert.equal(status, 1);
    assert.match(stderr, /--package requires a package name/);
  });

  it('rejects --package followed by another option (--package --all)', () => {
    const { status, stderr } = run(['--package', '--all']);
    assert.equal(status, 1);
    assert.match(stderr, /--package requires a package name/);
  });

  it('accepts a valid package name', () => {
    const { status } = run(['--all', '--package', '@dialpad/dialtone-next']);
    assert.equal(status, 0);
  });
});
