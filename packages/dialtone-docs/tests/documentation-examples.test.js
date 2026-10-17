import { describe, it, expect, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { buildRecords, chunkSections } from '../src/generators/build-public-docs.mjs';
import { buildExampleRecords } from '../src/generators/documentation-examples.mjs';
import { getProfile } from '../../../scripts/retrieval/profiles.mjs';

const source = resolve('../../apps/dialtone-documentation/docs/components/button.md');
const vuePackage = JSON.parse(readFileSync(resolve('../dialtone-vue/package.json')));
const examples = () => buildRecords(source).filter(record => record.example);
function assemble(raw, build = buildExampleRecords) {
  const sections = chunkSections(raw);
  return build({ rawFile: raw, sections, records: sections.map(({ headingPath }) => ({ id: 'source#renamed', headingPath })), filePath: 'source.md', vuePackage });
}
const live = '### Renamed\n<!-- example-id: examples/button-default -->\n\n```vue demo\n<!-- @wrapper -->\n<dt-button>Live</dt-button>\n<!-- @code -->\n<dt-button {props}>Shortened</dt-button>\n```';

describe('selected documentation examples', () => {
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
    const [stale] = assemble('<!-- example-id: examples/button-default -->\n\n```vue demo\n<dt-button>Changed</dt-button>\n```');
    expect(stale.example.validation.consumerBuild).toBe('unverified');
    expect(stale.example.manualReview).toBe('pending');
    expect(stale.example.validation.manualReview).toBeUndefined();
    expect(stale.example.validation.payloadHash).not.toBe(current.example.validation.payloadHash);
  });

  it.each(['id', 'artifact integrity'])('invalidates saved evidence after changing the profile %s', async field => {
    const profile = getProfile('dt10-pinned');
    if (field === 'id') profile.id = 'renamed-profile';
    else profile.artifacts['@dialpad/dialtone'].integrity = 'changed-integrity';
    vi.resetModules();
    vi.doMock('../../../scripts/retrieval/profiles.mjs', () => ({ getProfile: () => profile }));
    try {
      const { buildExampleRecords: build } = await import('../src/generators/documentation-examples.mjs');
      const [record] = assemble(readFileSync(source, 'utf8'), build);
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
    ['an undeclared component', live.replace('<dt-button>Live</dt-button>', '<dt-input />'), 'unconfigured dt-input'],
    ['an undeclared directive', live.replace('<dt-button>Live</dt-button>', '<dt-button v-dt-mode:dark>Live</dt-button>'), 'unconfigured v-dt-mode'],
  ])('rejects %s', (_, raw, message) => {
    expect(() => assemble(raw)).toThrow(message);
  });
});
