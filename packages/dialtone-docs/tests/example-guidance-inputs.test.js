import { expect, it } from 'vitest';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { prepareGuidanceFacts } from '../src/generators/example-guidance-inputs.mjs';
import { createGuidanceManifest } from '../src/generators/example-guidance.mjs';

it('follows component source imports and fingerprints changed helpers without release-version noise', () => {
  const root = mkdtempSync(resolve(tmpdir(), 'dialtone-guidance-'));
  try {
    mkdirSync(resolve(root, 'packages/dialtone-vue'), { recursive: true });
    writeFileSync(resolve(root, 'packages/dialtone-vue/Button.vue'), '<script>import x from "@/helper.js"; export default {x}</script><template><button /></template>');
    const helper = resolve(root, 'packages/dialtone-vue/helper.js');
    writeFileSync(helper, 'export default false;');
    const input = { id: 'examples/button-default', template: '<dt-button>Save</dt-button>', setup: '', components: ['DtButton'], directives: [], filePath: 'docs/button.md', headingPath: ['Default'], rawFile: '# Button\nUse a meaningful button label.' };
    const metadata = [{ displayName: 'DtButton', props: [], sourceFiles: [resolve(root, 'packages/dialtone-vue/Button.vue')], identity: { package: { version: '4.5.0' } } }];
    const config = { model: 'test-model', toolingHash: 'a'.repeat(64) };
    const facts = () => prepareGuidanceFacts(input, { root, metadata });
    const before = createGuidanceManifest([facts()], config).entries[0].inputHash;
    expect(facts().dependencies.some(x => x.path.endsWith('helper.js'))).toBe(true);
    metadata[0].identity.package.version = '4.6.0';
    expect(createGuidanceManifest([facts()], config).entries[0].inputHash).toBe(before);
    writeFileSync(helper, 'export default true;');
    expect(createGuidanceManifest([facts()], config).entries[0].inputHash).not.toBe(before);
    const asset = resolve(root, 'packages/dialtone-vue/asset.bin');
    writeFileSync(helper, 'import "./asset.bin"; export default true;');
    writeFileSync(asset, Buffer.from([255]));
    const withAsset = createGuidanceManifest([facts()], config).entries[0].inputHash;
    writeFileSync(asset, Buffer.from([254]));
    expect(createGuidanceManifest([facts()], config).entries[0].inputHash).not.toBe(withAsset);
  } finally { rmSync(root, { recursive: true }); }
});
