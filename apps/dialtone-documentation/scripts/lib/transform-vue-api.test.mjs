import assert from 'node:assert/strict';
import { test } from 'vitest';
import { setComponentDocs, findComponent, transformVueApi } from './transform-vue-api.mjs';

const record = (name, kind = 'public') => ({
  displayName: name,
  schemaVersion: 2,
  identity: {
    canonicalName: name, aliases: [], kind,
    imports: kind === 'public' ? [{ name, from: '@dialpad/dialtone-vue', kind: 'root', verification: 'source-export' }] : [],
  },
  props: [{ name: 'label', type: { name: 'string' } }],
});

test('authored snake names join canonical public identities without losing API tables', () => {
  setComponentDocs([record('DtEmojiPicker'), record('DtResizablePanel')]);
  assert.equal(findComponent('emoji_picker')?.displayName, 'DtEmojiPicker');
  const output = transformVueApi('resizable_panel').join('\n');
  assert.match(output, /import \{ DtResizablePanel \}/);
  assert.match(output, /\| `label` \|/);
});

test('an alias join imports the canonical binding used by the docs component name', () => {
  const panel = record('DtPanel');
  panel.identity.aliases = ['PanelAlias'];
  panel.identity.imports.unshift({ ...panel.identity.imports[0], name: 'PanelAlias' });
  setComponentDocs([panel]);
  assert.equal(findComponent('PanelAlias')?.displayName, 'DtPanel');
  const output = transformVueApi('PanelAlias').join('\n');
  assert.match(output, /import \{ DtPanel \}/);
  assert.ok(!output.includes('import { PanelAlias }'));
});

test('internal, legacy and incomplete API records never imply a public root export', () => {
  const incomplete = record('DtIncomplete');
  delete incomplete.identity.imports;
  setComponentDocs([record('KitchenSinkView', 'internal'), { displayName: 'DtLegacy', props: [] }, incomplete]);
  for (const name of ['KitchenSinkView', 'legacy', 'incomplete']) {
    assert.ok(!transformVueApi(name).join('\n').includes('import {'));
  }
});

test('ambiguous aliases and missing companion records do not invent imports', () => {
  const first = record('DtFirst');
  const second = record('DtSecond');
  first.identity.aliases = ['shared'];
  second.identity.aliases = ['shared'];
  setComponentDocs([first, second]);
  assert.equal(findComponent('shared'), null);
  const output = transformVueApi('first', { alsoImport: ['missing'] }).join('\n');
  assert.match(output, /import \{ DtFirst \}/);
  assert.ok(!output.includes('DtMissing'));
});
