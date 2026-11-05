import { test } from 'node:test';
import assert from 'node:assert/strict';
import { foldMatched } from './cdp-provenance.mjs';

// CDP shapes: matchedCSSRules[].rule.style.cssProperties and inlineStyle.cssProperties.
const rule = (...cssProperties) => ({ rule: { selectorList: { text: '.x' }, style: { cssProperties } } });
const decl = (name, value, extra = {}) => ({ name, value, ...extra });

test('an inline declaration beats a normal rule', () => {
  const f = foldMatched({
    matchedCSSRules: [rule(decl('color', 'var(--a)'))],
    inlineStyle: { cssProperties: [decl('color', 'var(--b)')] },
  });
  assert.equal(f.color.value, 'var(--b)');
  assert.equal(f.color.selector, '[inline]');
});

test('an !important rule beats a normal inline declaration', () => {
  const f = foldMatched({
    matchedCSSRules: [rule(decl('color', 'var(--a)', { important: true }))],
    inlineStyle: { cssProperties: [decl('color', 'var(--b)')] },
  });
  assert.equal(f.color.value, 'var(--a)');
});

test('an important inline declaration beats an important rule, and its marker is stripped', () => {
  const f = foldMatched({
    matchedCSSRules: [rule(decl('color', 'var(--a) !important'))],
    inlineStyle: { cssProperties: [decl('color', 'var(--b) !important')] },
  });
  assert.equal(f.color.value, 'var(--b)');
});

test('an inline custom property with no competing rule is kept', () => {
  const f = foldMatched({ inlineStyle: { cssProperties: [decl('--x', 'var(--dt-spacing-100)')] } });
  assert.equal(f['--x'].value, 'var(--dt-spacing-100)');
});
