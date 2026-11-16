// Opt-in real consumer validation. Reuses the C5 materializer; never publishes packages.
// The profile is the one that generated the records (DIALTONE_EXAMPLE_RELEASE_MANIFEST or the
// checked release manifests). Candidate archives (--archive name=path) are installed only inside
// the isolated fixture; delivered example files keep their exact published version pins.
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdirSync, renameSync } from 'node:fs';
import { parseArgs } from 'node:util';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { createConsumerFixture, fingerprintArtifact, sha256 } from './fixtures.mjs';
import { selectExampleProfile } from './release-profile.mjs';
import { extractExampleFiles, promoteExampleEvidence } from './example-evidence.mjs';
import { assertTemplateBindings, assertStaticHtml } from '../../packages/dialtone-docs/src/generators/example-template.mjs';
import { assertExampleId, checkTemplateApi, consumerTuple, parseTemplate } from './example-consumer.mjs';
import { checkStaticCss } from './static-example.mjs';
import { NPM_REGISTRY, archiveIntegrity, archiveManifest, registryArgs } from './release-archives.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const run = (file, args, cwd) => execFileSync(file, args, { cwd, stdio: 'pipe', encoding: 'utf8', timeout: 240000 });
const { values, positionals } = parseArgs({ options: {
  id: { type: 'string', multiple: true }, promote: { type: 'boolean' }, docs: { type: 'string' },
  archive: { type: 'string', multiple: true }, 'evidence-out': { type: 'string' },
}, allowPositionals: true });
assert.ok(positionals.length <= 1, 'Expected one consumer output directory');
const destination = resolve(positionals[0] ?? '.temp/example-consumers');
const docs = JSON.parse(readFileSync(resolve(values.docs ?? resolve(root, 'packages/dialtone-docs/dist/public-docs.json'))));
for (const id of values.id ?? []) assert.ok(docs.some(record => record.id === id && record.example), `Unknown example ID: ${id}`);
const selected = docs.filter(record => record.example && (!values.id || values.id.includes(record.id)));
assert.ok(selected.length, 'No examples in public-docs.json');
const { profile } = selectExampleProfile();
const primaryArtifact = profile.artifacts['@dialpad/dialtone'];
assert.ok(primaryArtifact?.integrity, `Profile ${profile.id} has no archive integrity; select a qualification manifest with DIALTONE_EXAMPLE_RELEASE_MANIFEST`);
for (const record of selected)
  assert.equal(record.example.profile.id, profile.id, `${record.id} was generated for ${record.example.profile.id}, not ${profile.id}`);
const archives = Object.fromEntries((values.archive ?? []).map(value => {
  const split = value.lastIndexOf('=');
  const [name, path] = [value.slice(0, split), value.slice(split + 1)];
  assert.ok(name.startsWith('@dialpad/') && path.endsWith('.tgz'), `Expected --archive @dialpad/name=path.tgz, got ${value}`);
  return [name, resolve(path)];
}));
const fixture = await createConsumerFixture(destination, profile);
const consumer = fixture.dependencyRoot;
const deliveredFiles = new Map(selected.map(record => [record.id, extractExampleFiles(record)]));
const pkg = JSON.parse(extractExampleFiles(docs.find(record => record.example?.representation === 'vue-app'))['package.json']);
assert.deepEqual(pkg.dependencies, profile.dependencies, 'Delivered pins differ from the selected profile');
// Fixture-only installation map: direct pins become file: specs; overrides force transitive copies.
const installManifest = { ...structuredClone(pkg), overrides: {} };
for (const [name, path] of Object.entries(archives)) {
  if (name in installManifest.dependencies) {
    installManifest.dependencies[name] = `file:${path}`;
    installManifest.overrides[name] = '$' + name;
  } else installManifest.overrides[name] = `file:${path}`;
}
writeFileSync(resolve(consumer, 'package.json'), JSON.stringify(installManifest, null, 2));
run('npm', ['install', '--ignore-scripts', ...registryArgs(NPM_REGISTRY), '--no-audit', '--no-fund', '--cache', resolve(destination, 'npm-cache')], consumer);
const consumerRequire = createRequire(resolve(consumer, 'package.json'));
const { parse } = consumerRequire('@vue/compiler-sfc');
const compilerDom = consumerRequire('@vue/compiler-dom');
const installedIcons = await import(pathToFileURL(consumerRequire.resolve('@dialpad/dialtone-icons/vue')).href);
const metadata = JSON.parse(readFileSync(consumerRequire.resolve('@dialpad/dialtone/vue3/component-documentation.json')));
const lintRequire = createRequire(resolve(root, 'package.json'));
const { ESLint } = lintRequire('eslint');
const vueParser = createRequire(lintRequire.resolve('eslint-plugin-vue'))('vue-eslint-parser');
const plugin = lintRequire('./packages/eslint-plugin-dialtone');
// Root ESLint at the fixture: CI and release runs keep consumers outside the checkout.
const eslint = new ESLint({ cwd: consumer, overrideConfigFile: true, ignore: false, overrideConfig: [{ files: ['**/*.vue'], languageOptions: { parser: vueParser }, plugins: { dialtone: plugin }, rules: Object.fromEntries(Object.keys(plugin.rules).filter(name => name.startsWith('deprecated-')).map(name => [`dialtone/${name}`, 'error'])) }] });

