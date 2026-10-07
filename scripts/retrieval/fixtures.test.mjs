import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { test } from 'node:test';
import { createConsumerFixture, fingerprintArtifact } from './fixtures.mjs';
import { getProfile } from './profiles.mjs';

test('nested fixture declares exact pins at the dependency root and limits evidence to copied data', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'dialtone-fixtures-'));
  try {
    const data = [{ displayName: 'DtButton' }];
    const fixture = await createConsumerFixture(directory, 'nested-umbrella', {
      packages: {
        '@dialpad/dialtone': { 'dist/vue3/component-documentation.json': data },
      },
    });
    assert.equal(fixture.verification, 'lookup-data-only');
    assert.deepEqual(
      JSON.parse(
        await readFile(
          createRequire(join(fixture.invocationRoot, 'package.json')).resolve(
            '@dialpad/dialtone/vue3/component-documentation.json',
          ),
        ),
      ),
      data,
    );
    assert.equal(
      fixture.invocationRoot,
      join(fixture.dependencyRoot, 'apps/client'),
    );
    const manifest = JSON.parse(
      await readFile(join(fixture.dependencyRoot, 'package.json')),
    );
    assert.deepEqual(
      manifest.dependencies,
      getProfile('dt10-current').dependencies,
    );
    const fingerprint = await fingerprintArtifact(
      'nested-umbrella',
      join(fixture.dependencyRoot, 'node_modules/@dialpad/dialtone'),
      ['dist/vue3/component-documentation.json'],
    );
    assert.equal(fingerprint.data[0].sha256, fixture.data[0].sha256);
    assert.deepEqual(fingerprint.data[0].schemaVersions, [null]);
    await writeFile(
      join(
        fixture.dependencyRoot,
        'node_modules/@dialpad/dialtone/package.json',
      ),
      JSON.stringify({ name: '@dialpad/dialtone', version: '9.185.0' }),
    );
    await assert.rejects(
      fingerprintArtifact(
        'nested-umbrella',
        join(fixture.dependencyRoot, 'node_modules/@dialpad/dialtone'),
        [],
      ),
      /does not match/,
    );
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
test('no installation, partial and legacy profiles remain distinct declarations', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'dialtone-fixtures-'));
  try {
    for (const id of [
      'no-install',
      'partial-install',
      'dt9-legacy',
      'standalone-vue3-legacy',
    ])
      assert.equal(
        (await createConsumerFixture(directory, id)).verification,
        'declaration-only',
      );
    assert.equal(
      getProfile('dt9-legacy').dependencies['@dialpad/dialtone'],
      '9.185.0',
    );
    assert.equal(
      getProfile('standalone-vue3-legacy').dependencies[
        '@dialpad/dialtone-vue'
      ],
      '3.157.0',
    );
    await assert.rejects(
      createConsumerFixture(directory, 'no-install', {
        packages: { '@dialpad/dialtone': {} },
      }),
      /not declared/,
    );
    await assert.rejects(
      createConsumerFixture(directory, 'dt10-min', {
        packages: { '@dialpad/dialtone': { '../outside.json': [] } },
      }),
      /Unsafe/,
    );
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
