// A unit's Vue sources: where the gate reads its Vue tests and stories, and which Vue changes CI gates it for
// (changed-units.mjs). The rules are the loop's plan.mjs (react-migration), which CI can't read, so its two tables are
// repeated here: keep MERGED and OWNED_FILES in step with plan.mjs' MERGES and OWNED_FILES.
import fs from 'node:fs';
import path from 'node:path';
import { pascal } from './cases.mjs';

// Pieces plan.mjs folds into another unit: mutual dependencies, or pieces with no React deliverable of their own.
const MERGED = {
  'mode-island': ['directive-mode'],
  skeleton: ['mixin-skeleton'],
  'mixin-keyboard-list-navigation': ['mixin-dom'],
  tooltip: ['directive-tooltip'],
};
// Shared Vue files outside any unit's directory, owned by one unit.
const OWNED_FILES = { button: ['common/sr_only_close_button.vue'] };

// plan.mjs' ids: tooltip_directive → tooltip, keyboard_list_navigation → keyboard-list-navigation,
// useIndicatorAnimation → use-indicator-animation.
const kebab = s => s.replace(/_directive$/, '').replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/_/g, '-').toLowerCase();
const isTest = f => /\.test\.[jt]s$/.test(f);
const list = dir => (fs.existsSync(dir) ? fs.readdirSync(dir, { withFileTypes: true }) : []);

/** A directive, mixin or composable unit's own paths (relative to dialtone-vue), or [] for any other id. */
function ownPaths (vueRoot, id) {
  const [, kind, rest] = id.match(/^(directive|mixin|composable)-(.+)$/) ?? [];
  if (kind === 'directive') {
    return list(path.join(vueRoot, 'directives')).filter(d => d.isDirectory() && kebab(d.name) === rest)
      .map(d => `directives/${d.name}`);
  }
  if (!kind) return [];
  const dir = kind === 'mixin' ? 'common/mixins' : 'common/composables';
  return list(path.join(vueRoot, dir))
    .filter(f => f.isFile() && /\.[jt]s$/.test(f.name) && f.name !== 'index.js' && !isTest(f.name))
    .filter(f => kebab(f.name.replace(/\.[jt]s$/, '')) === rest)
    .flatMap((f) => {
      const file = `${dir}/${f.name}`;
      const test = file.replace(/\.([jt]s)$/, '.test.$1');
      return fs.existsSync(path.join(vueRoot, test)) ? [file, test] : [file];
    });
}

/**
 * The unit's Vue sources. Throws when its component is in more than one directory.
 *   dir: the component directory (absolute), where the gate reads the unit's Vue tests and stories. The component
 *     is components/*\/<Name>.vue, one level deep: usually components/<Name>/, but DtTabGroup is in components/Tab/.
 *     A unit with no .vue (a composable, a mixin) keeps components/<Name>/, where any tests it has would be.
 *   paths: every Vue source, relative to dialtone-vue: dir if it exists, the unit's own directive, mixin or composable
 *     files, and what plan.mjs folds into it (directives/tooltip_directive for tooltip).
 */
export function vueSources (vueRoot, unit) {
  const name = pascal(unit);
  const homes = list(path.join(vueRoot, 'components'))
    .filter(d => d.isDirectory() && fs.existsSync(path.join(vueRoot, 'components', d.name, `${name}.vue`)))
    .map(d => d.name);
  if (homes.length > 1 && !homes.includes(name)) {
    throw new Error(`${name}.vue is in more than one directory: ${homes.join(', ')}`);
  }
  const home = `components/${homes.includes(name) ? name : (homes[0] ?? name)}`;
  const dir = path.join(vueRoot, home);
  const paths = [
    ...(fs.existsSync(dir) ? [home] : []),
    ...[unit, ...(MERGED[unit] ?? [])].flatMap(id => ownPaths(vueRoot, id)),
    ...(OWNED_FILES[unit] ?? []),
  ];
  return { dir, paths };
}

const FOLDED_INTO = Object.fromEntries(Object.entries(MERGED).flatMap(([unit, ids]) => ids.map(id => [id, unit])));

/**
 * The units a Vue path (relative to dialtone-vue) belongs to by its shape alone, whether or not it exists. vueSources
 * lists the files on disk, so it can't place a file a change deleted: components/<Dir>/ is unit <dir> (and
 * components/<Dir>/<Name>.vue unit <name>), directives/<d>/ is directive-<d>, common/mixins/<f> mixin-<f> and
 * common/composables/<f> composable-<f>, each then folded into its unit as plan.mjs does. Ids aren't checked against
 * anything: the caller keeps the ported ones.
 */
export function unitsOfPath (file) {
  const ids = [];
  const component = file.match(/^components\/([^/]+)\/(?:([^/]+)\.vue$)?/);
  if (component) ids.push(kebab(component[1]), ...(component[2] ? [kebab(component[2])] : []));
  const directive = file.match(/^directives\/([^/]+)\//);
  if (directive) ids.push(`directive-${kebab(directive[1])}`);
  const own = file.match(/^common\/(mixins|composables)\/([^/]+?)(?:\.test)?\.[jt]s$/);
  if (own && own[2] !== 'index') ids.push(`${own[1] === 'mixins' ? 'mixin' : 'composable'}-${kebab(own[2])}`);
  return [...new Set(ids.map(id => FOLDED_INTO[id] ?? id))];
}

/** Whether `file` (relative to dialtone-vue) is one of `paths` or inside one of them. */
export const containsPath = (paths, file) => paths.some(p => file === p || file.startsWith(`${p}/`));
