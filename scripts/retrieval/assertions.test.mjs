import assert from 'node:assert/strict';
import { test } from 'node:test';
import { evaluateAssertions } from './assertions.mjs';
import { cases, checksFor, expectedFailures } from './cases.mjs';

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
  const breadcrumb = cases.find(
    (value) => value.id === 'breadcrumb-public-name',
  );
  for (const adapter of breadcrumb.adapters) {
    const id = `${breadcrumb.id}/${adapter}`;
    const actualChecks = checksFor(breadcrumb, adapter);
    assert.equal(
      evaluateAssertions(
        id,
        {
          names: [],
          text:
            adapter === 'cli'
              ? '[]'
              : 'No components found for "DtBreadcrumbItem".',
        },
        actualChecks,
        expectedFailures[id],
      ).status,
      'expected-failure',
    );
    for (const actual of [
      { names: [], text: '' },
      {
        names: ['DtModal'],
        text: 'No components found for "DtBreadcrumbItem".',
      },
      { names: [], text: 'No components found for "DtOther".' },
    ])
      assert.throws(
        () =>
          evaluateAssertions(id, actual, actualChecks, expectedFailures[id]),
        /breadcrumb-response/,
      );
    assert.throws(
      () =>
        evaluateAssertions(
          id,
          {
            names: ['DtBreadcrumbItem'],
            text: 'DtBreadcrumbItem canonical item',
          },
          actualChecks,
          expectedFailures[id],
        ),
      /unexpected pass; promote/,
    );
    assert.throws(
      () =>
        evaluateAssertions(
          id,
          {
            names: ['DtBreadcrumbItem'],
            text: '',
          },
          actualChecks,
        ),
      /breadcrumb-response/,
    );
  }
  for (const value of [
    [],
    [[]],
    [[{ kind: 'any', value: [[{ kind: 'empty' }]] }]],
  ])
    assert.throws(
      () =>
        evaluateAssertions('invalid-alternative', { names: [], text: '' }, [
          { id: 'baseline', kind: 'any', value },
        ]),
      /nonempty flat primitive groups/,
    );
});
