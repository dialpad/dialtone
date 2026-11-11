#!/usr/bin/env node
// The units a change touches, for CI's gate job: reads repo-relative paths (one per line) on stdin and prints, one per
// line, the id of every ported unit (an index.ts in the unit's directory in this package: components/<Name>/, or
// common/<name>/ for a directive, mixin or composable, vue-sources.mjs' reactDir) the change can break:
//   - a React path in the unit's directory;
//   - a Vue path among the unit's Vue sources (vue-sources.mjs, the gate's own lookup), which reach outside
//     components/: directives/tooltip_directive is tooltip's, common/sr_only_close_button.vue is button's. A Vue
//     change (a staging sync) can break parity as surely as a React one. A deleted path is placed by its shape
//     (unitsOfPath), since the lookup only sees files that exist;
//   - a file the unit's React or Vue sources import, directly or not, deleted or not: Checkbox renders DtText, so a
//     change to Text on either side can break checkbox's parity, and Tooltip uses Popover/TippyUtils, which is no
//     unit of its own;
//   - the unit's Combinator presets, which are DOM parity's cases: the variants file the registry maps it to
//     (presetFiles), and what that file imports inside Combinator;
//   - a shared file (SHARED): every ported unit, since the harness, foundations, configs and dependencies are
//     under all of them, and so are the icons and emoji both sides render and dialtone-vue's test config and
//     setup. dialtone-tokens gates no unit: no component, test or parity case reads it. The Storybook themes do,
//     and the check job's typecheck catches a change to their types in the same run.
// The id is the one the gate takes: the kebab form of components/<Name>, the inverse of cases.mjs' pascal()
// (ValidationMessages → validation-messages), or the directive, mixin or composable common/<name> is for
// (common/input → mixin-input, commonUnit).
//   git diff --no-renames --name-only <base> <head> | node packages/dialtone-react/parity/changed-units.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pascal } from './cases.mjs';
import { commonUnit, containsPath, reactDir, unitsOfPath, vueSources } from './vue-sources.mjs';

const REACT = 'packages/dialtone-react/';
const VUE = 'packages/dialtone-vue/';
const COMBINATOR = 'packages/combinator/';
const VARIANTS = `${COMBINATOR}src/variants/`;
const SHARED = new RegExp([
  `^${REACT}(?:parity|common|tests|scripts|types)/`,
  `^${REACT}(?:package\\.json|tsconfig[^/]*|vite[^/]*|eslint\\.config\\.[^/]+)$`,
  '^pnpm-lock\\.yaml$',
  '^\\.github/workflows/dialtone-react[^/]*\\.yml$',
  // dialtone-vue's Vitest config and setup, under every unit's Vue tests and goldens.
  `^${VUE}(?:vite\\.config\\.js|tests/setupTests\\.js)$`,
  // React's icons are generated from dialtone-icons' SVGs and Vue's come from its build; emoji come from
  // dialtone-emojis. Their Markdown can't change a render.
  '^packages/dialtone-(?:icons|emojis)/(?!.*\\.md$)',
  // Combinator's registry, which says which variants file holds each unit's presets.
  `^${VARIANTS}variants\\.js$`,
].join('|'));

const kebab = name => name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
// common/'s foundations: code the units share, which no directive, mixin or composable names. Every other common/
// directory with an index.ts is a directive's, mixin's or composable's, so one whose Vue files are gone, or that's
// misnamed, is an error rather than a unit nobody gates.
const FOUNDATIONS = ['link', 'localization', 'transition'];

