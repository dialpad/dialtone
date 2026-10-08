import { it, expect } from 'vitest';
import { getDocumentationDetail as lookup } from '../src/tools/docs.js';
import type { DocumentationRecord } from '../src/types.js';
it('retrieves prose beyond discovery excerpts with a precise Unicode continuation', () => {
  const content =
    'Intro '.repeat(100) +
    'Checkbox aria-describedby must reference supporting text.😀';
  const records = [
    {
      id: 'components/checkbox#accessibility',
      docId: 'components/checkbox',
      docTitle: 'Checkbox',
      category: 'components',
      headingPath: ['Accessibility'],
      content,
      frontmatter: {},
      filePath: 'apps/dialtone-documentation/docs/components/checkbox.md',
    },
  ] as DocumentationRecord[];
  const first = lookup(
    { id: records[0].id, textOffset: 0, textLimit: 500 },
    records,
  );
  expect(first.contentCounts).toEqual({
    total: Array.from(content).length,
    returned: 500,
    offset: 0,
  });
  expect(first.continuation.arguments).toEqual({
    id: records[0].id,
    textOffset: 500,
    textLimit: 500,
  });
  const second = lookup(first.continuation.arguments, records);
  expect(first.record.content + second.record.content).toBe(content);
  expect(second.record.content).toContain('aria-describedby');
  expect(lookup({ id: 'missing' }, records).match).toBe('no-match');
});
