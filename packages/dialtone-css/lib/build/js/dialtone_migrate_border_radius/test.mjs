#!/usr/bin/env node

/**
 * @fileoverview Tests for dialtone-migrate-border-radius codemod.
 * Run: node packages/dialtone-css/lib/build/js/dialtone_migrate_border_radius/test.mjs
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { transformContent } from './index.mjs';

// ---------------------------------------------------------------------------
// All-corners numeric (d-barN → d-bar-STOP)
// ---------------------------------------------------------------------------

describe('All-corners numeric renames', () => {
  it('d-bar0 → d-bar-0', () => {
    const { transformed, count } = transformContent('<div class="d-bar0" />');
    assert.equal(transformed, '<div class="d-bar-0" />');
    assert.equal(count, 1);
  });

  it('d-bar1 → d-bar-100', () => {
    const { transformed } = transformContent('<div class="d-bar1" />');
    assert.equal(transformed, '<div class="d-bar-100" />');
  });

  it('d-bar2 → d-bar-200', () => {
    const { transformed } = transformContent('<div class="d-bar2" />');
    assert.equal(transformed, '<div class="d-bar-200" />');
  });

  it('d-bar4 → d-bar-300', () => {
    const { transformed } = transformContent('<div class="d-bar4" />');
    assert.equal(transformed, '<div class="d-bar-300" />');
  });

  it('d-bar6 → d-bar-350', () => {
    const { transformed } = transformContent('<div class="d-bar6" />');
    assert.equal(transformed, '<div class="d-bar-350" />');
  });

  it('d-bar8 → d-bar-400', () => {
    const { transformed } = transformContent('<div class="d-bar8" />');
    assert.equal(transformed, '<div class="d-bar-400" />');
  });

  it('d-bar12 → d-bar-450', () => {
    const { transformed } = transformContent('<div class="d-bar12" />');
    assert.equal(transformed, '<div class="d-bar-450" />');
  });

  it('d-bar16 → d-bar-500', () => {
    const { transformed } = transformContent('<div class="d-bar16" />');
    assert.equal(transformed, '<div class="d-bar-500" />');
  });

  it('d-bar24 → d-bar-550', () => {
    const { transformed } = transformContent('<div class="d-bar24" />');
    assert.equal(transformed, '<div class="d-bar-550" />');
  });

  it('d-bar32 → d-bar-600', () => {
    const { transformed } = transformContent('<div class="d-bar32" />');
    assert.equal(transformed, '<div class="d-bar-600" />');
  });
});

// ---------------------------------------------------------------------------
// Pair numeric (d-{btr|bbr|blr|brr}N → d-{bbsr|bber|bisr|bier}-STOP)
// ---------------------------------------------------------------------------

describe('Pair numeric renames', () => {
  it('d-btr6 → d-bbsr-350 (top → block-start)', () => {
    const { transformed } = transformContent('<div class="d-btr6" />');
    assert.equal(transformed, '<div class="d-bbsr-350" />');
  });

  it('d-btr8 → d-bbsr-400', () => {
    const { transformed } = transformContent('<div class="d-btr8" />');
    assert.equal(transformed, '<div class="d-bbsr-400" />');
  });

  it('d-bbr8 → d-bber-400 (bottom → block-end)', () => {
    const { transformed } = transformContent('<div class="d-bbr8" />');
    assert.equal(transformed, '<div class="d-bber-400" />');
  });

  it('d-blr12 → d-bisr-450 (left → inline-start)', () => {
    const { transformed } = transformContent('<div class="d-blr12" />');
    assert.equal(transformed, '<div class="d-bisr-450" />');
  });

  it('d-brr16 → d-bier-500 (right → inline-end)', () => {
    const { transformed } = transformContent('<div class="d-brr16" />');
    assert.equal(transformed, '<div class="d-bier-500" />');
  });
});

// ---------------------------------------------------------------------------
// Pair keyword (d-{btr|bbr|blr|brr}-{pill|circle} → logical)
// ---------------------------------------------------------------------------

describe('Pair keyword renames', () => {
  it('d-btr-pill → d-bbsr-pill', () => {
    const { transformed } = transformContent('<div class="d-btr-pill" />');
    assert.equal(transformed, '<div class="d-bbsr-pill" />');
  });

  it('d-btr-circle → d-bbsr-circle', () => {
    const { transformed } = transformContent('<div class="d-btr-circle" />');
    assert.equal(transformed, '<div class="d-bbsr-circle" />');
  });

  it('d-bbr-pill → d-bber-pill', () => {
    const { transformed } = transformContent('<div class="d-bbr-pill" />');
    assert.equal(transformed, '<div class="d-bber-pill" />');
  });

  it('d-bbr-circle → d-bber-circle', () => {
    const { transformed } = transformContent('<div class="d-bbr-circle" />');
    assert.equal(transformed, '<div class="d-bber-circle" />');
  });

  it('d-blr-pill → d-bisr-pill', () => {
    const { transformed } = transformContent('<div class="d-blr-pill" />');
    assert.equal(transformed, '<div class="d-bisr-pill" />');
  });

  it('d-blr-circle → d-bisr-circle', () => {
    const { transformed } = transformContent('<div class="d-blr-circle" />');
    assert.equal(transformed, '<div class="d-bisr-circle" />');
  });

  it('d-brr-pill → d-bier-pill', () => {
    const { transformed } = transformContent('<div class="d-brr-pill" />');
    assert.equal(transformed, '<div class="d-bier-pill" />');
  });

  it('d-brr-circle → d-bier-circle', () => {
    const { transformed } = transformContent('<div class="d-brr-circle" />');
    assert.equal(transformed, '<div class="d-bier-circle" />');
  });
});

// ---------------------------------------------------------------------------
// Multiple classes in one attribute
// ---------------------------------------------------------------------------

describe('Multiple classes in one attribute', () => {
  it('rewrites multiple legacy classes in one pass', () => {
    const { transformed, count } = transformContent('<div class="d-bar6 d-btr8 d-blr-pill" />');
    assert.equal(transformed, '<div class="d-bar-350 d-bbsr-400 d-bisr-pill" />');
    assert.equal(count, 3);
  });

  it('leaves non-radius classes untouched', () => {
    const { transformed, count } = transformContent('<div class="d-p-200 d-bar6 d-fc-primary" />');
    assert.equal(transformed, '<div class="d-p-200 d-bar-350 d-fc-primary" />');
    assert.equal(count, 1);
  });
});

// ---------------------------------------------------------------------------
// Already-migrated classes — no changes
// ---------------------------------------------------------------------------

describe('Does NOT transform already-migrated classes', () => {
  it('ignores d-bar-350 (already new format)', () => {
    const { transformed, count } = transformContent('<div class="d-bar-350" />');
    assert.equal(transformed, '<div class="d-bar-350" />');
    assert.equal(count, 0);
  });

  it('ignores d-bbsr-400', () => {
    const { transformed, count } = transformContent('<div class="d-bbsr-400" />');
    assert.equal(transformed, '<div class="d-bbsr-400" />');
    assert.equal(count, 0);
  });

  it('ignores d-bber-pill', () => {
    const { transformed, count } = transformContent('<div class="d-bber-pill" />');
    assert.equal(transformed, '<div class="d-bber-pill" />');
    assert.equal(count, 0);
  });

  it('ignores d-bisr-circle', () => {
    const { transformed, count } = transformContent('<div class="d-bisr-circle" />');
    assert.equal(transformed, '<div class="d-bisr-circle" />');
    assert.equal(count, 0);
  });

  it('ignores d-bar-pill (all-corners keyword, not deprecated)', () => {
    const { transformed, count } = transformContent('<div class="d-bar-pill" />');
    assert.equal(transformed, '<div class="d-bar-pill" />');
    assert.equal(count, 0);
  });

  it('ignores d-bar-circle (all-corners keyword, not deprecated)', () => {
    const { transformed, count } = transformContent('<div class="d-bar-circle" />');
    assert.equal(transformed, '<div class="d-bar-circle" />');
    assert.equal(count, 0);
  });
});

// ---------------------------------------------------------------------------
// Does NOT match inside unrelated class names
// ---------------------------------------------------------------------------

describe('Does NOT match substrings inside other classes', () => {
  it('ignores foo-d-bar6', () => {
    const { transformed, count } = transformContent('<div class="foo-d-bar6" />');
    assert.equal(transformed, '<div class="foo-d-bar6" />');
    assert.equal(count, 0);
  });

  it('ignores my-d-btr8', () => {
    const { transformed, count } = transformContent('<div class="my-d-btr8" />');
    assert.equal(transformed, '<div class="my-d-btr8" />');
    assert.equal(count, 0);
  });

  it('ignores app-d-brr-pill', () => {
    const { transformed, count } = transformContent('<div class="app-d-brr-pill" />');
    assert.equal(transformed, '<div class="app-d-brr-pill" />');
    assert.equal(count, 0);
  });
});

// ---------------------------------------------------------------------------
// Unrelated classes — no false positives
// ---------------------------------------------------------------------------

describe('Does NOT touch unrelated utilities', () => {
  it('ignores d-p-200 d-m-100 d-fc-primary', () => {
    const input = '<div class="d-p-200 d-m-100 d-fc-primary" />';
    const { transformed, count } = transformContent(input);
    assert.equal(transformed, input);
    assert.equal(count, 0);
  });

  it('ignores d-ba d-baw2 d-bas-dashed', () => {
    const input = '<div class="d-ba d-baw2 d-bas-dashed" />';
    const { transformed, count } = transformContent(input);
    assert.equal(transformed, input);
    assert.equal(count, 0);
  });
});

// ---------------------------------------------------------------------------
// Different quote styles
// ---------------------------------------------------------------------------

describe('Different quote styles and contexts', () => {
  it('handles single-quoted class attribute', () => {
    const { transformed } = transformContent('<div class=\'d-btr8\' />');
    assert.equal(transformed, '<div class=\'d-bbsr-400\' />');
  });

  it('handles class in a Vue template', () => {
    const input = '<template><div class="d-bar6 d-brr-circle" /></template>';
    const expected = '<template><div class="d-bar-350 d-bier-circle" /></template>';
    const { transformed } = transformContent(input);
    assert.equal(transformed, expected);
  });
});

// ---------------------------------------------------------------------------
// Template literals (JS/TS backtick strings)
// ---------------------------------------------------------------------------

describe('Template literal delimiters', () => {
  it('transforms d-bar6 inside a simple template literal', () => {
    const input = 'const cls = `d-bar6`;';
    const expected = 'const cls = `d-bar-350`;';
    const { transformed, count } = transformContent(input);
    assert.equal(transformed, expected);
    assert.equal(count, 1);
  });

  it('transforms pair keyword inside a template literal', () => {
    const input = 'const cls = `d-btr-pill`;';
    const expected = 'const cls = `d-bbsr-pill`;';
    const { transformed } = transformContent(input);
    assert.equal(transformed, expected);
  });

  it('transforms pair numeric inside a template literal', () => {
    const input = 'const cls = `d-brr16`;';
    const expected = 'const cls = `d-bier-500`;';
    const { transformed } = transformContent(input);
    assert.equal(transformed, expected);
  });

  it('transforms multiple classes inside a template literal', () => {
    const input = 'const cls = `d-bar8 d-btr-circle`;';
    const expected = 'const cls = `d-bar-400 d-bbsr-circle`;';
    const { transformed, count } = transformContent(input);
    assert.equal(transformed, expected);
    assert.equal(count, 2);
  });

  it('transforms class inside a template literal with interpolation', () => {
    const input = 'const cls = `d-bar6 ${otherClass}`;';
    const expected = 'const cls = `d-bar-350 ${otherClass}`;';
    const { transformed, count } = transformContent(input);
    assert.equal(transformed, expected);
    assert.equal(count, 1);
  });

  it('does not match inside a non-delimited context (no false positive)', () => {
    const input = 'const cls = `foo-d-bar6`;';
    const { transformed, count } = transformContent(input);
    assert.equal(transformed, input);
    assert.equal(count, 0);
  });
});

// ---------------------------------------------------------------------------
// Edge cases
// ---------------------------------------------------------------------------

describe('Edge cases', () => {
  it('returns count of 0 for content with no matches', () => {
    const { count } = transformContent('<div><span>No radius here</span></div>');
    assert.equal(count, 0);
  });

  it('handles empty string', () => {
    const { transformed, count } = transformContent('');
    assert.equal(transformed, '');
    assert.equal(count, 0);
  });

  it('handles d-bar32 at end of attribute (before closing quote)', () => {
    const { transformed } = transformContent('<div class="d-p-200 d-bar32" />');
    assert.equal(transformed, '<div class="d-p-200 d-bar-600" />');
  });

  it('handles class at start of attribute (after opening quote)', () => {
    const { transformed } = transformContent('<div class="d-bar6 d-p-200" />');
    assert.equal(transformed, '<div class="d-bar-350 d-p-200" />');
  });
});

// ---------------------------------------------------------------------------
// Real-world patterns
// ---------------------------------------------------------------------------

describe('Real-world patterns', () => {
  it('transforms radius in a card-like component', () => {
    const input = '<div class="d-p-200 d-bgc-primary d-bar8 d-bs-sm">';
    const expected = '<div class="d-p-200 d-bgc-primary d-bar-400 d-bs-sm">';
    const { transformed } = transformContent(input);
    assert.equal(transformed, expected);
  });

  it('transforms top-only radius on a header', () => {
    const input = '<div class="d-btr6 d-bgc-moderate">';
    const expected = '<div class="d-bbsr-350 d-bgc-moderate">';
    const { transformed } = transformContent(input);
    assert.equal(transformed, expected);
  });

  it('transforms bottom pill radius', () => {
    const input = '<div class="d-bbr-pill d-bgc-info">';
    const expected = '<div class="d-bber-pill d-bgc-info">';
    const { transformed } = transformContent(input);
    assert.equal(transformed, expected);
  });

  it('transforms mixed numeric and keyword across multiple classes', () => {
    const input = '<div class="d-bar6 d-btr-pill d-bbr-circle d-blr8 d-brr-pill">';
    const expected = '<div class="d-bar-350 d-bbsr-pill d-bber-circle d-bisr-400 d-bier-pill">';
    const { transformed, count } = transformContent(input);
    assert.equal(transformed, expected);
    assert.equal(count, 5);
  });
});
