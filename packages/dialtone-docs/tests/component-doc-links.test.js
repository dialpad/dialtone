import { describe, it, expect } from 'vitest';
import { buildComponentPage as build } from '../src/generators/build-component-doc-links.mjs';
const identities = [
  'DtButton',
  'DtTabPanel',
  'DtDropdownSeparator',
  'DtResizablePanel',
].map((canonicalName) => ({
  displayName: canonicalName,
  schemaVersion: 2,
  identity: { canonicalName, aliases: [], kind: 'public', imports: [] },
}));
describe('authored component page associations', () => {
  it('resolves C1 aliases and companion references and retains status and source lines', async () => {
    const page = await build(
      'components/dropdown.md',
      '---\ntitle: Dropdown\nstatus: deprecated\n---\n<component-vue-api component-name="button" :also-import="[\'dropdownseparator\']" />',
      identities,
    );
    expect(page.components.map((c) => [c.canonicalName, c.relation])).toEqual([
      ['DtButton', 'api'],
      ['DtDropdownSeparator', 'companion'],
    ]);
    expect(page.pageStatus).toBe('deprecated');
    expect(page.components[0].sourceLine).toBe(5);
  });
  it('uses VuePress permalink policy and independent raw source routes', async () => {
    const page = await build(
      'components/tabs.md',
      '---\npermalink: /custom-tabs/\n---\n<component-vue-api component-name="tabpanel" />',
      identities,
    );
    expect(page.pagePath).toBe('/custom-tabs/');
    expect(page.rawMarkdownPath).toBe('/md/components/tabs.md');
  });
  it('keeps beta pages and ignores fenced/commented tags', async () => {
    const page = await build(
      'components/resizable.md',
      '---\nstatus: beta\n---\n<!-- <component-vue-api component-name="fake" /> -->\n```vue\n<component-vue-api component-name="fake" />\n```\n<component-vue-api component-name="resizable_panel" />',
      identities,
    );
    expect(page.pageStatus).toBe('beta');
    expect(page.components.map((c) => c.canonicalName)).toEqual([
      'DtResizablePanel',
    ]);
  });
  it('fails closed for unknown or dynamic API references', async () => {
    await expect(
      build(
        'components/a.md',
        '<component-vue-api component-name="missing" />',
        identities,
      ),
    ).rejects.toThrow(/Unresolved/);
    await expect(
      build(
        'components/a.md',
        '<component-vue-api :component-name="variable" />',
        identities,
      ),
    ).rejects.toThrow(/Dynamic/);
  });
});
it('does not treat inline or indented code as authored API associations', async () => {
  const source =
    'Use `<component-vue-api component-name="button" />` as syntax.\n\n    <component-vue-api component-name="missing" />';
  const page = await build('components/a.md', source, identities);
  expect(page.components).toEqual([]);
});
it('keeps a live tag when a comment opener is literal code inside a fence', async () => {
  const source =
    '```html\n<!--\n```\n<component-vue-api component-name="button" />\n-->';
  const page = await build('components/a.md', source, identities);
  expect(page.components.map((reference) => reference.canonicalName)).toEqual([
    'DtButton',
  ]);
  expect(page.components[0].sourceLine).toBe(4);
});

it('locates live inline HTML in Markdown table cells', async () => {
  const source =
    '<component-vue-api component-name="button" />\n\nColumn\n---\n<component-vue-api component-name="button" />';
  const page = await build('components/a.md', source, identities);
  expect(page.components[0].canonicalName).toBe('DtButton');
  expect(page.components.map((reference) => reference.sourceLine)).toEqual([
    1, 5,
  ]);
});
