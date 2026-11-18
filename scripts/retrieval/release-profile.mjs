// Selects the consumer profile that generated examples target.
// Default: the versions declared by the checked-in release manifests (never the registry).
// With DIALTONE_EXAMPLE_RELEASE_MANIFEST: the exact profile, archive identities and machine
// evidence of one qualification run. Legacy fixed profiles stay available by explicit ID.
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { sha256 } from './fixtures.mjs';
import { getProfile } from './profiles.mjs';

export const MANIFEST_ENV = 'DIALTONE_EXAMPLE_RELEASE_MANIFEST';
export const RELEASE_PROFILE_ID = 'dt-release';
const UMBRELLA = '@dialpad/dialtone';
const ICONS = '@dialpad/dialtone-icons';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const readJson = path => JSON.parse(readFileSync(path, 'utf8'));
const exactVersion = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/;

/** Versions the next release will publish, read from the checked package manifests. */
export function sourceVersions(repoRoot = root) {
  return {
    [UMBRELLA]: readJson(resolve(repoRoot, 'package.json')).version,
    [ICONS]: readJson(resolve(repoRoot, 'packages/dialtone-icons/package.json')).version,
  };
}

/** Profile shape shared with the fixed fixtures; integrity is unknown until an archive is qualified. */
export function releaseProfile(versions, integrity = null) {
  const { framework, layout, data } = getProfile('dt10-pinned');
  return {
    id: RELEASE_PROFILE_ID,
    framework,
    dependencies: { [UMBRELLA]: versions[UMBRELLA], [ICONS]: versions[ICONS], vue: framework.version },
    artifacts: { [UMBRELLA]: { version: versions[UMBRELLA], integrity } },
    layout,
    data,
    boundaries: ['release-selected umbrella; qualify exports and data from the exact archive'],
  };
}

/** Validate a run manifest and return its profile. Delivered pins must be exact published versions. */
export function profileFromManifest(manifest, versions = sourceVersions()) {
  if (manifest?.schemaVersion !== 1) throw new Error('Unsupported example release manifest schema');
  if (typeof manifest.profile === 'string') return getProfile(manifest.profile);
  const profile = manifest.profile;
  if (profile?.id !== RELEASE_PROFILE_ID) throw new Error(`Unexpected manifest profile ${profile?.id}`);
  const expected = releaseProfile(versions);
  for (const [name, version] of Object.entries(profile.dependencies ?? {}))
    if (typeof version !== 'string' || !exactVersion.test(version))
      throw new Error(`Manifest dependency ${name} must be an exact published version, not ${version}`);
  if (JSON.stringify(profile.dependencies) !== JSON.stringify(expected.dependencies))
    throw new Error(`Manifest dependencies ${JSON.stringify(profile.dependencies)} do not match the checked release manifests ${JSON.stringify(expected.dependencies)}`);
  const artifact = profile.artifacts?.[UMBRELLA];
  if (artifact?.version !== profile.dependencies[UMBRELLA] || !/^sha512-[A-Za-z0-9+/]+=*$/.test(artifact?.integrity ?? ''))
    throw new Error('Manifest must bind the umbrella version to its archive sha512 integrity');
  return structuredClone(profile);
}

// Relative selections resolve from the repository root, where Nx runs the fingerprint command.
function readManifest(env) {
  if (!env[MANIFEST_ENV]) return null;
  const path = resolve(root, env[MANIFEST_ENV]);
  const bytes = readFileSync(path);
  return { path, bytes, manifest: JSON.parse(bytes) };
}

/** Profile plus run evidence for example assembly. */
export function selectExampleProfile(env = process.env, repoRoot = root) {
  const selected = readManifest(env);
  if (!selected) return { profile: releaseProfile(sourceVersions(repoRoot)), evidence: null };
  return {
    profile: profileFromManifest(selected.manifest, sourceVersions(repoRoot)),
    evidence: selected.manifest.evidence ?? null,
  };
}

/** Nx runtime input: the selected manifest's bytes, not merely its (ignored, external) path. */
export function selectionFingerprint(env = process.env) {
  const selected = readManifest(env);
  return selected ? sha256(selected.bytes) : 'source-manifests';
}

if (process.argv[1] === fileURLToPath(import.meta.url) && process.argv[2] === '--fingerprint')
  process.stdout.write(selectionFingerprint() + '\n');
