import { BASE_TIPPY_DIRECTIONS } from './tippy_utils';

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
export const POPOVER_DIRECTIONS = [
  ...BASE_TIPPY_DIRECTIONS,
];
