// Publish qualified lookup archives and confirm the release delivered exactly those bytes.
// Publication stays non-atomic: each package/registry publishes independently, retries skip
// versions already holding the qualified bytes, and a different archive at an existing version fails.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
export const NPM_REGISTRY = 'https://registry.npmjs.org';
export const GITHUB_REGISTRY = 'https://npm.pkg.github.com';
// Publish-matrix keys whose bytes must be the qualified archives: the umbrella's runtime closure
// and both lookup adapters. Other packages keep their existing build-and-publish target.
export const RUNTIME_PACKAGES = { dialtone: '.', 'dialtone-icons': 'packages/dialtone-icons', 'dialtone-emojis': 'packages/dialtone-emojis', 'dialtone-tokens': 'packages/dialtone-tokens' };
export const ADAPTER_PACKAGES = { 'dialtone-mcp-server': 'packages/dialtone-mcp-server', 'dialtone-cli': 'packages/dialtone-cli' };
export const qualifiedPackages = packages => packages.filter(key => key in RUNTIME_PACKAGES || key in ADAPTER_PACKAGES);
const runNpm = args => execFileSync('npm', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 120000 });

// A configured @dialpad scope registry takes precedence over --registry, so name both.
export const registryArgs = registry => [`--registry=${registry}`, `--@dialpad:registry=${registry}`];

export const archiveIntegrity = file => `sha512-${createHash('sha512').update(readFileSync(file)).digest('base64')}`;
export const archiveManifest = file => JSON.parse(execFileSync('tar', ['-xOzf', file, 'package/package.json'], { encoding: 'utf8' }));

/** Published integrity, or null when the registry reports the version as absent. */
export function registryIntegrity(name, version, registry, npm = runNpm) {
  try {
    return JSON.parse(npm(['view', `${name}@${version}`, 'dist.integrity', '--json', ...registryArgs(registry)]) || 'null');
  } catch (error) {
    if (/\bE404\b|404 Not Found/.test(`${error.stderr ?? ''}${error.stdout ?? ''}`)) return null;
    throw error;
  }
}

const distTags = (name, registry, npm) => JSON.parse(npm(['view', name, 'dist-tags', '--json', ...registryArgs(registry)]) || '{}');
// semantic-release prerelease versions carry their channel (10.0.0-next.24); stable versions belong to latest.
const versionChannel = version => version.includes('-') ? version.split('-')[1].split('.')[0] : 'latest';
// An unchanged stable version may ride a prerelease branch (verified by bytes); another channel's prerelease may not.
function assertChannel({ name, version }, tag) {
  const channel = versionChannel(version);
  if (channel !== 'latest' && channel !== tag)
    throw new Error(`${name}@${version} is a ${channel} prerelease and cannot be released on the ${tag} channel`);
}

export function publishDecision({ name, version, integrity }, published) {
  if (!published) return 'publish';
  if (published === integrity) return 'skip';
  throw new Error(`${name}@${version} is already published as ${published}, not the qualified archive ${integrity}. Published versions are immutable; release a new version instead of republishing.`);
}

function qualifiedArchive(receipt, key) {
  const archive = receipt.archives?.[key];
  assert.ok(archive, `No qualified archive for ${key}`);
  const actual = archiveIntegrity(archive.file);
  assert.equal(actual, archive.integrity, `${archive.file} does not match its qualification receipt`);
  return archive;
}

/** Publish one package to one registry from its qualified archive (no rebuild). As before,
 * only publication sets the channel tag; a skipped version's tags are never moved. */
export function publishArchive({ receipt, key, registry, tag, npm = runNpm }) {
  const archive = qualifiedArchive(receipt, key);
  assertChannel(archive, tag);
  const published = registryIntegrity(archive.name, archive.version, registry, npm);
  const decision = publishDecision(archive, published);
  if (decision === 'publish')
    npm(['publish', archive.file, '--tag', tag, '--ignore-scripts', ...registryArgs(registry)]);
  return decision;
}

/** Bounded confirmation that every selected package/registry holds the qualified bytes and, for a
 * version of this channel, its tag. All pending pairs are polled in rounds sharing one budget. */
