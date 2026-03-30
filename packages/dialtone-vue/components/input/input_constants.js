// Valid input types, any other input types (for example: 'radio' or 'checkbox') should
// use the respective base vue components (radio.vue and checkout.vue).
export const INPUT_TYPES = {
  TEXT: 'text',
  TEXTAREA: 'textarea',
  PASSWORD: 'password',
  EMAIL: 'email',
  NUMBER: 'number',
  DATE: 'date',
  TIME: 'time',
  FILE: 'file',
  TEL: 'tel',
  SEARCH: 'search',
  COLOR: 'color',
};

export const INPUT_SIZES = {
  EXTRA_SMALL: 'xs',
  SMALL: 'sm',
  DEFAULT: 'md',
  LARGE: 'lg',
  EXTRA_LARGE: 'xl',
};

export const INPUT_ICON_SIZES = {
  // Numeric (preferred)
  100: '100',
  200: '200',
  300: '200',
  400: '400',
  500: '500',
  // T-shirt aliases (deprecated)
  xs: '100',
  sm: '200',
  md: '200',
  lg: '400',
  xl: '500',
};

export const INPUT_SIZE_CLASSES = {
  input: {
    // Numeric (preferred)
    100: 'd-input--xs',
    200: 'd-input--sm',
    400: 'd-input--lg',
    500: 'd-input--xl',
    // T-shirt aliases (deprecated)
    xs: 'd-input--xs',
    sm: 'd-input--sm',
    lg: 'd-input--lg',
    xl: 'd-input--xl',
  },

  textarea: {
    // Numeric (preferred)
    100: 'd-textarea--xs',
    200: 'd-textarea--sm',
    400: 'd-textarea--lg',
    500: 'd-textarea--xl',
    // T-shirt aliases (deprecated)
    xs: 'd-textarea--xs',
    sm: 'd-textarea--sm',
    lg: 'd-textarea--lg',
    xl: 'd-textarea--xl',
  },
};

export const INPUT_STATE_CLASSES = {
  error: 'd-input--error',
  warning: 'd-input--warning',
  success: 'd-input--success',
};

export const DESCRIPTION_SIZE_CLASSES = {
  // Numeric (preferred)
  100: 'd-description--xs',
  200: 'd-description--sm',
  300: '',
  400: 'd-description--lg',
  500: 'd-description--xl',
  // T-shirt aliases (deprecated)
  xs: 'd-description--xs',
  sm: 'd-description--sm',
  md: '',
  lg: 'd-description--lg',
  xl: 'd-description--xl',
};

export default {
  INPUT_TYPES,
  INPUT_SIZES,
  INPUT_ICON_SIZES,
  INPUT_SIZE_CLASSES,
  INPUT_STATE_CLASSES,
  DESCRIPTION_SIZE_CLASSES,
};
