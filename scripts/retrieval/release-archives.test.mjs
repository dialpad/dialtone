import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { archiveIntegrity, assertAdaptersUnpublished, fixtureOverrides, publishArchive, registryIntegrity, smokeSample, verifyPublication } from './release-archives.mjs';

const directory = mkdtempSync(join(tmpdir(), 'release-archives-'));
const file = join(directory, 'dialtone-mcp-server-1.13.0.tgz');
writeFileSync(file, 'qualified bytes');
const qualified = archiveIntegrity(file);
const receipt = { channel: 'latest', archives: { 'dialtone-mcp-server': { name: '@dialpad/dialtone-mcp-server', version: '1.13.0', file, integrity: qualified, origin: 'candidate' } } };
const notFound = Object.assign(new Error('404'), { stderr: 'npm error code E404\nnpm error 404 Not Found' });

/** Fake npm: `published` maps registry -> integrity (or a function of the attempt); `tags` are explicit. */
function npm(published, calls = []) {
  let attempt = 0;
  return (args) => {
    calls.push(args);
    const registry = args.find(arg => arg.startsWith('--registry=')).slice('--registry='.length);
    if (args[0] === 'publish') { published[registry] = qualified; published.tags = { ...published.tags, [args[3]]: '1.13.0' }; return ''; }
    if (args[0] === 'dist-tag') { published.tags = { ...published.tags, [args[3]]: args[2].split('@').at(-1) }; return ''; }
    if (args[0] === 'view' && args.includes('dist-tags')) return JSON.stringify(published.tags ?? {});
    const value = typeof published[registry] === 'function' ? published[registry](attempt++) : published[registry];
    if (value instanceof Error) throw value;
    if (!value) throw notFound;
    return JSON.stringify(value);
  };
}

test('publishes a missing version and skips one already published with the qualified bytes', () => {
  const calls = [];
  const registries = {};
  assert.equal(publishArchive({ receipt, key: 'dialtone-mcp-server', registry: 'https://registry.npmjs.org', tag: 'latest', npm: npm(registries, calls) }), 'publish');
  assert.deepEqual(calls.at(-1), ['publish', file, '--tag', 'latest', '--ignore-scripts', '--registry=https://registry.npmjs.org', '--@dialpad:registry=https://registry.npmjs.org']);
  assert.equal(publishArchive({ receipt, key: 'dialtone-mcp-server', registry: 'https://registry.npmjs.org', tag: 'latest', npm: npm(registries, calls) }), 'skip');
});

test('a retry that skips matching bytes leaves channel tags to the original publication', () => {
  const calls = [];
  const registries = { 'https://registry.npmjs.org': qualified, tags: { latest: '1.14.0' } };
  assert.equal(publishArchive({ receipt, key: 'dialtone-mcp-server', registry: 'https://registry.npmjs.org', tag: 'latest', npm: npm(registries, calls) }), 'skip');
  assert.deepEqual(registries.tags, { latest: '1.14.0' });
  assert.ok(!calls.some(args => ['publish', 'dist-tag'].includes(args[0])));
});

test('never republishes different bytes at an existing version', () => {
  assert.throws(() => publishArchive({ receipt, key: 'dialtone-mcp-server', registry: 'https://registry.npmjs.org', tag: 'latest', npm: npm({ 'https://registry.npmjs.org': 'sha512-other' }) }), /immutable/);
});

test('rejects a stale or altered qualified archive before contacting a registry', () => {
  const altered = structuredClone(receipt);
  altered.archives['dialtone-mcp-server'].integrity = 'sha512-stale';
  const calls = [];
  assert.throws(() => publishArchive({ receipt: altered, key: 'dialtone-mcp-server', registry: 'https://registry.npmjs.org', tag: 'latest', npm: npm({}, calls) }), /does not match its qualification receipt/);
  assert.equal(calls.length, 0);
});

test('treats registry errors other than not-found as failures', () => {
  assert.equal(registryIntegrity('@dialpad/x', '1.0.0', 'https://registry.npmjs.org', npm({})), null);
  assert.throws(() => registryIntegrity('@dialpad/x', '1.0.0', 'https://registry.npmjs.org', npm({ 'https://registry.npmjs.org': new Error('E401 unauthorized') })), /E401/);
});

test('release verification waits a bounded time and reports a missing second registry as incomplete', () => {
  const registries = ['https://registry.npmjs.org', 'https://npm.pkg.github.com'];
  const eventually = { 'https://registry.npmjs.org': attempt => attempt < 2 ? null : qualified, 'https://npm.pkg.github.com': qualified, tags: { latest: '1.13.0' } };
  assert.deepEqual(verifyPublication({ receipt, keys: ['dialtone-mcp-server'], registries, tag: 'latest', attempts: 4, wait: () => {}, npm: npm(eventually) }).map(result => result.integrity), [qualified, qualified]);
  assert.throws(() => verifyPublication({ receipt, keys: ['dialtone-mcp-server'], registries, tag: 'latest', attempts: 3, wait: () => {}, npm: npm({ 'https://registry.npmjs.org': qualified, tags: { latest: '1.13.0' } }) }), /Incomplete release.*npm\.pkg\.github\.com/s);
});

