/**
 * Resolves Dialtone's 29 typography composites — `text.*`, `typography.inputs.*`
 * and `typography.button.*` — into the shape the Figma plugin needs: one entry
 * per style, each field carrying both its resolved value and the name of the
 * Figma variable it should bind to (matching what `dialtone-tokens`' variables
 * sync already created).
 *
 * Typography does not vary by mode, so this only resolves `light` — there is
 * no separate dark-mode composition to reconcile.
 */

import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

import type { resolveModes as ResolveModes } from '../../dialtone-tokens/sync-scripts/resolve_tokens.ts';
import type { figmaFontFamily as FigmaFontFamily } from '../../dialtone-tokens/sync-scripts/variable_policy.ts';

// resolve_tokens.ts reads token files relative to `process.cwd()` at MODULE
// LOAD TIME, since that is how dialtone-tokens' own scripts are always run.
// ESM evaluates a static import's top-level code before this module's own —
// chdir-ing here would run too late. Importing dynamically, after chdir,
// makes the ordering explicit instead of depending on it silently.
const DIALTONE_TOKENS_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '../../dialtone-tokens');
process.chdir(DIALTONE_TOKENS_DIR);

const { resolveModes } = await import('../../dialtone-tokens/sync-scripts/resolve_tokens.ts') as
  { resolveModes: typeof ResolveModes };
const { figmaFontFamily } = await import('../../dialtone-tokens/sync-scripts/variable_policy.ts') as
  { figmaFontFamily: typeof FigmaFontFamily };

const NAMESPACES = ['text', 'typography.inputs', 'typography.button'];

/** `600` (Dialtone's numeric scale) to the style name Figma's SF/Season faces use. */
const WEIGHT_TO_STYLE: Record<string, string> = {
  '400': 'Regular',
  '500': 'Medium',
  '600': 'Semibold',
  '700': 'Bold',
};

export interface TextStyleField {
  value: string | number;
  /** The Figma variable name to bind this field to, e.g. `text/body/md/fontSize`. */
  variable: string;
}

export interface TextStyleSpec {
  /** Figma style name, e.g. `text/body/md`. */
  name: string;
  fontFamily: TextStyleField;
  fontSize: TextStyleField;
  fontWeight: TextStyleField;
  lineHeight: TextStyleField;
  /** Not variable-backed — no `textCase` variable exists in the sync today. */
  textCase: string;
  /** Resolved font style name (`Semibold`, …), derived from `fontWeight`. */
  fontStyleName: string;
  /** The real Figma family name (`SF Pro Text`, …), resolved from the CSS stack. */
  figmaFamily: string;
}

function figmaName (path: string): string {
  return path.split('.').join('/');
}

export async function resolveTextStyles (): Promise<TextStyleSpec[]> {
  const { tokens } = await resolveModes('dp', ['light']);

  const byComposite = new Map<string, Map<string, (typeof tokens)[number]>>();
  for (const token of tokens) {
    const parts = token.name.split('.');
    const field = parts.at(-1)!;
    const composite = parts.slice(0, -1).join('.');
    if (!NAMESPACES.some(ns => composite === ns || composite.startsWith(`${ns}.`))) continue;
    if (!['fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'textCase'].includes(field)) continue;

    if (!byComposite.has(composite)) byComposite.set(composite, new Map());
    byComposite.get(composite)!.set(field, token);
  }

  const specs: TextStyleSpec[] = [];
  for (const [composite, fields] of byComposite) {
    const required = ['fontFamily', 'fontSize', 'fontWeight', 'lineHeight'] as const;
    const missing = required.filter(f => !fields.has(f));
    if (missing.length) {
      throw new Error(`${composite}: missing ${missing.join(', ')}`);
    }

    const fontFamilyToken = fields.get('fontFamily')!;
    const fontWeightToken = fields.get('fontWeight')!;
    const rawFamily = String(fontFamilyToken.modes.light.resolved);
    const figmaFamily = figmaFontFamily(rawFamily);
    if (!figmaFamily) {
      throw new Error(`${composite}: unrecognised font family "${rawFamily}"`);
    }
    const weight = String(fontWeightToken.modes.light.resolved);
    const fontStyleName = WEIGHT_TO_STYLE[weight];
    if (!fontStyleName) {
      throw new Error(`${composite}: unrecognised font weight "${weight}"`);
    }

    const field = (name: 'fontFamily' | 'fontSize' | 'fontWeight' | 'lineHeight'): TextStyleField => {
      const token = fields.get(name)!;
      return {
        value: token.modes.light.resolved as string | number,
        variable: figmaName(token.name),
      };
    };

    specs.push({
      name: figmaName(composite),
      fontFamily: field('fontFamily'),
      fontSize: field('fontSize'),
      fontWeight: field('fontWeight'),
      lineHeight: field('lineHeight'),
      textCase: String(fields.get('textCase')?.modes.light.resolved ?? 'none'),
      fontStyleName,
      figmaFamily,
    });
  }

  return specs.sort((a, b) => a.name.localeCompare(b.name));
}
