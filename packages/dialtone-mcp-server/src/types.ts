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
}

export interface ComponentEvent {
  name: string;
}

export interface ComponentSlot {
  name: string;
}

export interface Component {
  displayName: string;
  description?: string;
  props?: ComponentProp[];
  events?: ComponentEvent[];
  slots?: ComponentSlot[];
  metadata?: Metadata;
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

export interface SearchResult {
  type: string;
  name: string;
  details: any;
  metadata: Metadata | null;
  tier?: number;
}
