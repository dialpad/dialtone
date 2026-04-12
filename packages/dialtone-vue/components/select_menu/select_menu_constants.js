export const SELECT_SIZE_MODIFIERS = {
  // Numeric (preferred)
  100: 'd-select--xs',
  200: 'd-select--sm',
  300: '',
  400: 'd-select--lg',
  500: 'd-select--xl',
  // T-shirt aliases (deprecated)
  xs: 'd-select--xs',
  sm: 'd-select--sm',
  md: '',
  lg: 'd-select--lg',
  xl: 'd-select--xl',
};

export const SELECT_STATE_MODIFIERS = {
  critical: 'd-select__input--critical',
  warning: 'd-select__input--warning',
  positive: 'd-select__input--positive',
};

export default {
  SELECT_SIZE_MODIFIERS,
  SELECT_STATE_MODIFIERS,
};
