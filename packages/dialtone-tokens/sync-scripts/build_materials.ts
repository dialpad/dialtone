/**
 * Writes the material dimension as extended Figma collections.
 *
 * A material swaps the black ramp and nothing else: each set redefines the
 * twenty `color.black.*` steps and every semantic colour resolves differently
 * as a result. In Figma that is an extended collection, which inherits the
 * parent's variables, modes, names, scopes and order, and overrides values.
 *
 * Most of the work happens by inheritance. A semantic that aliases
 * `color/black/900` follows the override automatically, so only two kinds of
 * variable need writing out:
 *
 *   the black ramp itself, which is what the material changes
 *   anything holding a literal, which is mostly the tokens that reference a
 *   primitive and then modify its alpha, and so could not stay an alias
 *
 * That second group is the reason this exists rather than being free. Roughly
 * 130 values per material, against 175 that inherit.
 *
 * Usage:
 *   npx tsx sync-scripts/build_materials.ts --dry-run
 *   npx tsx sync-scripts/build_materials.ts
 *
 * Options:
 *   --dry-run                report what would change, post nothing
 *   --file-key KEY            override FILE_KEY from .env
 *   --local-snapshot FILE     skip the REST read of existing variables and use
 *                             this file instead — a JSON dump shaped like
 *                             ApiGetLocalVariablesResponse (same recovery
 *                             valve as build_variables.ts's flag of the same
 *                             name, for when REST's view of /variables/local
 *                             is stale or wrong). Must include the parent
 *                             "Dialtone 2026" collection/variables AND each
 *                             material's own collection entry (with its real
 *                             id/modes and whatever `variableOverrides` it
 *                             actually currently holds).
 */

import 'dotenv/config';

import FigmaApi, { ApiGetLocalVariablesResponse, loadLocalSnapshot } from './figma_api.js';
import { parseColor, colorApproximatelyEqual } from './color.js';
import { resolveModes, ResolvedToken } from './resolve_tokens.js';
import { classify, FigmaType } from './variable_policy.js';
import { toNumber as toNumberWithUnits } from './utils.js';
import { staleOverrides } from './stale_overrides.js';

// See the matching override in build_variables.ts: the preview file names
// its collection differently so its CI job can't collide with the main file's.
const PARENT = process.env.COLLECTION_NAME ?? 'Dialtone 2026';

/** Sandstone is the default and lives in the parent, so it is not a material here. */
const MATERIALS = ['steel', 'graphite', 'iron', 'amethyst', 'jade'];

const MODES = { light: 'Light', dark: 'Dark' } as const;
const GROUPS = ['base', 'dp'];

/** `steel` becomes `Dialtone 2026 / Steel`. */
function collectionNameFor (material: string): string {
  return `${PARENT} / ${material[0].toUpperCase()}${material.slice(1)}`;
}

async function resolveAll (extraSets?: string[]): Promise<ResolvedToken[]> {
  // Deduplicated by name, keeping the first. A material set is emitted by every
  // group that reads it, so the black ramp would otherwise appear twice and the
  // second copy, resolved in a theme that does not own those tokens, would win.
  const seen = new Set<string>();
  const out: ResolvedToken[] = [];
  for (const group of GROUPS) {
    const { tokens } = await resolveModes(group, Object.keys(MODES), extraSets ? { extraSets } : {});
    for (const token of tokens) {
      if (seen.has(token.name)) continue;
      seen.add(token.name);
      out.push(token);
    }
  }
  return out;
}

const toNumber = (value: unknown): number | null => toNumberWithUnits(value, 'px|rem|em');

/** The same conversion the main sync applies, for the value being overridden. */
function figmaValue (figmaType: FigmaType, resolved: unknown): unknown | null {
  if (figmaType === 'COLOR') {
    try { return parseColor(String(resolved)); } catch { return null; }
  }
  if (figmaType === 'STRING') return String(resolved);
  if (figmaType === 'BOOLEAN') return resolved === true || resolved === 'true';
  return toNumber(resolved);
}

/**
 * Whether an override already stored in Figma matches what we would write.
 *
 * Cannot be an exact comparison: Figma stores colours and floats at single
 * precision, so a 0.9 sent from here reads back as 0.8999999761581421 and every
 * run would rewrite every override. Colours also come back with an explicit
 * alpha where we sent none.
 */
function sameValue (stored: unknown, wanted: unknown): boolean {
  if (stored === undefined) return false;
  if (typeof stored === 'number' && typeof wanted === 'number') {
    // Same fix as token_import.ts's numbersApproximatelyEqual, and for the
    // same reason: Figma stores floats as float32, and a relative 1e-6
    // tolerance is looser than the float32 rounding floor — wide enough to
    // treat a genuine value change as noise and silently skip the override.
    return Math.fround(stored) === Math.fround(wanted);
  }
  const isColor = (v: unknown): v is { r: number; g: number; b: number; a?: number } =>
    typeof v === 'object' && v !== null && 'r' in v;
  if (isColor(stored) && isColor(wanted)) return colorApproximatelyEqual(stored, wanted);
  return JSON.stringify(stored) === JSON.stringify(wanted);
}

