/**
 * Resolve `--target <name>` (or SYNC_TARGET) into the file this run works on. A side-effect module,
 * like `pin-cwd.mjs`: import it before anything that reads FILE_KEY.
 *
 *   import './target.mjs';
 *
 * It removes `--target <name>` from `process.argv` so the script's own argument parsing never sees
 * the name as a component, and records the choice in the environment (SYNC_TARGET), which a child
 * process inherits: `run-batch` starts several, and each one must work on the same file.
 */
import './pin-cwd.mjs';
import 'dotenv/config';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { TARGETS as BUILT_IN } from './targets.mjs';

// Only a missing targets.local.mjs means "no personal targets". A syntax error in it, or a missing
// import inside it (also ERR_MODULE_NOT_FOUND, but naming another specifier), must surface.
const LOCAL_URL = new URL('./targets.local.mjs', import.meta.url);
let LOCAL = {};
try {
  LOCAL = (await import(LOCAL_URL.href)).TARGETS || {};
} catch (e) {
  const itself = e && e.code === 'ERR_MODULE_NOT_FOUND' && String(e.message).includes(fileURLToPath(LOCAL_URL));
  if (!itself || existsSync(LOCAL_URL)) {
    throw new Error(`could not load sync-scripts/targets.local.mjs: ${e && e.message}`, { cause: e });
  }
}
export const ALL_TARGETS = { ...BUILT_IN, ...LOCAL };

let name = null;
let targetFlag = false;
{
  const argv = process.argv;
  const i = argv.findIndex((a, k) => k >= 2 && (a === '--target' || a.startsWith('--target=')));
  if (i >= 0) {
    targetFlag = true;
    if (argv[i].includes('=')) { name = argv[i].slice('--target='.length); argv.splice(i, 1); }
    else {
      const next = argv[i + 1];
      name = next !== undefined && !next.startsWith('--') ? next : '';
      argv.splice(i, name ? 2 : 1);
    }
  }
}
const choices = Object.keys(ALL_TARGETS).join(', ');
// An explicit --target with no value must not fall back to the environment: a build never picks a file silently.
if (targetFlag && !name) throw new Error(`--target needs a value (one of: ${choices})`);
name = name || process.env.SYNC_TARGET || null;

if (!name) {
  throw new Error(`no target: pass --target <name> (one of: ${choices}). A build never picks a file for you.`);
}
const def = ALL_TARGETS[name];
if (!def) throw new Error(`unknown target "${name}" (one of: ${choices})`);
const fileKey = process.env[def.fileKeyEnv];
if (!fileKey) {
  throw new Error(`target "${name}" needs ${def.fileKeyEnv} (the Figma file key); add it to .env`);
}

export const TARGET = { name, ...def, fileKey };

// Everything downstream (and every child process) reads these.
process.env.SYNC_TARGET = name;
process.env.FILE_KEY = fileKey;
process.env.HOME_COLLECTION = def.homeCollection;
