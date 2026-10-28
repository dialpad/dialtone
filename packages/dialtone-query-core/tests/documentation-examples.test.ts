import { it, expect } from 'vitest';
import { documentation, getDocumentationDetail, getDocumentationExampleIds, searchDocumentation } from '../src/index.js';

it('keeps selected examples exact-addressable without changing broad discovery', () => {
  const examples = documentation.filter(record => record.example);
  for (const record of examples) {
    const detail = getDocumentationDetail({ id: record.id, textLimit: 100000 }, documentation);
    expect(detail.record).toEqual(record);
    expect(detail.next).toBeNull();
  }
  const presetIds = (component: string) => examples.filter(record =>
    record.id.startsWith(`examples/presets/${component}/`)).map(record => record.id);
  for (const id of ['examples/unknown', 'examples/presets/DtModal/default', 'examples/presets/DtButton/block%20start%20icon'])
    expect(getDocumentationDetail({ id }, documentation).match).toBe('no-match');
  expect(getDocumentationExampleIds('DtButton', documentation).sort()).toEqual(['examples/button-default', 'examples/button-disabled-tooltip', ...presetIds('DtButton')].sort());
  expect(getDocumentationExampleIds('DtStack', documentation).sort()).toEqual(presetIds('DtStack').sort());
  expect(getDocumentationExampleIds('DtLoader', documentation).sort()).toEqual(['examples/loader-default', 'examples/loader-sizes', ...presetIds('DtLoader')].sort());
  expect(getDocumentationExampleIds('DtToggle', documentation).sort()).toEqual(['examples/toggle-base-styles', 'examples/toggle-sizes', 'examples/toggle-v-model', ...presetIds('DtToggle')].sort());
  expect(getDocumentationExampleIds('d-ww-normal', documentation)).toEqual(['examples/utility-word-wrap-normal']);
  expect(getDocumentationExampleIds('d-ww-anywhere', documentation)).toEqual([]);
  expect(getDocumentationExampleIds('utilities/typography/word-wrap#normal', documentation)).toEqual(['examples/utility-word-wrap-normal']);
  expect(getDocumentationExampleIds('DtTooltipDirective', documentation)).toEqual(['examples/button-disabled-tooltip']);
  expect(getDocumentationExampleIds('DtTooltip', documentation)).toEqual(['examples/button-disabled-tooltip']);
  expect(getDocumentationExampleIds('components/button#variants-disabled', documentation)).toEqual(['examples/button-disabled-tooltip']);
  expect(getDocumentationExampleIds('components/button#loading', documentation).sort()).toEqual(['examples/button-default', 'examples/button-disabled-tooltip', ...presetIds('DtButton')].sort());
  expect(searchDocumentation('button', documentation)).toEqual(searchDocumentation('button', documentation.filter(record => !record.example)));
});
