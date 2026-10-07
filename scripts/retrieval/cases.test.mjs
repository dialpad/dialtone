import assert from 'node:assert/strict';
import { test } from 'node:test';
import { cases, expectedFailures } from './cases.mjs';
import { evaluateAssertions } from './assertions.mjs';

test('mandatory MCP missing cases reject blank and unrecognized negative responses', () => {
  for (const [id, diagnostic] of Object.entries({
    'component-missing': 'No components found for "DLT3652MissingWidget".',
    'utility-missing': 'No results found for "DLT3652MissingProperty".',
    'token-missing': 'No token results found for "DLT3652MissingToken".',
    'icon-missing': 'No icons found for "DLT3652MissingIcon".',
  })) {
    const testCase = cases.find((value) => value.id === id);
    const checks = [
      ...testCase.checks,
      ...(testCase.checksByAdapter?.mcp ?? []),
    ];
    assert.equal(
      evaluateAssertions(`${id}/mcp`, { names: [], text: diagnostic }, checks)
        .status,
      'pass',
      id,
    );
    for (const text of [
      '',
      'No matching results.',
      `No widgets found for "${testCase.query}".`,
      diagnostic.replace(testCase.query, 'DLT3652AnotherQuery'),
    ])
      assert.throws(
        () =>
          evaluateAssertions(
            `${id}/mcp`,
            { names: [], text, bytes: 0 },
            checks,
          ),
        /meaningful-negative/,
        `${id} must reject ${JSON.stringify(text)}`,
      );
  }
});

test('every owned failure is an exercised precise assertion, and every case stays bounded', () => {
  assert.equal(new Set(cases.map((value) => value.id)).size, cases.length);
  const exercised = new Map(
    cases.flatMap((value) =>
      value.adapters.map((adapter) => [
        `${value.id}/${adapter}`,
        [...value.checks, ...(value.checksByAdapter?.[adapter] ?? [])],
      ]),
    ),
  );
  for (const [id, failure] of Object.entries(expectedFailures)) {
    assert.ok(exercised.has(id), `orphan expected failure: ${id}`);
    assert.match(failure.issue, /^DLT-\d+$/);
    assert.ok(failure.owner && failure.removeWhen);
    assert.equal(
      exercised.get(id).filter((check) => check.id === failure.assertion)
        .length,
      1,
      id,
    );
  }
  for (const value of cases)
    assert.ok(value.limit > 0 && value.limit <= 3, value.id);
});
