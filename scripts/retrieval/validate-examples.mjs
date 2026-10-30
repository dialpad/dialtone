// Opt-in real consumer validation. Reuses the C5 materializer; never publishes packages.
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdirSync, renameSync } from 'node:fs';
import { parseArgs } from 'node:util';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { createConsumerFixture, fingerprintArtifact, sha256 } from './fixtures.mjs';
import { getProfile } from './profiles.mjs';
import { extractExampleFiles, promoteExampleEvidence } from './example-evidence.mjs';
import { assertTemplateBindings, assertStaticHtml } from '../../packages/dialtone-docs/src/generators/example-template.mjs';
import { checkTemplateApi, consumerTuple } from './example-consumer.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const run = (file, args, cwd) => execFileSync(file, args, { cwd, stdio: 'pipe', encoding: 'utf8', timeout: 240000 });
const { values, positionals } = parseArgs({ options: { id: { type: 'string', multiple: true }, promote: { type: 'boolean' } }, allowPositionals: true });
assert.ok(positionals.length <= 1, 'Expected one consumer output directory');
const destination = resolve(positionals[0] ?? '.temp/example-consumers');
const docs = JSON.parse(readFileSync(resolve(root, 'packages/dialtone-docs/dist/public-docs.json')));
for (const id of values.id ?? []) assert.ok(docs.some(record => record.id === id && record.example), `Unknown example ID: ${id}`);
const selected = docs.filter(record => record.example && (!values.id || values.id.includes(record.id)));
assert.ok(selected.length, 'No examples in public-docs.json');
const PROFILE_ID = 'dt10-pinned';
const fixture = await createConsumerFixture(destination, PROFILE_ID);
const consumer = fixture.dependencyRoot;
const deliveredFiles = new Map(selected.map(record => [record.id, extractExampleFiles(record)]));
const pkg = JSON.parse(extractExampleFiles(docs.find(record => record.example?.representation === 'vue-app'))['package.json']);
writeFileSync(resolve(consumer, 'package.json'), JSON.stringify(pkg, null, 2));
run('npm', ['install', '--ignore-scripts', '--registry=https://registry.npmjs.org', '--@dialpad:registry=https://registry.npmjs.org', '--no-audit', '--no-fund', '--cache', resolve(destination, 'npm-cache')], consumer);
const consumerRequire = createRequire(resolve(consumer, 'package.json'));
const { parse } = consumerRequire('@vue/compiler-sfc');
const { baseParse } = consumerRequire('@vue/compiler-dom');
const installedIcons = await import(pathToFileURL(consumerRequire.resolve('@dialpad/dialtone-icons/vue')).href);
const metadata = JSON.parse(readFileSync(consumerRequire.resolve('@dialpad/dialtone/vue3/component-documentation.json')));
const lintRequire = createRequire(resolve(root, 'package.json'));
const { ESLint } = lintRequire('eslint');
const vueParser = createRequire(lintRequire.resolve('eslint-plugin-vue'))('vue-eslint-parser');
const plugin = lintRequire('./packages/eslint-plugin-dialtone');
const eslint = new ESLint({ overrideConfigFile: true, ignore: false, overrideConfig: [{ files: ['**/*.vue'], languageOptions: { parser: vueParser }, plugins: { dialtone: plugin }, rules: Object.fromEntries(Object.keys(plugin.rules).filter(name => name.startsWith('deprecated-')).map(name => [`dialtone/${name}`, 'error'])) }] });

