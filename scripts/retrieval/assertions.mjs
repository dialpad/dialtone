import assert from 'node:assert/strict';

const primitives = {
  contains: (actual, value) =>
    assert.ok(actual.text.includes(value), `missing ${JSON.stringify(value)}`),
  absent: (actual, value) =>
    assert.ok(
      !actual.text.includes(value),
      `forbidden ${JSON.stringify(value)}`,
    ),
  order: (actual, value) =>
    assert.deepEqual(actual.names?.slice(0, value.length), value),
  empty: (actual) => assert.deepEqual(actual.names, []),
  bytes: (actual, value) =>
    assert.ok(
      (actual.bytes ?? Buffer.byteLength(actual.text)) <= value,
      `exceeds ${value} bytes`,
    ),
};
function assertPrimitive(actual, check) {
  if (!Object.hasOwn(primitives, check?.kind))
    throw new Error(`Unknown primitive assertion kind: ${check.kind}`);
  primitives[check.kind](actual, check.value);
}

export function evaluateAssertions(id, actual, checks, expected) {
  if (!actual || typeof actual.text !== 'string')
    throw new Error(`Invalid adapter response for ${id}`);
  if (
    expected &&
    (!expected.issue ||
      !expected.owner ||
      !expected.removeWhen ||
      !checks.some((check) => check.id === expected.assertion))
  )
    throw new Error(`Invalid expected-failure registration for ${id}`);
  const failures = [];
  for (const check of checks) {
    try {
      assertPrimitive(actual, check);
    } catch (error) {
      // Programming errors never qualify as expected retrieval failures.
      if (!(error instanceof assert.AssertionError)) throw error;
      failures.push({ assertion: check.id, message: error.message });
    }
  }
  const unexpected = failures.filter(
    (failure) => failure.assertion !== expected?.assertion,
  );
  if (unexpected.length)
    throw new Error(
      `${id}: ${unexpected.map((failure) => `${failure.assertion}: ${failure.message}`).join('; ')}`,
    );
  if (expected && !failures.length)
    throw new Error(
      `${id}: unexpected pass; promote ${expected.assertion} to a mandatory regression and remove ${expected.issue} registration`,
    );
  return {
    id,
    status: expected ? 'expected-failure' : 'pass',
    ...(expected
      ? { issue: expected.issue, assertion: expected.assertion }
      : {}),
  };
}
