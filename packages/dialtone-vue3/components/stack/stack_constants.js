/**
 * Direction values for the stack component.
 * Uses object format for historical compatibility - changing to array would be breaking.
 * The object keys are the valid values, and the values are the CSS class suffixes.
 * @type {Object<string, string>}
 */
export const DT_STACK_DIRECTION = {
  default: 'column',
  column: 'column',
  row: 'row',
  'row-reverse': 'row-reverse',
  'column-reverse': 'column-reverse',
};

/**
 * Responsive breakpoint names used for all responsive props.
 * @type {string[]}
 */
export const DT_STACK_RESPONSIVE_BREAKPOINTS = ['sm', 'md', 'lg', 'xl'];

/**
 * Gap values for spacing between stack items.
 * Uses array format.
 * @type {string[]}
 */
export const DT_STACK_GAP = ['0', '50', '100', '200', '300', '350', '400', '450', '500', '525', '550', '600', '625', '650', '700'];

/**
 * Align values for the stack component (cross-axis alignment).
 * Uses array format - simpler structure for newer props.
 * @type {string[]}
 */
export const DT_STACK_ALIGN = ['start', 'center', 'end', 'stretch', 'baseline'];

/**
 * Justify values for the stack component (main-axis distribution).
 * Uses array format - simpler structure for newer props.
 * @type {string[]}
 */
export const DT_STACK_JUSTIFY = ['start', 'center', 'end', 'around', 'between', 'evenly'];

export default {
  DT_STACK_DIRECTION,
  DT_STACK_RESPONSIVE_BREAKPOINTS,
  DT_STACK_GAP,
  DT_STACK_ALIGN,
  DT_STACK_JUSTIFY,
};
