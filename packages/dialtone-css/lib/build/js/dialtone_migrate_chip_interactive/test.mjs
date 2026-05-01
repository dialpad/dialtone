/**
 * DLT-3195 — dialtone-migrate-chip-interactive tests.
 *
 * One assertion per test; data-driven via for..of where multiple cases share a concept.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { transformContent } from './index.mjs';

function run (input) {
  const { transformed } = transformContent(input, { filePath: 'test.vue' });
  return transformed;
}

function warnings (input) {
  return transformContent(input, { filePath: 'test.vue' }).warnings;
}

// ---------------------------------------------------------------------------
// Auto-add :interactive="true" for chips with click handlers
// ---------------------------------------------------------------------------

describe('chips with @click — auto-add :interactive="true"', () => {
  const cases = [
    [
      'single-line chip with @click',
      '<dt-chip @click="handleClick">Label</dt-chip>',
      '<dt-chip :interactive="true" @click="handleClick">Label</dt-chip>',
    ],
    [
      'chip with @click.stop modifier',
      '<dt-chip @click.stop="handleClick">Label</dt-chip>',
      '<dt-chip :interactive="true" @click.stop="handleClick">Label</dt-chip>',
    ],
    [
      'chip with @click.prevent modifier',
      '<dt-chip @click.prevent="handleClick">Label</dt-chip>',
      '<dt-chip :interactive="true" @click.prevent="handleClick">Label</dt-chip>',
    ],
    [
      'chip with v-on:click',
      '<dt-chip v-on:click="handleClick">Label</dt-chip>',
      '<dt-chip :interactive="true" v-on:click="handleClick">Label</dt-chip>',
    ],
    [
      'chip with other props and @click',
      '<dt-chip :size="200" :disabled="isDisabled" @click="handleClick">Label</dt-chip>',
      '<dt-chip :interactive="true" :size="200" :disabled="isDisabled" @click="handleClick">Label</dt-chip>',
    ],
    [
      'self-closing chip with @click',
      '<dt-chip @click="handleClick" />',
      '<dt-chip :interactive="true" @click="handleClick" />',
    ],
    [
      'PascalCase DtChip with @click',
      '<DtChip @click="handleClick">Label</DtChip>',
      '<DtChip :interactive="true" @click="handleClick">Label</DtChip>',
    ],
  ];

  for (const [label, input, expected] of cases) {
    it(label, () => {
      assert.equal(run(input), expected);
    });
  }
});

describe('chips with v-on object binding — auto-add :interactive="true"', () => {
  const cases = [
    [
      'chip with v-on object binding (double quotes)',
      '<dt-chip v-on="chipListeners">Label</dt-chip>',
      '<dt-chip :interactive="true" v-on="chipListeners">Label</dt-chip>',
    ],
    [
      'chip with v-on object binding (single quotes)',
      '<dt-chip v-on=\'chipListeners\'>Label</dt-chip>',
      '<dt-chip :interactive="true" v-on=\'chipListeners\'>Label</dt-chip>',
    ],
  ];

  for (const [label, input, expected] of cases) {
    it(label, () => {
      assert.equal(run(input), expected);
    });
  }
});

// ---------------------------------------------------------------------------
// Skip chips that already have the interactive prop
// ---------------------------------------------------------------------------

describe('chips that already have interactive prop — no change', () => {
  const cases = [
    [
      'already has :interactive="true"',
      '<dt-chip :interactive="true" @click="handleClick">Label</dt-chip>',
    ],
    [
      'already has :interactive="false"',
      '<dt-chip :interactive="false">Label</dt-chip>',
    ],
    [
      'already has plain interactive',
      '<dt-chip interactive>Label</dt-chip>',
    ],
    [
      'already has v-bind:interactive',
      '<dt-chip v-bind:interactive="isInteractive">Label</dt-chip>',
    ],
  ];

  for (const [label, input] of cases) {
    it(label, () => {
      assert.equal(run(input), input);
    });
  }
});

// ---------------------------------------------------------------------------
// Chips with no click handler — warn, no change
// ---------------------------------------------------------------------------

describe('chips with no click handler — no change, emit warning', () => {
  it('display-only chip produces no output change', () => {
    const input = '<dt-chip>Label</dt-chip>';
    assert.equal(run(input), input);
  });

  it('display-only chip emits a warning', () => {
    const input = '<dt-chip>Label</dt-chip>';
    assert.equal(warnings(input).length, 1);
  });

  it('warning message mentions the file path', () => {
    const { warnings: w } = transformContent('<dt-chip>Label</dt-chip>', { filePath: 'src/MyComponent.vue' });
    assert.ok(w[0].includes('src/MyComponent.vue'));
  });

  it('chip with @close only (no @click) emits warning, no auto-change', () => {
    const input = '<dt-chip @close="onRemove">Label</dt-chip>';
    assert.equal(run(input), input);
    assert.equal(warnings(input).length, 1);
  });
});

// ---------------------------------------------------------------------------
// Multiple chips in one file
// ---------------------------------------------------------------------------

describe('multiple chips in one file', () => {
  it('adds :interactive to the clickable chip only', () => {
    const input = [
      '<dt-chip @click="onClick">Clickable</dt-chip>',
      '<dt-chip>Display</dt-chip>',
    ].join('\n');
    const expected = [
      '<dt-chip :interactive="true" @click="onClick">Clickable</dt-chip>',
      '<dt-chip>Display</dt-chip>',
    ].join('\n');
    assert.equal(run(input), expected);
  });

  it('warns once per display-only chip', () => {
    const input = [
      '<dt-chip>Label A</dt-chip>',
      '<dt-chip>Label B</dt-chip>',
    ].join('\n');
    assert.equal(warnings(input).length, 2);
  });
});

// ---------------------------------------------------------------------------
// Inert content masking — should not match chips in comments or script
// ---------------------------------------------------------------------------

describe('inert content masking', () => {
  it('does not transform chip inside HTML comment', () => {
    const input = '<!-- <dt-chip @click="x">hidden</dt-chip> -->';
    assert.equal(run(input), input);
  });

  it('does not transform chip inside <script>', () => {
    const input = '<script>\nconst example = `<dt-chip @click="x">Label</dt-chip>`;\n</script>';
    assert.equal(run(input), input);
  });
});

// ---------------------------------------------------------------------------
// Fast path — no-op on files with no dt-chip reference
// ---------------------------------------------------------------------------

describe('fast path', () => {
  it('returns unchanged content when no dt-chip present', () => {
    const input = '<dt-button @click="x">Click</dt-button>';
    assert.equal(run(input), input);
  });

  it('emits no warnings when no dt-chip present', () => {
    const input = '<dt-button @click="x">Click</dt-button>';
    assert.equal(warnings(input).length, 0);
  });
});
