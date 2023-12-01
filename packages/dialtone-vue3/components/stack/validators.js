import { DT_STACK_DIRECTION, DT_STACK_GAP } from '@/components/stack/stack_constants';
import { directionPropType } from './utils';

export function directionValidator (direction) {
  if (directionPropType(direction) === 'string') {
    return Object.keys(DT_STACK_DIRECTION).includes(direction);
  } else if (directionPropType(direction) === 'object') {
    const { default: defaultStyle } = direction;

    return Object.keys(DT_STACK_DIRECTION).includes(defaultStyle);
  } else { return null; }
}

export function gapValidator (gap) {
  return DT_STACK_GAP.includes(gap);
}
