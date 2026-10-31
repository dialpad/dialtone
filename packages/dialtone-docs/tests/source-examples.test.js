import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import matter from 'gray-matter';
import { chunkSections } from '../src/generators/build-public-docs.mjs';
import { buildExampleRecords, buildExampleCoverage } from '../src/generators/documentation-examples.mjs';
import { applyGuidance, createGuidanceManifest, selectGuidance } from '../src/generators/example-guidance.mjs';
import { sourceSetup } from '../src/generators/example-template.mjs';

const vuePackage = JSON.parse(readFileSync(new URL('../../dialtone-vue/package.json', import.meta.url)));
const fence = markup => `\`\`\`vue demo\n${markup}\n\`\`\``;
const annotation = value => `<!-- @example ${JSON.stringify(value)} -->\n\n`;
function input(rawFile) {
  const { content } = matter(rawFile);
  const sections = chunkSections(content);
  return {
    rawFile, sections, filePath: 'apps/dialtone-documentation/docs/components/example.md', vuePackage,
    records: sections.map(({ headingPath, baseSlug }) => ({ id: `components/example#${baseSlug ?? headingPath.join('-').toLowerCase()}`, docId: 'components/example', category: 'components', headingPath })),
    componentPage: { components: [{ canonicalName: 'DtButton', relation: 'api' }] },
    lineOffset: rawFile.slice(0, rawFile.length - content.length).split('\n').length - 1,
  };
}
const produce = raw => buildExampleRecords(input(raw));
const ordinary = `## Default\n${fence('<dt-button>Save</dt-button>')}`;

