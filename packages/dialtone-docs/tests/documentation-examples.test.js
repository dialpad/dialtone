import { describe, it, expect, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { chunkSections } from '../src/generators/build-public-docs.mjs';
import { buildExampleRecords } from '../src/generators/documentation-examples.mjs';
import { getProfile } from '../../../scripts/retrieval/profiles.mjs';

const source = resolve('../../apps/dialtone-documentation/docs/components/button.md');
const vuePackage = JSON.parse(readFileSync(resolve('../dialtone-vue/package.json')));
const examples = () => assemble(readFileSync(source, 'utf8')).filter(record => ['examples/button-default', 'examples/button-disabled-tooltip'].includes(record.id));
function assemble(raw, build = buildExampleRecords) {
  const sections = chunkSections(raw);
  return build({ rawFile: raw, sections, records: sections.map(({ headingPath }) => ({ id: 'source#renamed', docId: 'components/button', headingPath })), filePath: 'apps/dialtone-documentation/docs/components/button.md', vuePackage, componentPage: { components: [{ canonicalName: 'DtButton', relation: 'api' }] } });
}
const live = '### Renamed\n<!-- @example {"id":"examples/button-default"} -->\n\n```vue demo\n<!-- @wrapper -->\n<dt-button>Live</dt-button>\n<!-- @code -->\n<dt-button {props}>Shortened</dt-button>\n```';

describe('authored documentation example evidence', () => {
  it('retains matching validation when only unrelated page prose changes', () => {
    const [before] = examples();
    const after = assemble(readFileSync(source, 'utf8') + '\nUnrelated editorial note.\n').find(record => record.id === before.id);
    expect(after.example.source.hash).not.toBe(before.example.source.hash);
    expect(after.example.validation.payloadHash).toBe(before.example.validation.payloadHash);
    expect(after.example.manualReview).toBe('passed');
  });

  it('assembles both authored IDs, literal live markup, identities and setup', () => {
    const records = examples();
    expect(records.map(record => record.id)).toEqual(['examples/button-default', 'examples/button-disabled-tooltip']);
    expect(records[0].content).toContain('importance="outlined"');
    expect(records[0].content).toContain('import { DtButton, DtStack } from \'@dialpad/dialtone/vue\'');
    expect(records[0].content).not.toContain('<!-- @wrapper -->');
    expect(records[1].content).toContain('<span v-dt-tooltip="`Tooltip example`" tabindex="0">');
    expect(records[1].content).toContain('app.use(DtTooltipDirective)');
    for (const record of records) {
      expect(record.content).toContain('@dialpad/dialtone/css-default-theme');
      expect(record.content).not.toContain('{props}');
      expect(record.example.components.map(identity => identity.canonicalName)).toEqual(['DtButton', 'DtStack']);
      expect(record.example.manualReview).toBe('passed');
    }
    expect(records[1].example.directives).toEqual(['DtTooltipDirective']);
  });

  it('reverts changed source to unverified and pending review', () => {
    const [current] = examples();
    const [stale] = assemble('<!-- @example {"id":"examples/button-default"} -->\n\n```vue demo\n<dt-button>Changed</dt-button>\n```');
    expect(stale.example.validation.consumerBuild).toBe('unverified');
    expect(stale.example.manualReview).toBe('pending');
    expect(stale.example.validation.manualReview).toBeUndefined();
    expect(stale.example.validation.payloadHash).not.toBe(current.example.validation.payloadHash);
  });

  it('withholds passed manual claims when any required evidence field is missing', async () => {
    const saved = JSON.parse(readFileSync(resolve('src/generators/example-validation.json'), 'utf8'));
    let evidence;
    vi.doMock('node:fs', async importOriginal => ({
      ...await importOriginal(),
      readFileSync: (file, ...args) => String(file).endsWith('/example-validation.json')
        ? JSON.stringify(evidence) : readFileSync(file, ...args),
    }));
    try {
      for (const field of ['date', 'reviewer', 'browser', 'os', 'assistiveTechnology']) {
        evidence = structuredClone(saved);
        delete evidence.examples['examples/button-default'].manualReview[field];
        vi.resetModules();
        const { buildExampleRecords: build } = await import('../src/generators/documentation-examples.mjs');
        const record = assemble(readFileSync(source, 'utf8'), build).find(record => record.id === 'examples/button-default');
        expect(record.example.validation.consumerBuild).toBe('built');
        expect(record.example.validation.api).toBe('passed');
        expect(record.example.manualReview).toBe('pending');
        expect(record.example.validation.manualReview.status).toBe('pending');
        expect(record.content).not.toContain('reviewer-reported spot checks passed');
      }
    } finally {
      vi.doUnmock('node:fs');
      vi.resetModules();
    }
  });

  it.each(['id', 'artifact integrity'])('invalidates saved evidence after changing the profile %s', async field => {
    const profile = getProfile('dt10-pinned');
    if (field === 'id') profile.id = 'renamed-profile';
    else profile.artifacts['@dialpad/dialtone'].integrity = 'changed-integrity';
    vi.resetModules();
    vi.doMock('../../../scripts/retrieval/profiles.mjs', () => ({ getProfile: () => profile }));
    try {
      const { buildExampleRecords: build } = await import('../src/generators/documentation-examples.mjs');
      const record = assemble(readFileSync(source, 'utf8'), build).find(record => record.id === 'examples/button-default');
      expect(record.example.validation.payloadHash).toBe(examples()[0].example.validation.payloadHash);
      expect(record.example.validation.consumerBuild).toBe('unverified');
      expect(record.example.manualReview).toBe('pending');
    } finally {
      vi.doUnmock('../../../scripts/retrieval/profiles.mjs');
      vi.resetModules();
    }
  });

  it('uses the authored ID after a heading rename and takes live code before @code', () => {
    const [record] = assemble(live);
    expect(record.id).toBe('examples/button-default');
    expect(record.content).toContain('<dt-button>Live</dt-button>');
    expect(record.content).not.toContain('Shortened');
    expect(record.example.validation.consumerBuild).toBe('unverified');
  });

  it.each([
    ['a repeated ID', live + '\n' + live, 'Duplicate example ID'],
    ['a code-only fence', live.replace('vue demo', 'vue code-only'), 'live Vue demo'],
  ])('rejects %s', (_, raw, message) => {
    expect(() => assemble(raw)).toThrow(message);
  });

  it('keeps unknown APIs unresolved instead of inventing an import', () => {
    expect(assemble(live.replace('<dt-button>Live</dt-button>', '<app-widget />'))).toEqual([]);
  });
});
