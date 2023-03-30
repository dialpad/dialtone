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
};

export const INPUT_SIZES = {
  EXTRA_SMALL: 'xs',
  SMALL: 'sm',
  DEFAULT: 'md',
  LARGE: 'lg',
  EXTRA_LARGE: 'xl',
};

export default {
  INPUT_TYPES,
  INPUT_SIZES,
};
