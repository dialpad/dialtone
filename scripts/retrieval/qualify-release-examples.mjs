// Build, pack and qualify the lookup release closure once, in an isolated run directory.
// Order follows the byte dependencies: runtime archives -> examples for their exact versions and
// integrity -> consumer qualification -> final CLI/MCP bundles -> installed packed delivery probe.
// --mode candidate packs every package from source (PR checks). --mode release reuses the registry
// archive for any version a registry already holds (tool-only releases and retries) and packs the
// rest. Repeat --registry to also look beyond npm (the publish workflow adds GitHub Packages), and
// --package for each package selected for publication.
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { sha256 } from './fixtures.mjs';
import { MANIFEST_ENV, releaseProfile } from './release-profile.mjs';
import { ADAPTER_PACKAGES as ADAPTERS, NPM_REGISTRY, RUNTIME_PACKAGES as RUNTIME, archiveIntegrity, archiveManifest, assertAdaptersUnpublished, fixtureOverrides, installDelivery, registryArgs, registryIntegrity } from './release-archives.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const { values } = parseArgs({ options: {
  mode: { type: 'string', default: 'candidate' }, out: { type: 'string' }, channel: { type: 'string' },
  'probe-id': { type: 'string', multiple: true }, registry: { type: 'string', multiple: true },
  package: { type: 'string', multiple: true },
} });
assert.ok(['candidate', 'release'].includes(values.mode), '--mode must be candidate or release');
assert.ok(values.out, '--out <run directory> is required');
const out = resolve(values.out);
assert.ok(!existsSync(out) || !readdirSync(out).length, `--out must be a new or empty directory: ${out}`);
const registries = values.registry ?? [NPM_REGISTRY];
const manifestOf = dir => JSON.parse(readFileSync(resolve(root, dir, 'package.json'), 'utf8'));
const workspaceDeps = Object.entries(manifestOf('.').dependencies).filter(([, spec]) => spec.startsWith('workspace:')).map(([name]) => name);
const covered = Object.values({ ...RUNTIME, ...ADAPTERS }).map(dir => manifestOf(dir).name);
for (const name of workspaceDeps) assert.ok(covered.includes(name), `Umbrella workspace dependency ${name} is not in the qualified closure`);
// --package names the publish selection: fail before any work if a selected adapter was already published.
if (values.mode === 'release') assertAdaptersUnpublished({ keys: values.package ?? [], registries,
  adapters: Object.fromEntries(Object.entries(ADAPTERS).map(([key, dir]) => [key, manifestOf(dir)])) });

const timings = {};
async function step(name, action) {
  const start = Date.now();
  console.info(`[qualify] ${name}`);
  try { return await action(); } finally { timings[name] = Math.round((Date.now() - start) / 1000); }
}
const sh = (file, args, { cwd = root, env = {} } = {}) => execFileSync(file, args,
  { cwd, env: { ...process.env, ...env }, stdio: ['ignore', 'inherit', 'inherit'], timeout: 3600000 });
const capture = (file, args, cwd = root) => execFileSync(file, args, { cwd, encoding: 'utf8' }).trim();
function packWorkspace(dir, destination) {
  mkdirSync(destination, { recursive: true });
  const before = new Set(readdirSync(destination));
  sh('pnpm', ['pack', '--pack-destination', destination], { cwd: resolve(root, dir) });
  const [file] = readdirSync(destination).filter(name => name.endsWith('.tgz') && !before.has(name));
  assert.ok(file, `pnpm pack produced no archive for ${dir}`);
  return resolve(destination, file);
}
function packRegistry(name, version, destination, registry) {
  mkdirSync(destination, { recursive: true });
  const file = capture('npm', ['pack', `${name}@${version}`, '--pack-destination', destination, ...registryArgs(registry), '--silent']).split('\n').at(-1);
  return resolve(destination, file);
}
function packSource(key, dir, destination = resolve(out, 'archives')) {
  const { name, version } = manifestOf(dir);
  const file = packWorkspace(dir, destination);
  const packed = archiveManifest(file);
  assert.equal(packed.version, version, `${file} version differs from ${dir}/package.json`);
  assert.ok(!JSON.stringify(packed.dependencies ?? {}).includes('workspace:'), `${name} archive kept workspace: specifiers`);
  return { key, name, version, file, integrity: archiveIntegrity(file), origin: 'candidate' };
}
/** Release mode never repacks a published version: immutable registry bytes are the archive. */
function published(key, dir) {
  if (values.mode !== 'release') return null;
  const { name, version } = manifestOf(dir);
  for (const registry of registries) {
    const integrity = registryIntegrity(name, version, registry);
    if (!integrity) continue;
    const file = packRegistry(name, version, resolve(out, 'registry'), registry);
    assert.equal(archiveIntegrity(file), integrity, `${name}@${version} registry download differs from its published integrity`);
    return { key, name, version, file, integrity, origin: 'registry', registry };
  }
  return null;
}
const writeJson = (file, value) => { writeFileSync(file, JSON.stringify(value, null, 2) + '\n'); return file; };
function copyDocs(destination) {
  mkdirSync(destination, { recursive: true });
  for (const name of ['public-docs.json', 'preset-example-coverage.json', 'example-coverage.json'])
    copyFileSync(resolve(root, 'packages/dialtone-docs/dist', name), resolve(destination, name));
  return resolve(destination, 'public-docs.json');
}
const buildAdapters = env => sh('pnpm', ['nx', 'run-many', '-t', 'build', '-p', 'dialtone-cli', 'dialtone-mcp-server', '--output-style=static'], { env });

