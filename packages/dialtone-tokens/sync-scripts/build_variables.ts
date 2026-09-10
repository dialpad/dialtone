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

/** `"4px"` becomes `4`. Returns null when there is no number to be had. */
export function toNumber (value: unknown): number | null {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  const match = String(value).trim().match(/^(-?[\d.]+)(px|rem|em|%)?$/);
  if (!match) return null;
  const n = Number.parseFloat(match[1]);
  return Number.isFinite(n) ? n : null;
}

export function convert (classified: Classified[]): Conversion {
  const emitted = new Set(classified.map(c => c.token.name));
  const files: FlattenedTokensByFile = {};
  const flattened: Conversion['flattened'] = [];
  const unconvertible: Conversion['unconvertible'] = [];
  const unresolvedFonts: Conversion['unresolvedFonts'] = [];

  for (const mode of Object.keys(MODES) as (keyof typeof MODES)[]) {
    const fileName = `${COLLECTION}.${MODES[mode]}.json`;
    files[fileName] = {};

    for (const entry of classified) {
      const { token, figmaType, scopes } = entry;
      const modeValue = token.modes[mode];
      const name = figmaName(token.name);

      let value: Token['$value'];

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
          // A CSS stack cannot be bound to a text layer. Resolve it to the one
          // family Figma can actually apply.
          const family = figmaFontFamily(String(modeValue.resolved));
          if (family === null) {
            unresolvedFonts.push({ name: token.name, value: String(modeValue.resolved) });
            continue;
          }
          value = family;
        } else if (figmaType === 'COLOR' || figmaType === 'STRING') {
          value = String(modeValue.resolved);
        } else if (figmaType === 'BOOLEAN') {
          value = modeValue.resolved === true || modeValue.resolved === 'true';
        } else {
          const n = toNumber(modeValue.resolved);
          if (n === null) {
            unconvertible.push({ name: token.name, mode, value: String(modeValue.resolved) });
            continue;
          }
          value = n;
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
          },
        },
      };
    }
  }

  return { files, flattened, unconvertible, unresolvedFonts };
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

  const { files, flattened, unconvertible, unresolvedFonts } = convert(emit);

  console.log(`resolved        : ${all.length}`);
  console.log(`excluded        : ${excluded.length}`);
  console.log(`variables       : ${emit.length}`);
  console.log(`unscoped        : ${unscoped.length}`);
  console.log(`flattened alias : ${flattened.length / Object.keys(MODES).length} (target is resolution-only)`);
  console.log(`unconvertible   : ${unconvertible.length}`);
  console.log(`unresolved font : ${unresolvedFonts.length}`);
  for (const f of unresolvedFonts.slice(0, 5)) console.log(`  ${f.name} = ${f.value.slice(0, 60)}`);

  // Fatal rather than reported. `convert()` omits the mode value it could not
  // parse, so carrying on posts a payload that leaves an existing variable at
  // its stale value, or creates one missing a mode — and exits 0 either way.
  if (unconvertible.length) {
    console.error('\nunconvertible values, nothing posted:');
    for (const u of unconvertible.slice(0, 10)) {
      console.error(`  ${u.name} [${u.mode}] = ${u.value}`);
    }
    if (unconvertible.length > 10) {
      console.error(`  … and ${unconvertible.length - 10} more`);
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