interface Override {
  name: string;
  mode: keyof typeof MODES;
  value: unknown;
}

/**
 * What a material has to state explicitly.
 *
 * A variable that is an alias to the same target in both stays an alias, and
 * the override on its target reaches it without help. Anything else has to be
 * written, because an extension overrides values and cannot re-point an alias.
 */
function overridesFor (
  parent: Map<string, ResolvedToken>,
  material: ResolvedToken[],
  types: Map<string, FigmaType>,
): { overrides: Override[]; unconvertible: string[] } {
  const out: Override[] = [];
  // Named and reported at the call site, not dropped — a silent `continue`
  // here reads as a clean run while Figma holds a value nothing in the
  // tokens asks for.
  const unconvertible: string[] = [];

  for (const token of material) {
    const figmaType = types.get(token.name);
    if (figmaType === undefined) continue; // not emitted, so nothing to override
    const before = parent.get(token.name);
    if (!before) continue;

    for (const mode of Object.keys(MODES) as (keyof typeof MODES)[]) {
      const was = before.modes[mode];
      const now = token.modes[mode];

      // Same alias in both: the override on the target propagates.
      if (was.alias !== null && was.alias === now.alias) continue;
      if (String(was.resolved) === String(now.resolved)) continue;

      const value = figmaValue(figmaType, now.resolved);
      if (value === null) { unconvertible.push(`${token.name} [${mode}]`); continue; }
      out.push({ name: token.name, mode, value });
    }
  }

  return { overrides: out, unconvertible };
}

