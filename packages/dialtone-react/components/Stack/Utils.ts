import {
  DT_STACK_DIRECTION,
  DT_STACK_GAP,
  DT_STACK_RESPONSIVE_BREAKPOINTS,
  DT_STACK_ALIGN,
  DT_STACK_JUSTIFY,
} from './StackConstants';

// The helpers take any prop value, as Vue's do: its validators only warn, so an invalid value still reaches them.
type PropValue = unknown;
type ClassName = string | null;

const DIRECTIONS: Readonly<Record<string, string>> = DT_STACK_DIRECTION;

function _isDefaultDirection (direction: unknown): boolean {
  return direction === DT_STACK_DIRECTION.default;
}

function _breakpointValue (value: object, key: string): unknown {
  return (value as Record<string, unknown>)[key];
}

function _includes (values: readonly string[], value: unknown): boolean {
  return values.includes(value as string);
}

/**
 * Generic helper to extract default value from string or object props
 * @returns The default value or null
 */
function _getDefaultValue (value: PropValue): unknown {
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value !== null) return _breakpointValue(value, 'default');
  return null;
}

function _getValidDirection (direction: PropValue): string | null | undefined {
  if (typeof direction === 'string') {
    return !_isDefaultDirection(direction) ? DIRECTIONS[direction] : null;
  } else if (typeof direction === 'object' && direction !== null) {
    const defaultStyle = _breakpointValue(direction, 'default');

    return !_isDefaultDirection(defaultStyle) ? DIRECTIONS[defaultStyle as string] : null;
  } else { return null; }
}

/**
 * Generic helper to generate responsive classes for any prop
 * @param propValue - The prop value object with breakpoint keys
 * @param propName - The name of the prop (e.g., 'gap', 'align')
 * @param validValues - Valid values (array or object for direction)
 * @param classPrefix - CSS class prefix (default: 'd-stack')
 * @returns Array of CSS class names
 */
function _getResponsiveClasses (
  propValue: PropValue,
  propName: string,
  validValues: readonly string[] | Readonly<Record<string, string>>,
  classPrefix = 'd-stack',
): ClassName[] {
  if (typeof propValue !== 'object' || propValue === null) return [];

  return DT_STACK_RESPONSIVE_BREAKPOINTS.map((breakpoint) => {
    const value = _breakpointValue(propValue, breakpoint);
    if (!value) return null;

    // Handle both array (gap, align, justify) and object (direction) validValues
    const isValid = Array.isArray(validValues)
      ? _includes(validValues, value)
      : String(value) in validValues;

    // For direction, we don't need the prop name in the class
    const className = propName === ''
      ? `${classPrefix}--${breakpoint}-${String(value)}`
      : `${classPrefix}--${breakpoint}-${propName}-${String(value)}`;

    return isValid ? className : null;
  });
}

export function getDefaultDirectionClass (direction: PropValue): ClassName {
  const validDirection = _getValidDirection(direction);
  return validDirection
    ? `d-stack--${DIRECTIONS[validDirection]}`
    : null;
}

function getResponsiveDirectionClasses (direction: PropValue): ClassName[] {
  return _getResponsiveClasses(direction, '', DT_STACK_DIRECTION);
}

function getResponsiveGapClasses (gap: PropValue): ClassName[] {
  return _getResponsiveClasses(gap, 'gap', DT_STACK_GAP);
}

function getResponsiveAlignClasses (align: PropValue): ClassName[] {
  return _getResponsiveClasses(align, 'align', DT_STACK_ALIGN);
}

function getResponsiveJustifyClasses (justify: PropValue): ClassName[] {
  if (typeof justify !== 'object' || justify === null) return [];

  return DT_STACK_RESPONSIVE_BREAKPOINTS.map((breakpoint) => {
    const value = _breakpointValue(justify, breakpoint);
    if (!value) return null;

    const isValid = _includes(DT_STACK_JUSTIFY, value);
    const normalizedValue = _normalizeJustifyForClass(value);

    return isValid ? `d-stack--${breakpoint}-justify-${normalizedValue}` : null;
  });
}

export function getResponsiveClasses (
  direction: PropValue,
  gap: PropValue,
  align: PropValue,
  justify: PropValue,
): ClassName[] {
  return [
    ...getResponsiveDirectionClasses(direction),
    ...getResponsiveGapClasses(gap),
    ...getResponsiveAlignClasses(align),
    ...getResponsiveJustifyClasses(justify),
  ];
}

export function getDefaultGapClass (gap: PropValue): ClassName {
  const validGap = _getDefaultValue(gap);
  return _includes(DT_STACK_GAP, validGap) ? `d-stack--gap-${validGap as string}` : null;
}

export function getDefaultAlignClass (align: PropValue): ClassName {
  const validAlign = _getDefaultValue(align);
  return _includes(DT_STACK_ALIGN, validAlign) ? `d-stack--align-${validAlign as string}` : null;
}

const JUSTIFY_NORMALIZE_MAP: Readonly<Record<string, string>> = {
  'space-around': 'around',
  'space-between': 'between',
  'space-evenly': 'evenly',
};

/**
 * Normalizes justify value to CSS class suffix.
 * Maps CSS-aligned values (space-around, space-between, space-evenly) to shorthand
 * (around, between, evenly) for CSS class generation.
 * @param value - The justify value
 * @returns The normalized value for CSS class
 */
function _normalizeJustifyForClass (value: unknown): string {
  const key = String(value);
  return (Object.hasOwn(JUSTIFY_NORMALIZE_MAP, key) && JUSTIFY_NORMALIZE_MAP[key]) || key;
}

export function getDefaultJustifyClass (justify: PropValue): ClassName {
  const validJustify = _getDefaultValue(justify);
  const normalizedJustify = _normalizeJustifyForClass(validJustify);
  return _includes(DT_STACK_JUSTIFY, validJustify) ? `d-stack--justify-${normalizedJustify}` : null;
}
