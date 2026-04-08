// ============================================================================
// DATA RESOLVER
// Resolves Dialtone data from the local project's installed packages or
// falls back to the bundled data (CLI version).
//
// Resolution order:
// 1. Individual packages (@dialpad/dialtone-css, dialtone-vue, dialtone-icons)
// 2. Umbrella package (@dialpad/dialtone/dist/css/*, dist/vue3/*)
// 3. Bundled data (compiled into the CLI at build time)
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

function tryResolveVersion(localRequire: NodeRequire, specifier: string): string | undefined {
  try {
    const pkgPath = localRequire.resolve(specifier);
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
    return pkg.version;
  } catch {
    return undefined;
  }
}

// Individual packages: @dialpad/dialtone-css, dialtone-vue, dialtone-icons
function tryIndividualPackages(localRequire: NodeRequire): ResolvedData | null {
  const utilityClasses = tryResolveAndRead(localRequire, '@dialpad/dialtone-css/lib/dist/dialtone-docs.json');
  const tokens = tryResolveAndRead(localRequire, '@dialpad/dialtone-css/lib/dist/tokens-docs.json');
  const components = tryResolveAndRead(localRequire, '@dialpad/dialtone-vue/component-documentation.json');
  const icons = tryResolveAndRead(localRequire, '@dialpad/dialtone-icons/keywords-icons.json');

  if (utilityClasses && tokens && components && icons) {
    return {
      utilityClasses: utilityClasses as UtilityClassesData,
      tokens: tokens as TokensData,
      components: components as Component[],
      icons: icons as IconsData,
      source: 'local',
      version: tryResolveVersion(localRequire, '@dialpad/dialtone-css/package.json'),
    };
  }
  return null;
}

// Umbrella package: @dialpad/dialtone
// The exports map "./*" → "./dist/*" means specifiers omit the "dist/" prefix.
function tryUmbrellaPackage(localRequire: NodeRequire): ResolvedData | null {
  const utilityClasses = tryResolveAndRead(localRequire, '@dialpad/dialtone/css/dialtone-docs.json');
  const tokens = tryResolveAndRead(localRequire, '@dialpad/dialtone/css/tokens-docs.json');
  const components = tryResolveAndRead(localRequire, '@dialpad/dialtone/vue3/component-documentation.json');
  // Icons aren't copied to the umbrella dist — fall back to bundled
  const icons = tryResolveAndRead(localRequire, '@dialpad/dialtone/icons/keywords-icons.json');

  if (utilityClasses && tokens && components) {
    // Version: read package.json via direct file path since it's not in exports
    let version: string | undefined;
    try {
      const dialtoneDir = localRequire.resolve('@dialpad/dialtone/css/dialtone-docs.json');
      // Walk up from .../dist/css/dialtone-docs.json to package root
      const pkgDir = dialtoneDir.replace(/\/dist\/css\/dialtone-docs\.json$/, '');
      const pkg = JSON.parse(readFileSync(join(pkgDir, 'package.json'), 'utf-8'));
      version = pkg.version;
    } catch { /* ignore */ }

    return {
      utilityClasses: utilityClasses as UtilityClassesData,
      tokens: tokens as TokensData,
      components: components as Component[],
      icons: (icons as IconsData) || bundledIcons,
      source: 'local',
      version,
    };
  }
  return null;
}

export function resolveData(forceBundled = false): ResolvedData {
  if (forceBundled) return BUNDLED;

  const localRequire = createRequire(join(process.cwd(), 'package.json'));

  // Try individual packages first (most precise version match)
  const individual = tryIndividualPackages(localRequire);
  if (individual) return individual;

  // Try umbrella package
  const umbrella = tryUmbrellaPackage(localRequire);
  if (umbrella) return umbrella;

  return BUNDLED;
}