async function main (): Promise<void> {
  const args = process.argv.slice(2);
  const flag = (name: string): string | undefined => {
    const i = args.indexOf(`--${name}`);
    return i >= 0 ? args[i + 1] : undefined;
  };
  const dryRun = args.includes('--dry-run');
  const localSnapshot = flag('local-snapshot');
  const pat = process.env.PERSONAL_ACCESS_TOKEN;
  const fileKey = flag('file-key') ?? process.env.FILE_KEY;
  if (!pat || !fileKey) {
    console.error('PERSONAL_ACCESS_TOKEN and FILE_KEY are required, in .env or via --file-key');
    process.exit(2);
  }

  const api = new FigmaApi(pat);
  const snapshot: ApiGetLocalVariablesResponse | null = localSnapshot
    ? loadLocalSnapshot(localSnapshot)
    : null;
  const getLocal = async (): Promise<ApiGetLocalVariablesResponse> =>
    snapshot ?? api.getLocalVariables(fileKey);
  if (snapshot) console.log(`\n--local-snapshot: skipping REST read, using ${localSnapshot}`);

  const parentTokens = await resolveAll();
  const classified = classify(parentTokens);
  const types = new Map<string, FigmaType>(classified.emit.map(e => [e.token.name, e.figmaType]));
  const parent = new Map(parentTokens.map(t => [t.name, t]));

  let local = await getLocal();
  const parentCollection = Object.values(local.meta.variableCollections).find(c => c.name === PARENT);
  if (!parentCollection) {
    console.error(`No "${PARENT}" collection in the file. Run build_variables.ts first.`);
    process.exit(1);
  }
  console.log(`parent      : "${PARENT}", ${parentCollection.variableIds.length} variables\n`);

  // Set whenever a material posts less than its full desired state — an
  // override this run knows about but couldn't address or convert. The loop
  // still posts everything else it safely can; this only decides the
  // process's own exit status, so CI stops treating that as a clean run (the
  // workflow's "✅ Synced" comment is driven by the job's exit code, and
  // reads every material as fully in sync otherwise).
  let incomplete = false;

  // Said out loud rather than dropped. A silent skip here reads as a clean
  // run while Figma holds a value nothing in the tokens asks for.
  const report = (name: string, label: string, items: string[]) => {
    if (items.length === 0) return;
    console.log(`${name}: ${items.length} ${label}`);
    for (const item of items.slice(0, 10)) console.log(`    ${item}`);
    if (items.length > 10) console.log(`    … and ${items.length - 10} more`);
  };

  for (const material of MATERIALS) {
    const name = collectionNameFor(material);
    const tokens = await resolveAll([`base/material/${material}`]);
    const { overrides, unconvertible: unconvertibleOverrides } = overridesFor(parent, tokens, types);

    // Checked here, not after the collection-creation branch below: a
    // brand-new material's `continue` on --dry-run (right below) never
    // reaches that later check, which silently dropped this exact report in
    // precisely the one case — --dry-run against a material with no
    // collection yet — this flag exists to stop happening.
    report(name, 'wanted overrides could not be converted to a Figma value', unconvertibleOverrides);
    if (unconvertibleOverrides.length > 0) incomplete = true;

    let collection = Object.values(local.meta.variableCollections).find(c => c.name === name);

    if (!collection) {
      if (dryRun) {
        console.log(`${name}: would create, ${overrides.length} overrides`);
        continue;
      }
      const created = await api.postVariables(fileKey, {
        variableCollections: [{
          action: 'CREATE',
          id: `temp-${material}`,
          name,
          parentVariableCollectionId: parentCollection.id,
        }],
      } as never);
      const id = (created as { meta?: { tempIdToRealId?: Record<string, string> } })
        .meta?.tempIdToRealId?.[`temp-${material}`];
      // A real REST read, not `getLocal()` — deliberately ignores
      // --local-snapshot. The POST response only echoes tempIdToRealId, never
      // the created collection's modes, and this material's real modeIds
      // (needed just below) exist nowhere else to read them from, snapshot or
      // not. `local` reverts to the snapshot on the next refresh (see the end
      // of this loop), so this one live read does not leak into how later
      // materials resolve their own, differently-named collections.
      local = await api.getLocalVariables(fileKey);
      collection = Object.values(local.meta.variableCollections).find(c => c.id === id);
      if (!collection) throw new Error(`Could not create ${name}`);
    }

    // The extension's modes carry encoded ids of the form
    // `<collectionId>/<modeId>`, which is how an override is addressed rather
    // than the parent's own value. Matched by name, since the extension
    // inherits the parent's mode names.
    const modeIdFor = new Map<string, string>(
      collection.modes.map(m => [m.name, m.modeId]));

    const byName = new Map<string, string>();
    for (const [id, variable] of Object.entries(local.meta.variables)) {
      // A deleted-but-referenced ghost shares its name with the live variable
      // it replaced; Figma keeps returning it while something still points at
      // it. Letting it win this map would address an override at the ghost's
      // id instead of the live variable's.
      if (variable.deletedButReferenced) continue;
      if (variable.variableCollectionId === parentCollection.id) byName.set(variable.name, id);
    }

    const existing = (collection as { variableOverrides?: Record<string, Record<string, unknown>> })
      .variableOverrides ?? {};

    // Every override this material should have, addressed the way Figma stores
    // them. Kept apart from the write list because a key can be wanted and
    // already correct, which is the common case on a repeat run.
    const wanted = new Map<string, { variableId: string; modeId: string; value: unknown }>();
    const unaddressable: string[] = [];
    for (const o of overrides) {
      const variableId = byName.get(o.name.split('.').join('/'));
      const modeId = modeIdFor.get(MODES[o.mode]);
      if (!variableId || !modeId) { unaddressable.push(`${o.name} [${o.mode}]`); continue; }
      wanted.set(`${variableId}/${modeId}`, { variableId, modeId, value: o.value });
    }

    const payload = [...wanted.values()]
      // Already overridden with the same value: leave it alone, so a repeat run
      // is a no-op the way the main sync is.
      .filter(o => !sameValue(existing[o.variableId]?.[o.modeId], o.value));

    // Deleted outright, via `value: null` on the extended mode — confirmed
    // directly against a real extended collection that this removes the
    // override and lets inheritance resume, which REST's own docs for
    // `VariableModeValue` also state. Writing the parent's own resolved value
    // here instead (an earlier version of this script did) looks equivalent
    // but isn't: a semantic that merely *aliases* a primitive with its own
    // material override — `color.surface.primary` referencing
    // `color.black.100`, where `black.100` itself still varies by material —
    // would have that alias permanently severed in favour of a frozen,
    // parent-only literal, silently wrong for every material from then on.
    // See `staleOverrides` for why this is skipped whenever addressing failed.
    const stale = staleOverrides(existing, wanted, unaddressable);

    report(name, 'overrides could not be addressed, no such variable or mode', unaddressable);
    if (unaddressable.length > 0) incomplete = true;

    if (dryRun) {
      console.log(`${name}: ${wanted.size} overrides, ${payload.length} to write, ${stale.length} stale to delete`);
      continue;
    }

    const writes = [...payload, ...stale.map(s => ({ ...s, value: null }))];
    if (writes.length === 0) {
      console.log(`${name}: up to date`);
      continue;
    }

    await api.postVariables(fileKey, { variableModeValues: writes } as never);
    console.log(
      `${name}: wrote ${payload.length} overrides` +
      (stale.length ? `, deleted ${stale.length} stale` : ''));
    local = await getLocal();
  }

  if (incomplete) {
    console.error('\nfailed: one or more materials left unaddressed or unconvertible overrides — see above');
    process.exitCode = 1;
  }
}

main().catch((error: { response?: { status?: number; data?: unknown }; message?: string }) => {
  console.error(`failed: ${error.response?.status ?? ''} ${JSON.stringify(error.response?.data ?? error.message).slice(0, 1000)}`);
  process.exit(1);
});