const reports = [];
const failures = [];
for (const record of selected) {
  const { id } = record;
  const files = deliveredFiles.get(id);
  assertExampleId(id);
  try {
    if (record.example.representation === 'static-html') {
      const classes = assertStaticHtml(files['example.html']);
      assert.equal(record.example.profile.dependencies['@dialpad/dialtone'], pkg.dependencies['@dialpad/dialtone']);
      const cssPath = consumerRequire.resolve('@dialpad/dialtone/css');
      const css = readFileSync(cssPath, 'utf8');
      const postcss = createRequire(consumerRequire.resolve('vite'))('postcss');
      const result = checkStaticCss(classes, record.example.utilities, postcss.parse(css));
      reports.push({ id, payloadHash: record.example.validation.payloadHash, consumerBuild: 'not-applicable', api: 'not-applicable', ...result, cssHash: sha256(readFileSync(cssPath)) });
      continue;
    }
    assert.deepEqual(consumerTuple(JSON.parse(files['package.json'])), consumerTuple(pkg), `${id} runtime/tooling tuple differs from installed consumer manifest`);
    const exampleDir = resolve(consumer, ...id.split('/'));
    mkdirSync(exampleDir, { recursive: true });
    for (const [name, content] of Object.entries(files)) writeFileSync(resolve(exampleDir, name), content);
    const sfc = parse(files['App.vue']);
    assert.deepEqual(sfc.errors, []);
    const ast = parseTemplate(compilerDom, sfc.descriptor.template.content);
    assertTemplateBindings(sfc.descriptor.template.content, sfc.descriptor.scriptSetup?.content ?? '');
    const checked = checkTemplateApi(ast, metadata, record.example.directives, installedIcons);
    const lint = await eslint.lintFiles([resolve(exampleDir, 'App.vue')]);
    const lintErrors = lint.reduce((total, result) => total + result.errorCount + result.warningCount, 0);
    assert.equal(lintErrors, 0, JSON.stringify(lint));
    const build = run('npm', ['run', 'build'], exampleDir);
    reports.push({ id, payloadHash: record.example.validation.payloadHash, consumerBuild: 'built', api: 'passed', checked: [...new Set(checked)], build });
  } catch (error) {
    // Name the example and the installed package so a failure cannot read as delivered.
    failures.push({ id, package: '@dialpad/dialtone', version: profile.dependencies['@dialpad/dialtone'], code: error.code, message: String(error.stderr || error.message).slice(0, 2000) });
  }
}
const primary = resolve(consumer, 'node_modules/@dialpad/dialtone');
const artifact = await fingerprintArtifact(profile, primary, ['dist/vue3/component-documentation.json']);
const lock = readFileSync(resolve(consumer, 'package-lock.json'));
const installed = JSON.parse(lock).packages;
for (const [name, version] of Object.entries(profile.dependencies))
  assert.equal(installed[`node_modules/${name}`].version, version, `Installed ${name} differs from the selected profile`);
for (const [name, path] of Object.entries(archives))
  assert.equal(JSON.parse(readFileSync(resolve(consumer, 'node_modules', name, 'package.json'))).version,
    archiveManifest(path).version, `${name} was not installed from ${path}`);
// Same version string is not the same bytes: compare the installed archive with the profile binding.
const archiveIntegrities = Object.fromEntries(Object.entries(archives)
  .map(([name, path]) => [name, archiveIntegrity(path)]));
artifact.integrity = archiveIntegrities['@dialpad/dialtone'] ?? installed['node_modules/@dialpad/dialtone'].integrity;
assert.equal(artifact.integrity, primaryArtifact.integrity, 'Installed @dialpad/dialtone archive differs from the selected profile');
const report = {
  fixture, profile: profile.id, artifact,
  archives: archiveIntegrities,
  verification: selected.some(record => record.example.representation === 'vue-app') ? 'built' : 'lookup-data-only',
  node: process.version, tooling: pkg.devDependencies, consumer: consumerTuple(pkg),
  verifiedOn: new Date().toISOString().slice(0, 10), lockHash: sha256(lock), reports, failures,
};
writeFileSync(resolve(destination, 'example-consumer-report.json'), JSON.stringify(report, null, 2));
if (failures.length) {
  console.error(JSON.stringify(failures.map(({ id, package: name, version, code, message }) => ({ id, package: `${name}@${version}`, code, message: message.split('\n')[0] })), null, 2));
  throw new Error(`${failures.length} of ${selected.length} examples failed against ${profile.id}; see ${resolve(destination, 'example-consumer-report.json')}`);
}
if (values['evidence-out']) {
  const evidence = promoteExampleEvidence(report, docs, { runs: {}, examples: {} }, profile);
  writeFileSync(resolve(values['evidence-out']), JSON.stringify(evidence, null, 2) + '\n');
}
if (values.promote) {
  const target = resolve(root, 'packages/dialtone-docs/src/generators/example-validation.json');
  const evidence = promoteExampleEvidence(report, docs, JSON.parse(readFileSync(target, 'utf8')), profile);
  writeFileSync(target + '.tmp', JSON.stringify(evidence, null, 2) + '\n');
  renameSync(target + '.tmp', target);
}
console.info(JSON.stringify({ profile: profile.id, examples: reports.length, report: resolve(destination, 'example-consumer-report.json') }));
