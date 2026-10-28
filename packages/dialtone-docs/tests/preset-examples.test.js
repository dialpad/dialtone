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
    sourceVersions: { combinator: combinatorPackage.version, vueComponents: vuePackage.version },
    entries: definitions.map(([component, preset, slug, template, imports]) => {
      const filePath = `packages/combinator/src/variants/variants_${slug}.js`;
      return { id: `examples/presets/${component}/${encodeURIComponent(preset)}`, component, preset,
        source: { kind: 'combinator-preset', filePath, hash: hash(read(filePath)) }, template, imports,
        disposition: 'eligible/setup-needed', reasons: [], requiredContext: [] };
    }),
  };
}
const vuePackage = JSON.parse(read('packages/dialtone-vue/package.json'));
const combinatorPackage = JSON.parse(read('packages/combinator/package.json'));
const records = definitions.map(([component, , slug]) => ({ id: `components/${slug}#intro`, docId: `components/${slug}`,
  docTitle: component, category: 'components', headingPath: [], frontmatter: {}, filePath: `components/${slug}.md` }));

describe('Combinator source delivery', () => {
  it('delivers registered eligible presets with root association, real icon imports and honest state', () => {
    const report = fixture();
    for (const [component, preset, slug, disposition] of [
      ['DtModal', 'default', 'modal', 'policy-excluded'],
      ['DtButton', 'block start icon', 'button', 'deprecated'],
    ]) {
      const filePath = `packages/combinator/src/variants/variants_${slug}.js`;
      report.entries.push({ id: `examples/presets/${component}/${encodeURIComponent(preset)}`, component, preset,
        disposition, reasons: [], requiredContext: [], source: { kind: 'combinator-preset', filePath, hash: hash(read(filePath)) } });
    }
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


  it('imports the Vue illustration wrapper from its component export, not generated icons', () => {
    const report = fixture();
    const filePath = 'packages/combinator/src/variants/variants_illustration.js';
    report.entries = [{ ...report.entries[0], id: 'examples/presets/DtIllustration/default',
      component: 'DtIllustration', template: '<dt-illustration name="nothing-to-see-here" />', imports: ['DtIllustration'],
      source: { kind: 'combinator-preset', filePath, hash: hash(read(filePath)) } }];
    const page = { ...records[0], docTitle: 'DtIllustration', docId: 'components/illustration' };
    const result = presets.buildPresetExampleRecords(report, { records: [page], vuePackage }).records[0];
    expect(result.content).toContain('import { DtIllustration } from \'@dialpad/dialtone/vue\'');
    expect(result.content).not.toContain('import { DtIllustration } from \'@dialpad/dialtone-icons/vue\'');
    expect(result.example.components.map(component => component.canonicalName)).toEqual(['DtIllustration']);
  });

  it('assembler follows source addition, payload edits, rename and removal without another membership list', () => {
    const report = fixture();
    report.entries = [{ ...report.entries[0], preset: 'new / preset (wide)', id: 'examples/presets/DtLoader/new%20%2F%20preset%20%28wide%29' }];
    const first = presets.buildPresetExampleRecords(report, { records, vuePackage });
    expect(first.records.map(record => record.id)).toEqual(['examples/presets/DtLoader/new%20%2F%20preset%20%28wide%29']);
    report.entries[0].template = '<dt-loader aria-label="Saving" size="500" />';
    const edited = presets.buildPresetExampleRecords(report, { records, vuePackage });
    expect(edited.records[0].example.validation.payloadHash).not.toBe(first.records[0].example.validation.payloadHash);
    expect(edited.records[0].example.validation.consumerBuild).toBe('unverified');
    report.entries[0].preset = 'renamed';
    report.entries[0].id = 'examples/presets/DtLoader/renamed';
    const renamed = presets.buildPresetExampleRecords(report, { records, vuePackage });
    expect(renamed.records.map(record => record.id)).toEqual(['examples/presets/DtLoader/renamed']);
    report.entries = [];
    expect(presets.buildPresetExampleRecords(report, { records, vuePackage }).records).toEqual([]);
  });

  it('reports missing source context without suppressing other eligible fixtures', () => {
    const report = fixture();
    report.entries[0].template = '<dt-loader :size="missingSize" />';
    const result = presets.buildPresetExampleRecords(report, { records, vuePackage });
    expect(result.records.map(record => record.id)).toEqual(['examples/presets/DtButton/start%20icon', 'examples/presets/DtToggle/default']);
    expect(result.coverage.entries[0].disposition).toBe('unresolved');
    expect(result.coverage.entries[0].reasons.join(' ')).toContain('missingSize');
    expect(result.coverage.summary.remaining).toBe(1);
  });

  it('fails stale intermediate/source identity instead of delivering old code', () => {
    const stale = fixture(); stale.inputsHash = 'stale';
    expect(() => presets.buildPresetExampleRecords(stale, { records, vuePackage })).toThrow(/stale/i);
    const malformed = fixture(); malformed.entries[0].disposition = 'misspelled';
    expect(() => presets.buildPresetExampleRecords(malformed, { records, vuePackage })).toThrow(/intermediate/i);
    for (const field of ['combinator', 'vueComponents']) {
      for (const version of [undefined, '0.0.0']) {
        const corruptVersion = fixture(); corruptVersion.sourceVersions[field] = version;
        expect(() => presets.buildPresetExampleRecords(corruptVersion, { records, vuePackage }))
          .toThrow(/intermediate|source version/i);
      }
    }
    const changed = fixture(); changed.entries[0].source.hash = 'old-bank';
    expect(() => presets.buildPresetExampleRecords(changed, { records, vuePackage })).toThrow(/source/i);
  });

  it('rejects duplicate identity and accounts for policy changes without publishing them', () => {
    const duplicate = fixture(); duplicate.entries.push(duplicate.entries[0]);
    expect(() => presets.buildPresetExampleRecords(duplicate, { records, vuePackage })).toThrow(/duplicate/i);
    const excluded = fixture(); excluded.entries[0].disposition = 'policy-excluded';
    const result = presets.buildPresetExampleRecords(excluded, { records, vuePackage });
    expect(result.records.some(record => record.id === excluded.entries[0].id)).toBe(false);
    expect(result.coverage.entries[0].disposition).toBe('policy-excluded');
  });
});
