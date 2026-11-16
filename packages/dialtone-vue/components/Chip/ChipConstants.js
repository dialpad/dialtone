export const CHIP_VARIANT_MODIFIERS = {
  default: '',
  people: 'd-chip__label--people',
};

export const CHIP_EMPHASIS_MODIFIERS = {
  subtle: 'd-chip__label--subtle',
  base: '',
  strong: 'd-chip__label--strong',
};

// Sizes 100 to 500 match DtBadge's type scale; 600 and 700 are chip-only.
export const CHIP_SIZE_MODIFIERS = {
  // Numeric (preferred)
  100: 'd-chip__label--size-100',
  200: 'd-chip__label--size-200',
  300: 'd-chip__label--size-300',
  400: 'd-chip__label--size-400',
  500: 'd-chip__label--size-500',
  600: 'd-chip__label--size-600',
  700: 'd-chip__label--size-700',
  // T-shirt aliases (deprecated)
  xs: 'd-chip__label--size-100',
  sm: 'd-chip__label--size-200',
  md: 'd-chip__label--size-300',
};

export const CHIP_CLOSE_BUTTON_SIZE_MODIFIERS = {
  // Numeric (preferred)
  100: 'd-chip__close--size-100',
  200: 'd-chip__close--size-200',
  300: 'd-chip__close--size-300',
  400: 'd-chip__close--size-400',
  500: 'd-chip__close--size-500',
  600: 'd-chip__close--size-600',
  700: 'd-chip__close--size-700',
  // T-shirt aliases (deprecated)
  xs: 'd-chip__close--size-100',
  sm: 'd-chip__close--size-200',
  md: 'd-chip__close--size-300',
};

// DtIcon size for the close icon, matching the chip's own icon size (12, 12, 14, 14, 14, 18, 18px).
export const CHIP_ICON_SIZES = {
  // Numeric (preferred)
  100: '100',
  200: '100',
  300: '200',
  400: '200',
  500: '200',
  600: '300',
  700: '300',
  // T-shirt aliases (deprecated)
  xs: '100',
  sm: '100',
  md: '200',
};

export default {
  CHIP_VARIANT_MODIFIERS,
  CHIP_EMPHASIS_MODIFIERS,
  CHIP_SIZE_MODIFIERS,
  CHIP_CLOSE_BUTTON_SIZE_MODIFIERS,
  CHIP_ICON_SIZES,
};
