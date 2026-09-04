import { BASE_TIPPY_DIRECTIONS, TIPPY_STICKY_VALUES } from './TippyUtils';

export const POPOVER_PADDING_CLASSES = {
  none: undefined,
  small: 'd-p-50',
  medium: 'd-p-100',
  large: 'd-p-200',
};
export const POPOVER_HEADER_FOOTER_PADDING_CLASSES = {
  none: undefined,
  small: 'd-pis-50',
  medium: 'd-pis-100',
  large: 'd-pis-200',
};
// Mirrors the --zi-popover and --zi-modal-element design tokens. Tippy takes a raw
// number for zIndex, so the values cannot be referenced as CSS custom properties.
export const POPOVER_Z_INDEX = 300;
export const POPOVER_MODAL_ELEMENT_Z_INDEX = 650;

// An open DtModal, in either the legacy div-based form ([aria-hidden="false"]) or the
// native <dialog> form ([open]).
export const OPEN_MODAL_SELECTOR = [
  '.d-modal[aria-hidden="false"]',
  '.d-modal--transparent[aria-hidden="false"]',
  '.d-modal[open]',
  '.d-modal--transparent[open]',
].join(', ');

export const POPOVER_ROLES = ['dialog', 'menu', 'listbox', 'tree', 'grid'];
export const POPOVER_BOUNDARY_VALUES = ['clippingParents', 'viewport', 'document'];
export const POPOVER_CONTENT_WIDTHS = ['', 'anchor'];
export const POPOVER_INITIAL_FOCUS_STRINGS = ['none', 'dialog', 'first'];
export const POPOVER_APPEND_TO_VALUES = ['parent', 'body', 'root'];
export const POPOVER_STICKY_VALUES = [
  ...TIPPY_STICKY_VALUES,
];
export const POPOVER_DIRECTIONS = [
  ...BASE_TIPPY_DIRECTIONS,
];

export default {
  POPOVER_PADDING_CLASSES,
  POPOVER_HEADER_FOOTER_PADDING_CLASSES,
  POPOVER_Z_INDEX,
  POPOVER_MODAL_ELEMENT_Z_INDEX,
  OPEN_MODAL_SELECTOR,
  POPOVER_ROLES,
  POPOVER_BOUNDARY_VALUES,
  POPOVER_CONTENT_WIDTHS,
  POPOVER_INITIAL_FOCUS_STRINGS,
  POPOVER_APPEND_TO_VALUES,
  POPOVER_STICKY_VALUES,
  POPOVER_DIRECTIONS,
};
