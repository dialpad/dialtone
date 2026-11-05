import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { rmSync, existsSync, mkdirSync, writeFileSync, readFileSync, readdirSync } from 'node:fs';
import { stateDir, readState, writeState, recordSetId } from './state.mjs';

// A target name no real run uses, so the folder under build-data/ is this test's alone.
const A = '__state-test-a__';
const B = '__state-test-b__';
const C = '__state-test-c__';
after(() => { for (const t of [A, B, C]) rmSync(stateDir(t), { recursive: true, force: true }); });

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

const plant = (file, text) => {
  mkdirSync(stateDir(C), { recursive: true });
  writeFileSync(`${stateDir(C)}${file}`, text);
};

test('a corrupt file throws and is left untouched, so no ids are erased', () => {
  const truncated = '{"button":{"figmaSetId":"1:1"},"loa';
  plant('set-ids.json', truncated);
  assert.throws(() => readState(C, 'set-ids.json'), /set-ids\.json is not valid JSON.*Delete/s);
  assert.throws(() => recordSetId(C, 'notice', false, '2:2'), /not valid JSON/);
  assert.equal(readFileSync(`${stateDir(C)}set-ids.json`, 'utf8'), truncated);
});

test('a root that is not an object throws', () => {
  for (const text of ['null', '[]', '"x"', '3']) {
    plant('set-ids.json', text);
    assert.throws(() => readState(C, 'set-ids.json'), /must hold a JSON object/);
    assert.throws(() => recordSetId(C, 'notice', false, '2:2'), /must hold a JSON object/);
    assert.equal(readFileSync(`${stateDir(C)}set-ids.json`, 'utf8'), text);
  }
});

test('a write leaves no temp file behind', () => {
  writeState(C, 'built-from.json', { a: 1 });
  writeState(C, 'built-from.json', { a: 2 });
  assert.deepEqual(readState(C, 'built-from.json'), { a: 2 });
  assert.deepEqual(readdirSync(stateDir(C)).filter((f) => f.endsWith('.tmp')), []);
});
