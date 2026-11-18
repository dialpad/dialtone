export const MULTI_SELECT_SIZES = {
  // Chip has no 'lg' and 'xl' size. So we don't support that in multi-select.
  EXTRA_SMALL: 'xs',
  SMALL: 'sm',
  DEFAULT: 'md',
} as const;

export const CHIP_SIZES = {
  // Numeric (preferred)
  100: 'xs',
  200: 'xs',
  300: 'sm',
  // T-shirt aliases (deprecated)
  xs: 'xs',
  sm: 'xs',
  md: 'sm',
} as const;

// Vue's CHIP_TOP_POSITION is deprecated and unused, so it isn't ported.

/** The sizes Vue's `ordinalSizeValidator(CHIP_SIZES)` accepts: each key, as a number or a string. */
export type ComboboxMultiSelectSize = keyof typeof CHIP_SIZES | `${keyof typeof CHIP_SIZES}`;

export default {
  MULTI_SELECT_SIZES,
  CHIP_SIZES,
};
