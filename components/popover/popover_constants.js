import { BASE_TIPPY_DIRECTIONS, TIPPY_STICKY_VALUES } from './tippy_utils';

export const POPOVER_PADDING_CLASSES = {
  none: undefined,
  small: 'd-p4',
  medium: 'd-p8',
  large: 'd-p16',
};
export const POPOVER_HEADER_FOOTER_PADDING_CLASSES = {
  none: undefined,
  small: 'd-pl4',
  medium: 'd-pl8',
  large: 'd-pl16',
};
export const POPOVER_ROLES = ['dialog', 'menu', 'listbox', 'tree', 'grid'];
export const POPOVER_CONTENT_WIDTHS = ['', 'anchor'];
export const POPOVER_INITIAL_FOCUS_STRINGS = ['none', 'dialog', 'first'];
export const POPOVER_APPEND_TO_VALUES = ['parent', 'body'];
export const POPOVER_STICKY_VALUES = [
  ...TIPPY_STICKY_VALUES,
];
export const POPOVER_DIRECTIONS = [
  ...BASE_TIPPY_DIRECTIONS,
];
