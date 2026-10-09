import assert from 'node:assert/strict';
import { test } from 'node:test';
import { evaluateAssertions } from './assertions.mjs';

const checks = [
  { id: 'literal', kind: 'contains', value: 'required' },
  { id: 'safe', kind: 'absent', value: 'wrong' },
];
const expected = {
  issue: 'DLT-3650',
  owner: 'MCP retrieval',
  assertion: 'literal',
  removeWhen: 'the literal survives focused MCP output',
};
test('precise expected failure does not hide another wrong fact', () => {
  assert.equal(
    evaluateAssertions('case', { text: 'safe' }, checks, expected).status,
    'expected-failure',
  );
  assert.throws(
    () => evaluateAssertions('case', { text: 'wrong' }, checks, expected),
    /safe/,
  );
});
test('unexpected pass forces promotion', () => {
  assert.throws(
    () => evaluateAssertions('case', { text: 'required' }, checks, expected),
    /promote/,
  );
});
test('setup/transport errors are outside the assertion registry', () => {
  assert.throws(
    () => evaluateAssertions('case', null, checks, expected),
    /Invalid adapter response/,
  );
});
test('mandatory required, forbidden, order, negative and budget assertions fail independently', () => {
  assert.equal(
    evaluateAssertions('case', { text: 'required', names: ['A', 'B'] }, [
      ...checks,
      { id: 'order', kind: 'order', value: ['A', 'B'] },
      { id: 'budget', kind: 'bytes', value: 20 },
    ]).status,
    'pass',
  );
  for (const check of [
    { id: 'order', kind: 'order', value: ['B', 'A'] },
    { id: 'negative', kind: 'empty' },
    { id: 'budget', kind: 'bytes', value: 2 },
  ])
    assert.throws(
      () =>
        evaluateAssertions('case', { text: 'required', names: ['A', 'B'] }, [
          check,
        ]),
      new RegExp(check.id),
    );
});