export function verifyPublication({ receipt, keys, registries, tag, attempts = 10, wait = seconds => execFileSync('sleep', [String(seconds)]), interval = 30, npm = runNpm }) {
  const pending = keys.flatMap(key => {
    assert.ok(receipt.archives[key], `No qualified archive for ${key}`);
    assertChannel(receipt.archives[key], tag);
    return registries.map(registry => ({ key, archive: receipt.archives[key], registry, state: 'not published' }));
  });
  const results = [];
  for (let attempt = 0; pending.length && attempt < attempts; attempt++) {
    if (attempt) wait(interval);
    for (const entry of [...pending]) {
      const { key, archive, registry } = entry;
      const published = registryIntegrity(archive.name, archive.version, registry, npm);
      if (!published) continue;
      publishDecision(archive, published);
      const tags = distTags(archive.name, registry, npm);
      const channel = versionChannel(archive.version);
      if (channel === tag && tags[tag] !== archive.version) {
        entry.state = `tag ${tag} -> ${tags[tag]}`;
        continue;
      }
      if (channel !== 'latest' && tags.latest === archive.version)
        throw new Error(`${archive.name}@${archive.version} was promoted to latest by a ${tag} release`);
      results.push({ key, name: archive.name, version: archive.version, registry, integrity: published,
        tag: channel === tag ? tag : 'not-applicable', origin: archive.origin });
      pending.splice(pending.indexOf(entry), 1);
    }
  }
  if (pending.length) {
    const missing = pending.map(({ archive, registry, state }) => `${archive.name}@${archive.version} on ${registry} (${state})`);
    throw new Error(`Incomplete release: ${missing.join('; ')}. Already-published packages remain; rerun the failed jobs to finish missing work.`);
  }
  return results;
}

/** Archives the isolated consumer fixture must supply because npm cannot serve the selected bytes:
 * candidate packs, and registry archives npm does not hold yet (a partial release can publish to
 * GitHub Packages only). A package resolves at its direct example pin, else at the umbrella's exact
 * pin, so a registry umbrella is never paired with versions it does not declare. The bootstrap
 * adapter archive supplies the umbrella's pinned MCP version when that is unpublished on npm. */
const npmServes = (name, version) => registryIntegrity(name, version, NPM_REGISTRY) !== null;
export function fixtureOverrides({ archives, umbrellaPins, direct, bootstrap, npmHas = npmServes }) {
  const umbrella = archives.dialtone;
  const servedByNpm = archive => archive.origin === 'registry' && archive.registry === NPM_REGISTRY;
  const overrides = Object.values(archives).filter(archive => !servedByNpm(archive)
    && (archive === umbrella || (direct[archive.name] ?? umbrellaPins[archive.name]) === archive.version));
  const adapterPin = umbrellaPins[bootstrap.name];
  if (adapterPin && (umbrella.origin === 'candidate' || !npmHas(bootstrap.name, adapterPin))) {
    assert.equal(bootstrap.version, adapterPin, `The umbrella pins ${bootstrap.name} ${adapterPin}, which npm does not serve and this commit does not build`);
    overrides.push(bootstrap);
  }
  return overrides;
}

/** A selected adapter version already on a registry carries an earlier run's dataset, so this run's
 * verification can never pass. Stop before publishing anything else; the earlier run's failed jobs
 * can still finish with its own qualified archives. */
export function assertAdaptersUnpublished({ keys, adapters, registries, integrity = registryIntegrity }) {
  for (const key of keys.filter(key => key in adapters))
    for (const registry of registries) {
      const { name, version } = adapters[key];
      if (integrity(name, version, registry))
        throw new Error(`${name}@${version} is already published on ${registry}, from an earlier run whose dataset this run cannot reproduce. Rerun that run's failed jobs, or release a new version.`);
    }
}

/** Install lookup adapters into a private delivery directory from npm (or file: archives). */
export function installDelivery(dir, dependencies, { attempts = 1 } = {}) {
  mkdirSync(dir, { recursive: true });
  writeFileSync(resolve(dir, 'package.json'), JSON.stringify({ private: true, dependencies }, null, 2) + '\n');
  for (let attempt = 1; ; attempt++) {
    try {
      return execFileSync('npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund', ...registryArgs(NPM_REGISTRY)], { cwd: dir, stdio: 'inherit', timeout: 3600000 });
    } catch (error) {
      if (attempt >= attempts) throw error;
      execFileSync('sleep', ['30']);
    }
  }
}

