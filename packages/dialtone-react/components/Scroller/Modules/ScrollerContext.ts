import { createContext, useContext } from 'react';
import type { ScrollerDirection } from './CoreScroller';

/** An item's id in the sizes store: its index in a simple array, its keyField otherwise. */
export type ScrollerItemId = string | number;

/** What a ScrollerItem asks of the ResizeObserver: Vue keeps these on the element as `$_vs_id` and `$_vs_onResize`. */
export interface ScrollerResizeTarget {
  id: ScrollerItemId | undefined;
  onResize: (id: ScrollerItemId | undefined, width: number, height: number) => void;
}

/**
 * Vue's `vscrollData`, `vscrollParent` and `vscrollResizeObserver` provides, in one context. Ids are object keys, as
 * in Vue, so `undefined` (a simple array's id, see ScrollerItem) is the key 'undefined'. `sizes` is the render's
 * snapshot; `getSize` reads the store as it is now, as Vue's synchronous reads of its reactive sizes do.
 */
export interface ScrollerContextValue {
  vscrollData: {
    active: boolean;
    sizes: Record<string, number>;
    keyField: string;
    simpleArray: boolean;
  };
  vscrollParent: {
    direction: ScrollerDirection;
    /** Vue's `$_undefinedMap` and `$_undefinedSizes`: items shown before their size was known. */
    undefinedMap: Record<string, boolean | undefined>;
    undefinedSizes: { current: number };
    getSize: (id: ScrollerItemId | undefined) => number | undefined;
    setSize: (id: ScrollerItemId | undefined, size: number) => void;
  };
  vscrollResizeObserver: ResizeObserver | null;
  resizeTargets: WeakMap<Element, ScrollerResizeTarget>;
}

export const ScrollerContext = createContext<ScrollerContextValue | null>(null);

export function useScrollerContext (): ScrollerContextValue {
  const context = useContext(ScrollerContext);
  if (!context) throw new Error('DtScrollerItem must be rendered inside a DynamicScroller.');
  return context;
}
