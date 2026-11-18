import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { getProfile } from './profiles.mjs';
import { MANIFEST_ENV, profileFromManifest, releaseProfile, selectExampleProfile, selectionFingerprint, sourceVersions } from './release-profile.mjs';

const integrity = 'sha512-' + 'A'.repeat(86) + '==';
const manifestFile = value => {
  const path = join(mkdtempSync(join(tmpdir(), 'release-profile-')), 'manifest.json');
  writeFileSync(path, JSON.stringify(value));
  return path;
};
const release = () => ({ schemaVersion: 1, profile: releaseProfile(sourceVersions(), integrity) });

test('targets the checked release manifests by default, not the frozen 10.5.1 fixture', () => {
  const { profile } = selectExampleProfile({});
  assert.deepEqual(profile.dependencies['@dialpad/dialtone'], sourceVersions()['@dialpad/dialtone']);
  assert.equal(profile.artifacts['@dialpad/dialtone'].integrity, null);
});

test('selects an explicit run manifest and keeps legacy fixtures reproducible by ID', () => {
  const selection = { [MANIFEST_ENV]: manifestFile({ ...release(), evidence: { runs: {}, examples: {} } }) };
  const { profile, evidence } = selectExampleProfile(selection);
  assert.equal(profile.artifacts['@dialpad/dialtone'].integrity, integrity);
  assert.deepEqual(evidence, { runs: {}, examples: {} });
  assert.deepEqual(selectExampleProfile({ [MANIFEST_ENV]: manifestFile({ schemaVersion: 1, profile: 'dt10-pinned' }) }).profile, getProfile('dt10-pinned'));
});

for (const [name, change, message] of [
  ['a missing integrity', manifest => { delete manifest.profile.artifacts['@dialpad/dialtone'].integrity; }, /sha512 integrity/],
  ['a stale version', manifest => { manifest.profile.dependencies['@dialpad/dialtone'] = '10.5.1'; manifest.profile.artifacts['@dialpad/dialtone'].version = '10.5.1'; }, /do not match the checked release manifests/],
  ['an unknown schema', manifest => { manifest.schemaVersion = 2; }, /Unsupported example release manifest schema/],
  ['an archive version that differs from the pinned version', manifest => { manifest.profile.artifacts['@dialpad/dialtone'].version = '0.0.1'; }, /bind the umbrella version/],
]) test(`rejects ${name}`, () => {
  const manifest = release();
  change(manifest);
  assert.throws(() => selectExampleProfile({ [MANIFEST_ENV]: manifestFile(manifest) }), message);
});

test('rejects a local archive path even when the checked versions would match it', () => {
  const versions = { ...sourceVersions(), '@dialpad/dialtone': 'file:/tmp/dialtone.tgz' };
  const manifest = { schemaVersion: 1, profile: releaseProfile(versions, integrity) };
  assert.throws(() => profileFromManifest(manifest, versions), /exact published version/);
});

test('fingerprints manifest bytes rather than the selected path', () => {
  const first = manifestFile(release());
  const changed = release();
  changed.profile.artifacts['@dialpad/dialtone'].integrity = 'sha512-' + 'B'.repeat(86) + '==';
  const second = manifestFile(changed);
  assert.equal(selectionFingerprint({}), 'source-manifests');
  assert.notEqual(selectionFingerprint({ [MANIFEST_ENV]: first }), selectionFingerprint({ [MANIFEST_ENV]: second }));
  const sameBytes = manifestFile(release());
  assert.equal(selectionFingerprint({ [MANIFEST_ENV]: first }), selectionFingerprint({ [MANIFEST_ENV]: sameBytes }));
});
