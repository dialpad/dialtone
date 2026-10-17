// Opt-in real consumer validation. Reuses the C5 materializer; never publishes packages.
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { createConsumerFixture, fingerprintArtifact, sha256 } from './fixtures.mjs';
import { getProfile } from './profiles.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const run = (file, args, cwd) => execFileSync(file, args, { cwd, stdio: 'pipe', encoding: 'utf8', timeout: 240000 });
const destination = resolve(process.argv[2] ?? '.temp/example-consumers');
const docs = JSON.parse(readFileSync(resolve(root, 'packages/dialtone-docs/dist/public-docs.json')));
const require = createRequire(resolve(root, 'apps/dialtone-documentation/package.json'));
const MarkdownIt = require('markdown-it');
const markdown = new MarkdownIt();
const selected = docs.filter(record => record.example);
const filenames = ['App.vue', 'index.html', 'main.js', 'package.json', 'vite.config.js'];
function extractFiles(record) {
  const tokens = markdown.parse(record.content, {});
  const files = {};
  for (let index = 0; index < tokens.length; index++) {
    if (tokens[index].type !== 'fence') continue;
    const name = tokens[index - 2]?.content;
    assert.ok(filenames.includes(name), `Unexpected file ${name}`);
    files[name] = tokens[index].content;
  }
  assert.deepEqual(Object.keys(files).sort(), filenames);
  const deliveredHash = sha256(JSON.stringify({
    files, dependencies: record.example.profile.dependencies, sourceHash: record.example.source.hash,
  }));
  assert.equal(deliveredHash, record.example.validation.payloadHash);
  return files;
}
const fixture = await createConsumerFixture(destination, 'dt10-pinned');
const consumer = fixture.dependencyRoot;
const pkg = JSON.parse(extractFiles(selected[0])['package.json']);
writeFileSync(resolve(consumer, 'package.json'), JSON.stringify(pkg, null, 2));
run('npm', ['install', '--ignore-scripts', '--registry=https://registry.npmjs.org', '--@dialpad:registry=https://registry.npmjs.org', '--no-audit', '--no-fund', '--cache', resolve(destination, 'npm-cache')], consumer);
const consumerRequire = createRequire(resolve(consumer, 'package.json'));
const { parse } = consumerRequire('@vue/compiler-sfc');
const { baseParse, NodeTypes } = consumerRequire('@vue/compiler-dom');
const metadata = JSON.parse(readFileSync(consumerRequire.resolve('@dialpad/dialtone/vue3/component-documentation.json')));
const lintRequire = createRequire(resolve(root, 'package.json'));
const { ESLint } = lintRequire('eslint');
const vueParser = createRequire(lintRequire.resolve('eslint-plugin-vue'))('vue-eslint-parser');
const plugin = lintRequire('./packages/eslint-plugin-dialtone');
const reports = [];
for (const id of ['examples/button-default', 'examples/button-disabled-tooltip']) {
  const record = docs.find(record => record.id === id);
  assert.ok(record?.example, id);
  const files = extractFiles(record);
  const exampleDir = resolve(consumer, id.split('/')[1]);
  mkdirSync(exampleDir);
  for (const [name, content] of Object.entries(files)) writeFileSync(resolve(exampleDir, name), content);
  const sfc = parse(files['App.vue']);
  assert.deepEqual(sfc.errors, []);
  const ast = baseParse(sfc.descriptor.template.content);
  const checked = [];
  function visit(node) {
    if (node.type === NodeTypes.ELEMENT && node.tag.startsWith('dt-')) {
      const name = node.tag.split('-').map(part => part[0].toUpperCase() + part.slice(1)).join('');
      const component = metadata.find(component => component.displayName === name);
      assert.ok(component, name);
      assert.ok(!component.tags?.deprecated && !component.metadata?.deprecated, `${name} deprecated`);
      for (const attribute of node.props) {
        const propName = attribute.type === NodeTypes.ATTRIBUTE ? attribute.name : attribute.name === 'bind' ? attribute.arg?.content : null;
        if (attribute.type === NodeTypes.DIRECTIVE && !['bind', 'dt-tooltip'].includes(attribute.name)) throw new Error(`Unhandled directive/event ${attribute.name}`);
        if (!propName || ['class', 'tabindex'].includes(propName) || propName.startsWith('aria-')) continue;
        const prop = component.props?.find(prop => prop.name === propName);
        assert.ok(prop, `${name}.${propName}`);
        assert.ok(!prop.tags?.deprecated, `${name}.${propName} deprecated`);
        if (attribute.type === NodeTypes.ATTRIBUTE && attribute.value && prop.values?.length) assert.ok(prop.values.includes(attribute.value.content), `${name}.${propName}=${attribute.value.content}`);
        if (propName === 'direction' && attribute.type === NodeTypes.DIRECTIVE) {
          assert.equal(attribute.exp.content, '{ \'default\': \'column\', \'md\': \'row\' }');
          for (const value of ['column', 'row']) assert.ok(prop.values.includes(value));
        }
        checked.push(`${name}.${propName}`);
      }
      if (node.children.some(child => child.type === NodeTypes.ELEMENT || (child.type === NodeTypes.TEXT && child.content.trim()))) assert.ok(component.slots?.some(slot => slot.name === 'default'), `${name} default slot`);
    }
    for (const child of node.children ?? []) visit(child);
  }
  visit(ast);
  const eslint = new ESLint({ overrideConfigFile: true, ignore: false, overrideConfig: [{ files: ['**/*.vue'], languageOptions: { parser: vueParser }, plugins: { dialtone: plugin }, rules: Object.fromEntries(Object.keys(plugin.rules).filter(name => name.startsWith('deprecated-')).map(name => [`dialtone/${name}`, 'error'])) }] });
  const lint = await eslint.lintFiles([resolve(exampleDir, 'App.vue')]);
  const lintErrors = lint.reduce((total, result) => total + result.errorCount + result.warningCount, 0);
  assert.equal(lintErrors, 0, JSON.stringify(lint));
  const build = run('npm', ['run', 'build'], exampleDir);
  reports.push({ id, payloadHash: record.example.validation.payloadHash, consumerBuild: 'built', api: 'passed', checked: [...new Set(checked)], build });
}
const primary = resolve(consumer, 'node_modules/@dialpad/dialtone');
const artifact = await fingerprintArtifact('dt10-pinned', primary, ['dist/vue3/component-documentation.json']);
const lock = readFileSync(resolve(consumer, 'package-lock.json'));
const installed = JSON.parse(lock).packages;
const profile = getProfile('dt10-pinned');
for (const [name, version] of Object.entries(profile.dependencies)) assert.equal(installed[`node_modules/${name}`].version, version);
assert.equal(installed['node_modules/@dialpad/dialtone'].integrity, profile.artifacts['@dialpad/dialtone'].integrity);
const report = { fixture, artifact, verification: 'built', node: process.version, tooling: pkg.devDependencies, lockHash: sha256(lock), reports };
writeFileSync(resolve(destination, 'example-consumer-report.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
