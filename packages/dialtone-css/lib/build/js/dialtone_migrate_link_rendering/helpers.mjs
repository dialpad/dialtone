/**
 * Shared test helpers for dialtone-migrate-link-rendering.
 *
 * Mirrors the pattern from dialtone_migration_helper/tests/helpers.mjs:
 * a small surface that test files can rely on without re-importing the CLI internals.
 */

import { transformContent } from './index.mjs';

/**
 * Run the transform on a single string of content and return the rewritten output.
 * Useful for one-input/one-expected-output assertion tests.
 */
export function runTransform (input, opts = {}) {
  const { transformed } = transformContent(input, opts);
  return transformed;
}

/**
 * Run the transform and return the full result, including warnings and notes.
 * Useful for tests that assert on warnings or notes.
 */
export function runTransformVerbose (input, opts = {}) {
  return transformContent(input, opts);
}
