// Valid input types, any other input types (for example: 'radio' or 'checkbox') should
// use the respective base vue components (radio.vue and checkout.vue).
export const INPUT_TYPES = {
  TEXT: 'text',
  TEXTAREA: 'textarea',
  PASSWORD: 'password',
  EMAIL: 'email',
  NUMBER: 'number',
};

export const INPUT_SIZE_TYPES = {
  EXTRA_SMALL: 'xs',
  SMALL: 'sm',
  DEFAULT: '',
  LARGE: 'lg',
  EXTRA_LARGE: 'xl',
};

export default {
  INPUT_TYPES,
  INPUT_SIZE_TYPES,
};
