// ============================================================================
// DATA RESOLVER
// Resolves Dialtone data from the project's installed packages, falling back
// to the CLI's bundled data one domain at a time.
//
// CLI resolution order (DLT-3639); MCP uses resolveProjectData below:
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

import { existsSync, readFileSync, realpathSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { dirname, isAbsolute, join, parse, relative, sep } from 'node:path';
import {
  utilityClasses as bundledUtilityClasses,
  tokens as bundledTokens,
  components as bundledComponents,
  icons as bundledIcons,
  documentation as bundledDocumentation,
} from './data.js';
import { bundledProvenance } from './data.js';
import { normalizeComponents } from './component-identity.js';
import type { BundledProvenance, DomainStamp } from './retrieval.js';
import type { UtilityClassesData, TokensData, Component, IconsData, DocumentationRecord } from './types.js';
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
  module?: unknown; // the legacy ESM entry, only when there is no exports map
  dependencies: Record<string, unknown>;
  hash: string;
  root: string; // the package folder's real path
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

interface ReadPolicy { boundary: string; failures: Partial<Record<Domain, string>> }
const within = (root: string, path: string) => {
  const suffix = relative(root, path);
  return suffix === '' || (!isAbsolute(suffix) && suffix !== '..' && !suffix.startsWith(`..${sep}`));
};
function authorizedPath(boundary: string, path: string): boolean {
  if (!within(boundary, path)) return false;
  for (const dir of ancestors(path)) {
    if (dir === boundary) return true;
    if (existsSync(join(dir, '.git'))) return false;
  }
  return false;
}

function findUp(fromDir: string, relativePath: string, policy?: ReadPolicy): string | null {
  for (const dir of ancestors(fromDir)) {
    const candidate = join(dir, relativePath);
    if (policy && !within(policy.boundary, dir)) break;
    if (existsSync(candidate)) return candidate;
    if (policy && (dir === policy.boundary || existsSync(join(dir, '.git')))) break;
  }
  return null;
}

// Finds the package through node_modules folders only, then reads one of its
// files. Plain require.resolve would also search NODE_PATH, which pnpm's bin
// shims point at a whole store, so a missing install could quietly resolve
// some other project's copy.
function tryRead(fromDir: string, specifier: string, domain: Domain, policy?: ReadPolicy): Found | null {
  // Bounded (MCP) lookups record why a domain fell back; CLI lookups just miss.
  const fail = (reason: string) => {
    if (policy) policy.failures[domain] = reason;
    return null;
  };
  // "@dialpad/dialtone-vue/component-documentation.json" → "@dialpad/dialtone-vue"
  const packageName = specifier.split('/').slice(0, 2).join('/');
  const manifest = findUp(fromDir, join('node_modules', packageName, 'package.json'), policy);
  if (!manifest) return fail('package-not-found-within-lookup-boundary');
  try {
    // Resolving the package's own name from inside it applies its exports map.
    // The real path keeps the check below valid when Node preserves symlinks.
    const root = realpathSync(dirname(manifest));
    if (policy && (!authorizedPath(policy.boundary, root) || !within(root, realpathSync(manifest)))) return fail('outside-lookup-boundary');
    const file = realpathSync(createRequire(manifest).resolve(specifier));
    // Without an exports map, resolve() falls back to Node's full lookup,
    // NODE_PATH included, so only accept the package's own files.
    if (!file.startsWith(root + sep)) return fail('outside-lookup-boundary');
    if (policy && !authorizedPath(policy.boundary, file)) return fail('outside-lookup-boundary');
    const bytes = readFileSync(file);
    const data = JSON.parse(bytes.toString('utf-8'));
    if (data === null) return fail('malformed-or-unsupported-dataset');
    const { name, version, exports, module, dependencies } = JSON.parse(readFileSync(manifest, 'utf-8'));
    if (policy && (name !== packageName || typeof version !== 'string' || !version || !validData(domain, data)))
      return fail('malformed-or-unsupported-dataset');
    return { data, file, source: { kind: 'local', package: packageName, version }, exports: exports ?? {}, module: exports ? undefined : module, dependencies: dependencies ?? {}, hash: policy ? createHash('sha256').update(bytes).digest('hex') : '', root };
  } catch {
    return fail('missing-or-unreadable-dataset');
  }
}

// Walks up from cwd to the first package.json that declares @dialpad/dialtone,
// so a subfolder stub like {"type": "module"} doesn't hide the app's. It stops
// at the repository root (.git), so an enclosing project's declaration never
// applies.
function findProject(cwd: string): { projectDir: string; spec: string | null } {
  for (const dir of ancestors(cwd)) {
    const spec = declaredSpec(readManifest(join(dir, 'package.json')), '@dialpad/dialtone');
    if (spec !== null) return { projectDir: dir, spec };
    if (existsSync(join(dir, '.git'))) break;
  }
  return { projectDir: cwd, spec: null };
}

const object = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

function readManifest(pkgPath: string): unknown {
  try {
    return JSON.parse(readFileSync(pkgPath, 'utf-8'));
  } catch {
    return null;
  }
}

// The package's version spec from the first dependency field declaring it.
function declaredSpec(manifest: unknown, packageName: string): string | null {
  for (const key of ['dependencies', 'devDependencies', 'peerDependencies']) {
    const dependencies = object(manifest) ? manifest[key] : undefined;
    const spec = object(dependencies) ? dependencies[packageName] : undefined;
    if (typeof spec === 'string') return spec;
  }
  return null;
}

// Prefer the installed umbrella's ./vue route (./vue3 before 9.173).
// Identity imports determine the actual hint; bundled data retains its
// source-verified standalone Vue route, without installed-project verification.
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
    const subpath = importFrom === found.source.package ? '.' : `.${importFrom.slice(found.source.package.length)}`;
    const target = importTarget(found.exports[subpath]) ?? (subpath === '.' ? found.module : null);
    if (typeof target !== 'string' || !target.startsWith('./')) return null;
    const file = realpathSync(join(found.root, target));
    if (!file.startsWith(found.root + sep)) return null;
    return parseComponentExports(readFileSync(file, 'utf8'));
  } catch {
    return null;
  }
}

