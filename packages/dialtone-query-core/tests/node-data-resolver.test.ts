import { afterEach, expect, test } from 'vitest';
import { mkdtemp, mkdir, readFile, rename, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createConsumerFixture, sha256 } from '../../../scripts/retrieval/fixtures.mjs';
import { resolveProjectData } from '../src/node-data-resolver.js';

let parent: string;
afterEach(async () => { if (parent) await rm(parent, { recursive: true, force: true, maxRetries: 5 }); });
const records = [{ displayName: 'DtButton', props: [{ name: 'legacy-prop' }] }];
async function fixture(profile = 'dt9-legacy', data: unknown = records) {
  parent = await mkdtemp(join(tmpdir(), 'dialtone-project-data-'));
  const app = await createConsumerFixture(parent, profile, { packages: {
    '@dialpad/dialtone': { 'dist/vue3/component-documentation.json': data },
  } });
  const pkg = join(app.dependencyRoot, 'node_modules/@dialpad/dialtone');
  const manifest = JSON.parse(await readFile(join(pkg, 'package.json'), 'utf8'));
  manifest.exports['./vue'] = './dist/vue3/entry.js';
  await writeFile(join(pkg, 'package.json'), JSON.stringify(manifest));
  await writeFile(join(pkg, 'dist/vue3/entry.js'), "import local from './button.js'; export { local as DtButton };\n");
  return { ...app, pkg };
}

test('installed selection hashes actual bytes, verifies exports, and keeps missing domains qualified', async () => {
  const app = await fixture();
  const context = resolveProjectData(app.dependencyRoot);
  expect(context.data.components[0].identity).toMatchObject({ kind: 'public', imports: [{ name: 'DtButton', verification: 'installed-export', version: '9.185.0' }] });
  expect(context.componentExports).toEqual(['DtButton']);
  const bytes = await readFile(join(app.pkg, 'dist/vue3/component-documentation.json'));
  expect(context.provenance.domains.components).toMatchObject({
    selection: 'installed', version: '9.185.0', hash: sha256(bytes),
  });
  expect(context.provenance.domains.tokens).toMatchObject({ selection: 'bundled', fallbackReason: 'missing-or-unreadable-dataset' });
  expect(context.provenance.domains.documentation.selection).toBe('bundled');
  await mkdir(join(app.dependencyRoot, '.git'));
  expect(resolveProjectData(app.dependencyRoot, parent).provenance.domains.icons.fallbackReason).toBe('package-not-declared-by-umbrella');
});

test('nested dependency roots are explicit and hoisting needs its own authorized boundary', async () => {
  const app = await fixture('nested-umbrella');
  expect(resolveProjectData(app.invocationRoot).provenance.domains.components.fallbackReason).toBe('project-root-or-manifest-unavailable');
  expect(resolveProjectData(app.dependencyRoot).data.sources.components.kind).toBe('local');
  await rename(join(app.dependencyRoot, 'node_modules'), join(app.directory, 'node_modules'));
  expect(resolveProjectData(app.dependencyRoot).data.sources.components.kind).toBe('bundled');
  expect(resolveProjectData(app.dependencyRoot, app.directory).data.sources.components.kind).toBe('local');
  await mkdir(join(app.dependencyRoot, '.git'));
  expect(resolveProjectData(app.dependencyRoot, app.directory).provenance.domains.components.fallbackReason).toBe('package-not-found-within-lookup-boundary');
  await rename(join(app.directory, 'node_modules'), join(parent, 'uninstalled-node-modules'));
  expect(resolveProjectData(app.dependencyRoot, app.directory).provenance.domains.components.fallbackReason).toBe('package-not-found-within-lookup-boundary');
});

test('a declared umbrella never borrows stray standalone or undeclared installations', async () => {
  const app = await fixture();
  const stray = join(app.dependencyRoot, 'node_modules/@dialpad/dialtone-vue');
  await mkdir(stray, { recursive: true });
  await writeFile(join(stray, 'package.json'), JSON.stringify({ name: '@dialpad/dialtone-vue', version: '4.3.1' }));
  await writeFile(join(stray, 'component-documentation.json'), JSON.stringify([{ displayName: 'DtStray' }]));
  expect(resolveProjectData(app.dependencyRoot).data.components.map(record => record.displayName)).toEqual(['DtButton']);
  await writeFile(join(app.dependencyRoot, 'package.json'), '{}');
  const context = resolveProjectData(app.dependencyRoot);
  expect(context.provenance.domains.components.fallbackReason).toBe('package-not-declared');
  expect(context.data.components.every(record => record.identity?.imports.length === 0)).toBe(true);
});

