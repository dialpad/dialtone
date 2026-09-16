// @vitest-environment node
import { spawnSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), '..');

/**
 * Runs build-ios.js against a throwaway token build containing one current
 * Swift file and one left over from a theme that no longer exists.
 * @param {(context: { result: object, packageOutput: string }) => void} assert
 */
function withBuild (assert) {
  const workingDirectory = mkdtempSync(join(tmpdir(), 'dialtone-build-ios-'));
  try {
    const tokenOutput = join(workingDirectory, 'dist/ios');
    const packageOutput = join(workingDirectory, 'dist_ios/Sources/DialtoneTokens');
    mkdirSync(tokenOutput, { recursive: true });
    mkdirSync(packageOutput, { recursive: true });
    writeFileSync(join(tokenOutput, 'tokens-paprika-light.swift'), 'current');
    writeFileSync(join(packageOutput, 'tokens-removed-theme-light.swift'), 'stale');

    const result = spawnSync(process.execPath, [join(packageRoot, 'build-ios.js')], {
      cwd: workingDirectory,
      encoding: 'utf8',
    });

    assert({ result, packageOutput });
  } finally {
    rmSync(workingDirectory, { recursive: true });
  }
}

describe('iOS package build', () => {
  describe('When the token build contains a theme the package output does not', () => {
    it('Should exit successfully', () => {
      withBuild(({ result }) => {
        expect(result.status, result.stderr).toBe(0);
      });
    });

    it('Should copy the generated Swift file into the package output', () => {
      withBuild(({ packageOutput }) => {
        expect(readFileSync(join(packageOutput, 'tokens-paprika-light.swift'), 'utf8')).toBe('current');
      });
    });

    it('Should remove generated Swift files that no longer exist in the token build', () => {
      withBuild(({ packageOutput }) => {
        expect(existsSync(join(packageOutput, 'tokens-removed-theme-light.swift'))).toBe(false);
      });
    });
  });
});
