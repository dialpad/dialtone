export const MULTI_SELECT_SIZES = {
  // Chip has no 'lg' and 'xl' size. So we don't support that in multi-select.
  EXTRA_SMALL: 'xs',
  SMALL: 'sm',
  DEFAULT: 'md',
};

export const CHIP_SIZES = {
  // Numeric (preferred)
  100: 'xs',
  200: 'xs',
  300: 'sm',
  // T-shirt aliases (deprecated)
  xs: 'xs',
  sm: 'xs',
  md: 'sm',
};

/**
 * @deprecated No longer used. Chip vertical alignment is computed geometrically
 * in DtComboboxMultiSelect rather than read from this table. Kept only so the
 * public export does not disappear; it will be removed in the next major.
 */
export const CHIP_TOP_POSITION = {
  // Numeric (preferred)
  100: 1.4,
  200: 0.4,
  300: 0.2,
  // T-shirt aliases (deprecated)
  xs: 1.4,
  sm: -0.1,
  md: -0.3,
};

export default {
  MULTI_SELECT_SIZES,
  CHIP_SIZES,
  CHIP_TOP_POSITION,
};
