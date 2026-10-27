import { expect, it } from 'vitest';
import { assertTemplateBindings, assertStaticHtml } from '../src/generators/example-template.mjs';
import { buildRecords } from '../src/generators/build-public-docs.mjs';
import { resolve } from 'node:path';

it('rejects missing state while retaining source setup and lexical template scopes', () => {
  expect(() => assertTemplateBindings('<dt-toggle v-model="checked" />')).toThrow('checked');
  expect(() => assertTemplateBindings('<div v-bind="$attrs" v-for="row in [1, 2]">{{ row }}</div>')).not.toThrow();
  expect(() => assertTemplateBindings('<dt-stack><template #default="{ row }">{{ row }}</template></dt-stack>')).not.toThrow();
  const example = buildRecords(resolve('../../apps/dialtone-documentation/docs/components/toggle.md')).find(record => record.id === 'examples/toggle-v-model');
  expect(example.content).toContain('const checked = ref(false)');
  expect(example.content).toContain('v-model="checked"');
  expect(example.content).not.toContain('utilityClassDocs');
});

it('uses Vue template globals rather than every JavaScript global', () => {
  for (const expression of ['Promise.resolve(1)', 'globalThis.value']) {
    expect(() => assertTemplateBindings(`<p>{{ ${expression} }}</p>`)).toThrow();
  }
  expect(() => assertTemplateBindings('<p>{{ Math.round(1.2) }} {{ JSON.stringify(1) }}</p>')).not.toThrow();
});

it('reads equivalent HTML class attributes through the parser', () => {
  for (const markup of ['<p class="d-ww-normal lg:d-w-350">Text</p>', '<p class=\'d-ww-normal lg:d-w-350\'>Text</p>', '<p class=d-ww-normal>Text</p>']) {
    const classes = assertStaticHtml(markup);
    expect(classes).toContain('d-ww-normal');
    if (markup.includes('lg:')) expect(classes).toContain('lg:d-w-350');
  }
});

it.each(['<script>alert(1)</script>', '<dt-button>Action</dt-button>', '<p>{{ value }}</p>', '<p v-if="value">Text</p>', '<p onclick="alert(1)">Text</p>'])('rejects a dynamic static-HTML payload: %s', markup => {
  expect(() => assertStaticHtml(markup)).toThrow();
});

it('delivers raw utility HTML without a Vue scaffold or unrelated table script', () => {
  const example = buildRecords(resolve('../../apps/dialtone-documentation/docs/utilities/typography/word-wrap.md')).find(record => record.example);
  expect(example.example.representation).toBe('static-html');
  expect(example.example.utilities).toEqual(['d-ww-normal']);
  expect(example.example.components).toEqual([]);
  expect(example.example.profile.dependencies).toEqual({ '@dialpad/dialtone': '10.5.1' });
  expect(example.content).toContain('<p class="d-ww-normal">');
  expect(example.content).not.toContain('const wordWrap');
  expect(example.content).not.toContain('## App.vue');
  expect(example.example.validation.consumerBuild).not.toBe('built');
});
