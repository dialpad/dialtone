/**
 * Turns the resolved tokens into a Figma variables payload and, unless asked
 * not to, posts it.
 *
 * The diffing, alias resolution and scope handling are the existing
 * `generatePostVariablesPayload`, which already does all three well. What was
 * missing was the input: it read a directory of three hand-maintained files
 * rather than the real token sets. This supplies that input.
 *
 * Usage:
 *   npx tsx sync-scripts/build_variables.ts --dry-run
 *   npx tsx sync-scripts/build_variables.ts
 *
 * Options:
 *   --dry-run        report what would change, post nothing
 *   --file-key KEY   override FILE_KEY from .env
 *   --out FILE       also write the payload to a file, for inspection
 */

import 'dotenv/config';
import { writeFileSync } from 'fs';

import FigmaApi from './figma_api.js';
import { generatePostVariablesPayload, FlattenedTokensByFile } from './token_import.js';
import { gamutMapped, resetGamutLog } from './color.js';
import { resolveModes, compareTokenNames } from './resolve_tokens.js';
import { classify, Classified, ScopeViolation, figmaFontFamily } from './variable_policy.js';
import type { Token } from './token_types.js';
import { toNumber as toNumberWithUnits } from './utils.js';

const toNumber = (value: unknown): number | null => toNumberWithUnits(value, 'px|rem|em|%');

const COLLECTION = 'Dialtone 2026';
const MODES = { light: 'Light', dark: 'Dark' } as const;

/** The theme groups to compose. `base` holds the primitives, `dp` the semantics. */
const GROUPS = ['base', 'dp'];

interface Conversion {
  files: FlattenedTokensByFile;
  /** Aliases whose target is not itself emitted, so they had to be flattened. */
  flattened: { name: string; target: string }[];
  /** Values that could not be turned into a number. */
  unconvertible: { name: string; mode: string; value: string }[];
  /** Font stacks with no family Figma could resolve. */
  unresolvedFonts: { name: string; value: string }[];
  /** Alpha-modified colours that became a real composed-colour alias. */
  composed: { name: string; mode: string; target: string }[];
}

/** `color.surface.primary` becomes `color/surface/primary`, Figma's grouping. */
function figmaName (path: string): string {
  return path.split('.').join('/');
}

function tokenType (figmaType: Classified['figmaType']): Token['$type'] {
  switch (figmaType) {
    case 'COLOR': return 'color';
    case 'STRING': return 'string';
    case 'BOOLEAN': return 'boolean';
    default: return 'number';
  }
}

/** `.17` reads as `17%`, which is how the modifier is actually thought about. */
export function asPercent (value: string): string {
  const n = Number.parseFloat(value);
  if (!Number.isFinite(n)) return value;
  return `${Math.round(n * 1000) / 10}%`;
}

/**
 * The note a variable carries when its value came from another token plus a
 * modifier.
 *
 * Figma has no way to express "that token, at 17% alpha": an alias copies the
 * whole value. So the reference is resolved away and only the resulting colour
 * reaches the canvas, leaving a designer looking at a hex with no idea where it
 * came from. This puts that back as text.
 *
 * Reads the modes separately, because a token can be modified differently in
 * light and dark, and saying so is more use than picking one.
 */
export function descriptionFor (token: Classified['token']): string | null {
  const parts: string[] = [];
  const seen = new Map<string, string[]>();

  for (const [mode, value] of Object.entries(token.modes)) {
    if (!value.from) continue;
    const label = `${value.from.target.split('.').join('/')} · ${value.from.modifier.type} ${asPercent(value.from.modifier.value)}`;
    const modes = seen.get(label) ?? [];
    modes.push(mode);
    seen.set(label, modes);
  }

  if (seen.size === 0) return null;

  // Same everywhere: say it once, without listing modes nobody needs.
  if (seen.size === 1) return [...seen.keys()][0];

  // Separated by a semicolon and a newline. Figma collapses the newline to a
  // space wherever it renders a description, so the punctuation has to carry
  // the structure on its own; the newline stays for anywhere that honours it.
  for (const [label, modes] of seen) parts.push(`${modes.join(', ')}: ${label}`);
  return parts.join(';\n');
}

/**
 * What Dev Mode shows for a variable, per platform.
 *
 * Without this, Figma invents a name from the variable's own path and shows
 * `var(--size-radius-300)`, which is not a custom property that exists. Filling
 * it in means the value a developer copies out of Dev Mode is the one Dialtone
 * actually ships, on all three platforms.
 *
 * The CSS name comes from the build rather than being derived here, so it
 * cannot drift from the stylesheet. The mobile platforms use the same name in
 * camelCase, which is what the Android and iOS outputs emit.
 */