test('symlinked packages are accepted inside the boundary and refused outside it', async () => {
  const app = await fixture();
  const stored = join(app.dependencyRoot, 'node_modules/.pnpm/local-package');
  await mkdir(join(stored, '..'), { recursive: true });
  await rename(app.pkg, stored);
  await symlink(stored, app.pkg);
  expect(resolveProjectData(app.dependencyRoot).data.sources.components.kind).toBe('local');
  const metadata = join(stored, 'dist/vue3/component-documentation.json');
  const escaped = join(app.dependencyRoot, 'outside-package-data.json');
  await rename(metadata, escaped);
  await symlink(escaped, metadata);
  expect(resolveProjectData(app.dependencyRoot).provenance.domains.components.fallbackReason).toBe('outside-lookup-boundary');
  await rm(metadata);
  await rename(escaped, metadata);
  await rm(app.pkg);
  const outside = join(parent, 'other-package');
  await rename(stored, outside);
  await symlink(outside, app.pkg);
  expect(resolveProjectData(app.dependencyRoot).provenance.domains.components).toMatchObject({ selection: 'bundled', fallbackReason: 'outside-lookup-boundary' });
});

test.each([null, { displayName: 'DtButton' }, [{ displayName: 'DtButton', props: {} }], [{ displayName: 'DtButton', schemaVersion: 99 }]])('malformed or unknown component data stays unverified: %j', async data => {
  const app = await fixture('dt9-legacy', data);
  const context = resolveProjectData(app.dependencyRoot);
  expect(context.componentExports).toBeNull();
  expect(context.data.sources.components.kind).toBe('bundled');
  expect(context.data.components.every(record => record.identity?.kind === 'unknown')).toBe(true);
  expect(context.provenance.domains.components.fallbackReason).toBe('malformed-or-unsupported-dataset');
});

test('missing configuration preserves bundled identity while invalid explicit configuration cannot claim exports', () => {
  const context = resolveProjectData();
  expect(context.configured).toBe(false);
  expect(context.provenance.domains.components.fallbackReason).toBe('project-root-not-configured');
  expect(context.data.components.some(record => record.identity?.imports.length)).toBe(true);
  expect(resolveProjectData(undefined, '/absolute/workspace').provenance.domains.components.fallbackReason).toBe('project-root-required');
  const invalid = resolveProjectData('relative/app');
  expect(invalid.configured).toBe(true);
  expect(invalid.data.components.every(record => record.identity?.kind === 'unknown')).toBe(true);
});

test('standalone, CSS-only and icons-only installs select only their installed domains', async () => {
  parent = await mkdtemp(join(tmpdir(), 'dialtone-project-data-'));
  const standalone = await createConsumerFixture(parent, 'standalone-vue3-legacy', { packages: {
    '@dialpad/dialtone-vue': { 'dist/component-documentation.json': [{ displayName: 'emoji_picker' }] },
  } });
  const pkg = join(standalone.dependencyRoot, 'node_modules/@dialpad/dialtone-vue');
  const manifest = JSON.parse(await readFile(join(pkg, 'package.json'), 'utf8'));
  manifest.exports['.'] = './dist/entry.js';
  await writeFile(join(pkg, 'package.json'), JSON.stringify(manifest));
  await writeFile(join(pkg, 'dist/entry.js'), "import local from './picker.js'; export { local as DtEmojiPicker };\n");
  const selected = resolveProjectData(standalone.dependencyRoot);
  expect(selected.data.components[0].displayName).toBe('DtEmojiPicker');
  expect(selected.data.components[0].identity?.imports[0].from).toBe('@dialpad/dialtone-vue');
  const cssOnly = await createConsumerFixture(parent, 'standalone-vue3-legacy', { packages: {
    '@dialpad/dialtone-css': {
      'lib/dist/dialtone-docs.json': { 'd-local': { values: [{ prop: 'padding', value: '1rem' }] } },
      'lib/dist/tokens-docs.json': { '--dt-local': { default: { value: '1rem' } } },
    },
  } });
  const css = resolveProjectData(cssOnly.dependencyRoot);
  expect(css.data.sources.utilities.kind).toBe('local');
  expect(css.data.sources.tokens.kind).toBe('local');
  expect(css.data.sources.components.kind).toBe('bundled');
  const partial = await createConsumerFixture(parent, 'partial-install', { packages: {
    '@dialpad/dialtone-icons': { 'dist/keywords-icons.json': { categories: { ui: { bell: ['notification'] } } } },
  } });
  const result = resolveProjectData(partial.dependencyRoot);
  expect(result.provenance.domains.icons).toMatchObject({ selection: 'installed', version: '5.2.0' });
  expect(result.data.sources.components.kind).toBe('bundled');
  expect(result.componentExports).toBeNull();
  await writeFile(join(partial.dependencyRoot, 'node_modules/@dialpad/dialtone-icons/dist/keywords-icons.json'), JSON.stringify({ schemaVersion: 99, categories: {} }));
  expect(resolveProjectData(partial.dependencyRoot).data.sources.icons.kind).toBe('bundled');
});
