import type { DocumentationRecord, DocumentationLink, DocumentationPageReference } from './types.js';
import type { ComponentDocCatalog } from './component-documentation.js';
import { directiveIdentifiers } from './directive-identifiers.js';
import { normalizeComponentName } from './component-name.js';

export type DocumentationContextReference =
  | { kind: 'documentation'; relation: 'source' | 'directive' | 'sibling';
      id: string; headingPath: string[]; contentCharacters: number }
  | { kind: 'component-api'; relation: 'api' | 'companion'; component: string }
  | { kind: 'utility'; relation: 'target'; name: string }
  | ({ kind: 'link'; relation: 'authored'; sourceSectionId: string } & DocumentationLink);
export interface DocumentationContextArgs { id: string }
export interface DocumentationContextResult {
  match: 'exact' | 'no-match';
  id: string;
  docId: string | null;
  sourceSectionId: string | null;
  documentation: DocumentationPageReference | null;
  items: DocumentationContextReference[];
  notes: string[];
}

function documentationReference(record: DocumentationRecord, relation: 'source' | 'directive' | 'sibling') {
  return { kind: 'documentation' as const, relation, id: record.id,
    headingPath: record.headingPath, contentCharacters: Array.from(record.content).length };
}

function apiReferences(docId: string, catalog: ComponentDocCatalog): DocumentationContextReference[] {
  const subjects = new Map<string, 'api' | 'companion'>();
  for (const page of catalog.pages.filter(page => page.docId === docId)) {
    for (const reference of page.components) {
      if (reference.relation !== 'api' && reference.relation !== 'companion') continue;
      if (!subjects.has(reference.canonicalName) || reference.relation === 'api') {
        subjects.set(reference.canonicalName, reference.relation);
      }
    }
  }
  return [...subjects].map(([component, relation]) => ({ kind: 'component-api' as const, relation, component }))
    .sort((a, b) => a.relation.localeCompare(b.relation) || a.component.localeCompare(b.component));
}

function directiveReferences(names: string[], records: DocumentationRecord[], notes: string[]) {
  const references: DocumentationContextReference[] = [];
  const subjects = [...new Set(names.flatMap(directiveIdentifiers))].sort();
  for (const name of subjects) {
    const matching = records.filter(record => !record.example && record.docId.startsWith('directives/')
      && normalizeComponentName(record.docId.slice('directives/'.length)) === normalizeComponentName(name));
    const pages = new Set(matching.map(record => record.docId));
    if (pages.size !== 1) {
      notes.push(`${pages.size ? 'Ambiguous' : 'Missing'} directive documentation for ${name}.`);
      continue;
    }
    references.push(...matching.filter(record => record.content.trim()).map(record => documentationReference(record, 'directive')));
  }
  return references;
}

/** Context describes authored associations; API/CSS availability is checked by the follow-up tool. */
export function getDocumentationContext(
  args: DocumentationContextArgs,
  documentation: DocumentationRecord[],
  componentDocumentation: ComponentDocCatalog,
): DocumentationContextResult {
  const id = args.id.trim();
  const selected = documentation.find(record => record.id === id);
  const docId = selected?.docId ?? id;
  const prose = documentation.filter(record => !record.example && record.docId === docId);
  const result: DocumentationContextResult = { match: 'no-match', id, docId: null,
    sourceSectionId: null, documentation: null, items: [], notes: [] };
  if (!selected && !prose.length) return result;
  result.match = 'exact';
  result.docId = docId;
  const example = selected?.example;
  const preset = example?.source.kind === 'combinator-preset';
  const source = !example ? selected : preset ? undefined : prose.find(record => record.id === example.source.id);
  if (source) {
    result.sourceSectionId = source.id;
    result.items.push(documentationReference(source, 'source'));
  } else if (example && !preset) {
    result.notes.push('The example source section is unavailable; available page context is listed instead.');
  }
  result.items.push(...apiReferences(docId, componentDocumentation));
  result.items.push(...directiveReferences(example?.directives ?? [], documentation, result.notes));
  result.items.push(...[...new Set(example?.utilities ?? [])].sort().map(name => ({
    kind: 'utility' as const, relation: 'target' as const, name,
  })));
  const referenced = new Set(result.items.flatMap(item => item.kind === 'documentation' ? [item.id] : []));
  result.items.push(...prose.filter(record => !referenced.has(record.id) && record.content.trim())
    .map(record => documentationReference(record, 'sibling')));
  const linkKeys = new Set<string>();
  const ordered = source ? [source, ...prose.filter(record => record.id !== source.id)] : prose;
  for (const record of ordered) {
    for (const link of record.links ?? []) {
      const key = JSON.stringify([link.label, link.href, link.url, link.targetDocId]);
      if (linkKeys.has(key)) continue;
      linkKeys.add(key);
      result.items.push({ kind: 'link', relation: 'authored', sourceSectionId: record.id, ...link });
    }
  }
  const pageReferences = new Map(prose.flatMap(record => record.documentation
    ? [[record.documentation.url, record.documentation] as const] : []));
  if (pageReferences.size === 1) result.documentation = [...pageReferences.values()][0];
  else result.notes.push(pageReferences.size ? 'Conflicting published page URLs; none selected.' : 'No published page URL is available.');
  return result;
}
