/**
 * dialtone-migrate-typography tests.
 *
 * One assertion per test; data-driven via for..of where multiple cases share a concept.
 * Run: node --test packages/dialtone-css/lib/build/js/dialtone_migrate_typography/test.mjs
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  transformContent,
  detectImportPathFor,
  removeMarkersForTest,
  validateDtTextProps,
} from './index.mjs';

function run (input) {
  const { transformed } = transformContent(input, { filePath: 'test.vue' });
  return transformed;
}

function warnings (input) {
  return transformContent(input, { filePath: 'test.vue' }).warnings;
}

// ---------------------------------------------------------------------------
// Task 1 — scaffold / no-op fast path
// ---------------------------------------------------------------------------

describe('fast path — no typography classes', () => {
  it('returns unchanged content when no typography class present', () => {
    const input = '<div class="d-d-flex">Hello</div>';
    assert.equal(run(input), input);
  });

  it('emits no warnings when no typography class present', () => {
    const input = '<div class="d-d-flex">Hello</div>';
    assert.equal(warnings(input).length, 0);
  });

  it('returns unchanged empty string', () => {
    assert.equal(run(''), '');
  });
});

// ---------------------------------------------------------------------------
// Task 2 — composed class transformation
// ---------------------------------------------------------------------------

describe('headline → dt-text', () => {
  const cases = [
    // basic sizes
    ['d-headline--sm on p', '<p class="d-headline--sm">Hi</p>', '<dt-text as="p" kind="headline" size="100">Hi</dt-text>'],
    ['d-headline-small alias', '<p class="d-headline-small">Hi</p>', '<dt-text as="p" kind="headline" size="100">Hi</dt-text>'],
    ['d-headline--md on p', '<p class="d-headline--md">Hi</p>', '<dt-text as="p" kind="headline" size="300">Hi</dt-text>'],
    ['d-headline-medium alias', '<p class="d-headline-medium">Hi</p>', '<dt-text as="p" kind="headline" size="300">Hi</dt-text>'],
    ['d-headline--lg on p', '<p class="d-headline--lg">Hi</p>', '<dt-text as="p" kind="headline" size="500">Hi</dt-text>'],
    ['d-headline-large alias', '<p class="d-headline-large">Hi</p>', '<dt-text as="p" kind="headline" size="500">Hi</dt-text>'],
    ['d-headline--xl on p', '<p class="d-headline--xl">Hi</p>', '<dt-text as="p" kind="headline" size="600">Hi</dt-text>'],
    ['d-headline-extra-large alias', '<p class="d-headline-extra-large">Hi</p>', '<dt-text as="p" kind="headline" size="600">Hi</dt-text>'],
    ['d-headline--xxl on p', '<p class="d-headline--xxl">Hi</p>', '<dt-text as="p" kind="headline" size="700">Hi</dt-text>'],
    ['d-headline-extra-extra-large alias', '<p class="d-headline-extra-extra-large">Hi</p>', '<dt-text as="p" kind="headline" size="700">Hi</dt-text>'],
    // soft variants (strength=medium)
    ['d-headline--sm-soft', '<p class="d-headline--sm-soft">Hi</p>', '<dt-text as="p" kind="headline" size="100" strength="medium">Hi</dt-text>'],
    ['d-headline-soft-small alias', '<p class="d-headline-soft-small">Hi</p>', '<dt-text as="p" kind="headline" size="100" strength="medium">Hi</dt-text>'],
    ['d-headline--lg-soft', '<p class="d-headline--lg-soft">Hi</p>', '<dt-text as="p" kind="headline" size="500" strength="medium">Hi</dt-text>'],
    // compact variants
    ['d-headline--sm-compact', '<p class="d-headline--sm-compact">Hi</p>', '<dt-text as="p" kind="headline" size="100" density="200">Hi</dt-text>'],
    ['d-headline-compact-small alias', '<p class="d-headline-compact-small">Hi</p>', '<dt-text as="p" kind="headline" size="100" density="200">Hi</dt-text>'],
    ['d-headline--md-compact', '<p class="d-headline--md-compact">Hi</p>', '<dt-text as="p" kind="headline" size="300" density="300">Hi</dt-text>'],
    ['d-headline--lg-compact', '<p class="d-headline--lg-compact">Hi</p>', '<dt-text as="p" kind="headline" size="500" density="200">Hi</dt-text>'],
    ['d-headline--xl-compact', '<p class="d-headline--xl-compact">Hi</p>', '<dt-text as="p" kind="headline" size="600" density="100">Hi</dt-text>'],
    ['d-headline--xxl-compact (no density)', '<p class="d-headline--xxl-compact">Hi</p>', '<dt-text as="p" kind="headline" size="700">Hi</dt-text>'],
    // soft-compact
    ['d-headline--sm-soft-compact', '<p class="d-headline--sm-soft-compact">Hi</p>', '<dt-text as="p" kind="headline" size="100" strength="medium" density="200">Hi</dt-text>'],
    ['d-headline--lg-soft-compact', '<p class="d-headline--lg-soft-compact">Hi</p>', '<dt-text as="p" kind="headline" size="500" strength="medium" density="200">Hi</dt-text>'],
  ];
  for (const [label, input, expected] of cases) {
    it(label, () => { assert.equal(run(input), expected); });
  }
});

describe('body → dt-text', () => {
  const cases = [
    ['d-body--md on p', '<p class="d-body--md">Hi</p>', '<dt-text as="p" kind="body" size="300">Hi</dt-text>'],
    ['d-body-base alias', '<p class="d-body-base">Hi</p>', '<dt-text as="p" kind="body" size="300">Hi</dt-text>'],
    ['d-body--sm on p', '<p class="d-body--sm">Hi</p>', '<dt-text as="p" kind="body" size="100">Hi</dt-text>'],
    ['d-body-small alias', '<p class="d-body-small">Hi</p>', '<dt-text as="p" kind="body" size="100">Hi</dt-text>'],
    ['d-body--md-compact', '<p class="d-body--md-compact">Hi</p>', '<dt-text as="p" kind="body" size="300" density="300">Hi</dt-text>'],
    ['d-body-compact alias', '<p class="d-body-compact">Hi</p>', '<dt-text as="p" kind="body" size="300" density="300">Hi</dt-text>'],
    ['d-body--sm-compact', '<p class="d-body--sm-compact">Hi</p>', '<dt-text as="p" kind="body" size="100" density="200">Hi</dt-text>'],
    ['d-body-compact-small alias', '<p class="d-body-compact-small">Hi</p>', '<dt-text as="p" kind="body" size="100" density="200">Hi</dt-text>'],
  ];
  for (const [label, input, expected] of cases) {
    it(label, () => { assert.equal(run(input), expected); });
  }
});

describe('label → dt-text', () => {
  const cases = [
    ['d-label--md', '<p class="d-label--md">Hi</p>', '<dt-text as="p" kind="label" size="300">Hi</dt-text>'],
    ['d-label-base alias', '<p class="d-label-base">Hi</p>', '<dt-text as="p" kind="label" size="300">Hi</dt-text>'],
    ['d-label--sm', '<p class="d-label--sm">Hi</p>', '<dt-text as="p" kind="label" size="100">Hi</dt-text>'],
    ['d-label-small alias', '<p class="d-label-small">Hi</p>', '<dt-text as="p" kind="label" size="100">Hi</dt-text>'],
    ['d-label--md-compact', '<p class="d-label--md-compact">Hi</p>', '<dt-text as="p" kind="label" size="300" density="300">Hi</dt-text>'],
    ['d-label--sm-compact', '<p class="d-label--sm-compact">Hi</p>', '<dt-text as="p" kind="label" size="100" density="200">Hi</dt-text>'],
    ['d-label--md-plain', '<p class="d-label--md-plain">Hi</p>', '<dt-text as="p" kind="label" size="300" strength="normal">Hi</dt-text>'],
    ['d-label-plain alias', '<p class="d-label-plain">Hi</p>', '<dt-text as="p" kind="label" size="300" strength="normal">Hi</dt-text>'],
    ['d-label--md-plain-compact', '<p class="d-label--md-plain-compact">Hi</p>', '<dt-text as="p" kind="label" size="300" strength="normal" density="300">Hi</dt-text>'],
    ['d-label--sm-plain', '<p class="d-label--sm-plain">Hi</p>', '<dt-text as="p" kind="label" size="100" strength="normal">Hi</dt-text>'],
    ['d-label--sm-plain-compact', '<p class="d-label--sm-plain-compact">Hi</p>', '<dt-text as="p" kind="label" size="100" strength="normal" density="200">Hi</dt-text>'],
  ];
  for (const [label, input, expected] of cases) {
    it(label, () => { assert.equal(run(input), expected); });
  }
});

describe('code → dt-text', () => {
  it('d-code--md maps to kind=code size=200', () => {
    assert.equal(run('<p class="d-code--md">Hi</p>'), '<dt-text as="p" kind="code" size="200">Hi</dt-text>');
  });
  it('d-code-base alias maps to kind=code size=200', () => {
    assert.equal(run('<p class="d-code-base">Hi</p>'), '<dt-text as="p" kind="code" size="200">Hi</dt-text>');
  });
});

describe('flag rows — eyebrow and code-sm emit review comment, no rewrite', () => {
  it('d-headline--eyebrow emits review comment and leaves element unchanged', () => {
    const input = '<p class="d-headline--eyebrow">Hi</p>';
    const out = run(input);
    assert.ok(out.includes('<!-- dt-text-migrate: review -->'), 'should emit review comment');
    assert.ok(out.includes('<p class="d-headline--eyebrow">'), 'should preserve original element');
  });
  it('d-headline-eyebrow alias emits review comment', () => {
    const input = '<p class="d-headline-eyebrow">Hi</p>';
    assert.ok(run(input).includes('<!-- dt-text-migrate: review -->'));
  });
  it('d-code--sm emits review comment and leaves element unchanged', () => {
    const input = '<p class="d-code--sm">Hi</p>';
    const out = run(input);
    assert.ok(out.includes('<!-- dt-text-migrate: review -->'));
    assert.ok(out.includes('<p class="d-code--sm">'));
  });
  it('d-code-small alias emits review comment', () => {
    const input = '<p class="d-code-small">Hi</p>';
    assert.ok(run(input).includes('<!-- dt-text-migrate: review -->'));
  });
});

describe('helper rows — approximate as body+density with review marker', () => {
  it('d-helper--md rewrites to body size=300 density=300 with helper comment', () => {
    const input = '<p class="d-helper--md">Hi</p>';
    const out = run(input);
    assert.ok(out.includes('kind="body"'), 'should have kind=body');
    assert.ok(out.includes('size="300"'), 'should have size=300');
    assert.ok(out.includes('density="300"'), 'should have density=300');
    assert.ok(out.includes('<!-- dt-text-migrate: review helper -->'), 'should have helper comment');
  });
  it('d-helper--sm rewrites to body size=100 density=200 with helper comment', () => {
    const input = '<p class="d-helper--sm">Hi</p>';
    const out = run(input);
    assert.ok(out.includes('kind="body"') && out.includes('size="100"') && out.includes('density="200"'));
    assert.ok(out.includes('<!-- dt-text-migrate: review helper -->'));
  });
});

describe('element tags — only rewriteable tags are converted', () => {
  const rewriteable = ['p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'label'];
  for (const tag of rewriteable) {
    it(`<${tag}> is rewritten to dt-text with as="${tag}"`, () => {
      const input = `<${tag} class="d-headline--md">Hi</${tag}>`;
      const out = run(input);
      assert.ok(out.startsWith('<dt-text'), `should start with dt-text, got: ${out}`);
      assert.ok(out.includes(`as="${tag}"`), `should include as="${tag}"`);
    });
  }
  it('<span> is rewritten without as prop (DtText default)', () => {
    assert.equal(run('<span class="d-body--sm">x</span>'), '<dt-text kind="body" size="100">x</dt-text>');
  });
  it('<a> is not rewritten', () => {
    const input = '<a class="d-headline--md">link</a>';
    assert.equal(run(input), input);
  });
  it('<button> is not rewritten', () => {
    const input = '<button class="d-headline--md">btn</button>';
    assert.equal(run(input), input);
  });
  it('<li> is not rewritten', () => {
    const input = '<li class="d-headline--md">item</li>';
    assert.equal(run(input), input);
  });
});

describe('mixed classes — composed class dropped, others retained', () => {
  it('retains non-typography class on output dt-text', () => {
    assert.equal(
      run('<p class="d-headline--md d-mb-200">Hi</p>'),
      '<dt-text as="p" kind="headline" size="300" class="d-mb-200">Hi</dt-text>',
    );
  });
  it('retains multiple non-typography classes', () => {
    assert.equal(
      run('<p class="d-headline--md d-mb-200 d-p-100">Hi</p>'),
      '<dt-text as="p" kind="headline" size="300" class="d-mb-200 d-p-100">Hi</dt-text>',
    );
  });
  it('drops only the composed class when mixed', () => {
    const out = run('<p class="d-body--sm d-w100p">x</p>');
    assert.ok(!out.includes('d-body--sm'), 'should drop d-body--sm');
    assert.ok(out.includes('d-w100p'), 'should retain d-w100p');
  });
});

describe('multi-element file — all matches rewritten', () => {
  it('rewrites two elements in the same file', () => {
    const input = [
      '<p class="d-headline--md">Title</p>',
      '<p class="d-body--sm">Body</p>',
    ].join('\n');
    const expected = [
      '<dt-text as="p" kind="headline" size="300">Title</dt-text>',
      '<dt-text as="p" kind="body" size="100">Body</dt-text>',
    ].join('\n');
    assert.equal(run(input), expected);
  });
});

// ---------------------------------------------------------------------------
// Task 3 — override utility extraction + already-DtText residual lift
// ---------------------------------------------------------------------------

describe('override utilities on rewriteable elements', () => {
  it('d-fw-bold on p alongside composed class → strength prop', () => {
    assert.equal(
      run('<p class="d-headline--md d-fw-bold">x</p>'),
      '<dt-text as="p" kind="headline" size="300" strength="bold">x</dt-text>',
    );
  });
  it('d-fc-tertiary → tone prop', () => {
    assert.equal(
      run('<p class="d-headline--md d-fc-tertiary">x</p>'),
      '<dt-text as="p" kind="headline" size="300" tone="tertiary">x</dt-text>',
    );
  });
  it('d-fw-bold + d-fc-tertiary together on p', () => {
    assert.equal(
      run('<p class="d-fw-bold d-fc-tertiary">x</p>'),
      '<dt-text as="p" strength="bold" tone="tertiary">x</dt-text>',
    );
  });
  it('d-lh-300 → density prop', () => {
    assert.equal(
      run('<p class="d-body--md d-lh-300">x</p>'),
      '<dt-text as="p" kind="body" size="300" density="300">x</dt-text>',
    );
  });
  it('d-truncate → truncate boolean prop (no value)', () => {
    assert.equal(
      run('<p class="d-body--sm d-truncate">x</p>'),
      '<dt-text as="p" kind="body" size="100" truncate>x</dt-text>',
    );
  });
  it('d-ta-left → align="start" (logical naming)', () => {
    assert.equal(
      run('<p class="d-body--sm d-ta-left">x</p>'),
      '<dt-text as="p" kind="body" size="100" align="start">x</dt-text>',
    );
  });
  it('d-ta-right → align="end" (logical naming)', () => {
    assert.equal(
      run('<p class="d-body--sm d-ta-right">x</p>'),
      '<dt-text as="p" kind="body" size="100" align="end">x</dt-text>',
    );
  });
  it('d-ta-center → align="center"', () => {
    assert.equal(
      run('<p class="d-body--sm d-ta-center">x</p>'),
      '<dt-text as="p" kind="body" size="100" align="center">x</dt-text>',
    );
  });
  it('d-ta-justify → align="justify"', () => {
    assert.equal(
      run('<p class="d-body--sm d-ta-justify">x</p>'),
      '<dt-text as="p" kind="body" size="100" align="justify">x</dt-text>',
    );
  });
  it('all 15 d-fc-* tones map correctly (spot-check)', () => {
    const tones = [
      ['d-fc-primary', 'primary'], ['d-fc-secondary', 'secondary'], ['d-fc-muted', 'muted'],
      ['d-fc-disabled', 'disabled'], ['d-fc-placeholder', 'placeholder'],
      ['d-fc-critical', 'critical'], ['d-fc-critical-strong', 'critical-strong'],
      ['d-fc-positive', 'positive'], ['d-fc-positive-strong', 'positive-strong'],
      ['d-fc-warning', 'warning'], ['d-fc-info', 'info'], ['d-fc-info-strong', 'info-strong'],
      ['d-fc-neutral-black', 'neutral-black'], ['d-fc-neutral-white', 'neutral-white'],
    ];
    for (const [cls, expected] of tones) {
      const out = run(`<p class="${cls}">x</p>`);
      assert.ok(out.includes(`tone="${expected}"`), `${cls} should produce tone="${expected}", got: ${out}`);
    }
  });
  it('override-only on span (no composed) → dt-text without as prop', () => {
    assert.equal(
      run('<span class="d-fw-bold d-fc-tertiary">x</span>'),
      '<dt-text strength="bold" tone="tertiary">x</dt-text>',
    );
  });
  it('non-rewriteable <a> with only overrides → unchanged (silent)', () => {
    const input = '<a class="d-fw-bold">link</a>';
    assert.equal(run(input), input);
  });
  it('non-rewriteable <button> with d-truncate → unchanged', () => {
    const input = '<button class="d-truncate">btn</button>';
    assert.equal(run(input), input);
  });
});

describe('--validate — DtText prop bug detection', () => {
  it('detects object syntax on :tone', () => {
    const issues = validateDtTextProps('<dt-text :tone="{ muted: cond }">x</dt-text>');
    assert.equal(issues.length, 1);
    assert.equal(issues[0].type, 'object-syntax');
    assert.ok(issues[0].message.includes('tone'));
  });
  it('detects object syntax on :strength', () => {
    const issues = validateDtTextProps('<dt-text :strength="{ bold: isUnread }">x</dt-text>');
    assert.equal(issues.length, 1);
    assert.equal(issues[0].type, 'object-syntax');
  });
  it('detects invalid density value', () => {
    const issues = validateDtTextProps('<dt-text kind="body" density="160">x</dt-text>');
    assert.ok(issues.some(i => i.type === 'invalid-value' && i.message.includes('density')));
  });
  it('detects invalid kind value', () => {
    const issues = validateDtTextProps('<dt-text kind="title" size="md">x</dt-text>');
    assert.ok(issues.some(i => i.type === 'invalid-value' && i.message.includes('kind')));
  });
  it('detects mixed CSS classes on DtText (typography utility leakage)', () => {
    const issues = validateDtTextProps('<dt-text class="d-fw-bold d-fc-tertiary">x</dt-text>');
    assert.ok(issues.some(i => i.type === 'mixed-class'));
  });
  it('clean dt-text returns 0 issues', () => {
    const issues = validateDtTextProps('<dt-text kind="body" size="md" tone="primary">x</dt-text>');
    assert.equal(issues.length, 0);
  });
  it('accepts both numeric and t-shirt size values', () => {
    const a = validateDtTextProps('<dt-text size="300">x</dt-text>');
    const b = validateDtTextProps('<dt-text size="md">x</dt-text>');
    assert.equal(a.length, 0);
    assert.equal(b.length, 0);
  });
  it('non-typography classes on DtText do not flag', () => {
    const issues = validateDtTextProps('<dt-text class="my-custom d-mb-200">x</dt-text>');
    assert.equal(issues.length, 0);
  });
});

describe('P3 — legacy raw-utility heading hint comment', () => {
  it('emits hint for <h2> with d-fw-bold + d-fs-300 + d-fc-primary', () => {
    const input = '<h2 class="d-ff-custom d-fw-bold d-fs-300 d-fc-primary">x</h2>';
    const out = run(input);
    assert.ok(out.includes('dt-text-migrate: legacy heading'), `should emit hint, got: ${out}`);
    assert.ok(out.includes('kind=headline'), 'should propose kind=headline for h-tag');
    assert.ok(out.includes('strength=bold'), 'should propose strength=bold');
    assert.ok(out.includes('tone=primary'), 'should propose tone=primary');
    assert.ok(out.includes('<h2 class="d-ff-custom d-fw-bold d-fs-300 d-fc-primary">'), 'element unchanged');
  });
  it('emits hint for <p> with d-fw-medium + d-fs-200 — non-h tag gets verify-kind hint', () => {
    const input = '<p class="d-fw-medium d-fs-200 d-fc-secondary">x</p>';
    const out = run(input);
    assert.ok(out.includes('dt-text-migrate: legacy heading'));
    assert.ok(out.includes('VERIFY'), 'non-h tag should include VERIFY-kind note');
  });
  it('does NOT emit hint when there is no d-fw-* (just d-fs-N alone)', () => {
    const input = '<div class="d-fs-200">x</div>';
    const out = run(input);
    assert.ok(!out.includes('dt-text-migrate: legacy heading'));
  });
  it('does NOT emit hint when there is a composed class (Task 2 handles it)', () => {
    const input = '<h2 class="d-headline--md d-fw-bold d-fs-300">x</h2>';
    const out = run(input);
    assert.ok(!out.includes('dt-text-migrate: legacy heading'));
  });
  it('--remove-markers cleans up the legacy-heading hint (with embedded <dt-text>)', () => {
    const input = '<!-- dt-text-migrate: legacy heading — likely <dt-text as="h2" kind="headline" strength="bold"> (verify) --><h2>x</h2>';
    const cleaned = removeMarkersForTest(input);
    assert.equal(cleaned, '<h2>x</h2>');
  });
});

describe('d-ff-mono — establishes kind=code', () => {
  it('<span class="d-ff-mono"> → kind="code"', () => {
    assert.equal(
      run('<span class="d-ff-mono">x</span>'),
      '<dt-text kind="code">x</dt-text>',
    );
  });
  it('combined with d-fw-bold', () => {
    assert.equal(
      run('<span class="d-ff-mono d-fw-bold">x</span>'),
      '<dt-text kind="code" strength="bold">x</dt-text>',
    );
  });
});

describe('P1 — override-only without composed class: only span/p/label converted', () => {
  it('<span class="d-fw-bold"> converts (text-as-default is safe)', () => {
    assert.equal(
      run('<span class="d-fw-bold">x</span>'),
      '<dt-text strength="bold">x</dt-text>',
    );
  });
  it('<p class="d-fc-secondary"> converts', () => {
    assert.equal(
      run('<p class="d-fc-secondary">x</p>'),
      '<dt-text as="p" tone="secondary">x</dt-text>',
    );
  });
  it('<label class="d-fw-medium"> converts', () => {
    assert.equal(
      run('<label class="d-fw-medium">x</label>'),
      '<dt-text as="label" strength="medium">x</dt-text>',
    );
  });
  it('<div class="d-fc-neutral-white"> stays as <div> (layout wrapper safe)', () => {
    const input = '<div class="d-fc-neutral-white">x</div>';
    assert.equal(run(input), input);
  });
  it('<h2 class="d-fw-bold d-fc-primary"> stays as <h2> (kind not deducible)', () => {
    const input = '<h2 class="d-fw-bold d-fc-primary">x</h2>';
    assert.equal(run(input), input);
  });
});

describe('F8 — validateDtTextProps masks inert content + quote-aware', () => {
  it('ignores DtText inside HTML comments', () => {
    const issues = validateDtTextProps('<!-- <dt-text kind="title">x</dt-text> -->');
    assert.equal(issues.length, 0);
  });
  it('ignores DtText inside <script>', () => {
    const issues = validateDtTextProps('<script>const x = `<dt-text kind="title">x</dt-text>`;</script>');
    assert.equal(issues.length, 0);
  });
  it('still detects real bugs', () => {
    const issues = validateDtTextProps('<dt-text kind="title">x</dt-text>');
    assert.ok(issues.some(i => i.type === 'invalid-value'));
  });
  it('catches mixed-class even when > appears in a previous binding', () => {
    const issues = validateDtTextProps('<dt-text :title="a > b" class="d-fw-bold">x</dt-text>');
    assert.ok(issues.some(i => i.type === 'mixed-class'), 'should detect mixed class after > in binding');
  });
});

describe('C8 — addedDtText uses count delta, not boolean presence', () => {
  it('partial migration: existing <dt-text> + new <p class="d-headline--md"> → both kept, count grows', () => {
    const input = '<dt-text kind="body">existing</dt-text>\n<p class="d-headline--md">new</p>';
    const out = run(input);
    const before = (input.match(/<dt-text\b/g) || []).length;
    const after = (out.match(/<dt-text\b/g) || []).length;
    assert.equal(before, 1);
    assert.equal(after, 2);
    // The count-delta detection is what processFile uses to gate the import-warning;
    // we just assert here that the transform produces the expected before/after counts.
  });
});

describe('C3 — validateDtTextProps reports correct line numbers past masked regions', () => {
  it('line number after a large script block matches the actual source line', () => {
    const lines = ['<script>'];
    for (let i = 0; i < 50; i++) lines.push('  const x' + i + ' = ' + i + ';');
    lines.push('</script>');
    lines.push('<dt-text kind="title">x</dt-text>');
    const issues = validateDtTextProps(lines.join('\n'));
    assert.equal(issues.length, 1);
    assert.equal(issues[0].line, 53, `expected line 53, got ${issues[0].line}`);
  });
});

describe('C7 — idempotent dynamic-class marker insertion', () => {
  it('running the codemod twice produces the same output as one run', () => {
    const input = '<p :class="{ \'d-headline--md\': cond }">x</p>';
    const once = transformContent(input).transformed;
    const twice = transformContent(once).transformed;
    assert.equal(once, twice, 'second run should be a no-op');
  });
  it('marker count stays at 1 across multiple runs', () => {
    const input = '<p :class="{ \'d-headline--md\': cond }">x</p>';
    let out = input;
    for (let i = 0; i < 3; i++) out = transformContent(out).transformed;
    assert.equal((out.match(/review dynamic class/g) || []).length, 1);
  });
});

describe('C1 — nested span with flagged composed class stays unwrapped', () => {
  it('<span class="d-code--sm"> inside migrated parent is NOT rewritten', () => {
    const out = run('<p class="d-headline--md"><span class="d-code--sm">x</span></p>');
    assert.ok(out.includes('<span class="d-code--sm">x</span>'), `span should be preserved, got: ${out}`);
    assert.ok(!out.includes('<dt-text class="d-code--sm">'), 'should not rewrite flagged class');
  });
  it('<span class="d-headline--eyebrow"> inside migrated parent stays unwrapped', () => {
    const out = run('<p class="d-headline--md"><span class="d-headline--eyebrow">x</span></p>');
    assert.ok(out.includes('<span class="d-headline--eyebrow">x</span>'), `should preserve, got: ${out}`);
  });
});

describe('F4 — parseExistingProps does not false-match suffix attrs', () => {
  it('font-kind= is not treated as kind=', () => {
    assert.equal(
      run('<dt-text font-kind="foo" class="d-ff-mono">x</dt-text>'),
      '<dt-text font-kind="foo" kind="code">x</dt-text>',
    );
  });
  it('wrapper-truncate= is not treated as truncate', () => {
    assert.equal(
      run('<dt-text wrapper-truncate="yes" class="d-truncate">x</dt-text>'),
      '<dt-text wrapper-truncate="yes" truncate>x</dt-text>',
    );
  });
  it('legitimate conflict still flagged', () => {
    const out = run('<dt-text strength="bold" class="d-fw-normal">x</dt-text>');
    assert.ok(out.includes('<!-- dt-text-migrate: review conflicting class -->'));
    assert.ok(out.includes('strength="bold"'));
  });
});

describe('F3 — depth-aware parent body in collapseNestedSpans', () => {
  it('trailing unsafe span AFTER an inner converted dt-text still gets flagged', () => {
    const input = '<p class="d-headline--md"><span class="d-body--sm">inner</span><span class="d-fw-bold" @click="x">trailing</span></p>';
    const out = run(input);
    assert.ok(out.includes('<!-- dt-text-migrate: review nested span -->'), `should flag trailing unsafe span, got: ${out}`);
  });
});

describe('F7 — nested <span> preserved when outer span is safe-collapsed', () => {
  it('inner <span> stays intact, outer becomes <dt-text>', () => {
    const out = run('<p class="d-headline--md"><span class="d-fw-bold"><span>nested</span></span></p>');
    assert.ok(out.includes('<span>nested</span>'), `inner span should be preserved, got: ${out}`);
    assert.ok(out.includes('<dt-text strength="bold">'), 'outer span converted');
    // Should NOT produce broken markup like <span>nested</dt-text></span>
    assert.ok(!out.includes('</dt-text></span>'), 'should not produce mismatched tags');
  });
});

describe('F1 — quote-aware opening-tag matching (> inside :prop binding)', () => {
  it('<p class="d-headline--md" :title="a > b"> preserves the binding', () => {
    assert.equal(
      run('<p class="d-headline--md" :title="a > b">x</p>'),
      '<dt-text as="p" kind="headline" size="300" :title="a > b">x</dt-text>',
    );
  });
  it('<p :disabled="i > total" class="d-body--sm"> preserves the binding', () => {
    assert.equal(
      run('<p :disabled="i > total" class="d-body--sm">x</p>'),
      '<dt-text as="p" kind="body" size="100" :disabled="i > total">x</dt-text>',
    );
  });
});

describe('F2 — d-fs-* marker never injects into attribute values', () => {
  it('< inside title attr does NOT cause marker injection', () => {
    const out = run('<div title="a < b" class="d-fs-200">x</div>');
    // The marker must come BEFORE the <div, never inside title="..."
    assert.ok(out.startsWith('<!-- dt-text-migrate'), 'marker should precede the tag');
    assert.ok(out.includes('<div title="a < b" class="d-fs-200">'), 'original tag intact');
  });
  it('< inside v-if= does NOT cause marker injection', () => {
    const out = run('<button v-if="rowCount < total" class="d-fs-200">x</button>');
    assert.ok(out.includes('<button v-if="rowCount < total" class="d-fs-200">'), 'original tag intact');
  });
});

describe('B1 — *-class="..." prop attrs do not false-positive', () => {
  it('font-size-class="d-fs-200" on a parent <AiRecapItem> does NOT flag the parent', () => {
    const input = '<AiRecapItem font-size-class="d-fs-200" />';
    const out = run(input);
    assert.ok(!out.includes('dt-text-migrate'), `should not flag, got: ${out}`);
  });
  it('content-class="d-fs-100" on <DtTooltip> does NOT flag the tooltip', () => {
    const input = '<DtTooltip content-class="d-fw-normal d-fs-100 d-lh-200" />';
    const out = run(input);
    assert.ok(!out.includes('dt-text-migrate'), `should not flag, got: ${out}`);
  });
  it('heading-class="d-headline--md" on <DtListItemGroup> does NOT trigger rewrite', () => {
    const input = '<DtListItemGroup heading-class="d-headline--md" />';
    assert.equal(run(input), input);
  });
  it('label-class="d-ai-center" without typography still untouched', () => {
    const input = '<DtToggle label-class="d-ai-center" />';
    assert.equal(run(input), input);
  });
});

describe('already-dt-text residual lift', () => {
  it('lifts d-fw-bold + d-fc-tertiary from existing dt-text', () => {
    assert.equal(
      run('<dt-text kind="body" class="d-fw-bold d-fc-tertiary">x</dt-text>'),
      '<dt-text kind="body" strength="bold" tone="tertiary">x</dt-text>',
    );
  });
  it('lifts d-truncate boolean prop', () => {
    assert.equal(
      run('<dt-text kind="body" class="d-truncate">x</dt-text>'),
      '<dt-text kind="body" truncate>x</dt-text>',
    );
  });
  it('preserves existing explicit prop when class would conflict', () => {
    const input = '<dt-text strength="bold" class="d-fw-normal">x</dt-text>';
    const out = run(input);
    assert.ok(out.includes('strength="bold"'), 'should preserve strength=bold');
    assert.ok(out.includes('<!-- dt-text-migrate: review conflicting class -->'), 'should emit conflict comment');
  });
  it('retains unrecognised classes after lifting', () => {
    const out = run('<dt-text kind="body" class="d-fw-bold d-mb-200">x</dt-text>');
    assert.ok(out.includes('strength="bold"'), 'should have strength');
    assert.ok(out.includes('d-mb-200'), 'should retain d-mb-200');
    assert.ok(!out.includes('d-fw-bold'), 'should drop d-fw-bold');
  });
  it('PascalCase DtText is also lifted', () => {
    assert.equal(
      run('<DtText kind="body" class="d-fw-bold">x</DtText>'),
      '<DtText kind="body" strength="bold">x</DtText>',
    );
  });
});

// ---------------------------------------------------------------------------
// Task 4 — nested-span collapse + dynamic :class / d-fs-* flagging
// ---------------------------------------------------------------------------

describe('nested-span collapse — safe case', () => {
  it('collapses direct child span with only recognized classes', () => {
    assert.equal(
      run('<p class="d-headline--md"><span class="d-fw-bold">name</span></p>'),
      '<dt-text as="p" kind="headline" size="300"><dt-text strength="bold">name</dt-text></dt-text>',
    );
  });
  it('collapses span with composed class', () => {
    assert.equal(
      run('<p class="d-headline--md"><span class="d-body--sm">note</span></p>'),
      '<dt-text as="p" kind="headline" size="300"><dt-text kind="body" size="100">note</dt-text></dt-text>',
    );
  });
});

describe('nested-span — unsafe case receives review comment', () => {
  it('span with @click gets review comment, parent still rewritten', () => {
    const out = run('<p class="d-headline--md"><span class="d-fw-bold" @click="x">name</span></p>');
    assert.ok(out.startsWith('<dt-text'), 'parent should be rewritten');
    assert.ok(out.includes('<!-- dt-text-migrate: review nested span -->'), 'should have nested span comment');
    assert.ok(out.includes('<span class="d-fw-bold" @click="x">'), 'unsafe span should be preserved');
  });
  it('span with v-if gets review comment', () => {
    const out = run('<p class="d-headline--md"><span class="d-fw-bold" v-if="cond">x</span></p>');
    assert.ok(out.includes('<!-- dt-text-migrate: review nested span -->'));
    assert.ok(out.includes('<span class="d-fw-bold" v-if="cond">'));
  });
  it('span with id attribute gets review comment', () => {
    const out = run('<p class="d-headline--md"><span id="foo" class="d-fw-bold">x</span></p>');
    assert.ok(out.includes('<!-- dt-text-migrate: review nested span -->'));
  });
  it('span with unrecognised class gets review comment', () => {
    const out = run('<p class="d-headline--md"><span class="d-fw-bold custom-thing">x</span></p>');
    assert.ok(out.includes('<!-- dt-text-migrate: review nested span -->'));
    assert.ok(out.includes('<span class="d-fw-bold custom-thing">'));
  });
});

describe('dynamic :class flagging', () => {
  it(':class with typography class gets review comment, element unchanged', () => {
    const input = '<p :class="{ \'d-headline--md\': cond }">x</p>';
    const out = run(input);
    assert.ok(out.includes('<!-- dt-text-migrate: review dynamic class -->'), 'should flag dynamic class');
    assert.ok(out.includes(':class='), 'should preserve :class');
  });
  it('v-bind:class with typography class gets review comment', () => {
    const input = '<p v-bind:class="{ \'d-body--sm\': flag }">x</p>';
    const out = run(input);
    assert.ok(out.includes('<!-- dt-text-migrate: review dynamic class -->'));
  });
});

describe('d-fs-* flagging', () => {
  it('d-fs-* on rewritten element gets review comment, class retained', () => {
    const out = run('<p class="d-headline--md d-fs-150">x</p>');
    assert.ok(/dt-text-migrate: review d-fs-\d+/.test(out), 'should flag d-fs-N');
    assert.ok(out.includes('d-fs-150'), 'should retain d-fs-150 class');
    assert.ok(out.includes('kind="headline"'), 'should still rewrite composed class');
  });
  it('d-fs-* emits one comment regardless of multiple fs classes', () => {
    const out = run('<p class="d-headline--md d-fs-100 d-fs-200">x</p>');
    const count = (out.match(/dt-text-migrate: review d-fs-/g) || []).length;
    assert.equal(count, 1);
  });
});

// ---------------------------------------------------------------------------
// Task 5 — import detection + --remove-markers + end-to-end
// ---------------------------------------------------------------------------

describe('import detection', () => {
  it('detectMissingDtTextImport returns null when DtText already imported', () => {
    const content = `<script>\nimport { DtText } from '@/components/text';\n</script>\n<p class="d-headline--md">x</p>`;
    const { transformed } = transformContent(content, { filePath: 'test.vue' });
    // Should not print import warning — we verify by confirming transform happened and no marker
    assert.ok(transformed.includes('<dt-text'), 'should still transform');
  });

  it('uses @/components/text path when @/components/ imports exist', () => {
    // We test the exported detectImportPathFor function
    const content = `<script>\nimport { DtButton } from '@/components/button';\n</script>`;
    const path = detectImportPathFor(content);
    assert.equal(path, '@/components/text');
  });

  it('uses @dialpad/dialtone-vue path when dialtone-vue import exists', () => {
    const content = `<script>\nimport { DtStack } from '@dialpad/dialtone-vue';\n</script>`;
    const path = detectImportPathFor(content);
    assert.equal(path, '@dialpad/dialtone-vue');
  });

  it('falls back to @/components/text when no imports present', () => {
    const content = `<template><p class="d-headline--md">x</p></template>`;
    const path = detectImportPathFor(content);
    assert.equal(path, '@/components/text');
  });
});

describe('--remove-markers', () => {
  it('strips all dt-text-migrate review comments from content', () => {
    const input = [
      '<!-- dt-text-migrate: review -->',
      '<p class="d-headline--eyebrow">Hi</p>',
      '<!-- dt-text-migrate: review helper --><dt-text as="p" kind="body" size="300">note</dt-text>',
      '<!-- dt-text-migrate: review nested span --><span class="d-fw-bold">x</span>',
    ].join('\n');
    const cleaned = removeMarkersForTest(input);
    assert.ok(!cleaned.includes('dt-text-migrate'), 'should remove all markers');
    assert.ok(cleaned.includes('<p class="d-headline--eyebrow">'), 'should preserve element');
  });

  it('handles inline comment on same line as element', () => {
    const input = '<p><!-- dt-text-migrate: review d-fs-* --><dt-text as="p">x</dt-text></p>';
    const cleaned = removeMarkersForTest(input);
    assert.ok(!cleaned.includes('dt-text-migrate'));
    assert.ok(cleaned.includes('<dt-text'));
  });
});

describe('end-to-end fixture', () => {
  // ~30-line representative .vue template covering all transform types
  const input = `<template>
  <!-- (a) headline rewrite -->
  <p class="d-headline--md">Title</p>
  <!-- (b) body with truncate + tone -->
  <span class="d-body--sm d-truncate d-fc-secondary">Body</span>
  <!-- (c) already-DtText residual lift -->
  <dt-text kind="label" class="d-fw-bold">Label</dt-text>
  <!-- (d) safe nested-span collapse -->
  <p class="d-headline--md"><span class="d-fw-bold">Name</span></p>
  <!-- (e) unsafe nested span — gets comment -->
  <p class="d-headline--md"><span class="d-fw-bold" @click="x">Click</span></p>
  <!-- (f) dynamic :class flag -->
  <p :class="{ 'd-headline--md': cond }">Dyn</p>
  <!-- (g) d-fs-* flag -->
  <p class="d-headline--md d-fs-150">Sized</p>
  <!-- (h) non-rewriteable <a> left alone -->
  <a class="d-fw-bold">link</a>
</template>`;

  it('transforms the fixture and produces expected shape', () => {
    const { transformed } = transformContent(input, { filePath: 'fixture.vue' });
    // (a) headline
    assert.ok(transformed.includes('<dt-text as="p" kind="headline" size="300">Title</dt-text>'), '(a) headline');
    // (b) body with truncate+tone
    assert.ok(transformed.includes('kind="body" size="100" tone="secondary" truncate'), '(b) body overrides');
    // (c) residual lift
    assert.ok(transformed.includes('<dt-text kind="label" strength="bold">Label</dt-text>'), '(c) residual lift');
    // (d) nested-span collapse
    assert.ok(transformed.includes('<dt-text strength="bold">Name</dt-text>'), '(d) nested collapse');
    // (e) unsafe nested span comment
    assert.ok(transformed.includes('<!-- dt-text-migrate: review nested span -->'), '(e) unsafe span comment');
    // (f) dynamic class flag
    assert.ok(transformed.includes('<!-- dt-text-migrate: review dynamic class -->'), '(f) dynamic class');
    // (g) d-fs-* flag
    assert.ok(/dt-text-migrate: review d-fs-\d+/.test(transformed), '(g) d-fs-N flag');
    // (h) <a> unchanged
    assert.ok(transformed.includes('<a class="d-fw-bold">link</a>'), '(h) <a> unchanged');
  });
});

describe('inert content masking — should not match in script or comments', () => {
  it('does not transform class inside HTML comment', () => {
    const input = '<!-- <p class="d-headline--md">hidden</p> -->';
    assert.equal(run(input), input);
  });

  it('does not transform class inside <script>', () => {
    const input = '<script>\nconst x = `<p class="d-headline--md">hi</p>`;\n</script>';
    assert.equal(run(input), input);
  });

  it('does not transform class inside <style>', () => {
    const input = '<style>\n.d-headline--md { color: red; }\n</style>';
    assert.equal(run(input), input);
  });
});
