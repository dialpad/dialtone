export const SEGMENTED_CONTROL_SIZES = ['default', 'xs', 'sm', 'lg', 'xl'];

export const SEGMENTED_CONTROL_SIZE_MODIFIERS = {
  default: 'd-segmented-control--md',
  xs: 'd-segmented-control--xs',
  sm: 'd-segmented-control--sm',
  lg: 'd-segmented-control--lg',
  xl: 'd-segmented-control--xl',
};

export const SEGMENTED_CONTROL_ORIENTATIONS = ['horizontal', 'vertical'];

export const SEGMENTED_CONTROL_ACTIVATION_MODES = ['auto', 'manual'];

export const SEGMENTED_CONTROL_SPREADS = ['grow', 'evenly'];

export const SEGMENTED_CONTROL_ITEM_SELECTOR = '[role="radio"]';
export const SEGMENTED_CONTROL_DATA_VALUE_ATTR = 'data-value';

export const SEGMENTED_CONTROL_CONTEXT_KEY = Symbol('DtSegmentedControlContext');
export const SEGMENTED_CONTROL_SELECT_KEY = Symbol('DtSegmentedControlSelect');
export const SEGMENTED_CONTROL_FOCUS_KEY = Symbol('DtSegmentedControlFocus');

export default {
  SEGMENTED_CONTROL_SIZES,
  SEGMENTED_CONTROL_SIZE_MODIFIERS,
  SEGMENTED_CONTROL_ORIENTATIONS,
  SEGMENTED_CONTROL_ACTIVATION_MODES,
  SEGMENTED_CONTROL_SPREADS,
  SEGMENTED_CONTROL_CONTEXT_KEY,
  SEGMENTED_CONTROL_SELECT_KEY,
  SEGMENTED_CONTROL_FOCUS_KEY,
};
