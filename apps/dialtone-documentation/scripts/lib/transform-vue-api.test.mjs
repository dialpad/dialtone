import assert from 'node:assert/strict';
import { test } from 'vitest';
import { setComponentDocs, findComponent, transformVueApi } from './transform-vue-api.mjs';

const record = (name, kind = 'public') => ({
  displayName: name,
  schemaVersion: 2,
  identity: {
    canonicalName: name, aliases: [], kind,
    imports: kind === 'public' ? [{ name, from: '@dialpad/dialtone-vue', kind: 'root', verification: 'source-export', version: '4.3.1' }] : [],
  },
  props: [{ name: 'label', type: { name: 'string' } }],
});
const profile = { package: '@dialpad/dialtone-vue', version: '4.3.1', dependency: 'workspace:vue3-next' };

test('authored snake names join canonical public identities without losing API tables', () => {
  setComponentDocs([record('DtEmojiPicker'), record('DtEmptyState'), record('DtResizable'), record('DtResizablePanel')], profile);
  assert.equal(findComponent('emoji_picker')?.displayName, 'DtEmojiPicker');
  assert.equal(findComponent('empty_state')?.displayName, 'DtEmptyState');
  assert.equal(findComponent('resizable')?.displayName, 'DtResizable');
  const output = transformVueApi('resizable_panel').join('\n');
  assert.match(output, /import \{ DtResizablePanel \}/);
  assert.match(output, /\| `label` \|/);
});

test('an alias join imports the canonical binding used by the docs component name', () => {
  const panel = record('DtPanel');
  panel.identity.aliases = ['PanelAlias'];
  panel.identity.imports.unshift({ ...panel.identity.imports[0], name: 'PanelAlias' });
  setComponentDocs([panel], profile);
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

test('ambiguous aliases and missing companion records fail with diagnostics', () => {
  const first = record('DtFirst');
  const second = record('DtSecond');
  first.identity.aliases = ['shared'];
  second.identity.aliases = ['shared'];
  setComponentDocs([first, second]);
  assert.equal(findComponent('shared'), null);
  assert.throws(() => transformVueApi('shared', { filePath: 'docs/shared.md' }), /shared.*docs\/shared.md.*component-documentation/);
  assert.throws(() => transformVueApi('first', { alsoImport: ['missing'], filePath: 'docs/first.md' }), /missing.*docs\/first.md/);
});

test('raw API tables retain allowed values, required, defaults and deprecation facts', () => {
  const component = record('DtExample');
  component.props = [
    { name: 'mode', description: 'A mode.', type: { name: 'string|number' }, values: ['light', 'dark'], required: true,
      defaultValue: { value: 'undefined' }, tags: { deprecated: [{ description: 'Use contentMode.' }] } },
    { name: 'empty', defaultValue: { value: '\'\'' }, required: false },
    { name: 'enabled', defaultValue: { value: false } },
    { name: 'count', defaultValue: { value: 0 } },
    { name: 'nullable', defaultValue: { value: null } },
    { name: 'missing' },
    { name: 'items', defaultValue: { func: true, value: '() => []' } },
    { name: 'documented', tags: { default: [{ description: '[]' }] } },
  ];
  component.metadata = { deprecated: true, replacement: 'DtReplacement', reason: 'Use the replacement.' };
  setComponentDocs([component], profile);
  const output = transformVueApi('example').join('\n');
  assert.match(output, /Name \| Description \| Type \| Values \| Default \| Required \| Deprecated/);
  assert.match(output, /`mode`.*`string\\\|number`.*`light`, `dark`.*`undefined`.*Yes.*Use contentMode/);
  assert.match(output, /`empty`.*`''`.*No/);
  assert.match(output, /`enabled`.*`false`/);
  assert.match(output, /`count`.*`0`/);
  assert.match(output, /`nullable`.*`null`/);
  assert.equal(output.split('\n').find(line => line.startsWith('| `missing`')).split('|')[5].trim(), 'Not documented');
  assert.match(output, /`items`.*`\(\) => \[\]`/);
  assert.match(output, /`documented`.*`\[\]`/);
  assert.match(output, /Deprecated.*DtReplacement/);
});

test('raw events and scoped slots preserve named payloads, binding facts and unknowns', () => {
  const component = record('DtExample');
  component.events = [
    { name: 'selected', description: 'Selection.', properties: [{ name: 'emoji', type: { names: ['Object'] }, description: 'Selected emoji.' }], tags: [{ title: 'deprecated', description: 'Use update.' }] },
    { name: 'unknown' },
  ];
  component.slots = [{ name: 'default', scoped: true, bindings: [{ name: 'icon-size', description: 'Size.', type: { name: 'number' } }] }];
  setComponentDocs([component], profile);
  const output = transformVueApi('example').join('\n');
  assert.match(output, /`selected`.*`emoji: Object`.*Selected emoji.*Use update/);
  assert.match(output, /`unknown`.*Not documented/);
  assert.match(output, /`default`.*Yes.*`icon-size: number`.*Size/);
});

test('imports certify only the declared docs package version and qualify unknown profiles', () => {
  const component = record('DtExample');
  setComponentDocs([component], profile);
  const verified = transformVueApi('example').join('\n');
  assert.match(verified, /@dialpad\/dialtone-vue@4\.3\.1.*workspace:vue3-next/);
  assert.match(verified, /does not establish compatibility with other installed versions/);
  assert.match(verified, /import \{ DtExample \}/);
  setComponentDocs([component], { ...profile, version: '3.0.0' });
  const mismatch = transformVueApi('example').join('\n');
  assert.match(mismatch, /Import unverified.*3\.0\.0/);
  assert.doesNotMatch(mismatch, /import \{/);
  setComponentDocs([component]);
  assert.match(transformVueApi('example').join('\n'), /Import unverified.*profile/);
  component.identity.imports.unshift({ ...component.identity.imports[0], version: '3.0.0' });
  setComponentDocs([component], profile);
  assert.doesNotMatch(transformVueApi('example').join('\n'), /import \{/);
});
