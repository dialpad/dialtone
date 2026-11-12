/**
 * Direction values for the stack component.
 * Uses object format for historical compatibility - changing to array would be breaking.
 * The object keys are the valid values, and the values are the CSS class suffixes.
 */
export const DT_STACK_DIRECTION = {
  default: 'column',
  column: 'column',
  row: 'row',
  'row-reverse': 'row-reverse',
  'column-reverse': 'column-reverse',
} as const;

/**
 * Responsive breakpoint names used for all responsive props.
 */
export const DT_STACK_RESPONSIVE_BREAKPOINTS = ['sm', 'md', 'lg', 'xl'] as const;

/**
 * Gap values for spacing between stack items.
 * Uses array format.
 */
export const DT_STACK_GAP = [
  '0', '1', '25', '50', '75', '100', '125', '150', '175', '200', '250', '300', '350', '400', '450', '500', '525', '550',
  '600', '650', '700', '750', '800',
] as const;

/**
 * Align values for the stack component (cross-axis alignment).
 * Uses array format - simpler structure for newer props.
 */
export const DT_STACK_ALIGN = ['start', 'center', 'end', 'stretch', 'baseline'] as const;

/**
 * Justify values for the stack component (main-axis distribution).
 * Uses array format - simpler structure for newer props.
 * Primary values align with CSS justify-content values.
 * The around, between and evenly values are deprecated aliases of space-around, space-between and space-evenly.
 */
export const DT_STACK_JUSTIFY = [
  'start', 'center', 'end', 'space-around', 'space-between', 'space-evenly', 'around', 'between', 'evenly',
] as const;

export type StackDirection = keyof typeof DT_STACK_DIRECTION;
export type StackBreakpoint = typeof DT_STACK_RESPONSIVE_BREAKPOINTS[number];
export type StackGap = typeof DT_STACK_GAP[number];
export type StackAlign = typeof DT_STACK_ALIGN[number];
export type StackJustify = typeof DT_STACK_JUSTIFY[number];

/**
 * A value for every breakpoint, or an object with a `default` value and per-breakpoint overrides.
 * Breakpoints left out get the `default` value.
 */
export type StackResponsive<T> = T | ({ default?: T } & { [B in StackBreakpoint]?: T });

export default {
  DT_STACK_DIRECTION,
  DT_STACK_RESPONSIVE_BREAKPOINTS,
  DT_STACK_GAP,
  DT_STACK_ALIGN,
  DT_STACK_JUSTIFY,
};
