/**
 * Content-hash cache for the thumb generator.
 *
 * Each component's input hash covers:
 *   - <Name>Default.story.vue source
 *   - <Name>.vue source
 *   - harness/main.js + harness/component-defaults.js (changing defaults invalidates)
 *   - dialtone-tokens compiled CSS (token changes invalidate)
 */

import { createHash } from 'crypto';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dir = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dir, '../../../..');
const CACHE_PATH = resolve(__dir, '.cache.json');

const HARNESS_MAIN = resolve(__dir, 'harness/main.js');
const HARNESS_DEFAULTS = resolve(__dir, 'harness/component-defaults.js');
const TOKENS_CSS = resolve(REPO_ROOT, 'packages/dialtone-tokens/dist/css/layered/tokens-dp-colors.css');

const HASH_LENGTH = 16; // truncated sha256; collision risk is negligible for ~60 components

function sha256 (content) {
  return createHash('sha256').update(content).digest('hex').slice(0, HASH_LENGTH);
}

function readSafe (path) {
  return existsSync(path) ? readFileSync(path, 'utf8') : '';
}

let _harnessHash = null;
function harnessHash () {
  if (!_harnessHash) {
    _harnessHash = sha256(readSafe(HARNESS_MAIN) + readSafe(HARNESS_DEFAULTS) + readSafe(TOKENS_CSS));
  }
  return _harnessHash;
}

export function readManifest () {
  if (!existsSync(CACHE_PATH)) return {};
  try {
    return JSON.parse(readFileSync(CACHE_PATH, 'utf8'));
  } catch {
    return {};
  }
}

export function writeManifest (manifest) {
  writeFileSync(CACHE_PATH, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
}

// Memoize per slug — getStale + post-capture manifest update would otherwise
// re-read the same source files twice per component (~108 redundant reads).
const _hashCache = new Map();

export function computeHash (slug, exportName) {
  if (_hashCache.has(slug)) return _hashCache.get(slug);
  const pascal = exportName.slice(2);
  const componentDir = resolve(REPO_ROOT, `packages/dialtone-vue/components/${pascal}`);
  const content =
    readSafe(resolve(componentDir, `${pascal}Default.story.vue`)) +
    readSafe(resolve(componentDir, `${pascal}.vue`)) +
    harnessHash();
  const hash = sha256(content);
  _hashCache.set(slug, hash);
  return hash;
}

export function getStale (slugs, exportNameFn, manifest = null) {
  const m = manifest ?? readManifest();
  return slugs.filter(slug => m[slug]?.inputHash !== computeHash(slug, exportNameFn(slug)));
}
