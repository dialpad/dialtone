import { it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { documentation, getDocumentationDetail, getDocumentationExampleIds, searchDocumentation } from '../src/index.js';

it('keeps source examples exact-addressable without changing broad discovery', () => {
  const examples = documentation.filter(record => record.example);
  for (const record of examples) {
    const detail = getDocumentationDetail({ id: record.id, textLimit: 100000 }, documentation);
    expect(detail.record).toEqual(record);
    expect(detail.next).toBeNull();
  }
  const canary = 'examples/presets/DtLoader/default';
  expect(getDocumentationDetail({ id: canary }, documentation).match).toBe('exact');
  expect(getDocumentationExampleIds('DtLoader', documentation)).toContain(canary);
  const coverage = JSON.parse(readFileSync(new URL('../../dialtone-docs/dist/preset-example-coverage.json', import.meta.url), 'utf8'));
  const excluded = coverage.entries.filter((entry: { id: string; disposition: string }) => entry.disposition !== 'delivered');
  for (const id of ['examples/unknown', ...excluded.map((entry: { id: string }) => entry.id)])
    expect(getDocumentationDetail({ id }, documentation).match).toBe('no-match');
  // DLT-3710: source additions may grow associations; preserve legacy links and wrong-section negatives.
  const authoredCanary = 'examples/docs/components/button/variants-critical';
  expect(getDocumentationExampleIds('DtButton', documentation)).toEqual(expect.arrayContaining([
    'examples/button-default', 'examples/button-disabled-tooltip', authoredCanary,
  ]));
  expect(getDocumentationExampleIds('DtStack', documentation)).not.toContain('examples/button-default');
  expect(getDocumentationExampleIds('DtLoader', documentation)).toEqual(expect.arrayContaining(['examples/loader-default', 'examples/loader-sizes']));
  expect(getDocumentationExampleIds('DtToggle', documentation)).toContain('examples/toggle-v-model');
  expect(getDocumentationExampleIds('d-ww-normal', documentation)).toEqual(['examples/utility-word-wrap-normal']);
  expect(getDocumentationExampleIds('d-ww-anywhere', documentation)).toEqual([]);
  expect(getDocumentationExampleIds('utilities/typography/word-wrap#normal', documentation)).toEqual(['examples/utility-word-wrap-normal']);
  expect(getDocumentationExampleIds('DtTooltipDirective', documentation)).toContain('examples/button-disabled-tooltip');
  expect(getDocumentationExampleIds('DtTooltip', documentation)).toContain('examples/button-disabled-tooltip');
  const disabledExamples = getDocumentationExampleIds('components/button#variants-disabled', documentation);
  expect(disabledExamples).toContain('examples/button-disabled-tooltip');
  expect(disabledExamples).not.toContain('examples/button-default');
  expect(getDocumentationExampleIds('components/button#loading', documentation)).toEqual(expect.arrayContaining(['examples/button-default', authoredCanary]));
  expect(searchDocumentation('button', documentation)).toEqual(searchDocumentation('button', documentation.filter(record => !record.example)));
});
