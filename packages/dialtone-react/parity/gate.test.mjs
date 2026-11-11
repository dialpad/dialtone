// gate.mjs' own checks that end a run before any tool does. Node's test runner, not Vitest: the harness runs in plain
// Node.
//   node --test packages/dialtone-react/parity/*.test.mjs
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const gate = (...args) => spawnSync(process.execPath, [fileURLToPath(new URL('./gate.mjs', import.meta.url)), ...args],
  { encoding: 'utf8' });

test('a unit dialtone-vue has no source for fails: a typo, or a port whose Vue files a change deleted', () => {
  const { status, stderr } = gate('no-such-unit');
  assert.equal(status, 2);
  assert.match(stderr, /^gate: dialtone-vue has no source for no-such-unit/);
});

test('an id that isn\'t one is a usage error', () => {
  const { status, stderr } = gate('Not A Unit');
  assert.equal(status, 2);
  assert.match(stderr, /^usage: gate\.mjs <unit id>/);
});
