import { createContext, useContext } from 'react';

/**
 * What the keyboard navigation mixin provides under `highlightId`: a function that returns the highlighted item's id.
 * `null` is Vue's inject default (ListItem's `highlightId: { default: null }`), outside a list that provides it.
 */
export type HighlightIdContextValue = (() => string | undefined) | null;

export const HighlightIdContext = createContext<HighlightIdContextValue>(null);

export function useHighlightIdContext (): HighlightIdContextValue {
  return useContext(HighlightIdContext);
}
