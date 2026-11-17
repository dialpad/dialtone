export const TAB_LIST_SIZES = ['100', '200', '300', '400', '500', 'default', 'xs', 'sm', 'md', 'lg', 'xl'] as const;

export const TAB_LIST_SIZE_MODIFIERS = {
  // Numeric (preferred)
  100: 'd-tablist--xs',
  200: 'd-tablist--sm',
  300: '',
  400: 'd-tablist--lg',
  500: 'd-tablist--xl',
  // T-shirt aliases (deprecated)
  xs: 'd-tablist--xs',
  sm: 'd-tablist--sm',
  md: '',
  lg: 'd-tablist--lg',
  xl: 'd-tablist--xl',
  // Legacy alias
  default: '',
} as const;

export const TAB_LIST_KIND_MODIFIERS = {
  inverted: 'd-tablist--inverted',
} as const;

export const TAB_LIST_IMPORTANCE_MODIFIERS = {
  borderless: 'd-tablist--no-border',
} as const;

export const TAB_ORIENTATIONS = ['horizontal', 'vertical'] as const;

export const TAB_ORIENTATION_MODIFIERS = {
  vertical: 'd-tablist--vertical',
} as const;

export const TAB_ACTIVATION_MODES = ['auto', 'manual'] as const;

export const TAB_GROUP_KINDS = ['default', 'muted'] as const;

export const TAB_SPREADS = ['none', 'grow', 'equal'] as const;

export const TAB_SPREAD_MODIFIERS = {
  grow: 'd-tablist--spread-grow',
  equal: 'd-tablist--spread-equal',
} as const;

/** Vue's `ordinalSizeValidator(TAB_LIST_SIZES)`: a size as a string, or a numeric one as a number. */
export type TabListSize = typeof TAB_LIST_SIZES[number] | 100 | 200 | 300 | 400 | 500;
export type TabOrientation = typeof TAB_ORIENTATIONS[number];
export type TabActivationMode = typeof TAB_ACTIVATION_MODES[number];
export type TabGroupKind = typeof TAB_GROUP_KINDS[number];
export type TabSpread = typeof TAB_SPREADS[number];