test('release verification fails when a registry holds different bytes at the qualified version', () => {
  const different = { 'https://registry.npmjs.org': 'sha512-other', tags: { latest: '1.13.0' } };
  assert.throws(() => verifyPublication({ receipt, keys: ['dialtone-mcp-server'], registries: ['https://registry.npmjs.org'], tag: 'latest', attempts: 1, wait: () => {}, npm: npm(different) }), /immutable/);
});

test('prerelease verification requires the channel tag and rejects promotion to latest', () => {
  const prerelease = { channel: 'next', archives: { 'dialtone-mcp-server': { ...receipt.archives['dialtone-mcp-server'], version: '1.13.0-next.1' } } };
  const registries = ['https://registry.npmjs.org'];
  const base = { 'https://registry.npmjs.org': qualified };
  const verify = tags => verifyPublication({ receipt: prerelease, keys: ['dialtone-mcp-server'], registries, tag: 'next', attempts: 1, wait: () => {}, npm: npm({ ...base, tags }) });
  assert.doesNotThrow(() => verify({ latest: '1.12.0', next: '1.13.0-next.1' }));
  assert.throws(() => verify({ latest: '1.13.0-next.1', next: '1.13.0-next.1' }), /promoted to latest/);
  assert.throws(() => verify({ latest: '1.12.0', next: '1.13.0-next.0' }), /Incomplete release.*tag next -> 1\.13\.0-next\.0/s);
});

test('a stable version selected on a prerelease branch is verified by bytes, not by the prerelease tag', () => {
  const beta = { ...receipt, channel: 'beta' };
  const results = verifyPublication({ receipt: beta, keys: ['dialtone-mcp-server'], registries: ['https://registry.npmjs.org'], tag: 'beta', attempts: 1, wait: () => {},
    npm: npm({ 'https://registry.npmjs.org': qualified, tags: { latest: '1.13.0', beta: '1.13.0-beta.2' } }) });
  assert.deepEqual(results.map(result => [result.tag, result.origin]), [['not-applicable', 'candidate']]);
});

test('a prerelease from another channel is rejected before publication and during verification', () => {
  for (const [version, tag] of [['2.0.0-alpha.1', 'beta'], ['2.0.0-beta.1', 'next'], ['2.0.0-next.1', 'alpha'], ['2.0.0-beta.1', 'latest']]) {
    const crossed = { channel: tag, archives: { 'dialtone-mcp-server': { ...receipt.archives['dialtone-mcp-server'], version } } };
    const calls = [];
    assert.throws(() => publishArchive({ receipt: crossed, key: 'dialtone-mcp-server', registry: 'https://registry.npmjs.org', tag, npm: npm({}, calls) }),
      new RegExp(`cannot be released on the ${tag} channel`));
    assert.equal(calls.length, 0);
    const registry = { 'https://registry.npmjs.org': qualified, tags: { latest: '1.0.0', [tag === 'latest' ? 'beta' : tag]: `2.0.0-${tag}.2` } };
    assert.throws(() => verifyPublication({ receipt: crossed, keys: ['dialtone-mcp-server'], registries: ['https://registry.npmjs.org'], tag, attempts: 1, wait: () => {}, npm: npm(registry) }),
      new RegExp(`cannot be released on the ${tag} channel`));
  }
});

const runtime = (version, origin, registry) => ({ version, file: `/run/${version}.tgz`, origin, ...(registry && { registry }) });
const runtimeArchives = (origin, registry, versions = {}) => ({
  dialtone: { name: '@dialpad/dialtone', ...runtime('10.13.0', origin, registry) },
  'dialtone-icons': { name: '@dialpad/dialtone-icons', ...runtime(versions.icons ?? '4.50.0', origin, registry) },
  'dialtone-emojis': { name: '@dialpad/dialtone-emojis', ...runtime('1.5.0', origin, registry) },
  'dialtone-tokens': { name: '@dialpad/dialtone-tokens', ...runtime(versions.tokens ?? '2.2.0', origin, registry) },
});
const pins = { '@dialpad/dialtone-icons': '4.50.0', '@dialpad/dialtone-emojis': '1.5.0', '@dialpad/dialtone-tokens': '2.2.0', '@dialpad/dialtone-mcp-server': '1.14.0' };
const bootstrapArchive = { name: '@dialpad/dialtone-mcp-server', version: '1.14.0', file: '/run/bootstrap.tgz' };
const overrideNames = options => fixtureOverrides({
  umbrellaPins: pins, bootstrap: bootstrapArchive, npmHas: () => true, ...options,
})
  .map(archive => archive.name).sort();

