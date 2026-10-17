import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { buildRecords, chunkSections } from '../src/generators/build-public-docs.mjs';
import { buildExampleRecords } from '../src/generators/documentation-examples.mjs';

const source = resolve('../../apps/dialtone-documentation/docs/components/button.md');
const examples = () => buildRecords(source).filter(record => record.example);
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
      expect(record.example.manualReview).toBe('pending');
    }
    expect(records[1].example.directives).toEqual(['DtTooltipDirective']);
    const stale = buildExampleRecords({
      rawFile: 'changed source bytes',
      sections: [{ headingPath: ['Variants', 'Default'], raw: '<!-- example-id: examples/button-default -->\n\n```vue demo\n<dt-button>Changed</dt-button>\n```' }],
      records: [records[0]], filePath: records[0].filePath,
      vuePackage: JSON.parse(readFileSync(resolve('../dialtone-vue/package.json'))),
    });
    expect(stale[0].example.validation.consumerBuild).toBe('unverified');
    expect(stale[0].example.validation.payloadHash).not.toBe(records[0].example.validation.payloadHash);
  });

  function assemble(raw) {
    const sections = chunkSections(raw);
    return buildExampleRecords({ rawFile: raw, sections, records: sections.map(({ headingPath }) => ({ id: 'source#renamed', headingPath })), filePath: 'source.md', vuePackage: JSON.parse(readFileSync(resolve('../dialtone-vue/package.json'))) });
  }
  it('uses the authored ID after a heading rename and takes live code before @code', () => {
    const raw = '### Renamed\n<!-- example-id: examples/button-default -->\n\n```vue demo\n<!-- @wrapper -->\n<dt-button>Live</dt-button>\n<!-- @code -->\n<dt-button {props}>Shortened</dt-button>\n```';
    const [record] = assemble(raw);
    expect(record.id).toBe('examples/button-default');
    expect(record.content).toContain('<dt-button>Live</dt-button>');
    expect(record.content).not.toContain('Shortened');
    expect(record.example.validation.consumerBuild).toBe('unverified');
    expect(() => assemble(raw + '\n' + raw)).toThrow('Duplicate example ID');
    expect(() => assemble(raw.replace('vue demo', 'vue code-only'))).toThrow('live Vue demo');
  });
});
