import { DT_STACK_DIRECTION, DT_STACK_GAP, DT_STACK_RESPONSIVE_BREAKPOINTS, DT_STACK_ALIGN, DT_STACK_JUSTIFY } from '@/components/stack/stack_constants';

function _isDefaultDirection (direction) {
  return direction === DT_STACK_DIRECTION.default;
}

function _getValidDirection (direction) {
  if (directionPropType(direction) === 'string') {
    return !_isDefaultDirection(direction) ? DT_STACK_DIRECTION[direction] : null;
  } else if (directionPropType(direction) === 'object') {
    const { default: defaultStyle } = direction;

    return !_isDefaultDirection(defaultStyle) ? DT_STACK_DIRECTION[defaultStyle] : null;
  } else { return null; }
}

function _getValidGap (gap) {
  if (typeof gap === 'string') {
    return gap;
  } else if (typeof gap === 'object') {
    return gap.default;
  } else { return null; }
}

function _getValidAlign (align) {
  if (typeof align === 'string') {
    return align;
  } else if (typeof align === 'object') {
    return align.default;
  } else { return null; }
}

function _getValidJustify (justify) {
  if (typeof justify === 'string') {
    return justify;
  } else if (typeof justify === 'object') {
    return justify.default;
  } else { return null; }
}

export function directionPropType (value) {
  return typeof value;
}

export function getDefaultDirectionClass (direction) {
  return _getValidDirection(direction)
    ? `d-stack--${DT_STACK_DIRECTION[_getValidDirection(direction)]}`
    : null;
}

function getResposiveDirectionClasses (direction) {
  if (directionPropType(direction) === 'object') {
    return [
      ...DT_STACK_RESPONSIVE_BREAKPOINTS.map((breakpoint) => {
        return direction[breakpoint]
          ? `d-stack--${breakpoint}-${direction[breakpoint]}`
          : null;
      })];
  } else { return []; }
}

function getResposiveGapClasses (gap) {
  if (typeof gap === 'object') {
    return [
      ...DT_STACK_RESPONSIVE_BREAKPOINTS.map((breakpoint) => {
        return DT_STACK_GAP.includes(gap[breakpoint])
          ? `d-stack--${breakpoint}-gap-${gap[breakpoint]}`
          : null;
      })];
  } else { return []; }
}

function getResponsiveAlignClasses (align) {
  if (typeof align === 'object') {
    return [
      ...DT_STACK_RESPONSIVE_BREAKPOINTS.map((breakpoint) => {
        return DT_STACK_ALIGN.includes(align[breakpoint])
          ? `d-stack--${breakpoint}-align-${align[breakpoint]}`
          : null;
      })];
  } else { return []; }
}

function getResponsiveJustifyClasses (justify) {
  if (typeof justify === 'object') {
    return [
      ...DT_STACK_RESPONSIVE_BREAKPOINTS.map((breakpoint) => {
        return DT_STACK_JUSTIFY.includes(justify[breakpoint])
          ? `d-stack--${breakpoint}-justify-${justify[breakpoint]}`
          : null;
      })];
  } else { return []; }
}

export function getResponsiveClasses (direction, gap, align, justify) {
  return [
    ...getResposiveDirectionClasses(direction),
    ...getResposiveGapClasses(gap),
    ...getResponsiveAlignClasses(align),
    ...getResponsiveJustifyClasses(justify),
  ];
}

export function getDefaultGapClass (gap) {
  const validGap = _getValidGap(gap);
  return DT_STACK_GAP.includes(validGap) ? `d-stack--gap-${validGap}` : null;
}

export function getDefaultAlignClass (align) {
  const validAlign = _getValidAlign(align);
  return DT_STACK_ALIGN.includes(validAlign) ? `d-stack--align-${validAlign}` : null;
}

export function getDefaultJustifyClass (justify) {
  const validJustify = _getValidJustify(justify);
  return DT_STACK_JUSTIFY.includes(validJustify) ? `d-stack--justify-${validJustify}` : null;
}
