import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { dirname, resolve, join, win32 } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { readPublicComponentExports, uniqueComponentFiles, withComponentIdentity } from '../lib/vue-component-identity.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
// Consume metadata generated separately by the standard dialtone-vue:build.
const docs = JSON.parse(readFileSync(resolve(root, 'packages/dialtone-vue/dist/component-documentation.json'), 'utf8'));

test('public SFC exports are covered under their exported names', () => {
  // Independent source check: only barrels reachable from the public root count.
  const entry = readFileSync(resolve(root, 'packages/dialtone-vue/index.js'), 'utf8');
  const folders = [...entry.matchAll(/export \* from '\.\/components\/([^']+)';/g)].map(match => match[1]);
  const exports = folders.flatMap(folder => {
    const barrel = readFileSync(resolve(root, `packages/dialtone-vue/components/${folder}/index.js`), 'utf8');
    return [...barrel.matchAll(/export \{ default as (\w+) \} from '([^']+\.vue)';/g)].map(match => match[1]);
  });
  assert.ok(exports.includes('DtBreadcrumbItem'));
  for (const name of exports) {
    const record = docs.find(component => component.displayName === name);
    assert.ok(record, `Missing exported component ${name}`);
    assert.equal(record.identity?.kind, 'public');
    assert.ok(record.identity.imports.some(route => route.name === name && route.from === '@dialpad/dialtone-vue'));
  }
  assert.equal(docs.filter(component => component.identity?.kind === 'public').length, exports.length);
});

test('Resizable records have canonical Dt names and retain filename aliases', () => {
  for (const name of ['Resizable', 'ResizablePanel', 'ResizableHandle']) {
    const record = docs.find(component => component.displayName === `Dt${name}`);
    assert.ok(record, `Missing Dt${name}`);
    assert.ok(record.identity.aliases.includes(name));
  }
});

test('retained internal records cannot recommend root imports', () => {
  for (const name of ['KitchenSinkView', 'SplitButtonStart', 'ComboboxEmptyList']) {
    const record = docs.find(component => component.displayName === name);
    assert.ok(record, `Internal metadata no longer available for ${name}`);
    assert.equal(record.identity.kind, 'internal');
    assert.deepEqual(record.identity.imports, []);
  }
});

test('array records carry additive versioned identity with portable source paths', () => {
  assert.ok(Array.isArray(docs));
  for (const record of docs) {
    assert.equal(record.schemaVersion, 2);
    assert.equal(record.displayName, record.identity.canonicalName);
    assert.ok(record.identity.source.path.startsWith('components/'));
    assert.ok(!record.identity.source.path.includes(root));
    assert.ok(!record.identity.aliases.includes(record.displayName));
  }
});

test('Windows scan and export paths produce one public record with a verified import', () => {
  const packageRoot = String.raw`C:\dialtone\packages\dialtone-vue`;
  const scanned = `${packageRoot}/components/button/button.vue`;
  const exported = win32.resolve(scanned);
  const exports = new Map([[exported, ['DtButton']]]);
  const files = uniqueComponentFiles([scanned, ...exports.keys()], win32.resolve);
  const records = files.map(file => withComponentIdentity(
    { displayName: 'button' }, file, exports, packageRoot, { name: '@example/ui', version: '1.0.0' },
  ));
  assert.deepEqual(records.map(record => ({ kind: record.identity.kind, imports: record.identity.imports })), [{
    kind: 'public',
    imports: [{
      name: 'DtButton', from: '@example/ui', kind: 'root', verification: 'source-export',
      package: '@example/ui', version: '1.0.0',
    }],
  }]);
});

test('barrel aliases share source identity and prefer the public Dt name', () => {
  const fixture = mkdtempSync(join(tmpdir(), 'dialtone-export-graph-'));
  try {
    mkdirSync(join(fixture, 'parts'));
    writeFileSync(join(fixture, 'index.js'), `export * from './parts';`);
    writeFileSync(join(fixture, 'parts/index.ts'), `import Panel from '../Panel.vue'; export { Panel as PanelAlias, Panel as DtPanel };`);
    const file = join(fixture, 'Panel.vue');
    writeFileSync(file, '<template><div /></template>');
    const exports = readPublicComponentExports(fixture);
    const record = withComponentIdentity({ displayName: 'Panel' }, file, exports, fixture, { name: '@example/ui', version: '1.0.0' });
    assert.equal(record.displayName, 'DtPanel');
    assert.deepEqual(record.identity.aliases, ['PanelAlias', 'Panel']);
    assert.deepEqual(record.identity.imports.map(route => route.name), ['PanelAlias', 'DtPanel']);
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
});
