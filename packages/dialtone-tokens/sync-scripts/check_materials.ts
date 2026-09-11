/**
 * Checks the material extensions in Figma against the CSS Dialtone ships.
 *
 * Written after a bug that this would have caught immediately: the material set
 * was placed in Style Dictionary's `include` list, which loses to `source`, so
 * every derived semantic colour changed correctly while the black ramp the
 * whole dimension exists to swap was left identical to the parent. A spot check
 * on one derived token looked right, because the derived tokens were right.
 *
 * Two passes, because they catch different things:
 *
 *   RESOLUTION  the ramp we resolve for a material against
 *               `tokens-material-<name>-<mode>.css`. Independent, because that
 *               file is produced by the shipped build and not by this code.
 *   WRITE       the value a Figma frame would actually see, which is the
 *               override where one exists and the parent's value otherwise,
 *               against what the resolver says it should be. Catches an
 *               override that was never written, or written to the wrong mode.
 *
 * Usage:  npx tsx sync-scripts/check_materials.ts
 */

import 'dotenv/config';
import { readFileSync, existsSync } from 'fs';

import FigmaApi from './figma_api.js';
import { parseColor } from './color.js';
import { resolveModes, ResolvedToken } from './resolve_tokens.js';
import { classify, FigmaType } from './variable_policy.js';

const PARENT = 'Dialtone 2026';
const MATERIALS = ['steel', 'graphite', 'iron', 'amethyst', 'jade'];
const MODES = { light: 'Light', dark: 'Dark' } as const;
const GROUPS = ['base', 'dp'];

/**
 * A colour as a comparable 8-bit key.
 *
 * Uses the sync's own `parseColor`, which gamut-maps by reducing chroma rather
 * than clipping channels. Converting any other way makes the check disagree
 * with the sync on precisely the fifteen colours that sit outside sRGB, and
 * report a difference that only exists because the check did the conversion
 * differently.
 */
function colorKey (value: unknown): string | null {
  const q = (n: number) => Math.round(Math.min(1, Math.max(0, n)) * 255);
  const key = (c: { r: number; g: number; b: number; a?: number }) =>
    `${q(c.r)},${q(c.g)},${q(c.b)},${Math.round((c.a ?? 1) * 100) / 100}`;

  if (value && typeof value === 'object' && 'r' in (value as Record<string, unknown>)) {
    return key(value as { r: number; g: number; b: number; a?: number });
  }
  try {
    return key(parseColor(String(value)));
  } catch {
    return null;
  }
}

function cssNameFor (path: string): string {
  return `--dt-${path.split('.').map(s => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()).join('-')}`;
}

function parseCss (file: string): Map<string, string> {
  const out = new Map<string, string>();
  for (const m of readFileSync(file, 'utf8').matchAll(/(--dt-[a-z0-9-]+)\s*:\s*([^;]+);/g)) {
    out.set(m[1], m[2].trim());
  }
  return out;
}

