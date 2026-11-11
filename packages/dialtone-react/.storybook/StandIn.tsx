import type { ReactNode } from 'react';

export interface StandInProps {
  /** The unit id (as the gate takes it) this markup stands in for, e.g. "stack" or "button". */
  for: string;
  /** That unit's HTML, copied from the Vue story's rendered DOM. */
  children?: ReactNode;
}

/**
 * Marks story markup that stands in for a component not ported yet, and renders
 * its children unchanged. Write the opening tag on one line, starting
 * `<StandIn for="<unit id>">`: that's how stand-ins are found, both to swap the
 * real component in once it's ported and for story parity, which fails a stand-in
 * for a component that's already in the tree.
 */
export function StandIn ({ children }: StandInProps) {
  return <>{children}</>;
}
