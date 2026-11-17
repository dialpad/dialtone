import { Children, Fragment, isValidElement, type ReactNode } from 'react';
import { hasContent } from '../../common/slots';

/**
 * Children.toArray, with Fragments replaced by their own children. Vue's slot fallback and hasSlotContent look
 * through a Fragment and reject it when nothing is inside, while React counts a Fragment as one element.
 */
function flattenFragments (node: ReactNode): ReactNode[] {
  return Children.toArray(node).flatMap(child => (
    isValidElement<{ children?: ReactNode }>(child) && child.type === Fragment
      ? flattenFragments(child.props.children)
      : [child]
  ));
}

/** `<slot>fallback</slot>`: the fallback unless the slot renders something. An empty string still counts. */
export function withSlotFallback (slot: ReactNode, fallback: ReactNode): ReactNode {
  return flattenFragments(slot).length > 0 ? slot : fallback;
}

/** hasContent, looking through Fragments. */
export function hasSlotContent (node: ReactNode): boolean {
  return hasContent(flattenFragments(node));
}
