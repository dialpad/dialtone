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

// Per-size sub-pixel offset (CSS px) subtracted from the chip wrapper's top so
// the chip lands integer-aligned with the input on both 1x and 2x displays.
// Empirically tuned — adjusting a value shifts the painted chip position by
// that many CSS px on hi-DPI and may flip the rounding side on 1x.
export const CHIP_TOP_POSITION = {
  xs: 1.4,
  sm: 0.4,
  md: 0.6,
};

export default {
  MULTI_SELECT_SIZES,
  CHIP_SIZES,
  CHIP_TOP_POSITION,
};
