/**
 * Canonical numeric-to-t-shirt size mapping for component size props.
 *
 * Scale: 100-unit ordinal steps with 50-unit half-steps reserved for future sizes.
 * Convention matches Dialtone's existing token scales (dt-size-*, dt-icon-size-*, colors).
 *
 * @example
 *   <DtButton :size="200" />   <!-- equivalent to size="sm" -->
 *   <DtButton :size="250" />   <!-- future "smedium" -->
 */

// Numeric → t-shirt label mapping
export const COMPONENT_SIZES = {
  100: 'xs',
  200: 'sm',
  300: 'md',
  400: 'lg',
  500: 'xl',
};

// Extended sizes for Text headline kind
export const TEXT_HEADLINE_SIZES = {
  ...COMPONENT_SIZES,
  600: '2xl',
  700: '3xl',
};

export default {
  COMPONENT_SIZES,
  TEXT_HEADLINE_SIZES,
};
