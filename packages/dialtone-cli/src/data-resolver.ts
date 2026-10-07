// ============================================================================
// DATA RESOLVER
// Resolves Dialtone data from the project's installed packages, falling back
// to the CLI's bundled data one domain at a time.
//
// Resolution order (DLT-3639):
// 1. --bundled: bundled data only.
// 2. The project declares @dialpad/dialtone: use that package's data, with
//    icons from the @dialpad/dialtone-icons it depends on. Separately
//    installed dialtone-css/-vue (e.g. lint-plugin peers) are ignored,
//    because they can be older than the Dialtone the app uses. Warn when the
//    installed major version differs from the declared one, or when none is
//    found (bundled data is used then).
// 3. Otherwise, per domain: an individual @dialpad/dialtone-vue, -css or
//    -icons package, then an undeclared umbrella.
// 4. Anything still missing: bundled data.
// Documentation is always bundled. Packages are found through node_modules
// folders only, never NODE_PATH.
// ============================================================================

import { existsSync, readFileSync, realpathSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, parse, sep } from 'node:path';
import {
  utilityClasses as bundledUtilityClasses,
  tokens as bundledTokens,
  components as bundledComponents,
  icons as bundledIcons,
  documentation as bundledDocumentation,
  normalizeComponents,
} from '@dialpad/dialtone-query-core';
import type { UtilityClassesData, TokensData, Component, IconsData, DocumentationRecord } from '@dialpad/dialtone-query-core';
import { parseComponentExports } from './component-exports.js';

export const DOMAINS = ['components', 'utilities', 'tokens', 'icons', 'docs'] as const;
export type Domain = typeof DOMAINS[number];
type LocalSource = { kind: 'local'; package: string; version?: string };
export type DomainSource = LocalSource | { kind: 'bundled' };

export interface ResolvedData {
  utilityClasses: UtilityClassesData;
  tokens: TokensData;
  components: Component[];
  icons: IconsData;
  documentation: DocumentationRecord[];
  sources: Record<Domain, DomainSource>;
  // Where import hints say to import components from.
  componentImportPath: string;
  warnings: string[];
}

interface Found {
  data: unknown;
  file: string;
  source: LocalSource;
  exports: Record<string, unknown>; // the package's exports map
  manifest: string;
}

type Parts = Partial<Record<Exclude<Domain, 'docs'>, Found | null>>;

const BUNDLED: DomainSource = { kind: 'bundled' };

// The umbrella file that proves it's installed, and whose location and version stand for it.
const anchorOf = (parts: Parts) => parts.components ?? parts.utilities ?? parts.tokens;

const installWarning = (spec: string, problem: string) =>
  `package.json declares @dialpad/dialtone "${spec}" but ${problem}. Reinstall dependencies to match.`;

// dir, then each parent up to and including the filesystem root.
function* ancestors(dir: string) {
  for (; ; dir = dirname(dir)) {
    yield dir;
    if (dir === parse(dir).root) return;
  }
}

function findUp(fromDir: string, relativePath: string): string | null {
  for (const dir of ancestors(fromDir)) {
    const candidate = join(dir, relativePath);
    if (existsSync(candidate)) return candidate;
  }
  return null;
}

// Finds the package through node_modules folders only, then reads one of its
// files. Plain require.resolve would also search NODE_PATH, which pnpm's bin
// shims point at a whole store, so a missing install could quietly resolve
// some other project's copy.
function tryRead(fromDir: string, specifier: string): Found | null {
  // "@dialpad/dialtone-vue/component-documentation.json" → "@dialpad/dialtone-vue"
  const packageName = specifier.split('/').slice(0, 2).join('/');
  const manifest = findUp(fromDir, join('node_modules', packageName, 'package.json'));
  if (!manifest) return null;
  try {
    // Resolving the package's own name from inside it applies its exports map.
    // The real path keeps the check below valid when Node preserves symlinks.
    const file = realpathSync(createRequire(manifest).resolve(specifier));
    // Without an exports map, resolve() falls back to Node's full lookup,
    // NODE_PATH included, so only accept the package's own files.
    if (!file.startsWith(realpathSync(dirname(manifest)) + sep)) return null;
    const data = JSON.parse(readFileSync(file, 'utf-8'));
    if (data === null) return null;
    const { version, exports } = JSON.parse(readFileSync(manifest, 'utf-8'));
    return { data, file, source: { kind: 'local', package: packageName, version }, exports: exports ?? {}, manifest };
  } catch {
    return null;
  }
}