// Each domain comes from the first candidate that found it, else from bundled data.
function assemble(candidates: Parts[] = [], names?: string[] | null): ResolvedData {
  const pick = (domain: keyof Parts) => candidates.map(c => c[domain]).find(Boolean);
  const [components, utilities, tokens, icons] = [pick('components'), pick('utilities'), pick('tokens'), pick('icons')];
  const importFrom = componentImportPath(components);
  return {
    components: components ? normalizeComponents(components.data as Component[], {
      package: components.source.package,
      version: components.source.version ?? 'unknown',
      from: importFrom,
      names: names === undefined ? installedComponentNames(components, importFrom) : names,
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
function umbrellaParts(fromDir: string, policy?: ReadPolicy): Parts {
  const components = tryRead(fromDir, '@dialpad/dialtone/vue3/component-documentation.json', 'components', policy);
  const utilities = tryRead(fromDir, '@dialpad/dialtone/css/dialtone-docs.json', 'utilities', policy);
  const tokens = tryRead(fromDir, '@dialpad/dialtone/css/tokens-docs.json', 'tokens', policy);
  const anchor = anchorOf({ components, utilities, tokens });
  if (!anchor) return {};
  // Icons aren't in the umbrella's dist: look for the icons package from the
  // umbrella's real path, so it's the version the umbrella depends on. Under
  // pnpm, the umbrella's dependencies sit beside it there, not at the top.
  const readsIcons = !policy || typeof anchor.dependencies['@dialpad/dialtone-icons'] === 'string';
  if (policy && !readsIcons) policy.failures.icons = 'package-not-declared-by-umbrella';
  const icons = readsIcons ? tryRead(dirname(anchor.file), '@dialpad/dialtone-icons/keywords-icons.json', 'icons', policy) : null;
  return { components, utilities, tokens, icons };
}

function individualParts(fromDir: string, policy?: ReadPolicy, declared?: (name: string) => boolean): Parts {
  const read = (domain: keyof Parts, packageName: string, path: string) => {
    if (declared && !declared(packageName)) {
      if (policy) policy.failures[domain] = 'package-not-declared';
      return null;
    }
    return tryRead(fromDir, `${packageName}/${path}`, domain, policy);
  };
  return {
    components: read('components', '@dialpad/dialtone-vue', 'component-documentation.json'),
    utilities: read('utilities', '@dialpad/dialtone-css', 'lib/dist/dialtone-docs.json'),
    tokens: read('tokens', '@dialpad/dialtone-css', 'lib/dist/tokens-docs.json'),
    icons: read('icons', '@dialpad/dialtone-icons', 'keywords-icons.json'),
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
    return Object.values(individual).every(Boolean) ? assemble([individual]) : assemble([individual, umbrellaParts(projectDir)]);
  }
  const umbrella = umbrellaParts(projectDir);
  const anchor = anchorOf(umbrella);
  if (anchor) {
    return { ...assemble([umbrella]), warnings: mismatchWarnings(spec, anchor.source.version) };
  }
  return { ...assemble(), warnings: [installWarning(spec, 'no installed copy with lookup data was found')] };
}

export interface ProjectData {
  data: ResolvedData;
  provenance: BundledProvenance;
  /** Complete static entry evidence, not runtime or peer-dependency validation. */
  componentExports: readonly string[] | null;
  configured: boolean;
}

const optionalText = (value: unknown) => value === undefined || value === null || typeof value === 'string';
const validMetadata = (value: unknown) => value === undefined || value === null || (object(value) &&
  ['reason', 'replacement', 'docs', 'category'].every(key => optionalText(value[key])) &&
  (value.alternatives === undefined || (Array.isArray(value.alternatives) && value.alternatives.every(word => typeof word === 'string'))));
function datasetSchema(data: unknown): number {
  const record = Array.isArray(data) ? data[0] : data;
  return object(record) && typeof record.schemaVersion === 'number' ? record.schemaVersion : 1;
}

// Validate the fields search/detail actually consume. Legacy records need not
// contain newer contract fields, but malformed/future formats are not trusted.
function validData(domain: Domain, data: unknown): boolean {
  if (domain === 'components') return Array.isArray(data) && data.every(record =>
    object(record) && typeof record.displayName === 'string' && record.displayName &&
    optionalText(record.description) && validMetadata(record.metadata) &&
    (record.schemaVersion === undefined || record.schemaVersion === 1 || record.schemaVersion === 2) &&
    ['props', 'events', 'slots', 'methods', 'expose'].every(key =>
      record[key] === undefined || (Array.isArray(record[key]) && record[key].every(item => object(item) && typeof item.name === 'string' && optionalText(item.description)))) &&
    (record.identity === undefined || (object(record.identity) &&
      typeof record.identity.canonicalName === 'string' &&
      ['public', 'internal', 'unknown'].includes(record.identity.kind as string) &&
      Array.isArray(record.identity.aliases) && record.identity.aliases.every(alias => typeof alias === 'string') &&
      Array.isArray(record.identity.imports) && record.identity.imports.every(object))));
  if (!object(data)) return false;
  if (domain === 'utilities') return Object.values(data).every(record => object(record) &&
    validMetadata(record.metadata) &&
    Array.isArray(record.values) && record.values.every(value => object(value) &&
      (value.prop === undefined || typeof value.prop === 'string') &&
      (value.value === undefined || typeof value.value === 'string') && optionalText(value.description)));
  if (domain === 'tokens') return Object.values(data).every(record => object(record) &&
    Object.entries(record).every(([key, value]) => key === 'metadata' ? validMetadata(value) : object(value) &&
      (value.value === undefined || typeof value.value === 'string' || typeof value.value === 'number') && optionalText(value.description)));
  return domain === 'icons' && (data.schemaVersion === undefined || data.schemaVersion === 1) && object(data.categories) && Object.values(data.categories).every(category =>
    object(category) && Object.values(category).every(words => Array.isArray(words) && words.every(word => typeof word === 'string')));
}

const bundledStamp = (stamp: DomainStamp, fallbackReason: string): DomainStamp =>
  ({ ...stamp, selection: 'bundled', fallbackReason });
const bundledDomains = (fallbackReason: string): Record<string, DomainStamp> => Object.fromEntries(
  Object.entries(bundledProvenance.domains).map(([key, stamp]) => [key, bundledStamp(stamp, fallbackReason)]));

// A configured project's bundled fallback components keep no verified import hint.
function unverifyBundledComponents(data: ResolvedData) {
  data.components = normalizeComponents(data.components, {
    package: bundledProvenance.domains.components.package,
    version: bundledProvenance.domains.components.version,
    from: data.componentImportPath,
    names: null,
  });
}

/** Explicit, bounded MCP selection. CLI callers retain resolveData's policy. */
export function resolveProjectData(projectRoot?: string, lookupRoot?: string): ProjectData {
  const configured = projectRoot !== undefined || lookupRoot !== undefined;
  const fallback = (reason: string): ProjectData => {
    const data = assemble();
    if (configured) unverifyBundledComponents(data);
    return { data, configured, componentExports: null, provenance: { ...bundledProvenance, domains: bundledDomains(reason) } };
  };
  if (!configured) return fallback('project-root-not-configured');
  if (!projectRoot) return fallback('project-root-required');
  if (!isAbsolute(projectRoot) || (lookupRoot !== undefined && !isAbsolute(lookupRoot)))
    return fallback('project-and-lookup-roots-must-be-absolute');
  let root: string;
  let boundary: string;
  let manifest: Record<string, unknown>;
  try {
    root = realpathSync(projectRoot);
    boundary = lookupRoot === undefined ? root : realpathSync(lookupRoot);
    if (!statSync(root).isDirectory() || !statSync(boundary).isDirectory() || !within(boundary, root))
      return fallback('invalid-lookup-boundary');
    const parsed = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
    if (!object(parsed)) return fallback('invalid-project-manifest');
    manifest = parsed;
  } catch {
    return fallback('project-root-or-manifest-unavailable');
  }
  const spec = declaredSpec(manifest, '@dialpad/dialtone');
  for (const dir of ancestors(root)) {
    if (existsSync(join(dir, '.git'))) { boundary = dir; break; }
    if (dir === boundary) break;
  }
  const policy: ReadPolicy = { boundary, failures: {} };
  const parts = spec !== null ? umbrellaParts(root, policy)
    : individualParts(root, policy, name => declaredSpec(manifest, name) !== null);
  const componentExports = parts.components ? installedComponentNames(parts.components, componentImportPath(parts.components)) : null;
  const data = assemble([parts], componentExports);
  const domainKeys = { components: 'components', utilities: 'utilityClasses', tokens: 'tokens', icons: 'icons' } as const;
  const domains = bundledDomains('documentation-is-bundled');
  for (const [domain, key] of Object.entries(domainKeys) as Array<[keyof Parts, string]>) {
    const found = parts[domain];
    domains[key] = found ? {
      package: found.source.package, version: found.source.version!,
      schemaVersion: datasetSchema(found.data),
      hash: found.hash,
      selection: 'installed', fallbackReason: null,
    } : bundledStamp(bundledProvenance.domains[key], policy.failures[domain] ?? 'declared-installed-data-unavailable');
  }
  if (!parts.components) unverifyBundledComponents(data);
  const anchor = anchorOf(parts);
  if (spec && anchor) data.warnings = mismatchWarnings(spec, anchor.source.version);
  return {
    data, configured, componentExports,
    provenance: { ...bundledProvenance, domains },
  };
}
