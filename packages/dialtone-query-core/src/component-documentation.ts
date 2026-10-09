import type { ComponentIdentity } from './types.js';
export interface ComponentDocPage {
  docId: string;
  title: string | null;
  pageStatus: string;
  sourcePath: string;
  pagePath: string;
  rawMarkdownPath: string;
  components: {
    canonicalName: string;
    referenceName: string;
    relation: string;
    sourceLine: number;
  }[];
}
export interface ComponentDocCatalog {
  schemaVersion: number;
  identitySchemaVersion: number;
  source: {
    channel: string;
    origin: string;
    versionScope: string;
    hash: string;
  };
  pages: ComponentDocPage[];
}
export function getComponentDocumentation(
  identity: ComponentIdentity | undefined,
  catalog: ComponentDocCatalog,
) {
  const qualification = {
    versionScope: 'latest',
    installedCompatibility: 'not_checked',
    source: catalog.source,
  };
  if (!identity || identity.kind !== 'public') {
    return {
      status: 'unverified_identity',
      pages: [],
      reason: 'public_component_identity_not_verified',
      ...qualification,
    };
  }
  const pages = catalog.pages.flatMap((page) => {
    const associations = page.components.filter(
      (reference) => reference.canonicalName === identity.canonicalName,
    );
    const association =
      associations.find((reference) => reference.relation === 'api') ??
      associations[0];
    return association
      ? [
          {
            docId: page.docId,
            url: new URL(page.pagePath, catalog.source.origin).href,
            rawMarkdownUrl: new URL(page.rawMarkdownPath, catalog.source.origin)
              .href,
            relation: association.relation,
            pageStatus: page.pageStatus,
            apiContentStatus: 'unverified',
            sourcePath: page.sourcePath,
            sourceLine: association.sourceLine,
          },
        ]
      : [];
  });
  const status =
    pages.length === 0
      ? 'missing'
      : pages.length === 1
        ? 'available'
        : 'ambiguous';
  return {
    status,
    pages,
    reason:
      status === 'missing'
        ? 'no_authored_component_association'
        : status === 'ambiguous'
          ? 'conflicting_authored_component_associations'
          : null,
    ...qualification,
  };
}
