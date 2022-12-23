import { BASE_TIPPY_DIRECTIONS, TIPPY_STICKY_VALUES } from './tippy_utils';

export const POPOVER_PADDING_CLASSES = {
  none: undefined,
  small: 'd-p8',
  medium: 'd-p16',
  large: 'd-p24',
};
export const POPOVER_HEADER_FOOTER_PADDING_CLASSES = {
  none: undefined,
  small: 'd-pl8',
  medium: 'd-pl16',
  large: 'd-pl24',
};
export const POPOVER_ROLES = ['dialog', 'menu', 'listbox', 'tree', 'grid'];
export const POPOVER_CONTENT_WIDTHS = [null, 'anchor'];
export const POPOVER_INITIAL_FOCUS_STRINGS = ['none', 'dialog', 'first'];
export const POPOVER_APPEND_TO_VALUES = ['parent'];
export const POPOVER_STICKY_VALUES = [
  ...TIPPY_STICKY_VALUES,
];
export const POPOVER_DIRECTIONS = [
  ...BASE_TIPPY_DIRECTIONS,
];