describe('source-driven component examples', () => {
  it('delivers an unannotated public demo with a derived exact ID', () => {
    const [record] = produce(ordinary);
    expect(record?.id).toBe('examples/docs/components/example/default');
    expect(record.example.components.map(x => x.canonicalName)).toEqual(['DtButton']);
    expect(record.content).toContain('<dt-button>Save</dt-button>');
    expect(record.example.validation.consumerBuild).toBe('unverified');
    expect(record.content).toContain('not verified against the pinned dependencies');
  });

  it('fails delivery-affecting ambiguity and preserves the base ID with a key', () => {
    const second = fence('<dt-button>Cancel</dt-button>');
    expect(() => produce(ordinary + '\n' + second)).toThrow(/example.md:\d+.*Default.*lines \d+, \d+/);
    expect(() => produce(ordinary + '\n' + second)).toThrow('<!-- @example {"key":"short-name"} -->');
    const records = produce(ordinary + '\n' + annotation({ key: 'compact' }) + second);
    expect(records.map(x => x.id)).toEqual(['examples/docs/components/example/default', 'examples/docs/components/example/default/compact']);
  });

  it.each([
    ['unknown field', annotation({ responsibilities: 'Hand-maintained guidance' }) + fence('<dt-button>Save</dt-button>')],
    ['orphan annotation', annotation({ key: 'lost' }) + 'Intervening prose.\n\n' + fence('<dt-button>Save</dt-button>')],
    ['legacy marker', '<!-- example-id: examples/button-default -->\n\n' + fence('<dt-button>Save</dt-button>')],
  ])('rejects %s rather than silently ignoring authored intent', (_, raw) => {
    expect(() => produce('## Default\n' + raw)).toThrow();
  });

  it('retains a source-owned exclusion and physical location in coverage', () => {
    const rawFile = '---\ntitle: Example\n---\n\n## Default\n' + annotation({ exclude: { reason: 'Needs an application service.', owner: 'Component owner' } }) + fence('<dt-button>Save</dt-button>');
    const options = input(rawFile);
    const records = buildExampleRecords(options);
    const coverage = buildExampleCoverage({ ...options, records });
    expect(records).toEqual([]);
    expect(coverage.candidates[0].disposition).toBe('excluded');
    expect(coverage.candidates[0].reason).toContain('application service');
    expect(rawFile.split('\n')[coverage.candidates[0].sourceLine - 1]).toBe('```vue demo');
  });

  it.each([
    ['excluded', '---\nstatus: planned\n---\n\n## 🧪\n' + fence('<dt-button>Save</dt-button>'), 'components', 'excluded', 'not-ready'],
    ['unresolved', '## 🧪\n' + fence('<dt-button :disabled="missing">Save</dt-button>'), 'components', 'remaining', 'missing'],
    ['outside the enabled area', '## 🧪\n' + fence('<dt-button>Save</dt-button>'), 'guides', 'remaining', 'outside'],
  ])('keeps %s candidates with non-publishable derived IDs in coverage', (_, raw, area, disposition, reason) => {
    const options = input(raw);
    options.filePath = `apps/dialtone-documentation/docs/${area}/example.md`;
    expect(buildExampleRecords(options)).toEqual([]);
    const coverage = buildExampleCoverage(options);
    expect(coverage.candidates[0].disposition).toBe(disposition);
    expect(coverage.candidates[0].reason).toContain(reason);
  });

  it('rejects non-publishable derived IDs when the candidate would be delivered', () => {
    expect(() => produce('## 🧪\n' + fence('<dt-button>Save</dt-button>'))).toThrow(/invalid example ID/);
  });

  it('validates explicit IDs even when the source is excluded', () => {
    const raw = '---\nstatus: planned\n---\n\n## Default\n'
      + annotation({ id: 'examples/Invalid' }) + fence('<dt-button>Save</dt-button>');
    expect(() => produce(raw)).toThrow(/invalid example ID/);
  });

  it('does not let a future reference fence change a live demo address', () => {
    const records = produce(ordinary + '\n```vue code-only\n<dt-button>Reference</dt-button>\n```');
    expect(records.map(x => x.id)).toEqual(['examples/docs/components/example/default']);
  });

  it('keeps usage comparisons with their guidance instead of delivering a discouraged fragment', () => {
    const raw = '## Usage\n<dialtone-usage>\n<template #dont>\n\n' + fence('<dt-button>Delete</dt-button>') + '\n\n</template>\n</dialtone-usage>';
    expect(produce(raw)).toEqual([]);
    expect(buildExampleCoverage(input(raw)).candidates[0].reason).toContain('Contextual');
  });

  it('does not let an identity override enroll a Vue demo outside the component rule', () => {
    const options = input('## Default\n' + annotation({ id: 'examples/guide-demo' }) + fence('<dt-button>Save</dt-button>'));
    options.filePath = 'apps/dialtone-documentation/docs/guides/example.md';
    expect(buildExampleRecords(options)).toEqual([]);
    expect(buildExampleCoverage(options).candidates[0].reason).toContain('outside');
  });

  it.each(['commented', 'nested'])('rejects %s scripts as authored top-level state', kind => {
    const script = '<script setup>\nimport { ref } from "vue";\nconst checked = ref(true);\n</script>';
    const raw = kind === 'commented' ? '<!--\n' + script + '\n-->' : '<div>\n' + script + '\n</div>';
    expect(() => sourceSetup(raw, ['checked'])).toThrow(/Missing/);
  });

  it('infers referenced Boolean state without a source annotation', () => {
    const raw = '<script setup>\nimport { ref } from "vue";\nconst checked = ref(false);\nconst unused = ref("outside this cohort");\n</script>\n\n## Model\n'
      + fence('<dt-toggle v-model="checked">Enable alerts</dt-toggle>');
    const [record] = produce(raw);
    expect(record).toBeDefined();
    expect(record.content).toContain('const checked = ref(false);');
    expect(record.content).not.toContain('outside this cohort');
    expect(record.example.validation.consumerBuild).toBe('unverified');
  });

  it('keeps unsupported referenced state pending instead of inventing setup', () => {
    const raw = '<script setup>\nimport { ref } from "vue";\nconst checked = ref(loadSettings());\n</script>\n\n## Model\n'
      + fence('<dt-toggle v-model="checked">Enable alerts</dt-toggle>');
    expect(produce(raw)).toEqual([]);
    expect(buildExampleCoverage(input(raw)).candidates[0].reason).toContain('checked');
  });

  it('adds guidance to retrieval prose without changing consumer proof or source records', () => {
    const records = produce(ordinary);
    const data = createGuidanceManifest([{ id: records[0].id, sources: [{ id: 'example', text: '<dt-button>Save</dt-button>' }], dependencies: [] }], { model: 'test-model', toolingHash: 'a'.repeat(64) });
    const input = data.entries[0];
    const notes = [{ text: 'Use a literal $& action label.', references: [{ source: 'example', quote: 'Save' }] }];
    const selection = selectGuidance(data, [{ schemaVersion: 1, entries: [{ id: input.id, inputHash: input.inputHash, notes, status: 'complete' }] }]);
    const [enriched] = applyGuidance(records, selection);
    expect(enriched.content).toContain('Use a literal $& action label.');
    expect(enriched.example).toEqual(records[0].example);
    expect(records[0].content).not.toContain('Use a literal $& action label.');
    expect(enriched.content).not.toContain(input.inputHash);
  });

  it('flows edits, heading renames and removals through the actual source reader', () => {
    const [before] = produce(ordinary);
    const [edited] = produce(ordinary.replace('Save', 'Submit'));
    expect(before).toBeDefined();
    expect(edited).toBeDefined();
    expect(edited.id).toBe(before.id);
    expect(edited.example.validation.payloadHash).not.toBe(before.example.validation.payloadHash);
    expect(produce(ordinary.replace('## Default', '## Renamed'))[0].id).toBe('examples/docs/components/example/renamed');
    expect(produce('## Default\nNo live source remains.')).toEqual([]);
  });

  it('selects real top-level Boolean state rather than a fenced script sample', () => {
    const raw = '```vue\n<script setup>\nimport { ref } from "vue";\nconst checked = ref(true);\n</script>\n```\n\n<script setup>\nimport { ref } from "vue";\nconst checked = ref(false);\n</script>';
    expect(sourceSetup(raw, ['checked'])).toContain('ref(false)');
    expect(sourceSetup(raw, ['checked'])).not.toContain('ref(true)');
  });
});
