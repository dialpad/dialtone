// DtTransition as Vue Test Utils stubs <transition> by default (parity.md › DOM parity): the child as v-show or v-if
// leaves it, with no transition classes and no hooks, settled at once. Only the DOM parity run uses it.
import { cloneElement, type CSSProperties, type ReactElement } from 'react';
import type { DtTransitionProps } from '../../common/transition/DtTransition';

export function DtTransition ({ show, unmountOnLeave = false, children }: DtTransitionProps) {
  if (show) return children;
  if (unmountOnLeave) return null;
  const child = children as ReactElement<{ style?: CSSProperties }>;
  return cloneElement(child, { style: { ...child.props.style, display: 'none' } });
}
