export const TAB_LIST_SIZES = ['100', '200', '300', '400', '500', 'default', 'xs', 'sm', 'md', 'lg', 'xl'];

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
};

export const TAB_LIST_KIND_MODIFIERS = {
  inverted: 'd-tablist--inverted',
};

export const TAB_LIST_IMPORTANCE_MODIFIERS = {
  borderless: 'd-tablist--no-border',
};

export const TAB_ORIENTATIONS = ['horizontal', 'vertical'];

export const TAB_ORIENTATION_MODIFIERS = {
  vertical: 'd-tablist--vertical',
};

export const TAB_ACTIVATION_MODES = ['auto', 'manual'];

export const TAB_GROUP_KINDS = ['default', 'muted'];

export const TAB_SPREADS = ['none', 'grow', 'equal'];

export const TAB_SPREAD_MODIFIERS = {
  grow: 'd-tablist--spread-grow',
  equal: 'd-tablist--spread-equal',
};
