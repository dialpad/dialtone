/**
 * DLT-3033 — button-nav transform tests.
 *
 * One assertion per test; data-driven via for..of where multiple cases share a concept.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { runTransform, runTransformVerbose } from './helpers.mjs';

describe('button-nav: <a class="d-btn"> → <dt-button href>', () => {
  const cases = [
    [
      'plain anchor',
      '<a class="d-btn" href="/x">Go</a>',
      '<dt-button href="/x">Go</dt-button>',
    ],
    [
      'anchor with target and rel preserved as fallthrough',
      '<a class="d-btn" href="/x" target="_blank" rel="noopener">Go</a>',
      '<dt-button target="_blank" rel="noopener" href="/x">Go</dt-button>',
    ],
    [
      'anchor with size modifier',
      '<a class="d-btn d-btn--lg" href="/x">Go</a>',
      '<dt-button href="/x" :size="400">Go</dt-button>',
    ],
    [
      'anchor with importance modifier',
      '<a class="d-btn d-btn--outlined" href="/x">Go</a>',
      '<dt-button href="/x" importance="outlined">Go</dt-button>',
    ],
    [
      'anchor with kind modifier',
      '<a class="d-btn d-btn--critical" href="/x">Go</a>',
      '<dt-button href="/x" kind="critical">Go</dt-button>',
    ],
    [
      'anchor with d-btn--danger renames to kind=critical',
      '<a class="d-btn d-btn--danger" href="/x">Go</a>',
      '<dt-button href="/x" kind="critical">Go</dt-button>',
    ],
    [
      'anchor with d-btn--success renames to kind=positive',
      '<a class="d-btn d-btn--success" href="/x">Go</a>',
      '<dt-button href="/x" kind="positive">Go</dt-button>',
    ],
    [
      'anchor with circle modifier',
      '<a class="d-btn d-btn--circle" href="/x">Go</a>',
      '<dt-button href="/x" circle>Go</dt-button>',
    ],
    [
      'anchor with active modifier',
      '<a class="d-btn d-btn--active" href="/x">Go</a>',
      '<dt-button href="/x" active>Go</dt-button>',
    ],
    [
      'anchor with loading modifier',
      '<a class="d-btn d-btn--loading" href="/x">Go</a>',
      '<dt-button href="/x" loading>Go</dt-button>',
    ],
    [
      'anchor with multiple modifiers (size + importance + kind)',
      '<a class="d-btn d-btn--lg d-btn--outlined d-btn--critical" href="/x">Go</a>',
      '<dt-button href="/x" :size="400" importance="outlined" kind="critical">Go</dt-button>',
    ],
    [
      'd-btn--md is the default size — stripped silently',
      '<a class="d-btn d-btn--md" href="/x">Go</a>',
      '<dt-button href="/x">Go</dt-button>',
    ],
    [
      'd-btn--primary is the default importance — stripped silently',
      '<a class="d-btn d-btn--primary" href="/x">Go</a>',
      '<dt-button href="/x">Go</dt-button>',
    ],
    [
      'vendor class preserved on resulting class attr',
      '<a class="d-btn d-btn--google" href="/x">Sign in</a>',
      '<dt-button href="/x" class="d-btn--google">Sign in</dt-button>',
    ],
    [
      'BEM internal preserved on class attr',
      '<a class="d-btn d-btn__icon-only" href="/x">i</a>',
      '<dt-button href="/x" class="d-btn__icon-only">i</dt-button>',
    ],
    [
      'arbitrary user class preserved',
      '<a class="d-btn my-cta-class" href="/x">Go</a>',
      '<dt-button href="/x" class="my-cta-class">Go</dt-button>',
    ],
    [
      'multiline tag content preserved',
      '<a class="d-btn" href="/x">\n  <span>Go</span>\n</a>',
      '<dt-button href="/x">\n  <span>Go</span>\n</dt-button>',
    ],
    [
      'self-closing anchor (rare but legal in templates)',
      '<a class="d-btn" href="/x" />',
      '<dt-button href="/x" />',
    ],
  ];

  for (const [label, input, expected] of cases) {
    it(label, () => {
      assert.equal(runTransform(input), expected);
    });
  }
});

describe('button-nav: <router-link class="d-btn"> → <dt-button :to>', () => {
  const cases = [
    [
      'router-link with static to',
      '<router-link class="d-btn" to="/x">Go</router-link>',
      '<dt-button to="/x">Go</dt-button>',
    ],
    [
      'router-link with bound :to',
      '<router-link class="d-btn" :to="route">Go</router-link>',
      '<dt-button :to="route">Go</dt-button>',
    ],
    [
      'router-link with size and kind modifiers',
      '<router-link class="d-btn d-btn--lg d-btn--critical" to="/x">Go</router-link>',
      '<dt-button to="/x" :size="400" kind="critical">Go</dt-button>',
    ],
    [
      'router-link with bound :to and circle',
      '<router-link class="d-btn d-btn--circle" :to="route">x</router-link>',
      '<dt-button :to="route" circle>x</dt-button>',
    ],
  ];

  for (const [label, input, expected] of cases) {
    it(label, () => {
      assert.equal(runTransform(input), expected);
    });
  }
});

describe('button-nav: warning paths', () => {
  it('dynamic :href on <a class="d-btn"> warns and skips transform', () => {
    const { transformed, warnings } = runTransformVerbose(
      '<a class="d-btn" :href="url">Go</a>',
      { filePath: 'fixture.vue' },
    );
    assert.equal(transformed, '<a class="d-btn" :href="url">Go</a>');
    assert.equal(warnings.length, 1);
    assert.match(warnings[0], /dynamic :href/);
  });

  it('dynamic :class alongside static class warns and skips transform', () => {
    const { transformed, warnings } = runTransformVerbose(
      '<a class="d-btn" :class="extraClass" href="/x">Go</a>',
      { filePath: 'fixture.vue' },
    );
    assert.equal(transformed, '<a class="d-btn" :class="extraClass" href="/x">Go</a>');
    assert.equal(warnings.length, 1);
    assert.match(warnings[0], /dynamic :class/);
  });

  it('<router-link custom> wrapping <dt-button> warns', () => {
    const input = '<router-link custom v-slot="{ navigate }" to="/x"><dt-button @click="navigate">Go</dt-button></router-link>';
    const { warnings } = runTransformVerbose(input, { filePath: 'fixture.vue' });
    const customWarn = warnings.find(w => /router-link custom.*dt-button/.test(w));
    assert.ok(customWarn, 'expected warning about <router-link custom> wrapper');
  });

  it('<router-link custom class="d-btn"> on the source tag itself warns and skips', () => {
    const input = '<router-link custom v-slot="{ navigate }" to="/x" class="d-btn">Go</router-link>';
    const { transformed, warnings } = runTransformVerbose(input, { filePath: 'fixture.vue' });
    assert.equal(transformed, input);
    assert.ok(warnings.some(w => /router-link custom.*don't transfer/.test(w)));
  });

  it('<router-link class="d-btn"> without `to` warns and skips', () => {
    const { transformed, warnings } = runTransformVerbose(
      '<router-link class="d-btn">Go</router-link>',
      { filePath: 'fixture.vue' },
    );
    assert.equal(transformed, '<router-link class="d-btn">Go</router-link>');
    assert.ok(warnings.some(w => /without a `to`/.test(w)));
  });
});

describe('button-nav: idempotency', () => {
  it('already-migrated <dt-button href> is a no-op', () => {
    const input = '<dt-button href="/x" :size="400">Go</dt-button>';
    assert.equal(runTransform(input), input);
  });

  it('mixed: one already-migrated and one legacy in same content', () => {
    const input =
      '<dt-button href="/already">A</dt-button>\n' +
      '<a class="d-btn" href="/legacy">B</a>';
    const expected =
      '<dt-button href="/already">A</dt-button>\n' +
      '<dt-button href="/legacy">B</dt-button>';
    assert.equal(runTransform(input), expected);
  });

  it('running the transform twice produces no further changes', () => {
    const input = '<a class="d-btn d-btn--lg" href="/x">Go</a>';
    const once = runTransform(input);
    const twice = runTransform(once);
    assert.equal(once, twice);
  });
});

describe('button-nav: --only respects transform selection', () => {
  it('--only=link-nav skips button-nav transform', () => {
    const input = '<a class="d-btn" href="/x">Go</a>';
    const { transformed } = runTransformVerbose(input, { only: ['link-nav'] });
    assert.equal(transformed, input);
  });

  it('--only=button-nav runs only button-nav', () => {
    const input = '<a class="d-btn" href="/x">Go</a>';
    const { transformed } = runTransformVerbose(input, { only: ['button-nav'] });
    assert.equal(transformed, '<dt-button href="/x">Go</dt-button>');
  });
});
