#!/usr/bin/env node
// The units a change touches, for CI's gate job: reads repo-relative paths (one per line) on stdin and prints, one per
// line, the id of every ported unit (components/<Name>/index.ts in this package) the change can break:
//   - a React path in the unit's components/<Name>/;
//   - a Vue path among the unit's Vue sources (vue-sources.mjs, the gate's own lookup), which reach outside
//     components/: directives/tooltip_directive is tooltip's, common/sr_only_close_button.vue is button's. A Vue
//     change (a staging sync) can break parity as surely as a React one. A deleted path is placed by its shape
//     (unitsOfPath), since the lookup only sees files that exist;
//   - a file the unit's React or Vue sources import, directly or not: Checkbox renders DtText, so a change to Text on
//     either side can break checkbox's parity, and Tooltip uses Popover/TippyUtils, which is no unit of its own;
//   - a shared file (SHARED): every ported unit, since the harness, foundations, configs and dependencies are
//     under all of them.
// The id is the kebab form the gate takes, the inverse of cases.mjs' pascal() (ValidationMessages →
// validation-messages).
//   git diff --no-renames --name-only <base> <head> | node packages/dialtone-react/parity/changed-units.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pascal } from './cases.mjs';
import { containsPath, unitsOfPath, vueSources } from './vue-sources.mjs';

const REACT = 'packages/dialtone-react/';
const VUE = 'packages/dialtone-vue/';
const SHARED = new RegExp([
  `^${REACT}(?:parity|common|tests|scripts|types)/`,
  `^${REACT}(?:package\\.json|tsconfig[^/]*|vite[^/]*|eslint\\.config\\.[^/]+)$`,
  '^pnpm-lock\\.yaml$',
  '^\\.github/workflows/dialtone-react[^/]*\\.yml$',
].join('|'));

const kebab = name => name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

// Static imports, re-exports, dynamic imports and requires. Only relative and dialtone-vue's `@/` specifiers resolve:
// packages are dependencies, and a dependency change is a pnpm-lock.yaml change, which is SHARED.
const SPECIFIER = /(?:\bfrom|\bimport|\brequire)\s*\(?\s*['"]([^'"\n]+)['"]/g;
const SUFFIXES = ['', '.ts', '.tsx', '.js', '.mjs', '.jsx', '.vue', '.json', '/index.ts', '/index.tsx', '/index.js'];
// Stories aren't followed: story parity parses them without rendering, and their demos import many components.
const STORY = /\.stories\.|\.story\.vue$|\.mdx$/;
const isFile = f => fs.statSync(f, { throwIfNoEntry: false })?.isFile() ?? false;
const walk = p => (isFile(p) ? [p] : fs.existsSync(p)
  ? fs.readdirSync(p, { recursive: true, withFileTypes: true }).filter(d => d.isFile())
    .map(d => path.join(d.parentPath, d.name))
  : []);

/** Every file under `root` that `seeds` (absolute paths) reach through imports, the seeds included, relative to it. */
function importClosure (root, seeds, alias, cache) {
  const importsOf = (file) => {
    if (!cache.has(file)) {
      const found = [];
      for (const [, spec] of fs.readFileSync(file, 'utf8').matchAll(SPECIFIER)) {
        const base = spec.startsWith('.') ? path.resolve(path.dirname(file), spec)
          : alias && spec.startsWith('@/') ? path.join(root, spec.slice(2)) : null;
        const hit = base && SUFFIXES.map(s => base + s).find(isFile);
        if (hit && !path.relative(root, hit).startsWith('..')) found.push(hit);
      }
      cache.set(file, found);
    }
    return cache.get(file);
  };
  const seen = new Set();
  const queue = seeds.filter(f => !STORY.test(f));
  while (queue.length) {
    const file = queue.pop();
    if (seen.has(file)) continue;
    seen.add(file);
    queue.push(...importsOf(file).filter(f => !STORY.test(f)));
  }
  return new Set([...seen].map(f => path.relative(root, f)));
}

/**
 * The ported units `files` (repo-relative paths) touch: { units, errors }, units sorted by id.
 *   pkg: packages/dialtone-react; vueRoot: packages/dialtone-vue (both absolute).
 */
export function changedUnits (files, { pkg, vueRoot }) {
  const errors = [];
  // A unit has an index.ts; a directory without one holds helpers another unit needed (Tooltip's Popover/TippyUtils).
  const ported = new Map();
  const componentsDir = path.join(pkg, 'components');
  for (const d of fs.existsSync(componentsDir) ? fs.readdirSync(componentsDir).sort() : []) {
    if (!fs.existsSync(path.join(componentsDir, d, 'index.ts'))) continue;
    const id = kebab(d);
    if (pascal(id) === d) ported.set(d, id);
    else errors.push(`components/${d} has no unit id that maps back to it (${id} → ${pascal(id)})`);
  }
  const paths = files.map(f => f.trim()).filter(Boolean);
  if (paths.some(f => SHARED.test(f))) return { units: [...ported.values()].sort(), errors };

  const reactPaths = paths.filter(f => f.startsWith(REACT)).map(f => f.slice(REACT.length));
  const vuePaths = paths.filter(f => f.startsWith(VUE)).map(f => f.slice(VUE.length));
  const units = new Set();
  const reactCache = new Map();
  const vueCache = new Map();
  // Whether `changed` holds a file the seeds import, directly or not. Walked only when a unit's own paths don't match.
  const reaches = (changed, root, seeds, alias, cache) => {
    if (!changed.length) return false;
    const reach = importClosure(root, seeds(), alias, cache);
    return changed.some(f => reach.has(f));
  };
  for (const [name, id] of ported) {
    let sources = [];
    if (vuePaths.length) {
      try {
        sources = vueSources(vueRoot, id).paths;
      } catch (error) {
        errors.push(`${id}: ${error.message}`);
      }
    }
    const home = `components/${name}`;
    if (reactPaths.some(f => containsPath([home], f))
      || vuePaths.some(f => containsPath(sources, f) || unitsOfPath(f).includes(id))
      || reaches(reactPaths, pkg, () => walk(path.join(pkg, home)), false, reactCache)
      || reaches(vuePaths, vueRoot, () => sources.flatMap(p => walk(path.join(vueRoot, p))), true, vueCache)) {
      units.add(id);
    }
  }
  return { units: [...units].sort(), errors };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const pkg = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const { units, errors } = changedUnits(fs.readFileSync(0, 'utf8').split('\n'), {
    pkg, vueRoot: path.resolve(pkg, '../dialtone-vue'),
  });
  for (const error of errors) console.error(`changed-units: ${error}`);
  for (const id of units) console.log(id);
  if (errors.length) process.exitCode = 1;
}
