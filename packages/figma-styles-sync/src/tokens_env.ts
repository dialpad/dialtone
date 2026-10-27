/**
 * Shared by every resolver: `resolve_tokens.ts` reads token files relative to
 * `process.cwd()` at MODULE LOAD TIME, since that is how dialtone-tokens' own
 * scripts are always run. ESM evaluates a static import's top-level code
 * before this module's own — chdir-ing here would run too late. Importing
 * dynamically, after chdir, makes the ordering explicit instead of depending
 * on it silently.
 */

import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

import type { resolveModes as ResolveModes } from '../../dialtone-tokens/sync-scripts/resolve_tokens.ts';

const DIALTONE_TOKENS_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '../../dialtone-tokens');
process.chdir(DIALTONE_TOKENS_DIR);

export const { resolveModes } = await import('../../dialtone-tokens/sync-scripts/resolve_tokens.ts') as
  { resolveModes: typeof ResolveModes };

export function figmaName (path: string): string {
  return path.split('.').join('/');
}
