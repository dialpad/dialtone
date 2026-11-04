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
import { TARGETS as BUILT_IN } from './targets.mjs';

let LOCAL = {};
try { LOCAL = (await import('./targets.local.mjs')).TARGETS || {}; } catch { /* no personal targets */ }
export const ALL_TARGETS = { ...BUILT_IN, ...LOCAL };

let name = null;
{
  const argv = process.argv;
  const i = argv.findIndex((a, k) => k >= 2 && (a === '--target' || a.startsWith('--target=')));
  if (i >= 0) {
    if (argv[i].includes('=')) { name = argv[i].slice('--target='.length); argv.splice(i, 1); }
    else { name = argv[i + 1]; argv.splice(i, 2); }
  }
}
name = name || process.env.SYNC_TARGET || null;

const choices = Object.keys(ALL_TARGETS).join(', ');
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
