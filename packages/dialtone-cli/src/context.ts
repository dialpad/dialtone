// ============================================================================
// SHARED CLI CONTEXT
// Resolved once at startup, read by all commands.
// ============================================================================

import type { UtilityClassesData, TokensData, Component, IconsData } from '@dialpad/dialtone-query-core';
import { resolveData } from './data-resolver.js';

interface CliContext {
  utilityClasses: UtilityClassesData;
  tokens: TokensData;
  components: Component[];
  icons: IconsData;
  source: 'local' | 'bundled';
  version?: string;
}

let _context: CliContext | null = null;

export function initContext(forceBundled = false): void {
  const data = resolveData(forceBundled);
  _context = data;

  if (data.source === 'local') {
    console.error(`Using local Dialtone data${data.version ? ` (v${data.version})` : ''}`);
  }
}

export function getContext(): CliContext {
  if (!_context) {
    // Shouldn't happen — initContext is called at startup
    initContext();
  }
  return _context!;
}
