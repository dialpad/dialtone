import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import test from 'node:test';
import { checkStaticCss } from './static-example.mjs';

const require = createRequire(new URL('../../apps/dialtone-documentation/package.json', import.meta.url));
const postcss = createRequire(require.resolve('vite'))('postcss');

test('validates a non-Word-Wrap utility without imposing Word Wrap declarations', () => {
  const result = checkStaticCss(['d-ta-center'], ['d-ta-center'],
    postcss.parse('.d-ta-center{text-align:center!important}'));
  assert.deepEqual(result, { css: 'passed', missingClasses: [], checked: ['d-ta-center'] });
});

test('requires the selected utility in both authored HTML and consumer CSS', () => {
  const stylesheet = postcss.parse('.d-ta-center{text-align:center}');
  assert.throws(() => checkStaticCss(['d-ta-center'], [], stylesheet), /selected utility/);
  assert.throws(() => checkStaticCss([], ['d-ta-center'], stylesheet), /absent from HTML/);
  assert.throws(() => checkStaticCss(['d-ta-center'], ['d-ta-center'],
    postcss.parse('.other{text-align:center}')), /absent from CSS/);
});

test('preserves Word Wrap semantics for its own subject', () => {
  assert.equal(checkStaticCss(['d-ww-normal'], ['d-ww-normal'],
    postcss.parse('.d-ww-normal{overflow-wrap:normal}')).css, 'passed');
  assert.throws(() => checkStaticCss(['d-ww-normal', 'other'], ['d-ww-normal', 'other'],
    postcss.parse('.d-ww-normal{overflow-wrap:anywhere}.other{overflow-wrap:normal}')),
  /word-wrap declaration differs/);
});

test('reports missing supporting classes as partial without rejecting a present subject', () => {
  const result = checkStaticCss(['d-ta-center', 'application-class'], ['d-ta-center'],
    postcss.parse('.d-ta-center{text-align:center}'));
  assert.deepEqual(result, {
    css: 'partial', missingClasses: ['application-class'], checked: ['d-ta-center'],
  });
});
