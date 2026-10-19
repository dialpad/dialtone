// ============================================================================
// DATA IMPORTS
// ============================================================================

import type { UtilityClassesData, TokensData, Component, IconsData, DocumentationRecord } from './types.js';
import type { BundledProvenance } from './retrieval.js';
import type { ComponentDocCatalog } from './component-documentation.js';
import bundledStamp from './generated/bundled-provenance.json' with { type: 'json' };
import componentDocCatalog from '@dialpad/dialtone-docs/dist/component-doc-links.json' with { type: 'json' };
import { normalizeComponents } from './component-identity.js';

import utilityClassesData from '@dialpad/dialtone-css/lib/dist/dialtone-docs.json' with { type: 'json' };
import tokensData from '@dialpad/dialtone-css/lib/dist/tokens-docs.json' with { type: 'json' };
import componentsData from '@dialpad/dialtone-vue/component-documentation.json' with { type: 'json' };
import iconsData from '@dialpad/dialtone-icons/keywords-icons.json' with { type: 'json' };
import documentationData from '@dialpad/dialtone-docs/dist/public-docs.json' with { type: 'json' };

export const utilityClasses: UtilityClassesData = utilityClassesData as unknown as UtilityClassesData;
export const tokens: TokensData = tokensData as unknown as TokensData;
export const components: Component[] = normalizeComponents(componentsData as unknown as Component[]);
export const icons: IconsData = iconsData as unknown as IconsData;
export const documentation: DocumentationRecord[] = documentationData as unknown as DocumentationRecord[];

export const bundledProvenance = bundledStamp as BundledProvenance;
export const componentDocumentation = componentDocCatalog as ComponentDocCatalog;
