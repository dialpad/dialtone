export const DROPDOWN_PADDING_CLASSES = {
  none: undefined,
  small: 'd-py-0',
  large: 'd-py-50',
} as const;

export type DropdownPadding = keyof typeof DROPDOWN_PADDING_CLASSES;

export default {
  DROPDOWN_PADDING_CLASSES,
};
