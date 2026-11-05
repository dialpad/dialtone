import type { ReactNode } from 'react';

export interface StandInProps {
  /** plan.json id of the unit this markup stands in for, e.g. "stack" or "button". */
  for: string;
  /** That unit's HTML, copied from the Vue story's rendered DOM. */
  children?: ReactNode;
}

/**
 * Marks story markup that stands in for a component not ported yet, and renders
 * its children unchanged. The loop finds each `<StandIn for="<unit id>">` (the
 * opening tag on one line) and swaps the real component in once it merges.
 */
export function StandIn ({ children }: StandInProps) {
  return <>{children}</>;
}
