/**
 * DLT-3035 — underline transform tests.
 *
 * One assertion per test; data-driven covering each row of the Q1 revised mapping table.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { runTransform, runTransformVerbose } from './helpers.mjs';

describe('underline: clean-mapping cases (no hover delta)', () => {
  const cases = [
    [
      'd-td-underline h:d-td-none → strip both (matches default)',
      '<dt-link href="/x" class="d-td-underline h:d-td-none">Go</dt-link>',
      '<dt-link href="/x">Go</dt-link>',
    ],
    [
      'd-td-none h:d-td-underline → strip + :underline="false"',
      '<dt-link href="/x" class="d-td-none h:d-td-underline">Go</dt-link>',
      '<dt-link href="/x" :underline="false">Go</dt-link>',
    ],
    [
      'h:d-td-none alone → strip (matches default hover)',
      '<dt-link href="/x" class="h:d-td-none">Go</dt-link>',
      '<dt-link href="/x">Go</dt-link>',
    ],
  ];

  for (const [label, input, expected] of cases) {
    it(label, () => {
      const { transformed, notes } = runTransformVerbose(input, { filePath: 'fixture.vue' });
      assert.equal(transformed, expected);
      assert.equal(notes.length, 0, 'expected no hover-delta note');
    });
  }
});

describe('underline: alone/same cases (closest-prop with hover delta note)', () => {
  const cases = [
    {
      label: 'd-td-none alone → :underline="false" + note',
      input: '<dt-link href="/x" class="d-td-none">Go</dt-link>',
      expected: '<dt-link href="/x" :underline="false">Go</dt-link>',
    },
    {
      label: 'd-td-none h:d-td-none → :underline="false" + note',
      input: '<dt-link href="/x" class="d-td-none h:d-td-none">Go</dt-link>',
      expected: '<dt-link href="/x" :underline="false">Go</dt-link>',
    },
    {
      label: 'd-td-underline alone → strip (default true) + note',
      input: '<dt-link href="/x" class="d-td-underline">Go</dt-link>',
      expected: '<dt-link href="/x">Go</dt-link>',
    },
    {
      label: 'd-td-underline h:d-td-underline → strip (default true) + note',
      input: '<dt-link href="/x" class="d-td-underline h:d-td-underline">Go</dt-link>',
      expected: '<dt-link href="/x">Go</dt-link>',
    },
    {
      label: 'h:d-td-underline alone → strip (default true) + note',
      input: '<dt-link href="/x" class="h:d-td-underline">Go</dt-link>',
      expected: '<dt-link href="/x">Go</dt-link>',
    },
  ];

  for (const { label, input, expected } of cases) {
    it(label, () => {
      const { transformed } = runTransformVerbose(input, { filePath: 'fixture.vue' });
      assert.equal(transformed, expected);
    });
    it(`${label} — emits hover-delta note`, () => {
      const { notes } = runTransformVerbose(input, { filePath: 'fixture.vue' });
      assert.equal(notes.length, 1);
      assert.match(notes[0].message, /hover behavior/);
    });
  }
});

describe('underline: warning paths', () => {
  it('responsive variant sm:d-td-none warns and skips', () => {
    const input = '<dt-link href="/x" class="sm:d-td-none">Go</dt-link>';
    const { transformed, warnings } = runTransformVerbose(input, { filePath: 'fixture.vue' });
    assert.equal(transformed, input);
    assert.equal(warnings.length, 1);
    assert.match(warnings[0], /responsive or unsupported/);
  });

  it('focus variant f:d-td-underline warns and skips', () => {
    const input = '<dt-link href="/x" class="f:d-td-underline">Go</dt-link>';
    const { transformed, warnings } = runTransformVerbose(input, { filePath: 'fixture.vue' });
    assert.equal(transformed, input);
    assert.equal(warnings.length, 1);
  });

  it('dynamic :class containing d-td-* warns', () => {
    const input = '<dt-link href="/x" :class="{ \'d-td-none\': isHover }">Go</dt-link>';
    const { warnings } = runTransformVerbose(input, { filePath: 'fixture.vue' });
    assert.equal(warnings.length, 1);
    assert.match(warnings[0], /dynamic binding/);
  });
});

describe('underline: self-closing tags preserve the /', () => {
  it('<dt-link class="d-td-none" /> → <dt-link :underline="false" />', () => {
    assert.equal(
      runTransform('<dt-link href="/x" class="d-td-none" />'),
      '<dt-link href="/x" :underline="false" />',
    );
  });
});

describe('underline: dynamic :class with d-td-* warns even when a static class is also present', () => {
  it('emits dynamic-binding warning and leaves the tag unchanged', () => {
    const input = '<dt-link href="/x" class="foo" :class="{ \'d-td-none\': off }">Go</dt-link>';
    const { transformed, warnings } = runTransformVerbose(input, { filePath: 'fixture.vue' });
    assert.equal(transformed, input);
    assert.ok(warnings.some(w => /dynamic binding/.test(w)));
  });
});

describe('underline: PascalCase tag (DtLink) accepted; case preserved on output', () => {
  it('<DtLink class="d-td-none h:d-td-underline"> → <DtLink :underline="false">', () => {
    assert.equal(
      runTransform('<DtLink href="/x" class="d-td-none h:d-td-underline">Go</DtLink>'),
      '<DtLink href="/x" :underline="false">Go</DtLink>',
    );
  });
});

describe('underline: idempotency and other classes preserved', () => {
  it('already-migrated <dt-link :underline="false"> is a no-op', () => {
    const input = '<dt-link href="/x" :underline="false">Go</dt-link>';
    assert.equal(runTransform(input), input);
  });

  it('non-d-td classes preserved when stripping d-td-*', () => {
    const input = '<dt-link href="/x" class="d-td-none h:d-td-underline custom-class">Go</dt-link>';
    const expected = '<dt-link href="/x" class="custom-class" :underline="false">Go</dt-link>';
    assert.equal(runTransform(input), expected);
  });

  it('<dt-link> with no d-td-* classes is unchanged', () => {
    const input = '<dt-link href="/x" class="custom-class">Go</dt-link>';
    assert.equal(runTransform(input), input);
  });

  it('<dt-link> with no class attr is unchanged', () => {
    const input = '<dt-link href="/x">Go</dt-link>';
    assert.equal(runTransform(input), input);
  });
});

describe('underline: --only=underline runs only this transform', () => {
  it('skips button-nav and link-nav', () => {
    const input = '<a class="d-btn" href="/x">Go</a>\n<a class="d-link" href="/y">Y</a>';
    const { transformed } = runTransformVerbose(input, { only: ['underline'] });
    assert.equal(transformed, input);
  });
});