/** Deterministic bounded sample for post-publication smoke checks, plus explicitly requested IDs. */
export function smokeSample(ids, required = [], size = 12) {
  const sorted = [...new Set(ids)].sort();
  const stride = Math.max(1, Math.ceil(sorted.length / size));
  return [...new Set([...sorted.filter((_, index) => index % stride === 0).slice(0, size), ...required])];
}

const node = (script, args, env = {}) => execFileSync(process.execPath, [resolve(root, script), ...args],
  { cwd: root, stdio: 'inherit', env: { ...process.env, ...env }, timeout: 3600000 });

async function main() {
  const [command] = process.argv.slice(2);
  if (command === 'select') {
    process.stdout.write(JSON.stringify(qualifiedPackages(JSON.parse(process.env.PACKAGES ?? '[]'))) + '\n');
    return;
  }
  const { values } = parseArgs({ args: process.argv.slice(3), options: {
    receipt: { type: 'string' }, package: { type: 'string', multiple: true }, registry: { type: 'string', multiple: true },
    tag: { type: 'string' }, out: { type: 'string' }, id: { type: 'string', multiple: true }, attempts: { type: 'string' },
  } });
  const receiptPath = resolve(values.receipt);
  const receipt = JSON.parse(readFileSync(receiptPath, 'utf8'));
  const base = dirname(receiptPath);
  for (const archive of [...Object.values(receipt.archives), ...Object.values(receipt.built ?? {})])
    archive.file = resolve(base, archive.file);
  const tag = values.tag ?? receipt.channel;
  if (command === 'publish') {
    for (const key of values.package)
      for (const registry of values.registry)
        console.info(`${key} ${registry}: ${publishArchive({ receipt, key, registry, tag })}`);
    return;
  }
  assert.equal(command, 'verify', 'Usage: release-archives.mjs select|publish|verify --receipt <file> --package <key> ...');
  const keys = values.package ?? Object.keys(receipt.archives);
  const registries = values.registry ?? [NPM_REGISTRY, GITHUB_REGISTRY];
  const out = resolve(values.out ?? resolve(base, 'release-verification'));
  mkdirSync(out, { recursive: true });
  const publication = verifyPublication({ receipt, keys, registries, tag, attempts: Number(values.attempts ?? 10) });
  // Installed lookup smoke: the registry adapters must deliver the qualified dataset.
  const delivery = resolve(out, 'delivery');
  // An adapter in this release installs from the registry, including one an earlier attempt
  // already published; an unchanged one uses this commit's build, since its older bytes
  // deliver older examples by design.
  const fromRegistry = Object.keys(ADAPTER_PACKAGES).filter(key => keys.includes(key));
  const adapters = Object.keys(ADAPTER_PACKAGES)
    .map(key => fromRegistry.includes(key) ? receipt.archives[key] : receipt.built[key]);
  // Registry metadata can be visible before every CDN edge serves the tarball: retry briefly.
  installDelivery(delivery, Object.fromEntries(adapters.map(archive =>
    [archive.name, fromRegistry.includes(archive.key) ? archive.version : `file:${archive.file}`])), { attempts: 3 });
  const lock = JSON.parse(readFileSync(resolve(delivery, 'package-lock.json'), 'utf8')).packages;
  for (const key of fromRegistry) assert.equal(lock[`node_modules/${receipt.archives[key].name}`].integrity, receipt.archives[key].integrity, `${key} installed bytes differ from the qualified archive`);
  const docs = resolve(base, receipt.documentation.file);
  const ids = smokeSample(receipt.examples.delivered, values.id ?? []);
  node('scripts/retrieval/probe-packed-examples.mjs', [delivery, '--docs', docs, ...ids.flatMap(id => ['--id', id])]);
  // Installed runtime smoke: the registry umbrella must match the profile the examples were qualified against.
  node('scripts/retrieval/validate-examples.mjs', [resolve(out, 'runtime'), '--docs', docs, ...ids.flatMap(id => ['--id', id])],
    { DIALTONE_EXAMPLE_RELEASE_MANIFEST: resolve(base, receipt.manifest.file) });
  const verification = { sourceCommit: receipt.sourceCommit, channel: tag, publication,
    registryAdapters: fromRegistry, smokeIds: ids, verifiedAt: new Date().toISOString() };
  writeFileSync(resolve(out, 'release-verification.json'), JSON.stringify(verification, null, 2));
  console.info(JSON.stringify({ verified: publication.length, smoke: ids.length, receipt: resolve(out, 'release-verification.json') }));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await main();
