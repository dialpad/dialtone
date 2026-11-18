import { createContext, useContext } from 'react';
import type { TextListType } from './TextListConstants';

/** What DtTextList shares with the items inside it: Vue's `DT_TEXT_LIST_CONTEXT` provide value. */
export interface TextListContextValue {
  type: TextListType;
}

/** Provided by DtTextList. The default is Vue's inject default, `null`: an item outside a list. */
export const TextListContext = createContext<TextListContextValue | null>(null);

export function useTextListContext (): TextListContextValue | null {
  return useContext(TextListContext);
}
