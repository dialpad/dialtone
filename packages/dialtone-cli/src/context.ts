// ============================================================================
// SHARED CLI CONTEXT
// Resolved once at startup, read by all commands.
// ============================================================================

import pkg from '../package.json' with { type: 'json' };
import { resolveData, DOMAINS, type ResolvedData, type Domain, type DomainSource } from './data-resolver.js';

let _context: ResolvedData | null = null;

const label = (source: DomainSource) => (source.kind === 'local' ? `${source.package}@${source.version ?? 'unknown'}` : 'bundled');

/** One stderr line naming where each data domain came from. */
export function formatSourceLine(sources: Record<Domain, DomainSource>, cliVersion: string): string {
  const primaryDomain = DOMAINS.find(d => sources[d].kind === 'local');
  if (!primaryDomain) return `Using bundled Dialtone data (@dialpad/dialtone-cli@${cliVersion})`;
  const primary = label(sources[primaryDomain]);
  const extras = DOMAINS
    .filter(d => label(sources[d]) !== primary)
    .map(d => `${d}: ${label(sources[d])}`);
  return `Using local Dialtone data: ${primary}${extras.length ? ` (${extras.join(', ')})` : ''}`;
}

export function initContext(forceBundled = false): void {
  _context = resolveData(forceBundled);
  console.error(formatSourceLine(_context.sources, pkg.version));
  _context.warnings.forEach(w => console.error(`Warning: ${w}`));
}

export function getContext(): ResolvedData {
  if (!_context) {
    // Shouldn't happen — initContext is called at startup
    initContext();
  }
  return _context!;
}
