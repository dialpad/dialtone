import { describe, test, expect } from 'vitest';
import { enrichDocumentationRecords } from '../src/generators/source-links.mjs';

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
  ];
  const records = pages.map(p => record(`${p.docId}#usage`));
  return enrichDocumentationRecords(records, pages)[0];
}

describe('authored context links', () => {
  test.each([
    ['/components/presence.md', `${origin}/components/presence.html`, 'components/presence'],
    ['./presence.md?view=compact#status', `${origin}/components/presence.html?view=compact#status`, 'components/presence'],
    ['../utilities/', `${origin}/utilities/`, 'utilities/index'],
    ['/components/mode-island.html#positioned-components', `${origin}/components/mode-island.html#positioned-components`, 'components/mode-island'],
    [`${origin}/components/presence.html`, `${origin}/components/presence.html`, 'components/presence'],
    ['#usage', `${origin}/components/example.html#usage`, 'components/example'],
    ['/components/presence.md#1-state', `${origin}/components/presence.html#_1-state`, 'components/presence'],
    ['/components/missing.md', null, null],
    ['https://example.org/guide#part', 'https://example.org/guide#part', null],
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

  test('leaves ambiguous local routes unresolved', () => {
      const pages = [page('a', 'a.md', '/same.html', '[Target](/same.html)'), page('b', 'b.md', '/same.html', '')];
    const result = enrichDocumentationRecords([record('a#usage'), record('b#usage')], pages);
    expect(result[0].links[0]).toMatchObject({ url: null, targetDocId: null });
  });

  test('enriches heading-free prose once per page after assembly and preserves source/preset payloads', () => {
      const source = record('a#usage');
    const records = [source, record('a#other'), record('examples/a', { example: { source: { id: 'a#usage' } } }), record('examples/presets/a', { example: { source: { kind: 'combinator-preset', id: 'combinator/a' } } }), record('plain')];
    const before = structuredClone(records);
    const pages = [page('a', 'a.md', '/a.html', ''), page('plain', 'plain.md', '/plain.html', '[Other](a.md)', { sections: [{ id: 'plain', raw: '[Other](a.md)' }] })];
    const result = enrichDocumentationRecords(records, pages);
    expect(records).toEqual(before);
    expect(result.map(r => r.id)).toEqual(before.map(r => r.id));
    expect(result[0].documentation).toEqual({ url: `${origin}/a.html`, versionScope: 'latest', installedCompatibility: 'not_checked' });
    expect(result[0].links).toBeUndefined();
    expect(result[1].documentation).toBeUndefined();
    expect(result.slice(2, 4)).toEqual(before.slice(2, 4));
    expect(result[4].links[0].targetDocId).toBe('a');
  });
});
