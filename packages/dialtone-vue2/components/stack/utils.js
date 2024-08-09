import { DT_STACK_DIRECTION, DT_STACK_GAP, DT_STACK_RESPONSIVE_BREAKPOINTS } from '@/components/stack/stack_constants';

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
  } else if (directionPropType(gap) === 'object') {
    return gap.default;
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
        return DT_STACK_DIRECTION.includes(direction[breakpoint])
          ? `d-stack--${breakpoint}-${direction[breakpoint]}`
          : null;
      })];
  } else { return []; }
}

function getResposiveGapClasses (gap) {
  if (directionPropType(gap) === 'object') {
    return [
      ...DT_STACK_RESPONSIVE_BREAKPOINTS.map((breakpoint) => {
        return DT_STACK_GAP.includes(gap[breakpoint])
          ? `d-stack--${breakpoint}-gap-${gap[breakpoint]}`
          : null;
      })];
  } else { return []; }
}

export function getResponsiveClasses (direction, gap) {
  return [
    ...getResposiveDirectionClasses(direction),
    ...getResposiveGapClasses(gap),
  ];
}

export function getDefaultGapClass (gap) {
  const validGap = _getValidGap(gap);
  return DT_STACK_GAP.includes(validGap) ? `d-stack--gap-${validGap}` : null;
}
