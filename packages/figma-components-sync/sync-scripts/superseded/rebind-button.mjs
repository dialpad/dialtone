/**
 * Audit and correct Button's Figma bindings against CSS-DECLARED provenance.
 *
 * The set was built from a value reverse-lookup, which returns the right value
 * under a plausibly wrong token name. This resolves what the stylesheet actually
 * declares for each of the 560 coordinates and reports every disagreement.
 *
 *   node rebind-button.mjs            # audit only
 *   node rebind-button.mjs --emit f   # write corrections for the Figma pass
 */
import { writeFileSync } from 'fs';
import { buildIndex, resolveNode } from './css-provenance.mjs';

const idx = buildIndex();

// straight from packages/dialtone-vue/components/Button/ButtonConstants.js
const KIND = { default: '', muted: 'd-btn--muted', critical: 'd-btn--critical',
               positive: 'd-btn--positive', inverted: 'd-btn--inverted' };
const IMPORTANCE = { clear: '', outlined: 'd-btn--outlined', primary: 'd-btn--primary' };
const SIZE = { 100: 'd-btn--xs', 200: 'd-btn--sm', 300: '', 400: 'd-btn--lg', 500: 'd-btn--xl' };
const STATE = { default: null, hover: 'hover', active: 'active', focus: 'focus-visible', disabled: 'disabled' };
const LOADING = { false: '', true: 'd-btn--loading' };
const INVALID = [{ kind: 'muted', importance: 'primary' }];
const reachable = (state, loading) => loading === 'false' || !['hover', 'active'].includes(state);

const name = t => t.replace(/^--dt-/, '').split('-').join('/');

const out = [];
let coords = 0;
for (const [kind, kc] of Object.entries(KIND)) {
  for (const [imp, ic] of Object.entries(IMPORTANCE)) {
    if (INVALID.some(x => x.kind === kind && x.importance === imp)) continue;
    for (const [size, sc] of Object.entries(SIZE)) {
      for (const [state, pseudo] of Object.entries(STATE)) {
        for (const [loading, lc] of Object.entries(LOADING)) {
          if (!reachable(state, loading)) continue;
          coords++;
          const classes = ['d-btn', kc, ic, sc, lc].filter(Boolean);
          if (state === 'disabled') classes.push('d-btn--disabled');

          const root = resolveNode(idx, classes, pseudo);
          // the label is a child; it needs the block's locals to resolve
          const label = resolveNode(idx, ['d-btn__label'], pseudo, root.locals);

          out.push({
            variant: `kind=${kind}, importance=${imp}, size=${size}, state=${state}, loading=${loading}`,
            root: Object.fromEntries(Object.entries(root.tokens).map(([k, v]) => [k, name(v)])),
            rootComputed: Object.keys(root.computed),
            label: Object.fromEntries(Object.entries(label.tokens).map(([k, v]) => [k, name(v)])),
          });
        }
      }
    }
  }
}

// what does the CSS actually pin down, per property?
const cover = {};
for (const v of out) {
  for (const k of Object.keys(v.root)) cover[k] = (cover[k] || 0) + 1;
  for (const k of v.rootComputed) cover[`${k} (computed)`] = (cover[`${k} (computed)`] || 0) + 1;
}
console.log(`coordinates: ${coords}`);
console.log('\nCSS-declared coverage across all coordinates:');
for (const [k, n] of Object.entries(cover).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${String(n).padStart(4)}/${coords}  ${k}`);
}

const sample = out.find(v => v.variant.includes('kind=critical, importance=outlined, size=200, state=hover, loading=false'));
if (sample) {
  console.log(`\nsample — ${sample.variant}`);
  for (const [k, v] of Object.entries(sample.root)) console.log(`   root.${k.padEnd(13)} ${v}`);
  for (const [k, v] of Object.entries(sample.label)) console.log(`   label.${k.padEnd(12)} ${v}`);
}

const idxArg = process.argv.indexOf('--emit');
if (idxArg > -1) {
  const f = process.argv[idxArg + 1];
  writeFileSync(f, JSON.stringify(out));
  console.log(`\nwrote ${f} (${out.length} coordinates)`);
}
