export const TOGGLE_SIZE_MODIFIERS = {
  // Numeric (preferred)
  200: 'd-toggle--small',
  300: '',
  // T-shirt aliases (deprecated)
  sm: 'd-toggle--small',
  md: '',
} as const;

export const TOGGLE_CHECKED_VALUES = [false, true, 'mixed'] as const;

/** A size `TOGGLE_SIZE_MODIFIERS` knows, as a string or a number (Vue's ordinalSizeValidator). */
export type ToggleSize = keyof typeof TOGGLE_SIZE_MODIFIERS | `${keyof typeof TOGGLE_SIZE_MODIFIERS}`;

/** A value `TOGGLE_CHECKED_VALUES` lists. */
export type ToggleCheckedValue = (typeof TOGGLE_CHECKED_VALUES)[number];
