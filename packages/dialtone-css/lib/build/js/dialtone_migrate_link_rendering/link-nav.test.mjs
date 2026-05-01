/**
 * DLT-3034 — link-nav transform tests.
 *
 * One assertion per test; data-driven via for..of where multiple cases share a concept.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { runTransform, runTransformVerbose } from './helpers.mjs';

describe('link-nav: <a class="d-link"> → <dt-link href>', () => {
  const cases = [
    [
      'plain anchor',
      '<a class="d-link" href="/x">Home</a>',
      '<dt-link href="/x">Home</dt-link>',
    ],
    [
      'anchor with target/rel passes through as fallthrough attrs',
      '<a class="d-link" href="https://example.com" target="_blank" rel="noopener">Ext</a>',
      '<dt-link target="_blank" rel="noopener" href="https://example.com">Ext</dt-link>',
    ],
    [
      'arbitrary user class preserved',
      '<a class="d-link my-typography-class" href="/x">Go</a>',
      '<dt-link href="/x" class="my-typography-class">Go</dt-link>',
    ],
  ];

  for (const [label, input, expected] of cases) {
    it(label, () => {
      assert.equal(runTransform(input), expected);
    });
  }
});

describe('link-nav: <router-link class="d-link"> → <dt-link :to>', () => {
  const cases = [
    [
      'router-link with static to',
      '<router-link class="d-link" to="/x">Home</router-link>',
      '<dt-link to="/x">Home</dt-link>',
    ],
    [
      'router-link with bound :to',
      '<router-link class="d-link" :to="route">Home</router-link>',
      '<dt-link :to="route">Home</dt-link>',
    ],
  ];

  for (const [label, input, expected] of cases) {
    it(label, () => {
      assert.equal(runTransform(input), expected);
    });
  }
});

describe('link-nav: tone modifier extraction', () => {
  // Per Q7 mapping table — including the danger→critical and success→positive renames
  const cases = [
    ['d-link--critical', 'tone="critical"'],
    ['d-link--danger', 'tone="critical"'],     // rename
    ['d-link--warning', 'tone="warning"'],
    ['d-link--positive', 'tone="positive"'],
    ['d-link--success', 'tone="positive"'],    // rename
    ['d-link--info', 'tone="info"'],
    ['d-link--muted', 'tone="muted"'],
    ['d-link--mention', 'tone="mention"'],
  ];

  for (const [modifier, expectedAttr] of cases) {
    it(`${modifier} → ${expectedAttr}`, () => {
      const input = `<a class="d-link ${modifier}" href="/x">Go</a>`;
      const expected = `<dt-link href="/x" ${expectedAttr}>Go</dt-link>`;
      assert.equal(runTransform(input), expected);
    });
  }
});

describe('link-nav: no-underline modifier', () => {
  it('d-link--no-underline → :underline="false"', () => {
    assert.equal(
      runTransform('<a class="d-link d-link--no-underline" href="/x">Go</a>'),
      '<dt-link href="/x" :underline="false">Go</dt-link>',
    );
  });
});

describe('link-nav: inverted modifier emits per-file note', () => {
  it('d-link--inverted is stripped and emits a note', () => {
    const { transformed, notes } = runTransformVerbose(
      '<a class="d-link d-link--inverted" href="/x">Go</a>',
      { filePath: 'fixture.vue' },
    );
    assert.equal(transformed, '<dt-link href="/x">Go</dt-link>');
    assert.equal(notes.length, 1);
  });

  it('d-link--inverted-critical extracts the tone and emits a note', () => {
    const { transformed, notes } = runTransformVerbose(
      '<a class="d-link d-link--inverted-critical" href="/x">Go</a>',
      { filePath: 'fixture.vue' },
    );
    assert.equal(transformed, '<dt-link href="/x" tone="critical">Go</dt-link>');
    assert.equal(notes.length, 1);
    assert.match(notes[0].message, /v-dt-mode/);
  });
});

describe('link-nav: CSS-only modifiers preserved on class', () => {
  it('d-link--disabled preserved (no prop equivalent)', () => {
    assert.equal(
      runTransform('<a class="d-link d-link--disabled" href="/x">Go</a>'),
      '<dt-link href="/x" class="d-link--disabled">Go</dt-link>',
    );
  });

  it('d-link--inverted-disabled preserved (no prop equivalent)', () => {
    assert.equal(
      runTransform('<a class="d-link d-link--inverted-disabled" href="/x">Go</a>'),
      '<dt-link href="/x" class="d-link--inverted-disabled">Go</dt-link>',
    );
  });
});

describe('link-nav: warning paths', () => {
  it('dynamic :href on <a class="d-link"> is lifted to :href on the output', () => {
    assert.equal(
      runTransform('<a class="d-link" :href="url">Go</a>'),
      '<dt-link :href="url">Go</dt-link>',
    );
  });

  it('dynamic :class alongside static class warns', () => {
    const { transformed, warnings } = runTransformVerbose(
      '<a class="d-link" :class="extraClass" href="/x">Go</a>',
      { filePath: 'fixture.vue' },
    );
    assert.equal(transformed, '<a class="d-link" :class="extraClass" href="/x">Go</a>');
    assert.equal(warnings.length, 1);
    assert.match(warnings[0], /dynamic :class/);
  });

  it('<router-link custom> wrapping <dt-link> warns', () => {
    const input = '<router-link custom v-slot="{ navigate }" to="/x"><dt-link @click="navigate">Go</dt-link></router-link>';
    const { warnings } = runTransformVerbose(input, { filePath: 'fixture.vue' });
    assert.ok(warnings.some(w => /router-link custom.*dt-link/.test(w)));
  });

  it('<router-link custom class="d-link"> on the source tag itself warns and skips', () => {
    const input = '<router-link custom v-slot="{ navigate }" to="/x" class="d-link">Go</router-link>';
    const { transformed, warnings } = runTransformVerbose(input, { filePath: 'fixture.vue' });
    assert.equal(transformed, input);
    assert.ok(warnings.some(w => /router-link custom.*don't transfer/.test(w)));
  });
});

describe('link-nav: PascalCase tags accepted, kebab-case emitted', () => {
  it('<RouterLink class="d-link" :to="..."> → <dt-link :to="...">', () => {
    assert.equal(
      runTransform('<RouterLink class="d-link" :to="route">Home</RouterLink>'),
      '<dt-link :to="route">Home</dt-link>',
    );
  });

  it('<a class="d-link d-link--muted" v-show="x > 0"> — `>` inside binding preserved with tone extraction', () => {
    assert.equal(
      runTransform('<a class="d-link d-link--muted" v-show="x > 0" href="/x">Help</a>'),
      '<dt-link v-show="x > 0" href="/x" tone="muted">Help</dt-link>',
    );
  });
});

describe('link-nav: idempotency', () => {
  it('already-migrated <dt-link href> is a no-op', () => {
    const input = '<dt-link href="/x" tone="muted">Go</dt-link>';
    assert.equal(runTransform(input), input);
  });

  it('running the transform twice produces no further changes', () => {
    const input = '<a class="d-link d-link--muted" href="/x">Go</a>';
    const once = runTransform(input);
    const twice = runTransform(once);
    assert.equal(once, twice);
  });
});

describe('link-nav: --only=link-nav runs only this transform', () => {
  it('skips button-nav rewrites', () => {
    const input = '<a class="d-btn" href="/x">Go</a>';
    const { transformed } = runTransformVerbose(input, { only: ['link-nav'] });
    assert.equal(transformed, input);
  });
});
