/**
 * Pin the working directory to the dialtone-tokens package root.
 *
 * Several scripts here address files as `sync-scripts/build-data/…`, which only
 * resolves when launched from `packages/dialtone-tokens`. Running them from the repo
 * root — the obvious thing to do — failed with MODULE_NOT_FOUND or a missing spec,
 * three separate times in one session, including once where a stray cwd made all
 * thirteen spec builds fail at once.
 *
 * Importing this first makes the launch directory irrelevant. It is a side-effect
 * module on purpose: `import './pin-cwd.mjs'` before anything that touches the disk.
 */
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const PKG_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
if (process.cwd() !== PKG_ROOT) process.chdir(PKG_ROOT);
export default PKG_ROOT;