mkdirSync(out, { recursive: true });
const sourceCommit = capture('git', ['rev-parse', 'HEAD']);
const channel = values.channel ?? (values.mode === 'release' ? 'latest' : 'candidate');
const archives = {};
let runtimeBuilt = false;
await step('runtime archives', () => {
  for (const [key, dir] of Object.entries(RUNTIME)) {
    archives[key] = published(key, dir);
    if (archives[key]) continue;
    if (!runtimeBuilt) sh('pnpm', ['nx', 'run', 'dialtone:build', '--output-style=static']);
    runtimeBuilt = true;
    archives[key] = packSource(key, dir);
  }
});
const umbrella = archives.dialtone;
const profile = releaseProfile({ '@dialpad/dialtone': umbrella.version, '@dialpad/dialtone-icons': archives['dialtone-icons'].version }, umbrella.integrity);
const base = { schemaVersion: 1, mode: values.mode, channel, sourceCommit, profile };
const unqualified = writeJson(resolve(out, 'manifest-unqualified.json'), base);

// Bootstrap MCP only satisfies the candidate umbrella's exact dependency inside the consumer fixture.
const bootstrap = await step('generate examples and bootstrap adapters', () => {
  buildAdapters({ [MANIFEST_ENV]: unqualified });
  copyDocs(resolve(out, 'docs-unqualified'));
  const archive = packSource('dialtone-mcp-server', ADAPTERS['dialtone-mcp-server'], resolve(out, 'bootstrap'));
  return { ...archive, purpose: 'consumer dependency only; not delivery proof' };
});
const umbrellaPins = archiveManifest(umbrella.file).dependencies ?? {};
const overrides = fixtureOverrides({ archives, umbrellaPins, direct: profile.dependencies, bootstrap });
const evidenceFile = resolve(out, 'evidence.json');
await step('qualify examples', () => sh(process.execPath, [resolve(root, 'scripts/retrieval/validate-examples.mjs'), resolve(out, 'consumer'),
  '--docs', resolve(out, 'docs-unqualified/public-docs.json'), '--evidence-out', evidenceFile,
  ...overrides.flatMap(archive => ['--archive', `${archive.name}=${archive.file}`])], { env: { [MANIFEST_ENV]: unqualified } }));

const manifest = writeJson(resolve(out, 'manifest.json'), { ...base, evidence: JSON.parse(readFileSync(evidenceFile, 'utf8')) });
// Both adapters are always built from this commit for the delivery probe. An adapter version npm
// already holds is not republished: its registry bytes stay the publication archive.
const built = {};
const docsFile = await step('final adapter bundles', () => {
  buildAdapters({ [MANIFEST_ENV]: manifest });
  const file = copyDocs(resolve(out, 'docs'));
  for (const [key, dir] of Object.entries(ADAPTERS)) {
    built[key] = packSource(key, dir);
    archives[key] = published(key, dir) ?? built[key];
  }
  return file;
});
const records = JSON.parse(readFileSync(docsFile, 'utf8')).filter(record => record.example);
const unproven = records.filter(record => record.example.representation === 'vue-app'
  ? !(record.example.validation.consumerBuild === 'built' && record.example.validation.api === 'passed')
  : !['passed', 'partial'].includes(record.example.validation.css));
assert.deepEqual(unproven.map(record => record.id), [], 'Delivered examples without machine proof for the selected archives');

await step('installed packed delivery probe', () => {
  const delivery = resolve(out, 'delivery');
  installDelivery(delivery, Object.fromEntries(Object.values(built).map(archive => [archive.name, `file:${archive.file}`])));
  sh(process.execPath, [resolve(root, 'scripts/retrieval/probe-packed-examples.mjs'), delivery, '--docs', docsFile,
    ...(values['probe-id'] ?? []).flatMap(id => ['--id', id])]);
});

const local = file => relative(out, file);
const localFiles = entries => Object.fromEntries(Object.entries(entries)
  .map(([key, archive]) => [key, { ...archive, file: local(archive.file) }]));
const ids = records.map(record => record.id);
const receipt = {
  schemaVersion: 1, mode: values.mode, channel, sourceCommit,
  manifest: { file: local(manifest), sha256: sha256(readFileSync(manifest)) },
  documentation: { file: local(docsFile), sha256: sha256(readFileSync(docsFile)) },
  archives: localFiles(archives),
  built: localFiles(built),
  bootstrap: { ...bootstrap, file: local(bootstrap.file) },
  examples: { delivered: ids, qualified: records.length, deliveredIdsSha256: sha256(JSON.stringify(ids)) },
  timings,
};
writeJson(resolve(out, 'receipt.json'), receipt);
console.info(JSON.stringify({ receipt: resolve(out, 'receipt.json'), examples: records.length, timings }));
