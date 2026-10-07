import type { Component, ComponentIdentity } from './types.js';

export interface InstalledComponentExports {
  package: string;
  version: string;
  from: string;
  names: readonly string[] | null;
}

/** Normalize identity without inventing API facts absent from older metadata. */
export function normalizeComponents(records: Component[], installed?: InstalledComponentExports): Component[] {
  const names = installed?.names ? new Set(installed.names) : null;
  return records.map(record => {
    const identity = record.schemaVersion === 2 ? record.identity : undefined;
    const recordedName = identity?.canonicalName || record.displayName;
    let canonicalName = recordedName;
    let kind: ComponentIdentity['kind'] = identity?.kind ?? 'unknown';
    let imports = kind === 'public' ? identity?.imports ?? [] : [];
    if (installed) {
      // A filename is an alias only after the selected installed export entry
      // proves the Dt-prefixed export. Exact names take precedence.
      canonicalName = names?.has(recordedName) ? recordedName
        : names?.has(`Dt${recordedName}`) ? `Dt${recordedName}` : recordedName;
      kind = names ? (names.has(canonicalName) ? 'public' : 'internal') : 'unknown';
      imports = kind === 'public' ? [{
        name: canonicalName, from: installed.from,
        kind: installed.from === installed.package ? 'root' : 'subpath',
        verification: 'installed-export', package: installed.package, version: installed.version,
      }] : [];
    }
    return {
      ...record,
      displayName: canonicalName,
      schemaVersion: 2,
      identity: {
        canonicalName,
        aliases: [...new Set([...(identity?.aliases ?? []), record.displayName])].filter(name => name !== canonicalName),
        kind,
        ...(identity?.source ? { source: identity.source }
          : installed ? { source: { package: installed.package, version: installed.version } } : {}),
        imports,
      },
    };
  });
}

/** Select only a verified route; preferredFrom never creates another route. */
export function componentImportStatement(identity?: ComponentIdentity, preferredFrom?: string): string | null {
  if (identity?.kind !== 'public') return null;
  const route = identity.imports.find(candidate => candidate.from === preferredFrom && candidate.name === identity.canonicalName)
    ?? identity.imports.find(candidate => candidate.from === preferredFrom)
    ?? identity.imports.find(candidate => candidate.name === identity.canonicalName)
    ?? identity.imports[0];
  return route ? `import { ${route.name} } from '${route.from}'` : null;
}

export function componentImportNote(identity?: ComponentIdentity): string {
  return identity?.kind === 'internal'
    ? 'Import unavailable: this component is not exported by the documented package.'
    : 'Import unverified: upgrade component metadata or verify the exports of the installed package before importing.';
}

/** Canonical/alias comparisons accept authored camel, kebab and snake names. */
export function normalizeComponentName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '').replace(/^dt/, '');
}

export function componentNames(component: Component): string[] {
  return [component.displayName, ...(component.identity?.aliases ?? [])];
}
