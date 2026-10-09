// ============================================================================
// DIALTONE QUERY CORE — Public API
// ============================================================================

// Types
export type {
  ValueObject,
  Metadata,
  ClassData,
  UtilityClassesData,
  ThemeData,
  TokenData,
  TokensData,
  ComponentProp,
  ComponentEvent,
  ComponentSlot,
  ComponentImport,
  ComponentIdentity,
  Component,
  Icon,
  IconsData,
  DocumentationFrontmatter,
  DocumentationRecord,
  SearchResult
} from './types.js';

export { normalizeComponents, normalizeComponentName, componentNames, componentImportStatement, componentImportNote } from './component-identity.js';
export type { InstalledComponentExports } from './component-identity.js';

// Data
export { utilityClasses, tokens, components, icons, documentation } from './data.js';

// Utility classes search
export {
  buildCompoundPropertiesSet,
  extractKeywords,
  isValueKeyword,
  valueMatchesKeyword,
  searchUtilityClasses,
  formatResults
} from './tools/utility-classes.js';

// Tokens search
export { searchTokens, formatTokenResults } from './tools/tokens.js';

// Components search
export {
  searchComponents,
  formatComponentResults,
  sortUnifiedResults,
  formatUnifiedResults,
  formatSingleResult
} from './tools/components.js';

// Icons search
export { searchIcons, formatIconResults } from './tools/icons.js';

// Documentation search
export { searchDocumentation, formatDocumentationResults } from './tools/docs.js';

// Filters
export { applySmartFilter } from './utils/filters.js';

export { getComponentDetail, COMPONENT_SECTIONS } from './component-detail.js';
export type { ComponentDetailArgs, ComponentSection } from './component-detail.js';

export { bundledProvenance, componentDocumentation } from "./data.js";
export { createRetrievalEnvelope, formatRetrievalEnvelope, MATCH_STATES, RETRIEVAL_BUDGETS } from "./retrieval.js";
export type { BundledProvenance, DomainStamp, MatchState, Continuation, RetrievalEnvelope } from "./retrieval.js";
export { getComponentDocumentation } from "./component-documentation.js";
export type { ComponentDocCatalog, ComponentDocPage } from "./component-documentation.js";
export { getDocumentationDetail } from './tools/docs.js';

export { getValueDetail, formatTokenThemes } from './value-retrieval.js';
export type { TokenThemeRecord } from './value-retrieval.js';
