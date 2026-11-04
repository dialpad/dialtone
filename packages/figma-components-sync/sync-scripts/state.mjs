/**
 * PER-TARGET STATE: what a build leaves behind about ONE Figma file.
 *
 * The ids a build records (each set, each icon) and the fingerprints of what was built are facts
 * about a particular file. Kept in one place they described whichever file was built last, and
 * building into a second file overwrote the first one's. Each target gets its own folder:
 *
 *   build-data/<target>/set-ids.json      { button: { figmaSetId, figmaMergedSetId? }, … }
 *   build-data/<target>/icon-library.json icon name -> component id
 *   build-data/<target>/built-from.json   what was built, and from which payload
 *
 * The specs and payloads stay shared in `build-data/`: they are measured from the browser and
 * regenerated every run, and say nothing about a file. The folder is gitignored.
 *
 * Set ids used to be written into the committed config files, which changed tracked source on every
 * build and made the next run look as though the axes had been edited.
 */
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';

const HERE = fileURLToPath(new URL('.', import.meta.url)).replace(/\/$/, '');

export const stateDir = (target) => `${HERE}/build-data/${target}/`;

/**
 * An absent file gives the fallback. A file that is there but cannot be read as a JSON object
 * throws: returning the fallback would let the next write replace it and erase every id it held.
 */
export function readState (target, file, fallback = {}) {
  const p = `${stateDir(target)}${file}`;
  if (!existsSync(p)) return fallback;
  const hint = `Delete ${p} to rebuild it, or restore it from a backup.`;
  let value;
  try { value = JSON.parse(readFileSync(p, 'utf8')); } catch (err) {
    throw new Error(`${p} is not valid JSON (${err.message}). ${hint}`);
  }
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    const found = Array.isArray(value) ? 'an array' : value === null ? 'null' : typeof value;
    throw new Error(`${p} must hold a JSON object, found ${found}. ${hint}`);
  }
  return value;
}

/** Write to a temp file in the same folder, then rename, so a crash never leaves a truncated file. */
export function writeState (target, file, value) {
  mkdirSync(stateDir(target), { recursive: true });
  const p = `${stateDir(target)}${file}`;
  const tmp = `${p}.${process.pid}.tmp`;
  writeFileSync(tmp, JSON.stringify(value, null, 2));
  renameSync(tmp, p);
}

/** Record a built set's id for a component: `figmaSetId`, or `figmaMergedSetId` for a merged build. */
export function recordSetId (target, component, merged, setId) {
  const ids = readState(target, 'set-ids.json');
  ids[component] = { ...ids[component], [merged ? 'figmaMergedSetId' : 'figmaSetId']: setId };
  writeState(target, 'set-ids.json', ids);
}
