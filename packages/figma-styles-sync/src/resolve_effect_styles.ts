/**
 * Resolves Dialtone's 8 shadow composites into the shape the Figma plugin
 * needs: one effect style per shadow, each layer's bindable fields (blur,
 * colour, spread, offsetX, offsetY) carrying the Figma variable to bind —
 * never a literal value, since every field here has a real variable
 * (confirmed live: 155 shadow variables, one set per shadow per layer).
 *
 * Both light and dark now have the same layer count for every shadow — the
 * padding fix that made this possible — so one style, with fields bound to
 * mode-aware variables, is correct in both modes without needing per-mode
 * style objects, which Figma has no concept of anyway.
 */

import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

import type { resolveModes as ResolveModes } from '../../dialtone-tokens/sync-scripts/resolve_tokens.ts';

const DIALTONE_TOKENS_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '../../dialtone-tokens');
process.chdir(DIALTONE_TOKENS_DIR);

const { resolveModes } = await import('../../dialtone-tokens/sync-scripts/resolve_tokens.ts') as
  { resolveModes: typeof ResolveModes };

const BINDABLE_FIELDS = ['blur', 'color', 'offsetX', 'offsetY', 'spread'] as const;
type BindableField = (typeof BINDABLE_FIELDS)[number];

export interface EffectLayerSpec {
  /** Variable name per bindable field, e.g. `shadow/small/1/blur`. */
  variables: Record<BindableField, string>;
}

export interface EffectStyleSpec {
  /** Figma style name, e.g. `shadow/small`. */
  name: string;
  /** A name ending `-inset` is an inner shadow; every other shadow is a drop shadow. */
  isInset: boolean;
  layers: EffectLayerSpec[];
}

function figmaName (path: string): string {
  return path.split('.').join('/');
}

export async function resolveEffectStyles (): Promise<EffectStyleSpec[]> {
  const { tokens } = await resolveModes('base', ['light', 'dark']);
  const shadowTokens = tokens.filter(t => t.name.startsWith('shadow.'));

  interface LayerGroup {
    shadowName: string;
    layerIndex: number | null;
    fields: Partial<Record<BindableField, string>>;
  }
  const groups = new Map<string, LayerGroup>();

  for (const token of shadowTokens) {
    const parts = token.name.split('.'); // shadow, <name...>, [index], field
    const field = parts.at(-1)!;
    if (!(BINDABLE_FIELDS as readonly string[]).includes(field)) continue; // skip `type`

    const rest = parts.slice(1, -1); // <name...>, [index]
    const hasIndex = /^\d+$/.test(rest.at(-1)!);
    const shadowName = hasIndex ? rest.slice(0, -1).join('.') : rest.join('.');
    const layerIndex = hasIndex ? Number(rest.at(-1)) : null;

    const key = `${shadowName}|${layerIndex}`;
    if (!groups.has(key)) groups.set(key, { shadowName, layerIndex, fields: {} });
    groups.get(key)!.fields[field as BindableField] = figmaName(token.name);
  }

  const byShadow = new Map<string, LayerGroup[]>();
  for (const g of groups.values()) {
    if (!byShadow.has(g.shadowName)) byShadow.set(g.shadowName, []);
    byShadow.get(g.shadowName)!.push(g);
  }

  const specs: EffectStyleSpec[] = [];
  for (const [shadowName, layers] of byShadow) {
    layers.sort((a, b) => (a.layerIndex ?? 0) - (b.layerIndex ?? 0));

    const missing = layers.flatMap(l => BINDABLE_FIELDS.filter(f => !l.fields[f]));
    if (missing.length) {
      throw new Error(`${shadowName}: missing field(s) ${missing.join(', ')} on some layer`);
    }

    specs.push({
      name: figmaName(`shadow.${shadowName}`),
      isInset: /(^|-)inset$/.test(shadowName),
      layers: layers.map(l => ({ variables: l.fields as Record<BindableField, string> })),
    });
  }

  return specs.sort((a, b) => a.name.localeCompare(b.name));
}