export function codeSyntaxFor (cssName: string): { WEB: string; ANDROID: string; iOS: string } | null {
  if (!cssName) return null;
  const camel = `dt-${cssName}`.replace(/-([a-z0-9])/g, (_, c: string) => c.toUpperCase());
  return {
    WEB: `var(--dt-${cssName})`,
    ANDROID: camel,
    iOS: camel,
  };
}

export function convert (classified: Classified[]): Conversion {
  const modesList = Object.keys(MODES) as (keyof typeof MODES)[];
  const flattened: Conversion['flattened'] = [];
  const unconvertible: Conversion['unconvertible'] = [];
  const unresolvedFonts: Conversion['unresolvedFonts'] = [];
  const composed: Conversion['composed'] = [];

  // Would THIS (token, mode) pair's literal conversion fail? Used for both
  // passes below — a non-alias entry, and an alias entry whose target didn't
  // survive, are checked by the exact same rule, because both end up needing
  // a literal value in the emission loop below.
  const fails = (figmaType: FigmaType, scopes: VariableScope[], resolved: TokenValue): boolean => {
    if (figmaType === 'STRING' && scopes.includes('FONT_FAMILY')) return figmaFontFamily(String(resolved)) === null;
    if (figmaType === 'COLOR' || figmaType === 'STRING' || figmaType === 'BOOLEAN') return false;
    return toNumber(resolved) === null;
  };
  const record = (figmaType: FigmaType, scopes: VariableScope[], name: string, mode: keyof typeof MODES, resolved: TokenValue) => {
    if (figmaType === 'STRING' && scopes.includes('FONT_FAMILY')) unresolvedFonts.push({ name, value: String(resolved) });
    else unconvertible.push({ name, mode, value: String(resolved) });
  };

  // Decide the drop ONCE, across every mode, before building anything. A
  // token that failed conversion in only one mode used to still get emitted
  // for its other modes, from an `emitted` set computed once up front — so
  // Figma either got a variable missing that mode's value, or, if some other
  // token aliased it, a dangling alias with no CREATE behind it, which fails
  // the WHOLE payload with a 400. Dropping a token everywhere the moment it
  // fails anywhere keeps `emitted` an honest description of what is actually
  // about to be created.
  const dropped = new Set<string>();
  for (const entry of classified) {
    const { token, figmaType, scopes } = entry;
    for (const mode of modesList) {
      const modeValue = token.modes[mode];
      if (modeValue.alias) continue;   // handled by the second pass, below
      if (fails(figmaType, scopes, modeValue.resolved)) {
        record(figmaType, scopes, token.name, mode, modeValue.resolved);
        dropped.add(token.name);
      }
    }
  }

  // An alias whose TARGET didn't survive falls back to its own resolved
  // value in the emission loop below — and that fallback can fail the exact
  // same way the target did, since resolution follows the same chain. Left
  // unchecked, the emission loop would force-unwrap that failure straight
  // into the payload (a `null` $value) instead of dropping it, because the
  // first pass skips every alias entry on the assumption it never needs its
  // own literal. That assumption breaks the moment the target is gone.
  //
  // Run to a FIXED POINT, not once. `classified` is sorted by token name, not
  // by dependency order, so a single forward sweep over a 3+ hop chain
  // X -> Y -> Z can miss X: if X sorts before Y, X is checked before Y has
  // been added to `dropped` in THIS same pass, even though Y only fails
  // because Z (dropped in the pass above) already did. Repeating until a
  // whole sweep adds nothing new means the order tokens happen to sort in can
  // no longer decide whether a genuine cascade gets caught.
  let changed = true;
  while (changed) {
    changed = false;
    for (const entry of classified) {
      const { token, figmaType, scopes } = entry;
      if (dropped.has(token.name)) continue;
      for (const mode of modesList) {
        const modeValue = token.modes[mode];
        if (!modeValue.alias || !dropped.has(modeValue.alias)) continue;
        if (fails(figmaType, scopes, modeValue.resolved)) {
          record(figmaType, scopes, token.name, mode, modeValue.resolved);
          dropped.add(token.name);
          changed = true;
          break;
        }
      }
    }
  }

  const usable = classified.filter(c => !dropped.has(c.token.name));
  const emitted = new Set(usable.map(c => c.token.name));
  const files: FlattenedTokensByFile = {};

  for (const mode of modesList) {
    const fileName = `${COLLECTION}.${MODES[mode]}.json`;
    files[fileName] = {};

    for (const entry of usable) {
      const { token, figmaType, scopes } = entry;
      const modeValue = token.modes[mode];
      const name = figmaName(token.name);

      let value: Token['$value'];
      let composedColor: { colorAlias: string; opacity: number } | undefined;

      if (modeValue.alias && emitted.has(modeValue.alias)) {
        // token_import expects the dotted form and converts it to slashes.
        value = `{${modeValue.alias}}`;
      } else {
        if (modeValue.alias) {
          // The target is resolution-only and never becomes a variable, so the
          // reference cannot survive. All of these today point at
          // `material.*`, a layer the CSS build also deliberately flattens.
          flattened.push({ name: token.name, target: modeValue.alias });
        }

        if (figmaType === 'STRING' && scopes.includes('FONT_FAMILY')) {
          // Pre-verified above: this entry would not be in `usable` otherwise.
          value = figmaFontFamily(String(modeValue.resolved))!;
        } else if (figmaType === 'COLOR' || figmaType === 'STRING') {
          value = String(modeValue.resolved);
          // A Tokens Studio `alpha` modifier is the one case resolve_tokens.ts
          // drops the alias for that Figma CAN still represent — as a
          // VariableComposedColor, alias for colour + literal opacity — once
          // the target survives as a real variable of its own. `lighten`,
          // `darken` and `mix` change the actual colour, which composed
          // colour cannot express (it only decouples colour from opacity), so
          // those stay flattened literals; this checks specifically for
          // `alpha` and does nothing for the others.
          if (
            figmaType === 'COLOR' && modeValue.from?.modifier.type === 'alpha'
            && emitted.has(modeValue.from.target)
          ) {
            // Rounded to 4 decimal places — ".07" * 100 is 7.000000000000001
            // in floating point, which is real noise in the payload and in
            // every log line, not a value anyone authored.
            const opacity = Math.round(Number.parseFloat(modeValue.from.modifier.value) * 100 * 1e4) / 1e4;
            if (Number.isFinite(opacity)) {
              composedColor = { colorAlias: modeValue.from.target, opacity };
              composed.push({ name: token.name, mode, target: modeValue.from.target });
            }
          }
        } else if (figmaType === 'BOOLEAN') {
          value = modeValue.resolved === true || modeValue.resolved === 'true';
        } else {
          value = toNumber(modeValue.resolved)!;   // pre-verified above
        }
      }

      const codeSyntax = codeSyntaxFor(token.cssName);
      const description = descriptionFor(token);

      files[fileName][name] = {
        $type: tokenType(figmaType),
        $value: value,
        ...(description ? { $description: description } : {}),
        $extensions: {
          'com.figma': {
            ...(scopes.length ? { scopes } : {}),
            ...(codeSyntax ? { codeSyntax } : {}),
            ...(composedColor ? { composedColor } : {}),
          },
        },
      };
    }
  }

  return { files, flattened, unconvertible, unresolvedFonts, composed };
}

