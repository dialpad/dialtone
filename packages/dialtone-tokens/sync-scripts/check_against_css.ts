/**
 * Checks the resolver against the CSS Dialtone actually ships.
 *
 * The CSS build is the proven consumer of these token sets, so it is the
 * reference implementation. Any value the resolver produces that the CSS build
 * disagrees with is a resolver bug, not a judgement call. That makes this the
 * one check worth running before Figma is involved at all.
 *
 * Two differences are expected and reconciled rather than reported:
 *
 *   units   the CSS build converts dimensions to rem against a 10px root, and
 *           Figma wants px, so rem values are multiplied back up
 *   names   Style Dictionary emits `--dt-` prefixed kebab-case, so token paths
 *           are converted the same way before matching
 *
 * Usage:  npx tsx sync-scripts/check_against_css.ts
 */

import { readFileSync, existsSync } from 'fs';

import { parse, converter } from 'culori';

import { resolveModes } from './resolve_tokens.js';
import { classify } from './variable_policy.js';

const ROOT_FONT_SIZE = Number.parseFloat(
  JSON.parse(readFileSync('./tokens/root.json', 'utf8')).font.size.root.value,
);

/** `color.surface.primary` becomes `--dt-color-surface-primary`. */
function cssNameFor (path: string): string {
  const kebab = path
    .split('.')
    .map(seg => seg.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase())
    .join('-');
  return `--dt-${kebab}`;
}

function parseCss (file: string): Map<string, string> {
  const out = new Map<string, string>();
  for (const m of readFileSync(file, 'utf8').matchAll(/(--dt-[a-z0-9-]+)\s*:\s*([^;]+);/g)) {
    out.set(m[1], m[2].trim());
  }
  return out;
}

/** rem to px, so a resolver px value and a CSS rem value can be compared. */
function normalise (value: string): string {
  const trimmed = String(value).trim();
  const rem = trimmed.match(/^(-?[\d.]+)rem$/);
  if (rem) return `${round(Number.parseFloat(rem[1]) * ROOT_FONT_SIZE)}px`;
  const px = trimmed.match(/^(-?[\d.]+)px$/);
  if (px) return `${round(Number.parseFloat(px[1]))}px`;
  const num = trimmed.match(/^-?[\d.]+$/);
  if (num) return String(round(Number.parseFloat(trimmed)));
  return trimmed;
}

/** Four decimals is well inside a pixel and absorbs rem round-tripping. */
function round (n: number): number {
  return Math.round(n * 1e4) / 1e4;
}

interface Finding {
  name: string;
  mode: string;
  cssName: string;
  expected: string;
  got: string;
}

const toRgbColor = converter('rgb');

/**
 * A colour reduced to a comparable string. Both sides are converted to sRGB
 * first, so the same colour written as `oklch(...)` on one side and `#rrggbb`
 * on the other still matches.
 */
function colorKey (value: string, alphaOverride?: number): string | null {
  const parsed = parse(value);
  if (!parsed) return null;
  const rgb = toRgbColor(parsed);
  if (!rgb) return null;
  const q = (n: number) => Math.round(Math.min(1, Math.max(0, n)) * 255);
  const alpha = Math.round((alphaOverride ?? rgb.alpha ?? 1) * 100) / 100;
  return `${q(rgb.r)},${q(rgb.g)},${q(rgb.b)},${alpha}`;
}

/**
 * Collapses `oklch(from X l c h / N)` down to a plain colour.
 *
 * These nest: X is often another relative colour, because one alpha variant is
 * built on top of another. Handling only the outer layer leaves the inner one
 * unparseable, which is what made the first version of this check quietly skip
 * every relative colour in the file rather than verify it.
 */
function flattenRelative (value: string, depth = 0): string | null {
  const trimmed = value.trim();
  if (depth > 10) return null;

  const match = trimmed.match(/^oklch\(\s*from\s+(.+?)\s+l\s+c\s+h\s*\/\s*([\d.]+)\s*\)$/);
  if (!match) return parse(trimmed) ? trimmed : null;

  const inner = flattenRelative(match[1], depth + 1);
  if (inner === null) return null;

  const parsed = parse(inner);
  if (!parsed) return null;
  const rgb = toRgbColor(parsed);
  if (!rgb) return null;

  // `l c h` keeps the source channels, so only the alpha changes.
  return `rgba(${Math.round(Math.min(1, Math.max(0, rgb.r)) * 255)}, ${Math.round(Math.min(1, Math.max(0, rgb.g)) * 255)}, ${Math.round(Math.min(1, Math.max(0, rgb.b)) * 255)}, ${match[2]})`;
}

/** The same colour with its alpha replaced, as a comparable key. */
function withAlpha (value: string, alpha: number): string | null {
  const flat = flattenRelative(value);
  return flat === null ? null : colorKey(flat, alpha);
}

