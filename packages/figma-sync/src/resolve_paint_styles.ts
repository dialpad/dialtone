/**
 * Resolves Dialtone's 2 gradient tokens into the shape the Figma plugin needs:
 * one paint style per gradient, with each stop either a variable to bind
 * (when the token's raw value references another token) or a literal colour
 * (when it doesn't) — `color.gradient.magenta-purple` is two stops, both
 * references; `color.gradient.gold-red-magenta-purple` is eleven, all baked
 * `oklch()` literals with no token behind them.
 *
 * A gradient is the one case in this whole sync where the RAW value matters
 * more than the resolved one: resolution substitutes `{color.brand.magenta}`
 * with magenta's own oklch literal, discarding exactly the reference this
 * needs to bind. Reading `raw` instead keeps it.
 */

import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

import type { resolveModes as ResolveModes } from '../../dialtone-tokens/sync-scripts/resolve_tokens.ts';
import type { parseColor as ParseColor, Color } from '../../dialtone-tokens/sync-scripts/color.ts';

const DIALTONE_TOKENS_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '../../dialtone-tokens');
process.chdir(DIALTONE_TOKENS_DIR);

const { resolveModes } = await import('../../dialtone-tokens/sync-scripts/resolve_tokens.ts') as
  { resolveModes: typeof ResolveModes };
const { parseColor } = await import('../../dialtone-tokens/sync-scripts/color.ts') as
  { parseColor: typeof ParseColor };

export interface GradientStopSpec {
  /** 0-1, not the 0-100 CSS percent. */
  position: number;
  /** Set when the stop referenced another token — bind this variable's colour. */
  variable?: string;
  /** Set when the stop was a literal — no token to bind, use this colour as-is. */
  color?: Color;
}

export interface PaintStyleSpec {
  /** Figma style name, e.g. `color/gradient/magenta-purple`. */
  name: string;
  angleDeg: number;
  stops: GradientStopSpec[];
}

function figmaName (path: string): string {
  return path.split('.').join('/');
}

/** `{a.b.c}` and nothing else — same rule `resolve_tokens.ts` uses for a whole-token alias. */
function referenceTarget (text: string): string | null {
  const match = text.trim().match(/^\{([^{}]+)\}$/);
  return match ? match[1] : null;
}

const GRADIENT = /^linear-gradient\((-?[\d.]+)deg,\s*(.+)\)$/;

function parseGradient (raw: string): { angleDeg: number; stops: GradientStopSpec[] } {
  const match = raw.match(GRADIENT);
  if (!match) throw new Error(`not a linear-gradient() this parser understands: ${raw}`);

  const angleDeg = Number.parseFloat(match[1]);
  // Dialtone's colours use space-separated channels, never commas, so a plain
  // split on the top-level comma is safe — no stop's own text contains one.
  const stops = match[2].split(',').map(part => {
    const stopMatch = part.trim().match(/^(.+?)\s+([\d.]+)%$/);
    if (!stopMatch) throw new Error(`unparseable gradient stop: ${part}`);
    const [, colorOrRef, percent] = stopMatch;
    const position = Number.parseFloat(percent) / 100;

    const target = referenceTarget(colorOrRef);
    return target
      ? { position, variable: figmaName(target) }
      : { position, color: parseColor(colorOrRef) };
  });

  return { angleDeg, stops };
}

export async function resolvePaintStyles (): Promise<PaintStyleSpec[]> {
  const { tokens } = await resolveModes('base', ['light']);
  const gradientTokens = tokens.filter(t => t.name.startsWith('color.gradient.'));

  return gradientTokens.map(token => {
    const { angleDeg, stops } = parseGradient(String(token.modes.light.raw));
    return { name: figmaName(token.name), angleDeg, stops };
  }).sort((a, b) => a.name.localeCompare(b.name));
}