// Walks up from cwd to the first package.json that declares @dialpad/dialtone,
// so a subfolder stub like {"type": "module"} doesn't hide the app's. It stops
// at the repository root (.git), so an enclosing project's declaration never
// applies.
function findProject(cwd: string): { projectDir: string; spec: string | null } {
  for (const dir of ancestors(cwd)) {
    const spec = declaredDialtoneSpec(join(dir, 'package.json'));
    if (spec !== null) return { projectDir: dir, spec };
    if (existsSync(join(dir, '.git'))) break;
  }
  return { projectDir: cwd, spec: null };
}

function declaredDialtoneSpec(pkgPath: string): string | null {
  try {
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
    for (const key of ['dependencies', 'devDependencies', 'peerDependencies']) {
      const spec = pkg[key]?.['@dialpad/dialtone'];
      if (typeof spec === 'string') return spec;
    }
    return null;
  } catch {
    return null;
  }
}

// v10 apps import components from the umbrella's ./vue export, which
// umbrellas before 9.173 don't have. Bundled data documents v10.
function componentImportPath(components: Found | null | undefined): string {
  if (components?.source.package === '@dialpad/dialtone-vue') return '@dialpad/dialtone-vue';
  if (components && !('./vue' in components.exports)) return '@dialpad/dialtone/vue3';
  return '@dialpad/dialtone/vue';
}

// Read the ESM condition explicitly: createRequire.resolve would select the
// CJS condition, and executing a consumer's package is unnecessary for lookup.
function installedComponentNames(found: Found, importFrom: string): string[] | null {
  function importTarget(value: unknown): string | null {
    if (typeof value === 'string') return value;
    if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
    // Conditional exports are ordered. Only flat published ESM maps are
    // supported; an earlier unknown condition or nested target is unverified.
    for (const [condition, target] of Object.entries(value)) {
      if (condition === 'types' || condition === 'require') continue;
      if (condition === 'import' || condition === 'default') return typeof target === 'string' ? target : null;
      return null;
    }
    return null;
  }
  try {
    const manifest = JSON.parse(readFileSync(found.manifest, 'utf8'));
    const subpath = importFrom === found.source.package ? '.' : `.${importFrom.slice(found.source.package.length)}`;
    const target = importTarget(found.exports[subpath])
      ?? (subpath === '.' && !manifest.exports ? manifest.module : null);
    if (typeof target !== 'string' || !target.startsWith('./')) return null;
    const root = realpathSync(dirname(found.manifest));
    const file = realpathSync(join(root, target));
    if (!file.startsWith(root + sep)) return null;
    return parseComponentExports(readFileSync(file, 'utf8'));
  } catch {
    return null;
  }
}

