// Diff Dialtone component captures between branches.
//
// Usage:
//   node scripts/diff-captures.mjs <master-capture.json...> -- <next-capture.json...>
//
// Multiple files per side are merged (capture several pages per branch).
// Output: per-component report of structural signatures, class inventory,
// and CSS selector differences — the raw material for extension rules.
import { readFile } from 'node:fs/promises';

const args = process.argv.slice(2);
const sep = args.indexOf('--');
if (sep === -1 || sep === 0 || sep === args.length - 1) {
  console.error('usage: node scripts/diff-captures.mjs <master.json...> -- <next.json...>');
  process.exit(1);
}
const masterFiles = args.slice(0, sep);
const nextFiles = args.slice(sep + 1);

async function loadSide(files) {
  const captures = await Promise.all(
    files.map(async (f) => JSON.parse(await readFile(f, 'utf8'))),
  );
  const side = { components: {}, cssSelectors: new Map(), pages: [] };
  for (const cap of captures) {
    side.pages.push(`${cap.page} (${cap.branch})`);
    for (const [name, data] of Object.entries(cap.components)) {
      if (!side.components[name]) {
        side.components[name] = { signatures: new Map(), classes: new Set() };
      }
      const comp = side.components[name];
      for (const group of data.groups) {
        const existing = comp.signatures.get(group.signature);
        if (existing) {
          existing.count += group.count;
        } else {
          comp.signatures.set(group.signature, {
            count: group.count,
            example: group.examples[0] || null,
          });
        }
        for (const ex of group.examples) {
          for (const node of ex.nodes) {
            for (const cls of node.classes) {
              if (cls.startsWith('d-') || cls === 'sr-only') comp.classes.add(cls);
            }
          }
        }
      }
    }
    for (const rule of cap.cssRules) {
      // Key by selector; keep the first css text and the source.
      if (!side.cssSelectors.has(rule.selector)) {
        side.cssSelectors.set(rule.selector, { css: rule.css, source: rule.source, context: rule.context });
      }
    }
  }
  return side;
}

const master = await loadSide(masterFiles);
const next = await loadSide(nextFiles);

console.log(`master pages: ${master.pages.join(', ')}`);
console.log(`next pages:   ${next.pages.join(', ')}`);

const componentNames = [...new Set([
  ...Object.keys(master.components),
  ...Object.keys(next.components),
])];

function styleDiff(a, b) {
  const out = [];
  const keys = new Set([...Object.keys(a || {}), ...Object.keys(b || {})]);
  for (const k of keys) {
    const av = a?.[k];
    const bv = b?.[k];
    if (av !== bv) out.push(`${k}: ${av ?? '(unset)'} -> ${bv ?? '(unset)'}`);
  }
  return out;
}

for (const name of componentNames) {
  const m = master.components[name] || { signatures: new Map(), classes: new Set() };
  const n = next.components[name] || { signatures: new Map(), classes: new Set() };

  console.log(`\n${'='.repeat(70)}`);
  console.log(`COMPONENT: ${name}`);
  console.log(`  master: ${m.signatures.size} structures, ${m.classes.size} d-* classes`);
  console.log(`  next:   ${n.signatures.size} structures, ${n.classes.size} d-* classes`);

  // Class inventory diff — the raw input for replaceClass rules.
  const onlyMaster = [...m.classes].filter((c) => !n.classes.has(c)).sort();
  const onlyNext = [...n.classes].filter((c) => !m.classes.has(c)).sort();
  if (onlyMaster.length) console.log(`  classes only in MASTER: ${onlyMaster.join(', ')}`);
  if (onlyNext.length) console.log(`  classes only in NEXT:   ${onlyNext.join(', ')}`);
  if (!onlyMaster.length && !onlyNext.length) console.log('  classes: identical inventory');

  // Structural signatures — exact matches carry style diffs; the rest are
  // listed per side for manual mapping (this is where unwrap/remove rules come from).
  const shared = [...n.signatures.keys()].filter((s) => m.signatures.has(s));
  const nextOnly = [...n.signatures.keys()].filter((s) => !m.signatures.has(s));
  const masterOnly = [...m.signatures.keys()].filter((s) => !n.signatures.has(s));

  if (shared.length) {
    console.log(`  shared structures: ${shared.length}`);
    for (const sig of shared) {
      const mEx = m.signatures.get(sig).example;
      const nEx = n.signatures.get(sig).example;
      const rootDiff = styleDiff(mEx?.nodes?.[0]?.styles, nEx?.nodes?.[0]?.styles);
      if (rootDiff.length) {
        console.log(`    ~ ${sig.slice(0, 90)}`);
        for (const d of rootDiff.slice(0, 8)) console.log(`        ${d}`);
      }
    }
  }
  if (nextOnly.length) {
    console.log(`  structures only in NEXT (${nextOnly.length}):`);
    for (const sig of nextOnly) {
      console.log(`    + [x${n.signatures.get(sig).count}] ${sig.slice(0, 110)}`);
    }
  }
  if (masterOnly.length) {
    console.log(`  structures only in MASTER (${masterOnly.length}):`);
    for (const sig of masterOnly) {
      console.log(`    - [x${m.signatures.get(sig).count}] ${sig.slice(0, 110)}`);
    }
  }
}

// CSS selector diff — which component rules exist on one side only.
console.log(`\n${'='.repeat(70)}`);
console.log('CSS RULES');
const mSel = master.cssSelectors;
const nSel = next.cssSelectors;
const selOnlyMaster = [...mSel.keys()].filter((s) => !nSel.has(s)).sort();
const selOnlyNext = [...nSel.keys()].filter((s) => !mSel.has(s)).sort();
console.log(`  master: ${mSel.size} selectors | next: ${nSel.size} selectors`);
if (selOnlyMaster.length) {
  console.log(`  selectors only in MASTER (${selOnlyMaster.length}):`);
  for (const s of selOnlyMaster.slice(0, 60)) console.log(`    - ${s}`);
  if (selOnlyMaster.length > 60) console.log(`    … +${selOnlyMaster.length - 60} more`);
}
if (selOnlyNext.length) {
  console.log(`  selectors only in NEXT (${selOnlyNext.length}):`);
  for (const s of selOnlyNext.slice(0, 60)) console.log(`    + ${s}`);
  if (selOnlyNext.length > 60) console.log(`    … +${selOnlyNext.length - 60} more`);
}

// App-owned overrides: rules NOT sourced from a dialtone stylesheet.
const appRules = [...nSel.entries()].filter(
  ([, v]) => v.source && !/dialtone/i.test(v.source),
);
if (appRules.length) {
  console.log(`\n  app-owned component overrides in NEXT (${appRules.length}):`);
  for (const [sel, v] of appRules.slice(0, 40)) {
    console.log(`    ! ${sel}  [${v.source.split('/').pop()}]`);
  }
}
