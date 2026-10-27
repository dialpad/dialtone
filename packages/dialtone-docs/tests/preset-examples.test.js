import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import * as presets from '../src/generators/preset-examples.mjs';

const root = resolve('../..');
const hash = value => createHash('sha256').update(value).digest('hex');
const read = path => readFileSync(resolve(root, path));
const definitions = [
  ['DtLoader', 'default', 'loader', '<dt-loader aria-label="Processing" size="500" />', ['DtLoader']],
  ['DtButton', 'start icon', 'button', '<dt-button><template #startIcon="{ iconSize }"><dt-icon-phone :size="iconSize" /></template>Label</dt-button>', ['DtButton', 'DtIconPhone']],
  ['DtToggle', 'default', 'toggle', '<dt-toggle model-value>Label</dt-toggle>', ['DtToggle']],
];
function fixture() {
  const inputs = ['package.json'];
  return {
    schemaVersion: 1, inputs, inputsHash: hash(JSON.stringify(inputs.map(path => [path, hash(read(path))]))),
    sourceVersions: { combinator: '1.3.0' },
    entries: definitions.map(([component, preset, slug, template, imports]) => {
      const filePath = `packages/combinator/src/variants/variants_${slug}.js`;
      return { id: `examples/presets/${component}/${encodeURIComponent(preset)}`, component, preset, selected: true,
        source: { kind: 'combinator-preset', filePath, hash: hash(read(filePath)) }, template, imports,
        disposition: 'eligible/setup-needed', reasons: [], requiredContext: [] };
    }),
  };
}
const vuePackage = JSON.parse(read('packages/dialtone-vue/package.json'));
const records = definitions.map(([component, , slug]) => ({ id: `components/${slug}#intro`, docId: `components/${slug}`,
  docTitle: component, category: 'components', headingPath: [], frontmatter: {}, filePath: `components/${slug}.md` }));

describe('Combinator source delivery', () => {
  it('delivers only selected eligible presets with root association, real icon imports and honest state', () => {
    const report = fixture();
    report.entries.push({ id: 'examples/presets/DtModal/default', component: 'DtModal', selected: false, disposition: 'policy-excluded' },
      { id: 'examples/presets/DtButton/block%20start%20icon', component: 'DtButton', selected: false, disposition: 'deprecated' });
    const result = presets.buildPresetExampleRecords(report, { records, vuePackage });
    expect(result.records.map(record => record.id)).toEqual(definitions.map(([component, preset]) => `examples/presets/${component}/${encodeURIComponent(preset)}`));
    expect(result.records[1].docId).toBe('components/button');
    expect(result.records[1].content).toContain('import { DtIconPhone } from \'@dialpad/dialtone-icons/vue\'');
    expect(result.records[1].content).toContain(report.entries[1].template);
    expect(result.records[2].content).toContain('Initial-state fixture');
    for (const record of result.records) {
      expect(record.example.source.kind).toBe('combinator-preset');
      expect(record.example.validation.consumerBuild).toBe('unverified');
      expect(record.example.manualReview).toBe('pending');
    }
    expect(result.coverage.summary.delivered).toBe(3);
    expect(result.coverage.summary.remaining).toBe(0);
    expect(result.coverage.entries.find(entry => entry.component === 'DtModal').disposition).toBe('policy-excluded');
  });

  it('fails stale intermediate/source identity instead of delivering old code', () => {
    const stale = fixture(); stale.inputsHash = 'stale';
    expect(() => presets.buildPresetExampleRecords(stale, { records, vuePackage })).toThrow(/stale/i);
    const changed = fixture(); changed.entries[0].source.hash = 'old-bank';
    expect(() => presets.buildPresetExampleRecords(changed, { records, vuePackage })).toThrow(/source/i);
  });

  it('rejects duplicate identity or selected policy exclusions rather than promoting them', () => {
    const duplicate = fixture(); duplicate.entries.push(duplicate.entries[0]);
    expect(() => presets.buildPresetExampleRecords(duplicate, { records, vuePackage })).toThrow(/duplicate/i);
    const excluded = fixture(); excluded.entries[0].disposition = 'policy-excluded';
    expect(() => presets.buildPresetExampleRecords(excluded, { records, vuePackage })).toThrow(/eligible/i);
  });
});