function countPayload (payload: Record<string, unknown[]>): string {
  return Object.entries(payload)
    .filter(([, list]) => list.length)
    .map(([key, list]) => `${key} ${list.length}`)
    .join(', ') || 'nothing';
}

async function main (): Promise<void> {
  const args = process.argv.slice(2);
  const flag = (name: string): string | undefined => {
    const i = args.indexOf(`--${name}`);
    return i >= 0 ? args[i + 1] : undefined;
  };
  const dryRun = args.includes('--dry-run');
  const fileKey = flag('file-key') ?? process.env.FILE_KEY;
  const pat = process.env.PERSONAL_ACCESS_TOKEN;

  if (!pat || !fileKey) {
    console.error('PERSONAL_ACCESS_TOKEN and FILE_KEY are required, in .env or via --file-key');
    process.exit(2);
  }

  resetGamutLog();

  const all = [];
  for (const group of GROUPS) {
    const { tokens, missing } = await resolveModes(group, Object.keys(MODES));
    if (Object.keys(missing).length) {
      console.warn(`${group}: ${Object.keys(missing).length} tokens absent from a mode, skipped`);
    }
    all.push(...tokens);
  }

  // Each group is sorted on its own, so the union has to be sorted again.
  // Ordering is not cosmetic here: Figma has no ordering field, so a variable's
  // position in the panel is the order its CREATE arrived in.
  all.sort((a, b) => compareTokenNames(a.name, b.name));

  const { emit, excluded, unscoped, violations } = classify(all);

  // Refuse before the network call. Figma rejects the whole payload on the
  // first bad type-and-scope pairing and names only that one variable, so
  // finding these one at a time costs a round trip each.
  if (violations.length) {
    console.error(`${violations.length} variables carry a scope Figma will not accept:\n`);
    const byRule: Record<string, ScopeViolation[]> = {};
    for (const v of violations) (byRule[v.rule ?? 'no rule'] ||= []).push(v);
    for (const [rule, list] of Object.entries(byRule)) {
      console.error(`  rule "${rule}" gave ${list[0].scopes.join(', ')} to ${list.length} ${list[0].figmaType} variables`);
      for (const v of list.slice(0, 5)) console.error(`      ${v.name}`);
      if (list.length > 5) console.error(`      and ${list.length - 5} more`);
    }
    process.exit(1);
  }

  const { files, flattened, unconvertible, unresolvedFonts, composed } = convert(emit);

  console.log(`resolved        : ${all.length}`);
  console.log(`excluded        : ${excluded.length}`);
  console.log(`variables       : ${emit.length}`);
  console.log(`unscoped        : ${unscoped.length}`);
  console.log(`flattened alias : ${flattened.length / Object.keys(MODES).length} (target is resolution-only)`);
  console.log(`composed colour : ${composed.length} (alpha-modified, now a real alias + opacity)`);
  console.log(`unconvertible   : ${unconvertible.length}`);
  console.log(`unresolved font : ${unresolvedFonts.length}`);
  for (const f of unresolvedFonts.slice(0, 5)) console.log(`  ${f.name} = ${f.value.slice(0, 60)}`);

  // Fatal rather than reported. `convert()` drops the WHOLE token (every
  // mode, not just the one that failed) the moment either list is non-empty
  // for it, so carrying on posts a payload silently missing that token
  // entirely — and exits 0 either way. `unresolvedFonts` uses the identical
  // drop-everywhere mechanism as `unconvertible` now, so it gets the same
  // fatal treatment: a partial run is no safer for a font that failed than
  // for a number that failed.
  if (unconvertible.length || unresolvedFonts.length) {
    if (unconvertible.length) {
      console.error('\nunconvertible values, nothing posted:');
      for (const u of unconvertible.slice(0, 10)) {
        console.error(`  ${u.name} [${u.mode}] = ${u.value}`);
      }
      if (unconvertible.length > 10) {
        console.error(`  … and ${unconvertible.length - 10} more`);
      }
    }
    if (unresolvedFonts.length) {
      console.error('\nunresolved font families, nothing posted:');
      for (const f of unresolvedFonts.slice(0, 10)) {
        console.error(`  ${f.name} = ${f.value.slice(0, 60)}`);
      }
      if (unresolvedFonts.length > 10) {
        console.error(`  … and ${unresolvedFonts.length - 10} more`);
      }
    }
    process.exit(1);
  }

  const api = new FigmaApi(pat);
  const local = await api.getLocalVariables(fileKey);
  const existing = Object.values(local.meta.variableCollections).find(c => c.name === COLLECTION);
  console.log(`\ntarget file     : ${fileKey.slice(0, 6)}…${fileKey.slice(-4)}`);
  console.log(`collection      : "${COLLECTION}" ${existing ? `exists, ${existing.variableIds.length} variables` : 'does not exist yet'}`);

  const payload = generatePostVariablesPayload(files, local);

  // Colours are converted during payload generation, so the gamut log is only
  // meaningful after that call.
  const uniqueMapped = new Set(gamutMapped.map(g => g.from));
  if (uniqueMapped.size) {
    console.log(`\ngamut-mapped    : ${uniqueMapped.size} distinct colours outside sRGB, chroma reduced`);
    for (const from of [...uniqueMapped].slice(0, 5)) console.log(`  ${from}`);
  }

  console.log(`\npayload         : ${countPayload(payload as never)}`);

  const out = flag('out');
  if (out) {
    writeFileSync(out, JSON.stringify(payload, null, 2));
    console.log(`written         : ${out}`);
  }

  if (dryRun) {
    console.log('\ndry run, nothing posted');
    return;
  }

  const every = Object.values(payload as Record<string, unknown[]>).every(v => v.length === 0);
  if (every) {
    console.log('\nalready up to date, nothing to post');
    return;
  }

  try {
    const response = await api.postVariables(fileKey, payload);
    // The response carries a temp-id to real-id map for every variable, which
    // is tens of thousands of characters and of no use once the write landed.
    const created = Object.keys(response?.meta?.tempIdToRealId ?? {}).length;
    console.log(`\nposted          : status ${response?.status ?? 200}, ${created} ids assigned`);
  } catch (error) {
    // Never let the raw error surface. Axios attaches the whole request config
    // to a failure, headers included, so printing it puts the access token in
    // the terminal and in whatever log or transcript is capturing it.
    const e = error as { response?: { status?: number; data?: unknown }; message?: string };
    console.error(`\nPOST failed: ${e.response?.status ?? 'no status'}`);
    console.error(JSON.stringify(e.response?.data ?? e.message ?? 'no detail', null, 2).slice(0, 4000));
    process.exit(1);
  }
}

main().catch(error => {
  const e = error as { response?: { status?: number; data?: unknown }; message?: string };
  console.error(`failed: ${e.response?.status ?? ''} ${JSON.stringify(e.response?.data ?? e.message ?? error)}`.slice(0, 2000));
  process.exit(1);
});
