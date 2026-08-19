import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'vitest';

import * as cache from './cache.mjs';

test('shared render hash includes CSS and icon output', () => {
  assert.equal(typeof cache.computeSharedRenderHash, 'function');

  const fixtureRoot = mkdtempSync(join(tmpdir(), 'dialtone-thumb-cache-'));
  const iconsDist = join(fixtureRoot, 'icons');
  const iconsDir = join(iconsDist, 'components', 'icons');
  const harnessFile = join(fixtureRoot, 'harness.js');
  const tokensCss = join(fixtureRoot, 'tokens.css');
  const dialtoneCss = join(fixtureRoot, 'dialtone.css');
  const iconFile = join(iconsDir, 'icon.js');

  try {
    mkdirSync(iconsDir, { recursive: true });
    writeFileSync(harnessFile, 'harness');
    writeFileSync(tokensCss, 'tokens');
    writeFileSync(dialtoneCss, 'dialtone');
    writeFileSync(iconFile, 'icon');

    const inputs = {
      harnessFiles: [harnessFile],
      tokensCss,
      dialtoneCss,
      iconsDist,
    };
    const baseline = cache.computeSharedRenderHash(inputs);

    writeFileSync(dialtoneCss, 'dialtone changed');
    assert.notEqual(cache.computeSharedRenderHash(inputs), baseline);

    writeFileSync(dialtoneCss, 'dialtone');
    writeFileSync(iconFile, 'icon changed');
    assert.notEqual(cache.computeSharedRenderHash(inputs), baseline);

    writeFileSync(iconFile, 'icon');
    renameSync(iconFile, join(iconsDir, 'renamed.js'));
    assert.notEqual(cache.computeSharedRenderHash(inputs), baseline);

    assert.throws(
      () => cache.computeSharedRenderHash({
        ...inputs,
        dialtoneCss: join(fixtureRoot, 'missing.css'),
      }),
      /ENOENT/,
    );

    assert.throws(
      () => cache.computeSharedRenderHash({
        ...inputs,
        iconsDist: join(fixtureRoot, 'missing-icons'),
      }),
      /icon JavaScript directory not found/,
    );
  } finally {
    rmSync(fixtureRoot, { recursive: true, force: true });
  }
});
