export const SEGMENTED_CONTROL_SIZES = ['100', '200', '300', '400', '500', 'xs', 'sm', 'md', 'lg', 'xl'];
export const SEGMENTED_CONTROL_SIZE_DEFAULT = 200;

export const SEGMENTED_CONTROL_SIZE_MODIFIERS = {
  // Numeric (preferred)
  100: 'd-segmented-control--xs',
  200: 'd-segmented-control--sm',
  300: 'd-segmented-control--md',
  400: 'd-segmented-control--lg',
  500: 'd-segmented-control--xl',
  // T-shirt aliases (deprecated)
  xs: 'd-segmented-control--xs',
  sm: 'd-segmented-control--sm',
  md: 'd-segmented-control--md',
  lg: 'd-segmented-control--lg',
  xl: 'd-segmented-control--xl',
};

export const SEGMENTED_CONTROL_ORIENTATIONS = ['horizontal', 'vertical'];
export const SEGMENTED_CONTROL_ORIENTATION_DEFAULT = 'horizontal';

export const SEGMENTED_CONTROL_ACTIVATION_MODES = ['auto', 'manual'];
export const SEGMENTED_CONTROL_ACTIVATION_MODE_DEFAULT = 'auto';

export const SEGMENTED_CONTROL_SPREADS = ['grow', 'evenly'];
export const SEGMENTED_CONTROL_SPREAD_DEFAULT = 'grow';

export const SEGMENTED_CONTROL_ITEM_SELECTOR = '[role="radio"]';
export const SEGMENTED_CONTROL_DATA_VALUE_ATTR = 'data-value';

export const SEGMENTED_CONTROL_CONTEXT_KEY = Symbol('DtSegmentedControlContext');
export const SEGMENTED_CONTROL_SELECT_KEY = Symbol('DtSegmentedControlSelect');
export const SEGMENTED_CONTROL_FOCUS_KEY = Symbol('DtSegmentedControlFocus');

export default {
  SEGMENTED_CONTROL_SIZES,
  SEGMENTED_CONTROL_SIZE_DEFAULT,
  SEGMENTED_CONTROL_SIZE_MODIFIERS,
  SEGMENTED_CONTROL_ORIENTATIONS,
  SEGMENTED_CONTROL_ORIENTATION_DEFAULT,
  SEGMENTED_CONTROL_ACTIVATION_MODES,
  SEGMENTED_CONTROL_ACTIVATION_MODE_DEFAULT,
  SEGMENTED_CONTROL_SPREADS,
  SEGMENTED_CONTROL_SPREAD_DEFAULT,
  SEGMENTED_CONTROL_CONTEXT_KEY,
  SEGMENTED_CONTROL_SELECT_KEY,
  SEGMENTED_CONTROL_FOCUS_KEY,
};
