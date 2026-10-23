import { it, expect } from 'vitest';
import { documentation, getDocumentationDetail, getDocumentationExampleIds, searchDocumentation } from '../src/index.js';

it('keeps selected examples exact-addressable without changing broad discovery', () => {
  const examples = documentation.filter(record => record.example);
  expect(examples).toHaveLength(2);
  for (const record of examples) {
    const detail = getDocumentationDetail({ id: record.id, textLimit: 100000 }, documentation);
    expect(detail.record).toEqual(record);
    expect(detail.next).toBeNull();
  }
  expect(getDocumentationDetail({ id: 'examples/unknown' }, documentation).match).toBe('no-match');
  expect(getDocumentationExampleIds('DtButton', documentation)).toEqual(['examples/button-default', 'examples/button-disabled-tooltip']);
  expect(getDocumentationExampleIds('DtStack', documentation)).toEqual([]);
  expect(getDocumentationExampleIds('DtTooltipDirective', documentation)).toEqual(['examples/button-disabled-tooltip']);
  expect(getDocumentationExampleIds('DtTooltip', documentation)).toEqual(['examples/button-disabled-tooltip']);
  expect(getDocumentationExampleIds('components/button#variants-disabled', documentation)).toEqual(['examples/button-disabled-tooltip']);
  expect(getDocumentationExampleIds('components/button#loading', documentation)).toEqual(['examples/button-default', 'examples/button-disabled-tooltip']);
  expect(searchDocumentation('button', documentation)).toEqual(searchDocumentation('button', documentation.filter(record => !record.example)));
});
