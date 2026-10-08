// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface ValueObject {
  prop?: string;
  value?: string;
  description?: string;
}

export interface Metadata {
  deprecated?: boolean;
  discouraged?: boolean;
  category?: string;
  reason?: string;
  alternatives?: string[];
  docs?: string;
  replacement?: string;
}

export interface ClassData {
  values: ValueObject[];
  metadata?: Metadata;
}

export interface UtilityClassesData {
  [className: string]: ClassData;
}

export interface ThemeData {
  value?: string | number;
  description?: string;
}

export interface TokenData {
  [themeName: string]: ThemeData | Metadata;
}

export interface TokensData {
  [tokenName: string]: TokenData;
}

export interface ComponentProp {
  name: string;
  type?: { name: string };
  values?: string[];
  description?: string;
  required?: boolean;
  defaultValue?: { value?: unknown; [key: string]: unknown };
  tags?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface ComponentEvent {
  name: string;
  description?: string;
  type?: unknown;
  properties?: unknown[];
  tags?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface ComponentSlot {
  name: string;
  description?: string;
  bindings?: unknown[];
  tags?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface ComponentMember {
  name: string;
  [key: string]: unknown;
}

export interface ComponentImport {
  name: string;
  from: string;
  kind: 'root' | 'subpath';
  verification: 'source-export' | 'installed-export';
  package: string;
  version: string;
}

/** C1 v2: aliases are lookup names; only imports certify an export route. */
export interface ComponentIdentity {
  canonicalName: string;
  aliases: string[];
  kind: 'public' | 'internal' | 'unknown';
  source?: { package: string; version: string; path?: string };
  imports: ComponentImport[];
}

export interface Component {
  displayName: string;
  description?: string;
  props?: ComponentProp[];
  events?: ComponentEvent[];
  slots?: ComponentSlot[];
  methods?: ComponentMember[];
  expose?: ComponentMember[];
  tags?: Record<string, unknown>;
  metadata?: Metadata;
  schemaVersion?: number;
  identity?: ComponentIdentity;
}

export interface Icon {
  name: string;
  category: string;
  keywords: string[];
}

export interface IconsData {
  categories: {
    [categoryName: string]: {
      [iconName: string]: string[];
    }
  }
}

export interface DocumentationFrontmatter {
  title?: string;
  description?: string;
  status?: 'ready' | 'planned' | 'beta' | 'wip';
  figmaUrl?: string;
  storybook?: string;
}

export interface DocumentationRecord {
  id: string;
  docId: string;
  docTitle: string;
  category: string;
  headingPath: string[];
  content: string;
  frontmatter: DocumentationFrontmatter;
  filePath: string;
}

export interface SearchResult {
  type: string;
  name: string;
  details: any;
  metadata: Metadata | null;
  tier?: number;
}