// Static imports, re-exports, dynamic imports and requires. Only relative and dialtone-vue's `@/` specifiers resolve:
// an npm dependency changes through pnpm-lock.yaml, and the workspace packages ports render from are SHARED by path.
const SPECIFIER = /(?:\bfrom|\bimport|\brequire)\s*\(?\s*['"]([^'"\n]+)['"]/g;
const SUFFIXES = ['', '.ts', '.tsx', '.js', '.mjs', '.jsx', '.vue', '.json', '/index.ts', '/index.tsx', '/index.js'];
// Stories aren't followed: story parity parses them without rendering, and their demos import many components.
const STORY = /\.stories\.|\.story\.vue$|\.mdx$/;
const isFile = f => fs.statSync(f, { throwIfNoEntry: false })?.isFile() ?? false;
const walk = p => (isFile(p) ? [p] : fs.existsSync(p)
  ? fs.readdirSync(p, { recursive: true, withFileTypes: true }).filter(d => d.isFile())
    .map(d => path.join(d.parentPath, d.name))
  : []);

/**
 * Every file under `root` that `seeds` (absolute paths) reach through imports, the seeds included, relative to it.
 * An import that resolves to no file adds every path it could resolve to, unfollowed: CI checks out the change's
 * head, so a file the change deletes is gone while `git diff` still lists it.
 */
function importClosure (root, seeds, alias, cache) {
  const inRoot = f => !path.relative(root, f).startsWith('..');
  const importsOf = (file) => {
    if (!cache.has(file)) {
      const found = [];
      const missing = [];
      for (const [, specifier] of fs.readFileSync(file, 'utf8').matchAll(SPECIFIER)) {
        const spec = specifier.replace(/\?.*$/, ''); // Vite's `./en-US.ftl?raw` is en-US.ftl
        const base = spec.startsWith('.') ? path.resolve(path.dirname(file), spec)
          : alias && spec.startsWith('@/') ? path.join(root, spec.slice(2)) : null;
        const candidates = base ? SUFFIXES.map(s => base + s).filter(inRoot) : [];
        const hit = candidates.find(isFile);
        if (hit) found.push(hit);
        else missing.push(...candidates);
      }
      cache.set(file, { found, missing });
    }
    return cache.get(file);
  };
  const seen = new Set();
  const gone = new Set();
  const queue = seeds.filter(f => !STORY.test(f));
  while (queue.length) {
    const file = queue.pop();
    if (seen.has(file)) continue;
    seen.add(file);
    const { found, missing } = importsOf(file);
    queue.push(...found.filter(f => !STORY.test(f)));
    missing.filter(f => !STORY.test(f)).forEach(f => gone.add(f));
  }
  return new Set([...seen, ...gone].map(f => path.relative(root, f)));
}

/**
 * Which variants file holds each component's Combinator presets, by Combinator's registry (variants.js), which
 * imports one per component as `import Dt<Name> from './variants_<x>.js'`: the lookup the Vue goldens use.
 * A Map of <Name> → file name.
 */
function presetFiles (variantsDir) {
  const registry = path.join(variantsDir, 'variants.js');
  const text = fs.existsSync(registry) ? fs.readFileSync(registry, 'utf8') : '';
  return new Map([...text.matchAll(/import Dt(\w+) from '\.\/(variants_\w+\.js)'/g)].map(m => [m[1], m[2]]));
}

/**
 * The ported units `files` (repo-relative paths) touch: { units, errors }, units sorted by id.
 *   pkg: packages/dialtone-react; vueRoot: packages/dialtone-vue; variantsDir: Combinator's src/variants (all
 *   absolute; variantsDir defaults to the one next to pkg).
 */
export function changedUnits (files, { pkg, vueRoot, variantsDir = path.resolve(pkg, '../combinator/src/variants') }) {
  const errors = [];
  const paths = files.map(f => f.trim()).filter(Boolean);
  const vuePaths = paths.filter(f => f.startsWith(VUE)).map(f => f.slice(VUE.length));
  // A unit has an index.ts; a directory without one holds helpers another unit needed (Tooltip's Popover/TippyUtils).
  // In common/, which unit a directory is comes from the Vue side, or from the paths of a change that deletes its Vue
  // files; FOUNDATIONS are none.
  const named = new Set(vuePaths.flatMap(unitsOfPath));
  const ported = new Set();
  const componentsDir = path.join(pkg, 'components');
  for (const d of fs.existsSync(componentsDir) ? fs.readdirSync(componentsDir).sort() : []) {
    if (!fs.existsSync(path.join(componentsDir, d, 'index.ts'))) continue;
    const id = kebab(d);
    if (pascal(id) !== d) errors.push(`components/${d} has no unit id that maps back to it (${id} → ${pascal(id)})`);
    else if (reactDir(id) !== `components/${d}`) errors.push(`components/${d}: ${id} belongs in ${reactDir(id)}`);
    else ported.add(id);
  }
  const commonDir = path.join(pkg, 'common');
  for (const d of fs.existsSync(commonDir) ? fs.readdirSync(commonDir).sort() : []) {
    if (!fs.existsSync(path.join(commonDir, d, 'index.ts'))) continue;
    try {
      const id = commonUnit(vueRoot, d, named);
      if (FOUNDATIONS.includes(d)) {
        if (id) errors.push(`common/${d} is a foundation, so ${id} can't live there`);
      } else if (id) ported.add(id);
      else {
        // Named after the Vue file (common/useIndicatorAnimation, common/input_group), or no unit at all.
        const kebabbed = kebab(d).replace(/_/g, '-');
        const meant = kebabbed !== d && commonUnit(vueRoot, kebabbed, named);
        errors.push(meant ? `common/${d}: ${meant} belongs in ${reactDir(meant)}`
          : `common/${d} matches no foundation (${FOUNDATIONS.join(', ')}) and no Vue directive, mixin or composable`);
      }
    } catch (error) {
      errors.push(error.message);
    }
  }
  if (paths.some(f => SHARED.test(f))) return { units: [...ported].sort(), errors };

  const reactPaths = paths.filter(f => f.startsWith(REACT)).map(f => f.slice(REACT.length));
  const combinatorPaths = paths.filter(f => f.startsWith(COMBINATOR)).map(f => f.slice(COMBINATOR.length));
  const combinatorRoot = path.resolve(variantsDir, '../..');
  const presets = combinatorPaths.length ? presetFiles(variantsDir) : new Map();
  const presetsOf = name => (presets.has(name) ? [path.join(variantsDir, presets.get(name))] : []);
  const combinatorCache = new Map();
  const units = new Set();
  const reactCache = new Map();
  const vueCache = new Map();
  // Whether `changed` holds a file the seeds import, directly or not. Walked only when a unit's own paths don't match.
  const reaches = (changed, root, seeds, alias, cache) => {
    if (!changed.length) return false;
    const reach = importClosure(root, seeds(), alias, cache);
    return changed.some(f => reach.has(f));
  };
  for (const id of ported) {
    let sources = [];
    if (vuePaths.length) {
      try {
        sources = vueSources(vueRoot, id).paths;
      } catch (error) {
        errors.push(`${id}: ${error.message}`);
      }
    }
    const name = pascal(id);
    const home = reactDir(id);
    if (reactPaths.some(f => containsPath([home], f))
      || presetsOf(name).some(f => combinatorPaths.includes(path.relative(combinatorRoot, f)))
      || reaches(combinatorPaths, combinatorRoot, () => presetsOf(name).filter(isFile), true, combinatorCache)
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
