import { DT_STACK_DIRECTION, DT_STACK_GAP, DT_STACK_RESPONSIVE_BREAKPOINTS, DT_STACK_ALIGN, DT_STACK_JUSTIFY } from '@/components/stack/stack_constants';

function _isDefaultDirection (direction) {
  return direction === DT_STACK_DIRECTION.default;
}

/**
 * Generic helper to extract default value from string or object props
 * @param {string|Object} value - The prop value
 * @returns {string|null} The default value or null
 */
function _getDefaultValue (value) {
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value !== null) return value.default;
  return null;
}

function _getValidDirection (direction) {
  if (typeof direction === 'string') {
    return !_isDefaultDirection(direction) ? DT_STACK_DIRECTION[direction] : null;
  } else if (typeof direction === 'object') {
    const { default: defaultStyle } = direction;

    return !_isDefaultDirection(defaultStyle) ? DT_STACK_DIRECTION[defaultStyle] : null;
  } else { return null; }
}

/**
 * Generic helper to generate responsive classes for any prop
 * @param {Object} propValue - The prop value object with breakpoint keys
 * @param {string} propName - The name of the prop (e.g., 'gap', 'align')
 * @param {Array|Object} validValues - Valid values (array or object for direction)
 * @param {string} classPrefix - CSS class prefix (default: 'd-stack')
 * @returns {Array} Array of CSS class names
 */
function _getResponsiveClasses (propValue, propName, validValues, classPrefix = 'd-stack') {
  if (typeof propValue !== 'object' || propValue === null) return [];

  return DT_STACK_RESPONSIVE_BREAKPOINTS.map((breakpoint) => {
    const value = propValue[breakpoint];
    if (!value) return null;

    // Handle both array (gap, align, justify) and object (direction) validValues
    const isValid = Array.isArray(validValues)
      ? validValues.includes(value)
      : value in validValues;

    // For direction, we don't need the prop name in the class
    const className = propName === ''
      ? `${classPrefix}--${breakpoint}-${value}`
      : `${classPrefix}--${breakpoint}-${propName}-${value}`;

    return isValid ? className : null;
  });
}

export function getDefaultDirectionClass (direction) {
  return _getValidDirection(direction)
    ? `d-stack--${DT_STACK_DIRECTION[_getValidDirection(direction)]}`
    : null;
}

function getResponsiveDirectionClasses (direction) {
  return _getResponsiveClasses(direction, '', DT_STACK_DIRECTION);
}

function getResponsiveGapClasses (gap) {
  return _getResponsiveClasses(gap, 'gap', DT_STACK_GAP);
}

function getResponsiveAlignClasses (align) {
  return _getResponsiveClasses(align, 'align', DT_STACK_ALIGN);
}

function getResponsiveJustifyClasses (justify) {
  return _getResponsiveClasses(justify, 'justify', DT_STACK_JUSTIFY);
}

export function getResponsiveClasses (direction, gap, align, justify) {
  return [
    ...getResponsiveDirectionClasses(direction),
    ...getResponsiveGapClasses(gap),
    ...getResponsiveAlignClasses(align),
    ...getResponsiveJustifyClasses(justify),
  ];
}

export function getDefaultGapClass (gap) {
  const validGap = _getDefaultValue(gap);
  return DT_STACK_GAP.includes(validGap) ? `d-stack--gap-${validGap}` : null;
}

export function getDefaultAlignClass (align) {
  const validAlign = _getDefaultValue(align);
  return DT_STACK_ALIGN.includes(validAlign) ? `d-stack--align-${validAlign}` : null;
}

export function getDefaultJustifyClass (justify) {
  const validJustify = _getDefaultValue(justify);
  return DT_STACK_JUSTIFY.includes(validJustify) ? `d-stack--justify-${validJustify}` : null;
}