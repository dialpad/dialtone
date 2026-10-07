import assert from 'node:assert/strict';

function assertPrimitive(actual, check) {
  if (check.kind === 'contains')
    assert.ok(
      actual.text.includes(check.value),
      `missing ${JSON.stringify(check.value)}`,
    );
  else if (check.kind === 'absent')
    assert.ok(
      !actual.text.includes(check.value),
      `forbidden ${JSON.stringify(check.value)}`,
    );
  else if (check.kind === 'exact') assert.equal(actual.text, check.value);
  else if (check.kind === 'order')
    assert.deepEqual(actual.names?.slice(0, check.value.length), check.value);
  else if (check.kind === 'empty') assert.deepEqual(actual.names, []);
  else if (check.kind === 'bytes')
    assert.ok(
      (actual.bytes ?? Buffer.byteLength(actual.text)) <= check.value,
      `exceeds ${check.value} bytes`,
    );
  else throw new Error(`Unknown primitive assertion kind: ${check.kind}`);
}

function assertAlternative(actual, groups) {
  if (
    !Array.isArray(groups) ||
    !groups.length ||
    groups.some(
      (group) =>
        !Array.isArray(group) ||
        !group.length ||
        group.some(
          (check) =>
            ![
              'contains',
              'absent',
              'exact',
              'order',
              'empty',
              'bytes',
            ].includes(check?.kind),
        ),
    )
  )
    throw new Error(
      'Assertion alternatives must be nonempty flat primitive groups',
    );
  const failures = [];
  for (const group of groups) {
    try {
      for (const check of group) assertPrimitive(actual, check);
      return;
    } catch (error) {
      if (!(error instanceof assert.AssertionError)) throw error;
      failures.push(error.message);
    }
  }
  assert.fail(`No valid response alternative: ${failures.join('; ')}`);
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
      if (check.kind === 'any') assertAlternative(actual, check.value);
      else assertPrimitive(actual, check);
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