const reports = [];
for (const record of selected) {
  const { id } = record;
  const files = deliveredFiles.get(id);
  assert.match(id, /^examples\/(?:[a-z0-9-]+|presets\/Dt[A-Za-z0-9]+\/[^/]+)$/);
  if (record.example.representation === 'static-html') {
    const classes = assertStaticHtml(files['example.html']);
    assert.equal(record.example.profile.dependencies['@dialpad/dialtone'], pkg.dependencies['@dialpad/dialtone']);
    const cssPath = consumerRequire.resolve('@dialpad/dialtone/css');
    const css = readFileSync(cssPath, 'utf8');
    const postcss = createRequire(consumerRequire.resolve('vite'))('postcss');
    const selectors = [];
    const subjectRules = [];
    postcss.parse(css).walkRules(rule => {
      selectors.push(...rule.selectors);
      if (record.example.utilities.some(name => rule.selectors.includes(`.${name}`))) subjectRules.push(rule);
    });
    const missingClasses = classes.filter(name => {
      const escaped = name.replace(/[^a-zA-Z0-9_-]/g, character => `\\${character}`);
      return !selectors.includes(`.${escaped}`);
    });
    for (const subject of record.example.utilities) {
      assert.ok(classes.includes(subject), `Selected utility ${subject} absent from HTML`);
      assert.ok(!missingClasses.includes(subject), `Selected utility ${subject} absent from CSS`);
    }
    assert.ok(subjectRules.some(rule => rule.nodes.some(node => node.prop === 'overflow-wrap' && node.value === 'normal')), 'Selected word-wrap declaration differs');
    reports.push({ id, payloadHash: record.example.validation.payloadHash, consumerBuild: 'not-applicable', api: 'not-applicable', css: missingClasses.length ? 'partial' : 'passed', missingClasses, cssHash: sha256(readFileSync(cssPath)), checked: classes.filter(name => !missingClasses.includes(name)) });
    continue;
  }
  assert.deepEqual(consumerTuple(JSON.parse(files['package.json'])), consumerTuple(pkg), `${id} runtime/tooling tuple differs from installed consumer manifest`);
  const exampleDir = resolve(consumer, ...id.split('/'));
  mkdirSync(exampleDir, { recursive: true });
  for (const [name, content] of Object.entries(files)) writeFileSync(resolve(exampleDir, name), content);
  const sfc = parse(files['App.vue']);
  assert.deepEqual(sfc.errors, []);
  const ast = baseParse(sfc.descriptor.template.content);
  assertTemplateBindings(sfc.descriptor.template.content, sfc.descriptor.scriptSetup?.content ?? '');
  const checked = checkTemplateApi(ast, metadata, record.example.directives, installedIcons);
  const lint = await eslint.lintFiles([resolve(exampleDir, 'App.vue')]);
  const lintErrors = lint.reduce((total, result) => total + result.errorCount + result.warningCount, 0);
  assert.equal(lintErrors, 0, JSON.stringify(lint));
  const build = run('npm', ['run', 'build'], exampleDir);
  reports.push({ id, payloadHash: record.example.validation.payloadHash, consumerBuild: 'built', api: 'passed', checked: [...new Set(checked)], build });
}
const primary = resolve(consumer, 'node_modules/@dialpad/dialtone');
const artifact = await fingerprintArtifact(PROFILE_ID, primary, ['dist/vue3/component-documentation.json']);
const lock = readFileSync(resolve(consumer, 'package-lock.json'));
const installed = JSON.parse(lock).packages;
const profile = getProfile(PROFILE_ID);
for (const [name, version] of Object.entries(profile.dependencies)) assert.equal(installed[`node_modules/${name}`].version, version);
assert.equal(installed['node_modules/@dialpad/dialtone'].integrity, profile.artifacts['@dialpad/dialtone'].integrity);
artifact.integrity = installed['node_modules/@dialpad/dialtone'].integrity;
const report = { fixture, profile: PROFILE_ID, artifact, verification: selected.some(record => record.example.representation === 'vue-app') ? 'built' : 'lookup-data-only', node: process.version, tooling: pkg.devDependencies, consumer: consumerTuple(pkg), verifiedOn: new Date().toISOString().slice(0, 10), lockHash: sha256(lock), reports };
writeFileSync(resolve(destination, 'example-consumer-report.json'), JSON.stringify(report, null, 2));
if (values.promote) {
  const target = resolve(root, 'packages/dialtone-docs/src/generators/example-validation.json');
  const evidence = promoteExampleEvidence(report, docs, JSON.parse(readFileSync(target, 'utf8')));
  writeFileSync(target + '.tmp', JSON.stringify(evidence, null, 2) + '\n');
  renameSync(target + '.tmp', target);
}
console.log(JSON.stringify(report, null, 2));
