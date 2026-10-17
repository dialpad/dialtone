import { it, expect } from 'vitest';
import { documentation, getDocumentationDetail, getDocumentationExampleHints, searchDocumentation } from '../src/index.js';

it('keeps selected examples exact-addressable without changing broad discovery', () => {
  const examples = documentation.filter(record => record.example);
  expect(examples).toHaveLength(2);
  for (const record of examples) {
    const detail = getDocumentationDetail({ id: record.id, textLimit: 100000 }, documentation);
    expect(detail.record).toEqual(record);
    expect(detail.next).toBeNull();
  }
  expect(getDocumentationDetail({ id: 'examples/unknown' }, documentation).match).toBe('no-match');
  expect(getDocumentationExampleHints('DtButton', documentation)).toHaveLength(2);
  expect(getDocumentationExampleHints('DtTooltipDirective', documentation)).toHaveLength(0);
  expect(searchDocumentation('button', documentation)).toEqual(searchDocumentation('button', documentation.filter(record => !record.example)));
});