async function resolveAll (extraSets?: string[]): Promise<ResolvedToken[]> {
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

interface Finding { material: string; pass: string; name: string; mode: string; expected: string; got: string }

async function main (): Promise<void> {
  const pat = process.env.PERSONAL_ACCESS_TOKEN;
  const fileKey = process.env.FILE_KEY;
  if (!pat || !fileKey) {
    console.error('PERSONAL_ACCESS_TOKEN and FILE_KEY are required');
    process.exit(2);
  }

  const findings: Finding[] = [];
  let resolutionChecks = 0;
  let writeChecks = 0;

  const local = await new FigmaApi(pat).getLocalVariables(fileKey);
  const collections = Object.values(local.meta.variableCollections);
  const parentCollection = collections.find(c => c.name === PARENT);
  if (!parentCollection) {
    console.error(`No "${PARENT}" collection in the file.`);
    process.exit(1);
  }
  const byName = new Map<string, string>();
  for (const [id, variable] of Object.entries(local.meta.variables)) {
    if (variable.variableCollectionId === parentCollection.id) byName.set(variable.name, id);
  }

  const parentTokens = await resolveAll();
  const types = new Map<string, FigmaType>(classify(parentTokens).emit.map(e => [e.token.name, e.figmaType]));

  for (const material of MATERIALS) {
    const tokens = await resolveAll([`base/material/${material}`]);
    const collection = collections.find(c => c.name === `${PARENT} / ${material[0].toUpperCase()}${material.slice(1)}`);
    if (!collection) {
      findings.push({ material, pass: 'setup', name: '-', mode: '-', expected: 'a collection', got: 'missing' });
      continue;
    }
    const overrides = (collection as { variableOverrides?: Record<string, Record<string, unknown>> })
      .variableOverrides ?? {};
    const modeIdFor = new Map(collection.modes.map(m => [m.name, m.modeId]));
    const parentModeIdFor = new Map(parentCollection.modes.map(m => [m.name, m.modeId]));

    for (const mode of Object.keys(MODES) as (keyof typeof MODES)[]) {
      // PASS 1: resolution, against the shipped CSS for this material.
      const cssFile = `dist/css/tokens-material-${material}-${mode}.css`;
      if (!existsSync(cssFile)) {
        console.error(`Missing ${cssFile}. Run: pnpm nx run dialtone-tokens:build`);
        process.exit(2);
      }
      const css = parseCss(cssFile);

      for (const token of tokens) {
        if (types.get(token.name) !== 'COLOR') continue;
        const inCss = css.get(cssNameFor(token.name));
        if (inCss === undefined || inCss.includes('var(')) continue;
        const expected = colorKey(inCss);
        const got = colorKey(token.modes[mode].resolved);
        if (expected === null || got === null) continue;
        resolutionChecks++;
        if (expected !== got) {
          findings.push({ material, pass: 'resolution', name: token.name, mode, expected, got });
        }
      }

      // PASS 2: what a frame pinned to this material would actually see.
      for (const token of tokens) {
        if (types.get(token.name) !== 'COLOR') continue;
        const variableId = byName.get(token.name.split('.').join('/'));
        if (!variableId) continue;

        const overridden = overrides[variableId]?.[modeIdFor.get(MODES[mode])!];
        const parentValue = local.meta.variables[variableId]
          ?.valuesByMode?.[parentModeIdFor.get(MODES[mode])!];
        const effective = overridden ?? parentValue;

        // An alias resolves through the graph, which this check does not walk.
        if (effective && typeof effective === 'object' && 'type' in effective) continue;

        const expected = colorKey(token.modes[mode].resolved);
        const got = colorKey(effective);
        if (expected === null || got === null) continue;
        writeChecks++;
        if (expected !== got) {
          findings.push({ material, pass: 'write', name: token.name, mode, expected, got });
        }
      }
    }
  }

  console.log(`materials         : ${MATERIALS.length}`);
  console.log(`resolution checks : ${resolutionChecks}  (resolver against the shipped CSS)`);
  console.log(`write checks      : ${writeChecks}  (what a pinned frame sees, against the resolver)`);
  console.log(`disagreements     : ${findings.length}`);

  if (findings.length) {
    const byKey: Record<string, number> = {};
    for (const f of findings) {
      const key = `${f.material}/${f.pass}/${f.name.split('.').slice(0, 2).join('.')}`;
      byKey[key] = (byKey[key] ?? 0) + 1;
    }
    console.log('\nby material, pass and namespace:');
    for (const [key, count] of Object.entries(byKey).sort((a, b) => b[1] - a[1]).slice(0, 15)) {
      console.log(`  ${String(count).padStart(4)}  ${key}`);
    }
    console.log('\nfirst 10:');
    for (const f of findings.slice(0, 10)) {
      console.log(`  [${f.material} ${f.pass}] ${f.name} (${f.mode})`);
      console.log(`      expected ${f.expected}`);
      console.log(`      got      ${f.got}`);
    }
  }

  process.exit(findings.length ? 1 : 0);
}

main().catch((error: { response?: { status?: number; data?: unknown }; message?: string }) => {
  console.error(`failed: ${error.response?.status ?? ''} ${JSON.stringify(error.response?.data ?? error.message).slice(0, 500)}`);
  process.exit(1);
});
