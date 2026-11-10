// DOM parity's canonical HTML (normalize.mjs) for select options. Node's test runner, with jsdom for the DOM.
//   node --test packages/dialtone-react/parity/*.test.mjs
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { JSDOM } from 'jsdom';
import { normalize } from './normalize.mjs';

const body = html => new JSDOM(`<!doctype html><body>${html}</body>`).window.document.body;
const canonical = html => normalize([...body(html).childNodes]);

test('options with the same labels and selection but different values differ', () => {
  const right = canonical('<select><option value="1">A</option><option value="b" selected>B</option></select>');
  const wrong = canonical('<select><option value="99">A</option><option value="b" selected>B</option></select>');
  assert.notEqual(wrong, right);
  assert.match(right, /<option data-parity-value="1">A<\/option>/);
});

test('an option with no value attribute has its text as its value, as its select reports it', () => {
  assert.equal(canonical('<select><option>A</option></select>'),
    canonical('<select><option value="A">A</option></select>'));
});

test('selection is live state: the selected attribute and the select\'s value property serialize the same', () => {
  const byProperty = body('<select><option value="1">A</option><option value="2">B</option></select>');
  byProperty.querySelector('select').value = '2';
  assert.equal(normalize([...byProperty.childNodes]),
    canonical('<select><option value="1">A</option><option value="2" selected>B</option></select>'));
});
