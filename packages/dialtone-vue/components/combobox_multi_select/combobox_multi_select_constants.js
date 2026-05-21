export const MULTI_SELECT_SIZES = {
  // Chip has no 'lg' and 'xl' size. So we don't support that in multi-select.
  EXTRA_SMALL: 'xs',
  SMALL: 'sm',
  DEFAULT: 'md',
};

export const CHIP_SIZES = {
  xs: 'xs',
  sm: 'xs',
  md: 'sm',
};

// Adjusted in DLT-3409 for sub-pixel offset for sizes sm and md
export const CHIP_TOP_POSITION = {
  xs: 1.4,
  sm: -0.1,
  md: -0.3,
};

export default {
  MULTI_SELECT_SIZES,
  CHIP_SIZES,
  CHIP_TOP_POSITION,
};
