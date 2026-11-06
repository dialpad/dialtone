import { it } from 'node:test';
import assert from 'node:assert/strict';
import { transformContent } from './index.mjs';

const sizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'];

it('converts all 38 composition mappings across literal syntax and tag casings', () => {
  for (const kind of ['headline', 'body', 'label', 'code']) {
    for (const [index, size] of sizes.entries()) {
      if (kind !== 'headline' && index > 3) continue;
      for (const value of [size, String((index + 1) * 100)]) {
        for (const tag of ['dt-text', 'DtText']) {
          for (const attrs of [
            `kind='${kind}' size="${value}"`,
            `:size="'${value}'"\n :kind="'${kind}'"`,
            `v-bind:kind="'${kind}'" v-bind:size="${/^\d+$/.test(value) ? value : `'${value}'`}"`,
          ]) {
            const result = transformContent(`<${tag} ${attrs}>Copy</${tag}>`);
            assert.equal(result.count, 1, attrs);
            assert.match(result.transformed, new RegExp(`variant="${kind}-${size}"`));
            assert.doesNotMatch(result.transformed, /\b(?:kind|size)=/);
            assert.equal(transformContent(result.transformed).count, 0);
          }
        }
      }
    }
  }
});

it('protects every explicit variant and leaves incomplete pairs outside scope', () => {
  for (const attrs of ['variant=""', ':variant="choice"', 'v-bind:variant="undefined"']) {
    const input = `<dt-text kind="body" size="sm" ${attrs}>Copy</dt-text>`;
    const result = transformContent(input);
    assert.equal(result.transformed, input);
    assert.equal(result.protectedCount, 1);
  }
  for (const attrs of ['kind="body"', 'size="300"']) {
    const input = `<dt-text ${attrs} />`;
    assert.equal(transformContent(input).transformed, input);
    assert.deepEqual(transformContent(input).diagnostics, []);
  }
});

it('leaves uncertain pairs unchanged with actionable line and column diagnostics', () => {
  for (const attrs of [
    'kind="body" size="sm" v-bind="props"',
    'kind="body" size="sm" :[key]="value"',
    'kind="body" size="sm" v-bind:[key]="value"',
    'kind="body" size="sm" :size="200"',
    'kind="body" size="sm" kind="code"',
    'kind="body" :size="compact ? 100 : 300"',
    ':kind="getKind()" size="300"',
    'kind="body" size="700"',
    'kind="body" size="0100"',
    'kind="body" size="sm" v-model:kind="kind"',
    'kind="body" size="sm" v-custom="props"',
    'kind="body" size="sm" :size.prop="300"',
  ]) {
    const input = `\n<dt-text ${attrs} />`;
    const result = transformContent(input);
    assert.equal(result.transformed, input, attrs);
    assert.equal(result.diagnostics.length, 1, attrs);
    assert.equal(result.diagnostics[0].line, 2);
    assert.equal(result.diagnostics[0].column, 1);
    assert.match(result.diagnostics[0].reason, /.+/);
    assert.match(result.diagnostics[0].action, /review/i);
  }
});

it('preserves unrelated source and ignores examples outside live template regions', () => {
  const example = '<dt-text kind="body" size="300">Example</dt-text>';
  const input = `<docs>${example}</docs>\n<script>const example = '${example}'</script>\n<style>/* ${example} */</style>\n<template>\n<!-- ${example} -->\n<div title='${example}'>{{ '${example}' }}</div>\n<textarea>${example}</textarea>\n<div v-pre>${example}</div>\n<DtText\n as="p" :title="count > 0" kind='body'\n :size="300" @click="go">Keep <b>content</b></DtText>\n</template>`;
  const expected = input.replace('kind=\'body\'', 'variant="body-md"').replace(' :size="300"', '');
  assert.equal(transformContent(input, { vue: true }).transformed, expected);
  assert.equal(transformContent(input, { vue: true }).count, 1);
  assert.equal(transformContent(`<script>${example}</script>${example}`).count, 1);
  for (const [before, after] of [
    ['<DtText\n  size="300"\n  kind="body"\n/>', '<DtText\n  variant="body-md"\n/>'],
    ['<dt-text\n  kind="body"\n  size="300"\n  as="p"\n>Copy</dt-text>', '<dt-text\n  variant="body-md"\n  as="p"\n>Copy</dt-text>'],
    ['<dt-text\n  kind="body"\n  size="300"\n/>', '<dt-text\n  variant="body-md"\n/>'],
    ['<dt-text\n  kind="body"\n  size="300">Copy</dt-text>', '<dt-text\n  variant="body-md"\n>Copy</dt-text>'],
  ]) {
    assert.equal(transformContent(before).transformed, after);
  }

});


it('leaves preprocessed templates and escaped interpolation examples untouched', () => {
  const example = '<dt-text kind="body" size="300" />';
  const pug = `<template lang="pug">${example}</template>`;
  assert.equal(transformContent(pug, { vue: true }).transformed, pug);
  const input = `{{ 'it\\'s ${example}' }}${example}`;
  assert.equal(transformContent(input).count, 1);
  assert.equal(transformContent(input).transformed, input.replace(/<dt-text kind="body" size="300" \/>$/, '<dt-text variant="body-md" />'));
});


it('recognizes numeric literal spellings without evaluating expressions', () => {
  for (const value of ['300.0', '3e2', '0x12c', '0b100101100', '0o454']) {
    assert.equal(transformContent(`<dt-text kind="body" :size="${value}" />`).transformed, '<dt-text variant="body-md" />');
  }
  assert.equal(transformContent('<dt-text kind="body" :size="100 + 200" />').count, 0);
});
