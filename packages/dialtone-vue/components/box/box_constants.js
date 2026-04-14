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

/**
 * Surface color values (neutral + semantic + subtle/strong + opaque).
 * @type {string[]}
 */
export const DT_BOX_SURFACE_VALUES = [
  'primary', 'secondary', 'moderate', 'bold', 'strong', 'contrast', 'backdrop',
  'brand', 'info', 'success', 'warning', 'critical',
  'brand-subtle', 'brand-strong', 'info-subtle', 'info-strong',
  'success-subtle', 'success-strong', 'warning-subtle', 'warning-strong',
  'critical-subtle', 'critical-strong',
  'primary-opaque', 'secondary-opaque', 'moderate-opaque', 'bold-opaque',
  'strong-opaque', 'contrast-opaque',
  'brand-opaque', 'brand-subtle-opaque', 'info-opaque', 'info-subtle-opaque',
  'success-opaque', 'success-subtle-opaque', 'warning-opaque', 'warning-subtle-opaque',
  'critical-opaque', 'critical-subtle-opaque',
];
