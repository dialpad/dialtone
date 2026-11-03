import { describe, test, expect } from 'vitest';
import { enrichDocumentationRecords } from '../src/generators/source-links.mjs';
import { resolveSourcePagePath } from '../../../apps/dialtone-documentation/scripts/lib/source-page.mjs';

const origin = 'https://dialtone.dialpad.com';
const record = (id, extra = {}) => ({ id, docId: id.split('#')[0], content: 'Authored prose.', headingPath: [], ...extra });
const page = (docId, sourcePath, path, raw, extra = {}) => ({
  docId, sourcePath, url: `${origin}${path}`, body: raw,
  sections: [{ id: `${docId}#usage`, raw }], ...extra,
});
function enrich(raw, extra = {}) {
  const pages = [
    page('components/example', 'components/example.md', '/components/example.html', raw, extra),
    page('components/presence', 'components/presence.md', '/components/presence.html', ''),
    page('components/mode-island', 'components/mode-island.md', '/components/mode-island.html', ''),
    page('utilities/index', 'utilities/index.md', '/utilities/', ''),
    page('index', 'index.md', '/', ''),
  ];
  const records = pages.map(p => record(`${p.docId}#usage`));
  return enrichDocumentationRecords(records, pages)[0];
}

describe('authored context links', () => {
  test.each([
    ['/components/presence.md', `${origin}/components/presence.html`, 'components/presence'],
    ['./presence.md?view=compact#status', `${origin}/components/presence.html?view=compact#status`, 'components/presence'],
    ['../utilities/', `${origin}/utilities/`, 'utilities/index'],
    ['/utilities/index.html', `${origin}/utilities/`, 'utilities/index'],
    ['../utilities/index.html#1-links', `${origin}/utilities/#_1-links`, 'utilities/index'],
    ['/components/mode-island.html#positioned-components', `${origin}/components/mode-island.html#positioned-components`, 'components/mode-island'],
    [`${origin}/components/presence.html`, `${origin}/components/presence.html`, 'components/presence'],
    [origin, `${origin}/`, 'index'],
    ['#usage', `${origin}/components/example.html#usage`, 'components/example'],
    ['#1-state', `${origin}/components/example.html#_1-state`, 'components/example'],
    ['/components/presence.md#1-state', `${origin}/components/presence.html#_1-state`, 'components/presence'],
    ['/components/missing.md', null, null],
    ['https://example.org/guide#part', 'https://example.org/guide#part', null],
    [`${origin}/vue/?path=/story/components-icon--default`, `${origin}/vue/?path=/story/components-icon--default`, null],
    [`${origin}/components/icon`, `${origin}/components/icon`, null],
    ['https://user:password@example.org/', null, null],
    ['mailto:help@example.org', null, null],
  ])('resolves %s through real source/page mappings', (href, url, targetDocId) => {
    expect(enrich(`[Context](${href})`).links).toEqual([{ label: 'Context', href, url, targetDocId }]);
  });

  test('retains reference links defined outside the owning section, without code or HTML false positives', () => {
    const raw = '[Presence][status]\n[Presence][status]\n`[code](/bad.md)`\n```md\n[fenced](/bad.md)\n```\n<a href="/bad.md">HTML</a>\n![Image](/bad.png)';
    const result = enrich(raw, { body: `${raw}\n\n## Other\n[status]: /components/presence.md` });
    expect(result.links).toEqual([{ label: 'Presence', href: '/components/presence.md', url: `${origin}/components/presence.html`, targetDocId: 'components/presence' }]);
  });

  test('uses the known Storybook base for directive query links', () => {
    const result = enrich('[Example](?path=/story/tooltip--default)', { directive: true, url: `${origin}/vue/?path=/docs/tooltip--docs` });
    expect(result.links[0]).toEqual({ label: 'Example', href: '?path=/story/tooltip--default', url: `${origin}/vue/?path=/story/tooltip--default`, targetDocId: null });
  });

  test('matches encoded HTML and directory routes to actual VuePress page paths', async () => {
    const raw = '[MD](./café.md) [HTML](./café.html) [Directory](../utilities/café/)';
    const pages = [
      page('components/example', 'components/example.md', '/components/example.html', raw),
      page('components/café', 'components/café.md', await resolveSourcePagePath('components/café.md', {}), ''),
      page('utilities/café/index', 'utilities/café/index.md', await resolveSourcePagePath('utilities/café/index.md', {}), ''),
    ];
    const result = enrichDocumentationRecords(pages.map(p => record(`${p.docId}#usage`)), pages);
    expect(result[0].links).toEqual([
      { label: 'MD', href: './caf%C3%A9.md', url: `${origin}/components/caf%C3%A9.html`, targetDocId: 'components/café' },
      { label: 'HTML', href: './caf%C3%A9.html', url: `${origin}/components/caf%C3%A9.html`, targetDocId: 'components/café' },
      { label: 'Directory', href: '../utilities/caf%C3%A9/', url: `${origin}/utilities/caf%C3%A9/`, targetDocId: 'utilities/café/index' },
    ]);
  });

  test('retains a source page URL without inventing an unavailable retrieval target', () => {
    const pages = [
      page('components/example', 'components/example.md', '/components/example.html', '[Preview](/components/preview.md)'),
      page('components/preview', 'components/preview.md', '/components/preview.html', 'Unindexed prose.'),
    ];
    const result = enrichDocumentationRecords([record('components/example#usage')], pages);
    expect(result).toHaveLength(1);
    expect(result[0].links[0]).toEqual({ label: 'Preview', href: '/components/preview.md',
      url: `${origin}/components/preview.html`, targetDocId: null });
  });

  test.each([
    ['/vue/?path=/story/tooltip--default', `${origin}/vue/?path=/story/tooltip--default`],
    ['/vue/index.html?path=/story/tooltip--default', `${origin}/vue/?path=/story/tooltip--default`],
    ['/vue/#1-story', `${origin}/vue/#1-story`],
  ])('uses the existing Storybook route for %s without a local documentation ID', (href, url) => {
    const pages = [
      page('components/example', 'components/example.md', '/components/example.html', `[Story](${href})`),
      page('directives/tooltip', 'directives/tooltip.mdx', '/vue/?path=/docs/tooltip--docs', '', { directive: true }),
    ];
    const result = enrichDocumentationRecords([record('components/example#usage'), record('directives/tooltip#usage')], pages);
    expect(result[0].links[0]).toEqual({ label: 'Story', href, url, targetDocId: null });
  });

  test('leaves ambiguous local routes unresolved', () => {
      const pages = [page('a', 'a.md', '/same.html', '[Target](/same.html)'), page('b', 'b.md', '/same.html', '')];
    const result = enrichDocumentationRecords([record('a#usage'), record('b#usage')], pages);
    expect(result[0].links[0]).toMatchObject({ url: null, targetDocId: null });
  });

  test('enriches heading-free prose once per page after assembly and preserves source/preset payloads', () => {
    // Examples share their page docId and precede its prose, so only the example guard keeps them unchanged.
    const records = [
      record('examples/a', { docId: 'a', example: { source: { id: 'a#usage' } } }),
      record('examples/presets/a', { docId: 'a', example: { source: { kind: 'combinator-preset', id: 'combinator/a' } } }),
      record('a#usage'), record('a#other'), record('plain'),
    ];
    const before = structuredClone(records);
    const pages = [page('a', 'a.md', '/a.html', ''), page('plain', 'plain.md', '/plain.html', '[Other](a.md)', { sections: [{ id: 'plain', raw: '[Other](a.md)' }] })];
    const result = enrichDocumentationRecords(records, pages);
    expect(records).toEqual(before);
    expect(result.map(r => r.id)).toEqual(before.map(r => r.id));
    expect(result.slice(0, 2)).toEqual(before.slice(0, 2));
    expect(result[2].documentation).toEqual({ url: `${origin}/a.html`, versionScope: 'latest', installedCompatibility: 'not_checked' });
    expect(result[2].links).toBeUndefined();
    expect(result[3].documentation).toBeUndefined();
    expect(result[4].links[0].targetDocId).toBe('a');
  });
});
