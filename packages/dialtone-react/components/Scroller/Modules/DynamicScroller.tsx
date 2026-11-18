/*
Ported from dialtone-vue's DynamicScroller.vue, itself code from an external library
(https://github.com/Akryum/vue-virtual-scroller/blob/master/packages/vue-virtual-scroller/src/components/DynamicScroller.vue)
modified for Dialtone's use.
*/
import {
  type Ref,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { renderSlot } from '../../../common/slots';
import { CoreScroller, type CoreScrollerHandle, type CoreScrollerProps } from './CoreScroller';
import { ScrollerContext, type ScrollerContextValue, type ScrollerResizeTarget } from './ScrollerContext';
import { DtScrollerItem } from './ScrollerItem';

/** An item as DynamicScroller hands it to CoreScroller: the item, its id under keyField, and its measured size. */
export type ItemWithSize<T> = {
  item: T;
  size: number | undefined;
} & Record<string, unknown>;

/** What DynamicScroller exposes to DtScroller, as Vue's methods. */
export interface DynamicScrollerHandle {
  dynamicScrollerUpdateItems: () => void;
  dynamicScrollerUpdateItemsFromBottom: () => void;
  scrollToItem: (index: number) => void;
  scrollToBottom: () => void;
}

export interface DynamicScrollerProps<T> extends Omit<CoreScrollerProps<T>, 'items' | 'ref' | 'children'> {
  /** The items to render. */
  items: T[];
  children?: CoreScrollerProps<T>['children'];
  ref?: Ref<DynamicScrollerHandle>;
}

export function DynamicScroller<T> ({
  items,
  keyField = 'id',
  direction = 'vertical',
  listTag = 'div',
  itemTag = 'div',
  minItemSize,
  children,
  before,
  empty,
  after,
  ref,
  ...attrs
}: DynamicScrollerProps<T>) {
  const scroller = useRef<CoreScrollerHandle>(null);

  // Vue's `vscrollData.sizes`: reactive in Vue, read and written synchronously. The ref is the store; the state
  // re-renders what reads it.
  const sizesStore = useRef<Record<string, number>>({});
  const [sizes, setSizes] = useState(sizesStore.current);
  // Vue's non-reactive `$_undefinedMap` and `$_undefinedSizes`.
  const undefinedMap = useRef<Record<string, boolean | undefined>>({});
  const undefinedSizes = useRef(0);
  const scrollingToBottom = useRef(false);

  // Vue creates one ResizeObserver per scroller, in provide(), before its items mount. Its callback finds each
  // item's handler through resizeTargets, where Vue keeps it on the element.
  const [resizeTargets] = useState(() => new WeakMap<Element, ScrollerResizeTarget>());
  const [resizeObserver] = useState(() => (typeof ResizeObserver === 'undefined'
    ? null
    : new ResizeObserver((entries) => {
      requestAnimationFrame(() => {
        if (!Array.isArray(entries)) return;
        for (const entry of entries) {
          const target = resizeTargets.get(entry.target);
          if (!target) continue;
          let width: number;
          let height: number;
          if (entry.borderBoxSize) {
            const resizeObserverSize = entry.borderBoxSize[0];
            width = resizeObserverSize.inlineSize;
            height = resizeObserverSize.blockSize;
          } else {
            width = entry.contentRect.width;
            height = entry.contentRect.height;
          }
          target.onResize(target.id, width, height);
        }
      });
    })));

  const simpleArray = items.length > 0 && typeof items[0] !== 'object';
  const minSize = minItemSize === null || minItemSize === undefined || minItemSize === '' ? undefined : Number(minItemSize);

  const itemsWithSize = useMemo(() => items.map((item, i): ItemWithSize<T> => {
    const id = simpleArray ? i : (item as Record<string, unknown>)[keyField];
    let size: number | undefined = sizes[String(id)];
    if (typeof size === 'undefined' && !undefinedMap.current[String(id)]) size = 0;
    return { item, [keyField]: id, size };
  }), [items, keyField, simpleArray, sizes]);

  const context = useMemo<ScrollerContextValue>(() => ({
    vscrollData: { active: true, sizes, keyField, simpleArray },
    vscrollParent: {
      direction,
      undefinedMap: undefinedMap.current,
      undefinedSizes,
      getSize: id => sizesStore.current[String(id)],
      setSize: (id, size) => {
        sizesStore.current = { ...sizesStore.current, [String(id)]: size };
        setSizes(sizesStore.current);
      },
    },
    vscrollResizeObserver: resizeObserver,
    resizeTargets,
  }), [sizes, keyField, simpleArray, direction, resizeObserver, resizeTargets]);

  // Vue's itemsWithSize watcher, which doesn't run on mount: add the size difference of the items above the scroll
  // position to it, to avoid jumping the contents that the user is seeing.
  const watchedItems = useRef(itemsWithSize);
  useLayoutEffect(() => {
    const prev = watchedItems.current;
    if (prev === itemsWithSize) return;
    watchedItems.current = itemsWithSize;
    const el = scroller.current?.element;
    if (!el) return;
    const scrollTop = el.scrollTop;
    let prevActiveTop = 0;
    let activeTop = 0;
    const length = Math.min(itemsWithSize.length, prev.length);
    for (let i = 0; i < length; i++) {
      if (prevActiveTop >= scrollTop) break;
      prevActiveTop += prev[i].size || minSize || 0;
      activeTop += itemsWithSize[i].size || minSize || 0;
    }
    const offset = activeTop - prevActiveTop;
    if (offset === 0) return;
    el.scrollTop += offset;
  });

  useImperativeHandle(ref, () => ({
    dynamicScrollerUpdateItems: () => scroller.current?.updateVisibleItems(true),
    dynamicScrollerUpdateItemsFromBottom: () => scroller.current?.updateVisibleItems(false, true),
    scrollToItem: index => scroller.current?.scrollToItem(index),
    scrollToBottom () {
      if (scrollingToBottom.current) return;
      const el = scroller.current?.element;
      if (!el) return;
      scrollingToBottom.current = true;
      // Item is inserted to the DOM
      queueMicrotask(() => {
        el.scrollTop = el.scrollHeight + 5000;
        // Item sizes are computed
        const cb = () => {
          // The viewport unmounted while sizes were still unknown: stop, instead of queuing frames for ever.
          if (!el.isConnected) {
            scrollingToBottom.current = false;
            return;
          }
          el.scrollTop = el.scrollHeight + 5000;
          requestAnimationFrame(() => {
            el.scrollTop = el.scrollHeight + 5000;
            if (undefinedSizes.current === 0) {
              scrollingToBottom.current = false;
            } else {
              requestAnimationFrame(cb);
            }
          });
        };
        requestAnimationFrame(cb);
      });
    },
  }), []);

  return (
    <ScrollerContext.Provider value={context}>
      <CoreScroller
        ref={scroller}
        items={itemsWithSize}
        minItemSize={minItemSize}
        direction={direction}
        keyField={keyField}
        listTag={listTag}
        itemTag={itemTag}
        before={before}
        empty={empty}
        after={after}
        {...attrs}
      >
        {({ item: itemWithSize, index, active }) => (
          <DtScrollerItem
            item={itemWithSize}
            active={active}
            sizeDependencies={[itemWithSize.message]}
            data-index={index}
          >
            {renderSlot(children, { item: itemWithSize.item, index, active })}
          </DtScrollerItem>
        )}
      </CoreScroller>
    </ScrollerContext.Provider>
  );
}
