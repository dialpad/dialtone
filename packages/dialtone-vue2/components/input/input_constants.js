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
};

export const INPUT_SIZES = {
  EXTRA_SMALL: 'xs',
  SMALL: 'sm',
  DEFAULT: 'md',
  LARGE: 'lg',
  EXTRA_LARGE: 'xl',
};

export const INPUT_ICON_SIZES = {
  xs: '100',
  sm: '200',
  md: '200',
  lg: '400',
  xl: '500',
};

export const INPUT_SIZE_CLASSES = {
  input: {
    xs: 'd-input--xs',
    sm: 'd-input--sm',
    lg: 'd-input--lg',
    xl: 'd-input--xl',
  },

  textarea: {
    xs: 'd-textarea--xs',
    sm: 'd-textarea--sm',
    lg: 'd-textarea--lg',
    xl: 'd-textarea--xl',
  },
};

export const INPUT_STATE_CLASSES = {
  input: {
    error: 'd-input--error',
    warning: 'd-input--warning',
    success: 'd-input--success',
  },

  textarea: {
    error: 'd-textarea--error',
    warning: 'd-textarea--warning',
    success: 'd-textarea--success',
  },
};

export default {
  INPUT_TYPES,
  INPUT_SIZES,
  INPUT_ICON_SIZES,
  INPUT_SIZE_CLASSES,
  INPUT_STATE_CLASSES,
};
