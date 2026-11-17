/**
 * Valid `as` elements for the box component.
 */
export const DT_BOX_AS_VALUES = [
  'div', 'span', 'section', 'article', 'aside', 'main', 'header', 'footer', 'nav', 'ul', 'ol', 'li', 'fieldset', 'form',
  'figure',
] as const;

/**
 * Spacing token scale (shared across all padding props).
 */
export const DT_BOX_SPACING_VALUES = [
  '0', '1', '25', '50', '75', '100', '125', '150', '175', '200', '250', '300', '350', '400', '450', '500', '525', '550',
  '600', '650', '700', '750', '800',
] as const;

type DtBoxSpacingNegative = `n${Exclude<typeof DT_BOX_SPACING_VALUES[number], '0'>}`;

const DT_BOX_SPACING_NEGATIVE_VALUES = DT_BOX_SPACING_VALUES
  .filter(value => value !== '0')
  .map(value => `n${value}` as DtBoxSpacingNegative);

/**
 * Inset coordinate scale for shorthand and axis inset props.
 */
export const DT_BOX_INSET_VALUES = [
  ...DT_BOX_SPACING_VALUES,
  ...DT_BOX_SPACING_NEGATIVE_VALUES,
] as const;

/**
 * Inset coordinate scale for side-specific inset props.
 */
export const DT_BOX_INSET_SIDE_VALUES = [
  ...DT_BOX_INSET_VALUES,
  '50p', '100p', 'n50p', 'n100p',
] as const;

/**
 * Surface color values (neutral + semantic + subtle/strong + opaque).
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
] as const;

/**
 * Border color values (neutral + semantic + variants).
 */
export const DT_BOX_BORDER_COLOR_VALUES = [
  'transparent', 'subtle', 'default', 'moderate', 'bold', 'accent', 'focus',
  'brand', 'positive', 'warning', 'critical', 'info',
  'brand-subtle', 'brand-strong', 'positive-subtle', 'positive-strong',
  'warning-subtle', 'warning-strong', 'critical-subtle', 'critical-strong',
  'info-subtle', 'info-strong',
] as const;

/**
 * Border width values (maps to --dt-size-border-* tokens).
 */
export const DT_BOX_BORDER_WIDTH_VALUES = ['0', '50', '100', '150', '200', '300', '400'] as const;

/**
 * Border radius values (maps to --dt-size-radius-* tokens).
 */
export const DT_BOX_BORDER_RADIUS_VALUES = [
  '0', '100', '200', '300', '350', '400', '450', '500', '550', '600', 'pill', 'circle',
] as const;

/**
 * Shadow values (maps to --dt-shadow-* tokens).
 */
export const DT_BOX_SHADOW_VALUES = ['small', 'medium', 'large', 'extra-large', 'card'] as const;

/**
 * CSS position values.
 */
export const DT_BOX_POSITION_VALUES = ['static', 'relative', 'absolute', 'fixed', 'sticky'] as const;

/**
 * Z-index values (maps to --zi-* tokens).
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
] as const;

/**
 * Layout token scale (for sizing props: inlineSize, blockSize, min/max variants).
 * dialtone-vue's `LAYOUT_VALUES` (`common/constants/layout.js`): `LAYOUT_SIZE_VALUES` then `LAYOUT_PERCENT_VALUES`.
 * Includes 0, which resolves to raw CSS 0 rather than a --dt-layout-* token.
 */
export const DT_BOX_LAYOUT_VALUES = [
  '0',
  '1px', '2px', '8px', '25', '20px', '24px', '50', '75', '100', '125', '150',
  '175', '200', '250', '300', '350', '400', '450', '500', '550', '600', '650',
  '700', '750', '800', '850', '900', '950', '1000', '1050', '1100', '1150',
  '1200', '1250', '1300', '1350', '1400', '1450', '1500', '1550', '1600',
  '10p', '20p', '25p', '30p', '33p', '40p', '50p',
  '60p', '66p', '70p', '75p', '80p', '90p', '95p', '100p',
] as const;

/**
 * Overflow values.
 */
export const DT_BOX_OVERFLOW_VALUES = ['hidden', 'scroll', 'auto', 'clip', 'visible'] as const;

/**
 * Scrollbar autoHide mode values (maps to OverlayScrollbars autoHide option).
 */
export const DT_BOX_SCROLLBAR_VALUES = ['leave', 'scroll', 'move', 'always'] as const;

export type DtBoxAs = typeof DT_BOX_AS_VALUES[number];
export type DtBoxSpacing = typeof DT_BOX_SPACING_VALUES[number];
export type DtBoxInset = typeof DT_BOX_INSET_VALUES[number];
export type DtBoxInsetSide = typeof DT_BOX_INSET_SIDE_VALUES[number];
export type DtBoxSurface = typeof DT_BOX_SURFACE_VALUES[number];
export type DtBoxBorderColor = typeof DT_BOX_BORDER_COLOR_VALUES[number];
export type DtBoxBorderWidth = typeof DT_BOX_BORDER_WIDTH_VALUES[number];
export type DtBoxBorderRadius = typeof DT_BOX_BORDER_RADIUS_VALUES[number];
export type DtBoxShadow = typeof DT_BOX_SHADOW_VALUES[number];
export type DtBoxPosition = typeof DT_BOX_POSITION_VALUES[number];
export type DtBoxZIndex = typeof DT_BOX_Z_INDEX_VALUES[number];
export type DtBoxLayout = typeof DT_BOX_LAYOUT_VALUES[number];
export type DtBoxOverflow = typeof DT_BOX_OVERFLOW_VALUES[number];
export type DtBoxScrollbar = typeof DT_BOX_SCROLLBAR_VALUES[number];
