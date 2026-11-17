import { Children, Fragment, isValidElement, type ReactNode } from 'react';

/**
 * Vue's `<slot>fallback</slot>` falls back when the slot renders nothing. React counts an empty fragment as a child,
 * so look inside fragments (nested too). An empty string stays content, as in the conventions.
 */
export function slotRendersContent (node: ReactNode): boolean {
  return Children.toArray(node).some(child => {
    if (isValidElement<{ children?: ReactNode }>(child) && child.type === Fragment) {
      return slotRendersContent(child.props.children);
    }
    return true;
  });
}
