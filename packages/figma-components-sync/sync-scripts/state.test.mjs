import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { rmSync, existsSync } from 'node:fs';
import { stateDir, readState, writeState, recordSetId } from './state.mjs';

// A target name no real run uses, so the folder under build-data/ is this test's alone.
const A = '__state-test-a__';
const B = '__state-test-b__';
after(() => { for (const t of [A, B]) rmSync(stateDir(t), { recursive: true, force: true }); });

test('reads fall back when nothing has been written', () => {
  assert.deepEqual(readState(A, 'set-ids.json'), {});
  assert.equal(readState(A, 'set-ids.json', null), null);
});

test('records a set id per component, keeping the plain and merged ids apart', () => {
  recordSetId(A, 'button', false, '1:1');
  recordSetId(A, 'button', true, '1:2');
  recordSetId(A, 'loader', false, '1:3');
  assert.deepEqual(readState(A, 'set-ids.json'), {
    button: { figmaSetId: '1:1', figmaMergedSetId: '1:2' },
    loader: { figmaSetId: '1:3' },
  });
});

test('targets never share state', () => {
  recordSetId(A, 'notice', false, '9:9');
  assert.deepEqual(readState(B, 'set-ids.json'), {});
  writeState(B, 'built-from.json', { notice: 'abc' });
  assert.equal(existsSync(`${stateDir(A)}built-from.json`), false);
});
