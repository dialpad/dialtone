// ============================================================================
// DATA RESOLVER
// Resolves Dialtone data from the local project's installed packages or
// falls back to the bundled data (CLI version).
//
// Uses Node's module resolution (via createRequire) to find packages,
// which works with pnpm virtual stores, workspace links, and npm hoisting.
// ============================================================================

import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import {
  utilityClasses as bundledUtilityClasses,
  tokens as bundledTokens,
  components as bundledComponents,
  icons as bundledIcons,
} from '@dialpad/dialtone-query-core';
import type { UtilityClassesData, TokensData, Component, IconsData } from '@dialpad/dialtone-query-core';

interface ResolvedData {
  utilityClasses: UtilityClassesData;
  tokens: TokensData;
  components: Component[];
  icons: IconsData;
  source: 'local' | 'bundled';
  version?: string;
}

const BUNDLED: ResolvedData = {
  utilityClasses: bundledUtilityClasses,
  tokens: bundledTokens,
  components: bundledComponents,
  icons: bundledIcons,
  source: 'bundled',
};

function tryResolveAndRead(localRequire: NodeRequire, specifier: string): unknown | null {
  try {
    const resolved = localRequire.resolve(specifier);
    return JSON.parse(readFileSync(resolved, 'utf-8'));
  } catch {
    return null;
  }
}

export function resolveData(forceBundled = false): ResolvedData {
  if (forceBundled) return BUNDLED;

  // Create a require function rooted at cwd so it uses the project's node_modules
  const localRequire = createRequire(join(process.cwd(), 'package.json'));

  const localUtilityClasses = tryResolveAndRead(localRequire, '@dialpad/dialtone-css/lib/dist/dialtone-docs.json');
  const localTokens = tryResolveAndRead(localRequire, '@dialpad/dialtone-css/lib/dist/tokens-docs.json');
  const localComponents = tryResolveAndRead(localRequire, '@dialpad/dialtone-vue/component-documentation.json');
  const localIcons = tryResolveAndRead(localRequire, '@dialpad/dialtone-icons/keywords-icons.json');

  // All four must be present to use local data
  if (localUtilityClasses && localTokens && localComponents && localIcons) {
    let version: string | undefined;
    try {
      const pkgPath = localRequire.resolve('@dialpad/dialtone-css/package.json');
      const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
      version = pkg.version;
    } catch { /* ignore */ }

    return {
      utilityClasses: localUtilityClasses as UtilityClassesData,
      tokens: localTokens as TokensData,
      components: localComponents as Component[],
      icons: localIcons as IconsData,
      source: 'local',
      version,
    };
  }

  return BUNDLED;
}
