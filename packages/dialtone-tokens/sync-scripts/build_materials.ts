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
 */

import 'dotenv/config';

import FigmaApi from './figma_api.js';
import { parseColor, colorApproximatelyEqual } from './color.js';
import { resolveModes, ResolvedToken } from './resolve_tokens.js';
import { classify, FigmaType } from './variable_policy.js';

const PARENT = 'Dialtone 2026';

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

function toNumber (value: unknown): number | null {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  const match = String(value).trim().match(/^(-?[\d.]+)(px|rem|em)?$/);
  if (!match) return null;
  const n = Number.parseFloat(match[1]);
  return Number.isFinite(n) ? n : null;
}

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
    return Math.abs(stored - wanted) <= Math.max(Math.abs(stored), Math.abs(wanted), 1) * 1e-6;
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
): Override[] {
  const out: Override[] = [];

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
      if (value === null) continue;
      out.push({ name: token.name, mode, value });
    }
  }

  return out;
}

async function main (): Promise<void> {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const pat = process.env.PERSONAL_ACCESS_TOKEN;
  const fileKey = process.env.FILE_KEY;
  if (!pat || !fileKey) {
    console.error('PERSONAL_ACCESS_TOKEN and FILE_KEY are required');
    process.exit(2);
  }

  const api = new FigmaApi(pat);

  const parentTokens = await resolveAll();
  const classified = classify(parentTokens);
  const types = new Map<string, FigmaType>(classified.emit.map(e => [e.token.name, e.figmaType]));
  const parent = new Map(parentTokens.map(t => [t.name, t]));

  let local = await api.getLocalVariables(fileKey);
  const parentCollection = Object.values(local.meta.variableCollections).find(c => c.name === PARENT);
  if (!parentCollection) {
    console.error(`No "${PARENT}" collection in the file. Run build_variables.ts first.`);
    process.exit(1);
  }
  console.log(`parent      : "${PARENT}", ${parentCollection.variableIds.length} variables\n`);

  for (const material of MATERIALS) {
    const name = collectionNameFor(material);
    const tokens = await resolveAll([`base/material/${material}`]);
    const overrides = overridesFor(parent, tokens, types);

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

    // An override Figma still holds that this material no longer wants, because
    // the token now agrees with the parent. Nothing in the payload above would
    // touch it, so without this the run reports "up to date" while Figma keeps
    // showing the old value.
    //
    // REST has no way to delete an override — the plugin API's
    // `removeOverridesForVariable` has no counterpart here — so the next best
    // thing is to write the parent's own value, which is what the material
    // resolves to now. The entry survives as an override that happens to match,
    // and every run rewrites the full desired state, so a later parent change
    // is picked up on the following run rather than propagating on its own.
    const nameById = new Map<string, string>();
    for (const [n, id] of byName) nameById.set(id, n);
    const modeNameById = new Map<string, string>(
      collection.modes.map(m => [m.modeId, m.name]));
    const modeKeyFor = new Map<string, keyof typeof MODES>(
      (Object.keys(MODES) as (keyof typeof MODES)[]).map(k => [MODES[k], k]));

    const stale: { variableId: string; modeId: string; value: unknown }[] = [];
    const unresettable: string[] = [];
    for (const [variableId, byMode] of Object.entries(existing)) {
      for (const modeId of Object.keys(byMode)) {
        if (wanted.has(`${variableId}/${modeId}`)) continue;
        const tokenName = nameById.get(variableId)?.split('/').join('.');
        const modeKey = modeKeyFor.get(modeNameById.get(modeId) ?? '');
        const token = tokenName ? parent.get(tokenName) : undefined;
        const figmaType = tokenName ? types.get(tokenName) : undefined;
        if (!token || !modeKey || figmaType === undefined) {
          unresettable.push(`${tokenName ?? variableId} [${modeId}]`);
          continue;
        }
        const value = figmaValue(figmaType, token.modes[modeKey].resolved);
        if (value === null) { unresettable.push(`${tokenName} [${modeKey}]`); continue; }
        if (sameValue(byMode[modeId], value)) continue;
        stale.push({ variableId, modeId, value });
      }
    }

    // Said out loud rather than dropped. A silent skip here reads as a clean
    // run while Figma holds a value nothing in the tokens asks for.
    const report = (label: string, items: string[]) => {
      if (items.length === 0) return;
      console.log(`${name}: ${items.length} ${label}`);
      for (const item of items.slice(0, 10)) console.log(`    ${item}`);
      if (items.length > 10) console.log(`    … and ${items.length - 10} more`);
    };
    report('overrides could not be addressed, no such variable or mode', unaddressable);
    report('stale overrides could not be reset', unresettable);

    if (dryRun) {
      console.log(`${name}: ${wanted.size} overrides, ${payload.length} to write, ${stale.length} stale to reset`);
      continue;
    }

    const writes = [...payload, ...stale];
    if (writes.length === 0) {
      console.log(`${name}: up to date`);
      continue;
    }

    await api.postVariables(fileKey, { variableModeValues: writes } as never);
    console.log(
      `${name}: wrote ${payload.length} overrides` +
      (stale.length ? `, reset ${stale.length} stale` : ''));
    local = await api.getLocalVariables(fileKey);
  }
}

main().catch((error: { response?: { status?: number; data?: unknown }; message?: string }) => {
  console.error(`failed: ${error.response?.status ?? ''} ${JSON.stringify(error.response?.data ?? error.message).slice(0, 1000)}`);
  process.exit(1);
});
