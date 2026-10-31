import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import matter from 'gray-matter';
import { chunkSections } from '../src/generators/build-public-docs.mjs';
import { buildExampleRecords, buildExampleCoverage, assembleExampleRecord } from '../src/generators/documentation-examples.mjs';
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
    expect(record.content).not.toContain('undefined');
  });

  it('fails delivery-affecting ambiguity and preserves the base ID with a key', () => {
    const second = fence('<dt-button>Cancel</dt-button>');
    expect(() => produce(ordinary + '\n' + second)).toThrow(/key|ambig/i);
    const records = produce(ordinary + '\n' + annotation({ key: 'compact' }) + second);
    expect(records.map(x => x.id)).toEqual(['examples/docs/components/example/default', 'examples/docs/components/example/default/compact']);
  });

  it.each([
    ['unknown field', annotation({ proof: 'passed' }) + fence('<dt-button>Save</dt-button>')],
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

  it('qualifies unverified authored Vue payloads against the pinned dependencies', () => {
    const record = assembleExampleRecord({ id: 'examples/not-yet-verified', template: '<dt-button>Save</dt-button>', definition: { components: ['DtButton'], directives: [] }, source: { id: 'components/example#default' }, headingPath: ['Default'], filePath: input('').filePath, vuePackage });
    expect(record.example.validation.consumerBuild).toBe('unverified');
    expect(record.content).toContain('not verified against the pinned dependencies');
  });

  it('selects real top-level Boolean state rather than a fenced script sample', () => {
    const raw = '```vue\n<script setup>\nimport { ref } from "vue";\nconst checked = ref(true);\n</script>\n```\n\n<script setup>\nimport { ref } from "vue";\nconst checked = ref(false);\n</script>';
    expect(sourceSetup(raw, ['checked'])).toContain('ref(false)');
    expect(sourceSetup(raw, ['checked'])).not.toContain('ref(true)');
  });
});
