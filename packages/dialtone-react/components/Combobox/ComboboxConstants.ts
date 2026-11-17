export const COMBOBOX_LABEL_SIZES = {
  EXTRA_SMALL: 'xs',
  SMALL: 'sm',
  DEFAULT: 'md',
  LARGE: 'lg',
  EXTRA_LARGE: 'xl',
} as const;

export type ComboboxLabelSize = typeof COMBOBOX_LABEL_SIZES[keyof typeof COMBOBOX_LABEL_SIZES];

/** Vue's size validator: a label size, or an ordinal of COMPONENT_SIZES as a number or a string. */
export type ComboboxSize = ComboboxLabelSize | 100 | 200 | 300 | 400 | 500 | '100' | '200' | '300' | '400' | '500';

export default {
  COMBOBOX_LABEL_SIZES,
};
