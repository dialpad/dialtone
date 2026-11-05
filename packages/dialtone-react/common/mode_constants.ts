// The parts of dialtone-vue's common/mode_constants.js the port uses so far. CONTENT_MODE_PROP is a Vue prop definition
// and its validator; in React both are the ContentMode type below.

export const CONTENT_MODE_TYPES = {
  LIGHT: 'light',
  DARK: 'dark',
  INVERT: 'invert',
} as const;

export type ContentMode = typeof CONTENT_MODE_TYPES[keyof typeof CONTENT_MODE_TYPES];