test('the consumer fixture receives every selected archive npm cannot serve, including GitHub-only recovery bytes', () => {
  const all = ['@dialpad/dialtone', '@dialpad/dialtone-emojis', '@dialpad/dialtone-icons', '@dialpad/dialtone-mcp-server', '@dialpad/dialtone-tokens'];
  const direct = { '@dialpad/dialtone': '10.13.0', '@dialpad/dialtone-icons': '4.50.0' };
  assert.deepEqual(overrideNames({ archives: runtimeArchives('candidate'), direct }), all);
  // A partial release published the runtime closure to GitHub Packages only; npm lacks the umbrella's adapter pin too.
  const github = runtimeArchives('registry', 'https://npm.pkg.github.com');
  assert.deepEqual(overrideNames({ archives: github, direct, npmHas: () => false }), all);
  assert.deepEqual(overrideNames({ archives: github, direct }), all.filter(name => name !== '@dialpad/dialtone-mcp-server'));
  assert.deepEqual(overrideNames({ archives: runtimeArchives('registry', 'https://registry.npmjs.org'), direct }), []);
});

test('a registry umbrella keeps its exact transitive pins in the consumer fixture', () => {
  const archives = runtimeArchives('registry', 'https://registry.npmjs.org');
  archives['dialtone-icons'] = { ...archives['dialtone-icons'], ...runtime('4.51.0', 'candidate') };
  archives['dialtone-tokens'] = { ...archives['dialtone-tokens'], ...runtime('2.3.0', 'candidate') };
  // The direct icons pin resolves to the candidate; the umbrella still pins tokens 2.2.0, which npm serves.
  assert.deepEqual(overrideNames({ archives, direct: { '@dialpad/dialtone': '10.13.0', '@dialpad/dialtone-icons': '4.51.0' } }), ['@dialpad/dialtone-icons']);
  assert.throws(() => fixtureOverrides({ archives: runtimeArchives('candidate'), umbrellaPins: pins, direct: {}, npmHas: () => true,
    bootstrap: { ...bootstrapArchive, version: '1.15.0' } }), /pins @dialpad\/dialtone-mcp-server 1\.14\.0/);
});

test('a new run stops before publication when a selected adapter version is already published', () => {
  const adapters = { 'dialtone-cli': { name: '@dialpad/dialtone-cli', version: '1.10.0' }, 'dialtone-mcp-server': { name: '@dialpad/dialtone-mcp-server', version: '1.13.0' } };
  const registries = ['https://registry.npmjs.org', 'https://npm.pkg.github.com'];
  const held = (name, version, registry) => name === '@dialpad/dialtone-mcp-server' && registry.includes('github') ? 'sha512-earlier' : null;
  assert.throws(() => assertAdaptersUnpublished({ keys: ['dialtone', 'dialtone-cli', 'dialtone-mcp-server'], adapters, registries, integrity: held }),
    /@dialpad\/dialtone-mcp-server@1\.13\.0 is already published on https:\/\/npm\.pkg\.github\.com.*Rerun/s);
  // An unselected adapter keeps its published version; a selected one not yet published proceeds.
  assert.doesNotThrow(() => assertAdaptersUnpublished({ keys: ['dialtone', 'dialtone-cli'], adapters, registries, integrity: held }));
});

test('verification polls every missing package and registry within one shared budget', () => {
  const waits = [];
  const registries = ['https://registry.npmjs.org', 'https://npm.pkg.github.com'];
  assert.throws(() => verifyPublication({ receipt, keys: ['dialtone-mcp-server'], registries, tag: 'latest', attempts: 3, wait: seconds => waits.push(seconds), npm: npm({}) }), /Incomplete release/);
  assert.equal(waits.length, 2);
});

test('smoke sampling is deterministic, bounded and keeps requested IDs', () => {
  const ids = Array.from({ length: 100 }, (_, index) => `examples/id-${String(index).padStart(3, '0')}`);
  const sample = smokeSample(ids, ['examples/id-099'], 10);
  assert.equal(sample.length, 11);
  assert.ok(sample.includes('examples/id-099'));
  assert.deepEqual(sample, smokeSample([...ids].reverse(), ['examples/id-099'], 10));
});

test('every registry command overrides the @dialpad scope registry, which otherwise wins over --registry', () => {
  const calls = [];
  const registries = {};
  publishArchive({ receipt, key: 'dialtone-mcp-server', registry: 'https://npm.pkg.github.com', tag: 'latest', npm: npm(registries, calls) });
  verifyPublication({ receipt, keys: ['dialtone-mcp-server'], registries: ['https://npm.pkg.github.com'], tag: 'latest', attempts: 1, wait: () => {}, npm: npm(registries, calls) });
  assert.ok(calls.length >= 4);
  for (const args of calls) assert.ok(args.includes('--@dialpad:registry=https://npm.pkg.github.com'), args.join(' '));
});
