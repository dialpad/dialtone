import { Children, type ReactNode } from 'react';

/** A Vue scoped slot in React: content, or a function of the slot's scope. */
export type SlotProp<Scope> = ReactNode | ((scope: Scope) => ReactNode);

export function renderSlot<Scope> (slot: SlotProp<Scope>, scope: Scope): ReactNode {
  return typeof slot === 'function' ? slot(scope) : slot;
}

/** hasSlotContent($slots.x) in React: null, undefined, booleans and '' count as empty; elements, portals, numbers and bigints count as content. */
export function hasContent (node: ReactNode): boolean {
  return Children.toArray(node).some(child => typeof child === 'string'
    ? child.trim() !== ''
    : (typeof child === 'number' || typeof child === 'bigint' || typeof child === 'object'));
}