/** Substitute `var(--dt-x)` with x's own value, repeatedly, up to a depth cap. */
function flattenCssRefs (value: string, css: Map<string, string>, depth = 0): string {
  if (depth > 10 || !value.includes('var(')) return value;
  const next = value.replace(/var\((--dt-[a-z0-9-]+)\)/g, (whole, name) => css.get(name) ?? whole);
  if (next === value) return value;
  return flattenCssRefs(next, css, depth + 1);
}

/**
 * Evaluate a CSS length expression to a number of pixels. Deliberately narrow:
 * digits, the four operators, parentheses, `calc` and the two length units.
 * Anything else returns null and is counted as uncheckable rather than guessed
 * at, because a check that quietly accepts what it cannot parse is worse than
 * one that admits the gap.
 */
function evaluate (expression: string): number | null {
  const stripped = expression.replace(/calc/g, '');
  if (!/^[\d\s.+\-*/()a-z]*$/.test(stripped)) return null;

  const toPx = stripped
    .replace(/(-?[\d.]+)rem/g, (_, n) => String(Number.parseFloat(n) * ROOT_FONT_SIZE))
    .replace(/(-?[\d.]+)px/g, '$1');

  if (!/^[\d\s.+\-*/()]+$/.test(toPx)) return null;

  try {
    // eslint-disable-next-line no-new-func
    const result = Function(`"use strict"; return (${toPx});`)();
    return Number.isFinite(result) ? (result as number) : null;
  } catch {
    return null;
  }
}

