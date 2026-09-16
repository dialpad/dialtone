import { LAYOUT_VALUES } from '@/common/constants';

/**
 * Valid `as` elements for the box component.
 * @type {string[]}
 */
export const DT_BOX_AS_VALUES = ['div', 'span', 'section', 'article', 'aside', 'main', 'header', 'footer', 'nav', 'ul', 'ol', 'li', 'fieldset', 'form', 'figure'];

/**
 * Spacing token scale (shared across all padding props).
 * @type {string[]}
 */
export const DT_BOX_SPACING_VALUES = ['0', '1', '25', '50', '75', '100', '125', '150', '175', '200', '250', '300', '350', '400', '450', '500', '525', '550', '600', '650', '700', '750', '800'];

const DT_BOX_SPACING_NEGATIVE_VALUES = DT_BOX_SPACING_VALUES
  .filter(value => value !== '0')
  .map(value => `n${value}`);

/**
 * Inset coordinate scale for shorthand and axis inset props.
 * @type {string[]}
 */
export const DT_BOX_INSET_VALUES = [
  ...DT_BOX_SPACING_VALUES,
  ...DT_BOX_SPACING_NEGATIVE_VALUES,
];

/**
 * Inset coordinate scale for side-specific inset props.
 * @type {string[]}
 */
export const DT_BOX_INSET_SIDE_VALUES = [
  ...DT_BOX_INSET_VALUES,
  '50p', '100p', 'n50p', 'n100p',
];

/**
 * Surface color values (neutral + semantic + subtle/strong + opaque).
 * @type {string[]}
 */
export const DT_BOX_SURFACE_VALUES = [
  'primary', 'secondary', 'moderate', 'bold', 'strong', 'contrast', 'backdrop', 'overlay',
  'brand', 'info', 'positive', 'warning', 'critical',
  'brand-subtle', 'brand-strong', 'info-subtle', 'info-strong',
  'positive-subtle', 'positive-strong', 'warning-subtle', 'warning-strong',
  'critical-subtle', 'critical-strong',
  'primary-opaque', 'secondary-opaque', 'moderate-opaque', 'bold-opaque',
  'strong-opaque', 'contrast-opaque',
  'brand-opaque', 'brand-subtle-opaque', 'info-opaque', 'info-subtle-opaque',
  'positive-opaque', 'positive-subtle-opaque', 'warning-opaque', 'warning-subtle-opaque',
  'critical-opaque', 'critical-subtle-opaque',
];

/**
 * Border color values (neutral + semantic + variants).
 * @type {string[]}
 */
export const DT_BOX_BORDER_COLOR_VALUES = [
  'transparent', 'subtle', 'default', 'moderate', 'bold', 'accent', 'focus',
  'brand', 'positive', 'warning', 'critical', 'info',
  'brand-subtle', 'brand-strong', 'positive-subtle', 'positive-strong',
  'warning-subtle', 'warning-strong', 'critical-subtle', 'critical-strong',
  'info-subtle', 'info-strong',
];

/**
 * Border width values (maps to --dt-size-border-* tokens).
 * @type {string[]}
 */
export const DT_BOX_BORDER_WIDTH_VALUES = ['0', '50', '100', '150', '200', '300', '400'];

/**
 * Border radius values (maps to --dt-size-radius-* tokens).
 * @type {string[]}
 */
export const DT_BOX_BORDER_RADIUS_VALUES = ['0', '100', '200', '300', '350', '400', '450', '500', '550', '600', 'pill', 'circle'];

/**
 * Shadow values (maps to --dt-shadow-* tokens).
 * @type {string[]}
 */
export const DT_BOX_SHADOW_VALUES = ['small', 'medium', 'large', 'extra-large', 'card'];

/**
 * CSS position values.
 * @type {string[]}
 */
export const DT_BOX_POSITION_VALUES = ['static', 'relative', 'absolute', 'fixed', 'sticky'];

/**
 * Z-index values (maps to --zi-* tokens).
 * @type {string[]}
 */
export const DT_BOX_Z_INDEX_VALUES = [
  'hide',
  'base',
  'base1',
  'selected',
  'active',
  'navigation',
  'navigation-fixed',
  'dropdown',
  'popover',
  'tooltip',
  'drawer',
  'modal',
  'modal-element',
  'notification',
];

/**
 * Layout token scale (for sizing props: inlineSize, blockSize, min/max variants).
 * @type {string[]}
 */
export const DT_BOX_LAYOUT_VALUES = LAYOUT_VALUES;

/**
 * Overflow values.
 * @type {string[]}
 */
export const DT_BOX_OVERFLOW_VALUES = ['hidden', 'scroll', 'auto', 'clip', 'visible'];

/**
 * Scrollbar autoHide mode values (maps to OverlayScrollbars autoHide option).
 * @type {string[]}
 */
export const DT_BOX_SCROLLBAR_VALUES = ['leave', 'scroll', 'move', 'always'];
