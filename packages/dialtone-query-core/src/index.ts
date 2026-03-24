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
  Component,
  Icon,
  IconsData,
  SearchResult
} from './types.js';

// Data
export { utilityClasses, tokens, components, icons } from './data.js';

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

// Filters
export { applySmartFilter } from './utils/filters.js';
