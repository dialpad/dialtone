import { expect, it } from 'vitest';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, renameSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { buildRecords } from '../src/generators/build-public-docs.mjs';
import { fileURLToPath } from 'node:url';
import { prepareGuidanceFacts } from '../src/generators/example-guidance-inputs.mjs';
import { withComponentIdentity } from '../../../scripts/lib/vue-component-identity.mjs';
import { createGuidanceManifest } from '../src/generators/example-guidance.mjs';

it('follows component source imports and fingerprints changed helpers without release-version noise', () => {
  const root = mkdtempSync(resolve(tmpdir(), 'dialtone-guidance-'));
  try {
    mkdirSync(resolve(root, 'packages/dialtone-vue'), { recursive: true });
    writeFileSync(resolve(root, 'packages/dialtone-vue/Button.vue'), '<script>import x from "@/helper.js"; export default {x}</script><template><button /></template>');
    const helper = resolve(root, 'packages/dialtone-vue/helper.js');
    writeFileSync(helper, 'export default false;');
    const input = { id: 'examples/button-default', template: '<dt-button>Save</dt-button>', setup: '', components: ['DtButton'], directives: [], filePath: 'docs/button.md', headingPath: ['Default'], rawFile: '# Button\nUse a meaningful button label.' };
    const metadata = [{ displayName: 'DtButton', props: [{ name: 'disabled', description: 'Use "disabled" for native behavior.\nGuard application handlers.' }], sourceFiles: [resolve(root, 'packages/dialtone-vue/Button.vue')], identity: { package: { version: '4.5.0' } } }];
    const config = { model: 'test-model', toolingHash: 'a'.repeat(64), driverHash: 'd'.repeat(64) };
    const facts = () => prepareGuidanceFacts(input, { root, metadata });
    const api = facts().sources.find(source => source.id === 'api:DtButton').text;
    expect(api).toContain(`Use "disabled" for native behavior.
Guard application handlers.`);
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

it('collects guidance inputs for the same examples emitted by the public page producer', () => {
    const inputs = [];
    const records = buildRecords(fileURLToPath(new URL('../../../apps/dialtone-documentation/docs/components/button.md', import.meta.url)), { onGuidanceInput: value => inputs.push(value) });
    expect(inputs.length).toBeGreaterThan(0);
    expect(inputs.map(value => value.id)).toEqual(records.filter(record => record.example).map(record => record.id));
    for (const input of inputs) {
      const record = records.find(record => record.id === input.id);
      expect(record.content).toContain(input.template);
      expect(input.components).toEqual(record.example.components.map(component => component.canonicalName));
      expect(input).not.toHaveProperty('validation');
      expect(input).not.toHaveProperty('manualReview');
    }
  });

it('reads cached component metadata after its producing checkout has moved', () => {
  const original = mkdtempSync(resolve(tmpdir(), 'guidance-producer-'));
  const moved = `${original}-consumer`;
  try {
    const packageRoot = resolve(original, 'packages/dialtone-vue');
    mkdirSync(packageRoot, { recursive: true });
    const file = resolve(packageRoot, 'Button.vue');
    writeFileSync(file, '<template><button>Save</button></template>');
    mkdirSync(resolve(packageRoot, 'parts'));
    writeFileSync(resolve(packageRoot, 'parts/Button.vue'), '<template><span>Part</span></template>');
    const metadata = [withComponentIdentity({ displayName: 'Button',
      sourceFiles: [file, 'packages/dialtone-vue/parts/Button.vue'] }, file,
      new Map([[file, ['DtButton']]]), packageRoot, { name: '@example/ui', version: '1.0.0' })];
    const input = { id: 'examples/portable', template: '<dt-button>Save</dt-button>', setup: '',
      components: ['DtButton'], directives: [], rawFile: '# Button\nUse a meaningful label.' };
    const before = prepareGuidanceFacts(input, { root: original, metadata });
    renameSync(original, moved);
    const after = prepareGuidanceFacts(input, { root: moved, metadata });
    expect(after).toEqual(before);
    expect(metadata[0].sourceFiles).toEqual(['packages/dialtone-vue/Button.vue', 'packages/dialtone-vue/parts/Button.vue']);
  } finally {
    rmSync(original, { recursive: true, force: true });
    rmSync(moved, { recursive: true, force: true });
  }
});


it('binds fieldset guidance to the current form section without unrelated guide noise', () => {
  const root = mkdtempSync(resolve(tmpdir(), 'guidance-form-context-'));
  try {
    const directory = resolve(root, 'apps/dialtone-documentation/docs/guides/accessibility');
    mkdirSync(directory, { recursive: true });
    const guide = resolve(directory, 'index.md');
    const text = '# Accessibility\n## Development\n### Form Best Practices\nName the fieldset group with a legend.\n### Other\nFirst outside paragraph.';
    writeFileSync(guide, text);
    const input = { id: 'examples/group', template: '<fieldset><input type="checkbox"></fieldset>', setup: '',
      rawFile: '# Group', components: [], directives: [] };
    const config = { model: 'test', toolingHash: 'a'.repeat(64), driverHash: 'd'.repeat(64) };
    const facts = () => prepareGuidanceFacts(input, { root, metadata: [] });
    const fingerprint = () => createGuidanceManifest([facts()], config).entries[0].inputHash;
    expect(facts().sources).toContainEqual({ id: 'guidance:guides/accessibility#development-form-best-practices',
      text: 'Name the fieldset group with a legend.' });
    const before = fingerprint();
    writeFileSync(guide, text.replace('First outside paragraph.', 'Different outside paragraph.'));
    expect(fingerprint()).toBe(before);
    writeFileSync(guide, text.replace('Name the fieldset group with a legend.', 'Give each fieldset a descriptive legend.'));
    expect(fingerprint()).not.toBe(before);
    writeFileSync(guide, text.replace('Form Best Practices', 'Renamed'));
    expect(facts).toThrow(/Form Best Practices/);
  } finally { rmSync(root, { recursive: true, force: true }); }
});
