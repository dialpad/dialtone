// cases.mjs: the cases DOM parity builds from Combinator's presets, and the templates their slot strings become.
// Node's test runner, not Vitest: the harness runs in plain Node.
//   node --test packages/dialtone-react/parity/*.test.mjs
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { test } from 'node:test';
import { casesFrom, slotTemplates } from './cases.mjs';

// The goldens run under dialtone-vue's Vitest, so its Vue and Vue Test Utils are the ones that compile slot strings.
// VTU's renderToString compiles a string slot as mount() does, with no DOM to set up.
const fromVue = createRequire(new URL('../../dialtone-vue/package.json', import.meta.url));
const { h } = fromVue('vue');
const { renderToString } = fromVue('@vue/test-utils');

// A slot rendered on its own with `scope`, as goldens.test.js' mountSlot renders one.
const renderSlot = (template, scope) => renderToString(
  { render () { return h('div', this.$slots.default?.(scope)); } },
  { slots: { default: template } },
);

// Shaped like variants_dropdown.js: the defaults name the anchor slot's scope, and the presets give its content.
const DROPDOWN = {
  defaults: { slots: { anchor: { scopeName: 'anchorAttrs' } } },
  default: {
    slots: { anchor: { initialValue: `<button :aria-expanded="anchorAttrs['aria-expanded']">{{ label }}</button>` } },
  },
  renamed: { slots: { anchor: { initialValue: '<button />', scopeName: 'attrs' } } },
};

test('a slot\'s scopeName comes from the variant\'s defaults unless its preset sets one', () => {
  assert.deepEqual(casesFrom(DROPDOWN).map(c => [c.name, c.scopeNames]), [
    ['default', { anchor: 'anchorAttrs' }],
    ['renamed', { anchor: 'attrs' }],
    ['standard attrs', { anchor: 'anchorAttrs' }],
  ]);
});

test('a case whose slots name no scope has no scopeNames, so its golden stays as it was', () => {
  const [c] = casesFrom({ default: { slots: { icon: { initialValue: '<i />' } } } });
  assert.equal(Object.hasOwn(c, 'scopeNames'), false);
});

test('a slot string renders as in Combinator: its scope\'s names are locals, and its scopeName is the whole scope', async () => {
  const [c] = casesFrom(DROPDOWN);
  assert.equal(await renderSlot(slotTemplates(c).anchor, { 'aria-expanded': 'true', label: 'Menu' }),
    '<div><button aria-expanded="true">Menu</button></div>');
});

test('a slot without a scopeName is left as it is, unless it opens with <template>', () => {
  const { icon, optionEnd } = slotTemplates({ slots: { icon: ' {{ label }} ', optionEnd: '<template v-if="x"><b>12</b></template>' } });
  assert.equal(icon, ' {{ label }} ');
  assert.equal(optionEnd, '<template #default><template v-if="x"><b>12</b></template></template>');
});

test('a slot string that opens with <template v-if> compiles, and renders its content only when the condition holds', async () => {
  const c = { slots: { optionEnd: `<template v-if="option.value === 'unread'">\n  <b>12</b>\n  <span>unread</span>\n</template>` } };
  const template = slotTemplates(c).optionEnd;
  assert.match(await renderSlot(template, { option: { value: 'unread' } }), /<b>12<\/b><span>unread<\/span>/);
  assert.doesNotMatch(await renderSlot(template, { option: { value: 'all' } }), /12/);
});

test('a slot string with a scopeName renders as it did when VTU wrapped it, apart from the scope\'s alias', async () => {
  const scope = { label: 'Label', iconSize: 300 };
  // Text at an edge too: VTU trims what it wraps (emoji-text-wrapper's default slot ends with a space).
  for (const source of ['\n  {{ label }} <i :data-size="iconSize" />\n', ' Text at both edges, {{ label }} ']) {
    const { icon } = slotTemplates({ slots: { icon: source }, scopeNames: { icon: 'iconScope' } });
    assert.equal(await renderSlot(icon, scope), await renderSlot(source, scope));
  }
});
