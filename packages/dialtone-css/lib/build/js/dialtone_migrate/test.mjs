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

describe('--health-check', () => {
  function runHealthCheck (files) {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'dlt-health-'));
    try {
      for (const [name, contents] of Object.entries(files)) {
        fs.writeFileSync(path.join(tmp, name), contents);
      }
      return execFileSync(process.execPath, [cli, '--health-check', '--cwd', tmp],
        { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
    }
  }

  it('does not flag native v-show on non-Dialtone elements as component-props', () => {
    const output = runHealthCheck({
      'App.vue': '<template><div v-show="isReady">Ready</div></template>',
    });
    assert.match(output, /\[DONE\].*Component Props & Events \(component-props\)/);
  });

  it('still flags show= on a Dialtone component as component-props', () => {
    const output = runHealthCheck({
      'App.vue': '<template><dt-modal show="isOpen"></dt-modal></template>',
    });
    assert.match(output, /\[PENDING\].*Component Props & Events \(component-props\)/);
  });

  it('does not flag an already-migrated file for stack-gap-to-spacing', () => {
    const output = runHealthCheck({
      'App.vue': '<template><dt-stack gap="100"></dt-stack><dt-stack gap="25"></dt-stack></template>',
    });
    assert.match(output, /\[DONE\].*Stack Gap to Spacing \(stack-gap-to-spacing\)/);
  });

  it('still flags an unmigrated file for stack-gap-to-spacing', () => {
    const output = runHealthCheck({
      'App.vue': '<template><dt-stack gap="625"></dt-stack></template>',
    });
    assert.match(output, /\[PENDING\].*Stack Gap to Spacing \(stack-gap-to-spacing\)/);
  });

  it('does not flag gap="525" for stack-gap-to-spacing', () => {
    const output = runHealthCheck({
      'App.vue': '<template><dt-stack gap="525"></dt-stack></template>',
    });
    assert.match(output, /\[DONE\].*Stack Gap to Spacing \(stack-gap-to-spacing\)/);
  });

  it('still flags an unmigrated stop in a partially migrated (mixed) file for stack-gap-to-spacing', () => {
    const output = runHealthCheck({
      'App.vue': '<template><dt-stack gap="25"></dt-stack><dt-stack gap="625"></dt-stack></template>',
    });
    assert.match(output, /\[PENDING\].*Stack Gap to Spacing \(stack-gap-to-spacing\)/);
  });

  it('does not flag an old stack class alongside a bound gap="\'25\'" for stack-gap-to-spacing', () => {
    const output = runHealthCheck({
      'App.vue': '<template><dt-stack class="d-stack--gap-100" :gap="\'25\'"></dt-stack></template>',
    });
    assert.match(output, /\[DONE\].*Stack Gap to Spacing \(stack-gap-to-spacing\)/);
  });
});