async function main (): Promise<void> {
  const modes = ['light', 'dark'];

  // Each theme group emits its own CSS file, and only the tokens from its
  // `enabled` sets land in it. `base` carries the primitives, `dp` carries the
  // semantics, so each group has to be checked against its own output or every
  // primitive reads as missing.
  const groups = ['base', 'dp'];
  const cssFile = (group: string, mode: string) => `dist/css/tokens-${group}-${mode}.css`;

  for (const group of groups) {
    for (const mode of modes) {
      const file = cssFile(group, mode);
      if (!existsSync(file)) {
        console.error(`Missing ${file}. Run: pnpm nx run dialtone-tokens:build`);
        process.exit(2);
      }
    }
  }

  const findings: Finding[] = [];
  const absent: string[] = [];
  let compared = 0;
  let referenced = 0;
  const uncheckable: string[] = [];
  let collapsed = 0;
  let emitTotal = 0;
  let excludedTotal = 0;
  let unscopedTotal = 0;

  for (const group of groups) {
    const resolved = await resolveModes(group, modes);
    const { emit, excluded, unscoped } = classify(resolved.tokens);
    emitTotal += emit.length;
    excludedTotal += excluded.length;
    unscopedTotal += unscoped.length;

    for (const mode of modes) {
      // A `dp` token can reference a `base` variable, so resolving a reference
      // needs both files. The group's own file wins where they overlap, and
      // matching a token to its declaration still uses only that file, further
      // down, so this widens resolution without widening the comparison.
      const css = parseCss(cssFile(group, mode));
      const lookup = new Map(parseCss(cssFile('base', mode)));
      for (const [k, v] of css) lookup.set(k, v);

      for (const { token } of emit) {
        const cssName = cssNameFor(token.name);
        const inCss = css.get(cssName);

        if (inCss === undefined) {
          if (mode === modes[0]) absent.push(token.name);
          continue;
        }

        // Where the CSS build kept a reference it emits `var(--dt-other)`,
        // sometimes wrapped in a `calc()`. Comparing the resolved value is not
        // possible, but the reference itself is: a token the CSS emitted as
        // `var(--dt-x)` must be an alias to `x` in the resolver, or the alias
        // graph the Figma file gets is not the graph Dialtone ships. Aliases
        // are most of the file, so skipping these would leave the majority of
        // the output unchecked.
        const pureRef = inCss.trim().match(/^var\((--dt-[a-z0-9-]+)\)$/);
        if (pureRef) {
          compared++;
          const { alias, raw, resolved } = token.modes[mode];

          if (alias && cssNameFor(alias) === pureRef[1]) continue;

          // Style Dictionary collapses an identity expression like
          // `{font.size.root} * 1` back to a bare reference. The resolver keeps
          // it as a number, correctly: Figma has no way to express an alias
          // multiplied by one, it is either a reference or a value. Accept it
          // when the sole reference is the one the CSS kept and the numbers
          // agree, and count it separately so it stays visible.
          const refs = [...String(raw).matchAll(/\{([^{}]+)\}/g)].map(m => m[1]);
          const target = lookup.get(pureRef[1]);
          if (
            refs.length === 1 &&
            cssNameFor(refs[0]) === pureRef[1] &&
            target !== undefined &&
            normalise(flattenCssRefs(target, lookup)) === normalise(String(resolved))
          ) {
            collapsed++;
            continue;
          }

          findings.push({
            name: token.name,
            mode,
            cssName,
            expected: pureRef[1],
            got: alias ? cssNameFor(alias) : `(not an alias: ${resolved})`,
          });
          continue;
        }

        // A relative colour: take the referenced colour and replace its alpha.
        // The resolver computes these itself, so this is the only check that
        // covers that code. Resolving it independently from the CSS side means
        // a mistake in the resolver shows up as a disagreement rather than as
        // an uncheckable value nobody looks at.
        const relative = inCss.trim().match(
          /^oklch\(\s*from\s+var\((--dt-[a-z0-9-]+)\)\s+l\s+c\s+h\s*\/\s*([\d.]+)\s*\)$/,
        );
        if (relative) {
          const source = lookup.get(relative[1]);
          const resolvedSource = source ? flattenCssRefs(source, lookup) : undefined;
          const want = resolvedSource ? withAlpha(resolvedSource, Number(relative[2])) : null;
          if (want === null) {
            referenced++;
            uncheckable.push(`${token.name} [${mode}] relative: ${inCss}`);
            continue;
          }
          compared++;
          const got = colorKey(String(token.modes[mode].resolved));
          if (got !== want) {
            findings.push({ name: token.name, mode, cssName, expected: want, got: got ?? 'unparseable' });
          }
          continue;
        }

        // Anything else containing a reference is an expression. Resolve the
        // references out of the CSS itself and evaluate, so the number can
        // still be compared.
        if (inCss.includes('var(')) {
          const flat = flattenCssRefs(inCss, lookup);
          const value = evaluate(flat);
          if (value === null) {
            referenced++;
            uncheckable.push(`${token.name} [${mode}] expr: ${inCss}`);
            continue;
          }
          compared++;
          const expected = normalise(`${round(value)}px`);
          const got = normalise(String(token.modes[mode].resolved));
          if (expected !== got) {
            findings.push({ name: token.name, mode, cssName, expected, got });
          }
          continue;
        }

        compared++;
        const expected = normalise(inCss);
        const got = normalise(String(token.modes[mode].resolved));

        if (expected !== got) {
          findings.push({ name: token.name, mode, cssName, expected, got });
        }
      }
    }
  }

  const emit = { length: emitTotal };
  const excluded = { length: excludedTotal };
  const unscoped = { length: unscopedTotal };

  console.log(`variables to emit : ${emit.length}`);
  console.log(`excluded          : ${excluded.length}`);
  console.log(`unscoped          : ${unscoped.length}`);
  console.log(`values compared   : ${compared}`);
  console.log(`identity refs     : ${collapsed}  (CSS collapsed an "x times 1" expression to a bare ref)`);
  console.log(`uncheckable       : ${referenced}  (expression the check will not guess at)`);
  if (uncheckable.length) {
    const shapes: Record<string, number> = {};
    for (const u of uncheckable) {
      const shape = u.replace(/^.*?\] /, '').replace(/--dt-[a-z0-9-]+/g, 'REF').replace(/[\d.]+/g, 'N');
      shapes[shape] = (shapes[shape] ?? 0) + 1;
    }
    for (const [shape, count] of Object.entries(shapes).sort((a, b) => b[1] - a[1]).slice(0, 6)) {
      console.log(`  ${String(count).padStart(4)}  ${shape}`);
    }
  }
  console.log(`not found in CSS  : ${absent.length}`);
  console.log(`disagreements     : ${findings.length}`);

  if (absent.length) {
    const byPrefix: Record<string, number> = {};
    for (const name of absent) {
      const prefix = name.split('.').slice(0, 2).join('.');
      byPrefix[prefix] = (byPrefix[prefix] ?? 0) + 1;
    }
    console.log('\nnot found in CSS, by namespace:');
    for (const [prefix, count] of Object.entries(byPrefix).sort((a, b) => b[1] - a[1]).slice(0, 15)) {
      console.log(`  ${String(count).padStart(4)}  ${prefix}`);
    }
  }

  if (findings.length) {
    const byName: Record<string, number> = {};
    for (const f of findings) {
      const prefix = f.name.split('.').slice(0, 2).join('.');
      byName[prefix] = (byName[prefix] ?? 0) + 1;
    }
    console.log('\ndisagreements by namespace:');
    for (const [prefix, count] of Object.entries(byName).sort((a, b) => b[1] - a[1])) {
      console.log(`  ${String(count).padStart(4)}  ${prefix}`);
    }
    console.log('\nfirst 20:');
    for (const f of findings.slice(0, 20)) {
      console.log(`  ${f.name} [${f.mode}]`);
      console.log(`      css ${f.cssName} = ${f.expected}`);
      console.log(`      resolver        = ${f.got}`);
    }
  }

  process.exit(findings.length ? 1 : 0);
}

main();
