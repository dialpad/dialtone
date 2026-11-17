import { BASE_TIPPY_DIRECTIONS, TIPPY_STICKY_VALUES } from './TippyUtils';

export const POPOVER_PADDING_CLASSES = {
  none: undefined,
  small: 'd-p-50',
  medium: 'd-p-100',
  large: 'd-p-200',
} as const;
export const POPOVER_HEADER_FOOTER_PADDING_CLASSES = {
  none: undefined,
  small: 'd-pis-50',
  medium: 'd-pis-100',
  large: 'd-pis-200',
} as const;
export const POPOVER_ROLES = ['dialog', 'menu', 'listbox', 'tree', 'grid'] as const;
export const POPOVER_BOUNDARY_VALUES = ['clippingParents', 'viewport', 'document'] as const;
export const POPOVER_CONTENT_WIDTHS = ['', 'anchor'] as const;
export const POPOVER_INITIAL_FOCUS_STRINGS = ['none', 'dialog', 'first'] as const;
export const POPOVER_APPEND_TO_VALUES = ['parent', 'body', 'root'] as const;
export const POPOVER_STICKY_VALUES = [
  ...TIPPY_STICKY_VALUES,
] as const;
export const POPOVER_DIRECTIONS = [
  ...BASE_TIPPY_DIRECTIONS,
] as const;

export type PopoverPadding = keyof typeof POPOVER_PADDING_CLASSES;
export type PopoverRole = typeof POPOVER_ROLES[number];
export type PopoverBoundary = typeof POPOVER_BOUNDARY_VALUES[number];
export type PopoverContentWidth = typeof POPOVER_CONTENT_WIDTHS[number];
export type PopoverInitialFocusString = typeof POPOVER_INITIAL_FOCUS_STRINGS[number];
export type PopoverAppendTo = typeof POPOVER_APPEND_TO_VALUES[number];
export type PopoverSticky = typeof POPOVER_STICKY_VALUES[number];
export type PopoverDirection = typeof POPOVER_DIRECTIONS[number];

export default {
  POPOVER_PADDING_CLASSES,
  POPOVER_HEADER_FOOTER_PADDING_CLASSES,
  POPOVER_ROLES,
  POPOVER_BOUNDARY_VALUES,
  POPOVER_CONTENT_WIDTHS,
  POPOVER_INITIAL_FOCUS_STRINGS,
  POPOVER_APPEND_TO_VALUES,
  POPOVER_STICKY_VALUES,
  POPOVER_DIRECTIONS,
};
