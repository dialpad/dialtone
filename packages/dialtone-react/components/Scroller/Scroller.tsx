import {
  type ComponentPropsWithoutRef,
  type ReactNode,
  type Ref,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import type { SlotProp } from '../../common/slots';
import {
  CoreScroller,
  type CoreScrollerHandle,
  type ScrollerDirection,
  type ScrollerSlotScope,
  type ScrollerUserPosition,
} from './Modules/CoreScroller';
import { DynamicScroller, type DynamicScrollerHandle } from './Modules/DynamicScroller';

export type { ScrollerDirection, ScrollerSlotScope, ScrollerUserPosition };

/** Vue's exposed methods. */
export interface DtScrollerHandle {
  /** Scrolls to the end of the list (dynamic mode only). */
  scrollToBottom: () => void;
  scrollToItem: (index: number) => void;
  /** Recomputes the rendered items, e.g. after items were added before the visible ones. */
  updateItems: () => void;
  /** Recomputes the rendered items, e.g. after items were added at the end. */
  updateItemsFromBottom: () => void;
}

export interface DtScrollerProps<T> extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
  /**
   * Amount of pixels added to each edge of the scroll viewport, so items are rendered before they scroll into view.
   * Also controls how early `onScrollStart` and `onScrollEnd` fire relative to the viewport edges.
   */
  buffer?: number;
  /** The direction of the scroller. */
  direction?: ScrollerDirection;
  /**
   * Indicates if the items need to react to changes in their size. If disabled the itemSize prop is required and you
   * will get improved performance. If enabled the minItemSize prop is required and you will have reduced performance
   * but the ability to reactively size list items.
   */
  dynamic?: boolean;
  /**
   * Display height (or width in horizontal mode) of the items in pixels used to calculate the scroll size and
   * position. Required if dynamic is false.
   */
  itemSize?: number | null;
  /** The tag to use for the items. */
  itemTag?: string;
  /**
   * The items to render. If the items are simple values, the index will be used as the key. If the items are
   * objects, the keyField will be used as the key.
   */
  items: T[];
  /** The key field to use for the items. By default it will look for an id field on the items. */
  keyField?: string;
  /** The tag to use for the list. */
  listTag?: string;
  /**
   * Minimum size used if the height (or width in horizontal mode) of an item is unknown. Is required for the initial
   * render of items in dynamic size mode.
   */
  minItemSize?: number | string | null;
  /** The height of the scroller. Can be a number (in pixels) or a string (in CSS units). */
  scrollerHeight?: string | number;
  /** The width of the scroller. Can be a number (in pixels) or a string (in CSS units). */
  scrollerWidth?: string | number;
  /** Markup for each item: a function of the item, its index in `items`, and whether it's visible to the user. */
  children?: SlotProp<ScrollerSlotScope<T>>;
  /** Content rendered before the items, inside the scroll viewport. Scrolls with the list. */
  before?: ReactNode;
  /** Content rendered inside the list wrapper only while the list is empty. */
  empty?: ReactNode;
  /** Content rendered after the items, inside the scroll viewport. Scrolls with the list. */
  after?: ReactNode;
  /** Called when the scroller moves between its block-start (aka top), the middle and its block-end (aka bottom). */
  onUserPosition?: (position: ScrollerUserPosition) => void;
  /**
   * Called when the first item enters the rendered view pool. Fires at least one `buffer` length before the
   * viewport's start edge is reached (earlier still with `before` content), so callers can prepend items ahead of time.
   */
  onScrollStart?: () => void;
  /**
   * Called when the last item enters the rendered view pool. Fires at least one `buffer` length before the
   * viewport's end edge is reached (earlier still with `after` content), so callers can append items ahead of time.
   */
  onScrollEnd?: () => void;
  ref?: Ref<DtScrollerHandle>;
}

const cssSize = (value: string | number) => (typeof value === 'number' ? `${value}px` : value);

export function DtScroller<T> ({
  buffer = 200,
  direction = 'vertical',
  dynamic = false,
  itemSize = null,
  itemTag = 'div',
  items,
  keyField = 'id',
  listTag = 'div',
  minItemSize = null,
  scrollerHeight = '100%',
  scrollerWidth = '100%',
  children,
  before,
  empty,
  after,
  onUserPosition,
  onScrollStart,
  onScrollEnd,
  ref,
  style,
  ...attrs
}: DtScrollerProps<T>) {
  const coreScroller = useRef<CoreScrollerHandle>(null);
  const dynamicScroller = useRef<DynamicScrollerHandle>(null);

  // Vue's deep, immediate watcher on its props: validate on mount and whenever one of them changes (StrictMode's
  // second run of the effect sees the same props, so it doesn't log twice).
  const validated = useRef<unknown[] | null>(null);
  useEffect(() => {
    const values = [
      buffer, direction, dynamic, itemSize, itemTag, items, keyField, listTag, minItemSize,
      scrollerHeight, scrollerWidth,
    ];
    if (validated.current && values.every((value, i) => Object.is(value, validated.current![i]))) return;
    validated.current = values;

    if (dynamic && !minItemSize) {
      console.error('scroller error: \'minItemSize\' is required on \'dynamic\' mode.');
    }
    if (!dynamic && !itemSize) {
      console.error('scroller error: \'itemSize\' is required.');
    }
  });

  useImperativeHandle(ref, () => ({
    scrollToBottom () {
      // Only the dynamic scroller has it. Vue's call throws in the fixed size mode, where it isn't a function.
      dynamicScroller.current?.scrollToBottom();
    },
    scrollToItem (index) {
      (dynamic ? dynamicScroller.current : coreScroller.current)?.scrollToItem(index);
    },
    updateItems () {
      if (dynamic) dynamicScroller.current?.dynamicScrollerUpdateItems();
      else coreScroller.current?.updateVisibleItems(true);
    },
    updateItemsFromBottom () {
      if (dynamic) dynamicScroller.current?.dynamicScrollerUpdateItemsFromBottom();
      else coreScroller.current?.updateVisibleItems(false, true);
    },
  }), [dynamic]);

  const shared = {
    'data-qa': 'dt-scroller',
    items,
    itemSize,
    minItemSize,
    buffer,
    direction,
    keyField,
    listTag,
    itemTag,
    style: { width: cssSize(scrollerWidth), height: cssSize(scrollerHeight), ...style },
    tabIndex: 0,
    onUserPosition,
    onScrollStart,
    onScrollEnd,
    children,
    before,
    empty,
    after,
    ...attrs,
  };

  return dynamic
    ? <DynamicScroller ref={dynamicScroller} {...shared} />
    : <CoreScroller ref={coreScroller} {...shared} />;
}
