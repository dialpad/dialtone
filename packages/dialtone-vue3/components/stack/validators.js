import { DT_STACK_DIRECTION, DT_STACK_GAP, DT_STACK_ALIGN, DT_STACK_JUSTIFY } from '@/components/stack/stack_constants';

export function directionValidator (direction) {
  if (typeof direction === 'string') {
    return Object.keys(DT_STACK_DIRECTION).includes(direction);
  } else if (typeof direction === 'object') {
    const { default: defaultStyle } = direction;

    return Object.keys(DT_STACK_DIRECTION).includes(defaultStyle);
  }
  return false;
}

export function gapValidator (gap) {
  if (typeof gap === 'string') {
    return DT_STACK_GAP.includes(gap);
  }
  if (typeof gap === 'object') {
    const { default: defaultStyle } = gap;

    return DT_STACK_GAP.includes(defaultStyle);
  }
  return false;
}

export function alignValidator (align) {
  if (typeof align === 'string') {
    return DT_STACK_ALIGN.includes(align);
  }
  if (typeof align === 'object') {
    const { default: defaultStyle } = align;

    return DT_STACK_ALIGN.includes(defaultStyle);
  }
  return false;
}

export function justifyValidator (justify) {
  if (typeof justify === 'string') {
    return DT_STACK_JUSTIFY.includes(justify);
  }
  if (typeof justify === 'object') {
    const { default: defaultStyle } = justify;

    return DT_STACK_JUSTIFY.includes(defaultStyle);
  }
  return false;
}