// Each domain comes from the first candidate that found it, else from bundled data.
function assemble(...candidates: Parts[]): ResolvedData {
  const pick = (domain: keyof Parts) => candidates.map(c => c[domain]).find(Boolean);
  const [components, utilities, tokens, icons] = [pick('components'), pick('utilities'), pick('tokens'), pick('icons')];
  const importFrom = componentImportPath(components);
  return {
    components: components ? normalizeComponents(components.data as Component[], {
      package: components.source.package,
      version: components.source.version ?? 'unknown',
      from: importFrom,
      names: installedComponentNames(components, importFrom),
    }) : bundledComponents,
    utilityClasses: (utilities?.data as UtilityClassesData) ?? bundledUtilityClasses,
    tokens: (tokens?.data as TokensData) ?? bundledTokens,
    icons: (icons?.data as IconsData) ?? bundledIcons,
    documentation: bundledDocumentation,
    sources: {
      components: components?.source ?? BUNDLED,
      utilities: utilities?.source ?? BUNDLED,
      tokens: tokens?.source ?? BUNDLED,
      icons: icons?.source ?? BUNDLED,
      docs: BUNDLED,
    },
    componentImportPath: importFrom,
    warnings: [],
  };
}

// The umbrella's exports map "./*" → "./dist/*", so specifiers omit "dist/".
function umbrellaParts(fromDir: string): Parts {
  const components = tryRead(fromDir, '@dialpad/dialtone/vue3/component-documentation.json');
  const utilities = tryRead(fromDir, '@dialpad/dialtone/css/dialtone-docs.json');
  const tokens = tryRead(fromDir, '@dialpad/dialtone/css/tokens-docs.json');
  const anchor = anchorOf({ components, utilities, tokens });
  if (!anchor) return {};
  // Icons aren't in the umbrella's dist: look for the icons package from the
  // umbrella's real path, so it's the version the umbrella depends on. Under
  // pnpm, the umbrella's dependencies sit beside it there, not at the top.
  const icons = tryRead(dirname(anchor.file), '@dialpad/dialtone-icons/keywords-icons.json');
  return { components, utilities, tokens, icons };
}

function individualParts(fromDir: string): Parts {
  return {
    components: tryRead(fromDir, '@dialpad/dialtone-vue/component-documentation.json'),
    utilities: tryRead(fromDir, '@dialpad/dialtone-css/lib/dist/dialtone-docs.json'),
    tokens: tryRead(fromDir, '@dialpad/dialtone-css/lib/dist/tokens-docs.json'),
    icons: tryRead(fromDir, '@dialpad/dialtone-icons/keywords-icons.json'),
  };
}

// A single caret, tilde or exact version, e.g. "^10.0.0", "~9.1",
// "10.0.0-next.10", "10.0.0+build.1". The first group is the major.
const SIMPLE_VERSION = /^[\^~=v]?(\d+)(\.(\d+|[xX*])){0,2}(-[\w.-]+)?(\+[\w.-]+)?$/;

// Compares majors only, so no semver dependency is needed. Warns when the
// installed major matches none of the range's alternatives ("^9 || ^10").
// Anything that isn't simple versions ("*", "workspace:*", ">=10", "8 - 9")
// never warns.
function mismatchWarnings(spec: string, installed: string | undefined): string[] {
  const majors = spec.split('||').map(a => SIMPLE_VERSION.exec(a.trim())?.[1]);
  if (majors.includes(undefined)) return [];
  const have = installed?.match(/\d+/)?.[0];
  if (!have || majors.includes(have)) return [];
  return [installWarning(spec, `${installed} is installed`)];
}

export function resolveData(forceBundled = false, cwd = process.cwd()): ResolvedData {
  if (forceBundled) return assemble();
  const { projectDir, spec } = findProject(cwd);
  if (spec === null) {
    const individual = individualParts(projectDir);
    // The umbrella's files are large (~13MB), so skip them when individual
    // packages cover every domain. Any gap reads all of them.
    return Object.values(individual).every(Boolean) ? assemble(individual) : assemble(individual, umbrellaParts(projectDir));
  }
  const umbrella = umbrellaParts(projectDir);
  const anchor = anchorOf(umbrella);
  if (anchor) {
    return { ...assemble(umbrella), warnings: mismatchWarnings(spec, anchor.source.version) };
  }
  return { ...assemble(), warnings: [installWarning(spec, 'no installed copy with lookup data was found')] };
}
