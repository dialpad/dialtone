export const CONTENT_MODE_TYPES = {
  LIGHT: 'light',
  DARK: 'dark',
  INVERT: 'invert',
};

export const CONTENT_MODE_VALUES = Object.values(CONTENT_MODE_TYPES);

/**
 * Shared prop definition for the contentMode prop.
 * Use in pass-through components that forward to an inner component with the ModeMixin.
 */
export const CONTENT_MODE_PROP = {
  type: String,
  default: null,
  validator: (v) => v === null || CONTENT_MODE_VALUES.includes(v),
};

/**
 * Shared Storybook argType for the contentMode prop.
 */
export const CONTENT_MODE_ARG_TYPE = {
  options: [null, ...CONTENT_MODE_VALUES],
  control: {
    type: 'select',
    labels: { null: '(none)' },
  },
  table: {
    category: 'props',
    defaultValue: { summary: 'null' },
  },
};

export default {
  CONTENT_MODE_TYPES,
  CONTENT_MODE_VALUES,
  CONTENT_MODE_PROP,
  CONTENT_MODE_ARG_TYPE,
};
