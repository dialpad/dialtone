/*
Ported from dialtone-vue's CoreScroller.vue, itself code from an external library
(https://github.com/Akryum/vue-virtual-scroller/blob/master/packages/vue-virtual-scroller/src/components/RecycleScroller.vue)
modified for Dialtone's use.
*/
import {
  type ComponentPropsWithoutRef,
  type ElementType,
  type ReactNode,
  type Ref,
  type UIEvent,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import { cx, type ClassValue } from '../../../common/cx';
import { renderSlot, type SlotProp } from '../../../common/slots';

export type ScrollerDirection = 'vertical' | 'horizontal';

/** Where the user is in the list: its block-start (aka top), in the middle, or at its block-end (aka bottom). */
export type ScrollerUserPosition = 'blockStart' | 'middle' | 'blockEnd';

/** The default slot's scope: the item, its index in `items`, and whether the view is in use. */
export interface ScrollerSlotScope<T> {
  item: T;
  index: number;
  active: boolean;
}

/** What CoreScroller exposes to DtScroller and DynamicScroller, as Vue's defineExpose does. */
export interface CoreScrollerHandle {
  /** The scroll viewport, Vue's `$el`. */
  readonly element: HTMLDivElement | null;
  scrollToItem: (index: number) => void;
  updateVisibleItems: (checkItem: boolean, checkPositionDiff?: boolean) => void;
}

export interface CoreScrollerProps<T> extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
  /** List of items you want to display in the scroller. */
  items: T[];
  /** Field used to identify items and optimize managing rendered views. */
  keyField?: string;
  /** Direction of the scroller. */
  direction?: ScrollerDirection;
  /** Size of the items in the list. If it is null (the default), it uses variable size mode. */
  itemSize?: number | null;
  /** Minimum size used if the height (or width in horizontal mode) of an item is unknown. */
  minItemSize?: number | string | null;
  /** Field used to get the item's size in variable size mode. */
  sizeField?: string;
  /** Amount of pixels added to the edges of the visible area to start rendering items further away. */
  buffer?: number;
  /** Enables the hover state class and mouse events on items. */
  enableHover?: boolean;
  /** The element to render as the list's wrapper. */
  listTag?: string;
  /** The element to render as the list item. */
  itemTag?: string;
  /** The custom classes added to the item list wrapper. */
  listClass?: ClassValue;
  /** The custom classes added to each item. */
  itemClass?: ClassValue;
  onUserPosition?: (position: ScrollerUserPosition) => void;
  onScrollStart?: () => void;
  onScrollEnd?: () => void;
  children?: SlotProp<ScrollerSlotScope<T>>;
  before?: ReactNode;
  empty?: ReactNode;
  after?: ReactNode;
  ref?: Ref<CoreScrollerHandle>;
}

interface ViewNr {
  id: number;
  index: number;
  used: boolean;
  key: unknown;
  type: unknown;
}

interface View<T> {
  item: T;
  position: number;
  offset: number;
  nr: ViewNr;
}

interface SizeEntry {
  accumulator: number;
  size?: number;
}

type Sizes = Record<number, SizeEntry>;

const field = (item: unknown, name: string): unknown =>
  (item !== null && typeof item === 'object' ? (item as Record<string, unknown>)[name] : undefined);

/** Vue's minItemSize takes a number or a string; the size arithmetic needs a number. */
const toSize = (value: number | string | null | undefined): number | null =>
  (value === null || value === undefined || value === '' ? null : Number(value));

export function CoreScroller<T> ({
  items,
  keyField = 'id',
  direction = 'vertical',
  itemSize = null,
  minItemSize = null,
  sizeField = 'size',
  buffer = 200,
  enableHover = true,
  listTag = 'div',
  itemTag = 'div',
  listClass = '',
  itemClass = '',
  onUserPosition,
  onScrollStart,
  onScrollEnd,
  children,
  before,
  empty,
  after,
  ref,
  className,
  onScroll,
  ...attrs
}: CoreScrollerProps<T>) {
  const [, rerender] = useReducer((n: number) => n + 1, 0);
  const [hoverKey, setHoverKey] = useState<unknown>(null);
  const [ready, setReady] = useState(false);

  const scroller = useRef<HTMLDivElement>(null);
  const beforeRef = useRef<HTMLDivElement>(null);
  const afterRef = useRef<HTMLDivElement>(null);

  // Vue's non-reactive instance state: the pool of views and its bookkeeping. Each update mutates it, then re-renders.
  const pool = useRef<View<T>[]>([]);
  const views = useRef(new Map<unknown, View<T>>());
  const unusedViews = useRef(new Map<unknown, View<T>[]>());
  const userPosition = useRef<ScrollerUserPosition>('blockStart');
  const startIndex = useRef(0);
  const endIndex = useRef(0);
  const scrollDirty = useRef(false);
  const sortTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const totalSize = useRef(0);
  const uid = useRef(0);

  const minSize = toSize(minItemSize);

  // Vue's `sizes` computed. In fixed size mode it reads only itemSize, so only an itemSize change makes a new one, and
  // only then does the watcher below update the views; in variable size mode, the items and their sizes do too.
  const variable = itemSize === null;
  const sizedItems = variable ? items : null;
  const sizedField = variable ? sizeField : null;
  const sizedMin = variable ? minSize : null;
  const sizes = useMemo<Sizes>(() => {
    if (!sizedItems || sizedField === null) return {};
    const result: Sizes = { [-1]: { accumulator: 0 } };
    let accumulator = 0;
    for (let i = 0, l = sizedItems.length; i < l; i++) {
      const current = Number(field(sizedItems[i], sizedField) || sizedMin) || 0;
      accumulator += current;
      result[i] = { accumulator, size: current };
    }
    return result;
    // itemSize too: a new itemSize makes new (empty) sizes in fixed size mode, as in Vue, so the watcher runs.
  }, [itemSize, sizedItems, sizedField, sizedMin]);

  const simpleArray = items.length > 0 && typeof items[0] !== 'object';

  // Item index by the key the views are assigned by: the item itself in a simple array, its keyField otherwise.
  const itemIndexByKey = useMemo(() => {
    const result = new Map<unknown, number>();
    items.forEach((item, i) => result.set(simpleArray ? item : field(item, keyField), i));
    return result;
  }, [items, keyField, simpleArray]);

  // The latest props and derived values, for the updates that run from effects, timers and the imperative handle.
  // Declared before the effects below, so they read this render's values.
  const latest = useRef({
    items, keyField, direction, itemSize, buffer, sizes, simpleArray, itemIndexByKey, onUserPosition, onScrollStart,
    onScrollEnd,
  });
  useLayoutEffect(() => {
    latest.current = {
      items, keyField, direction, itemSize, buffer, sizes, simpleArray, itemIndexByKey, onUserPosition, onScrollStart,
      onScrollEnd,
    };
  });

  function addView (index: number, item: T, key: unknown, type: unknown) {
    const view: View<T> = { item, position: 0, offset: 0, nr: { id: uid.current++, index, used: true, key, type } };
    pool.current.push(view);
    return view;
  }

  function unuseView (view: View<T>, fake = false) {
    let unusedPool = unusedViews.current.get(view.nr.type);
    if (!unusedPool) {
      unusedPool = [];
      unusedViews.current.set(view.nr.type, unusedPool);
    }
    unusedPool.push(view);
    if (!fake) {
      view.nr.used = false;
      view.position = -9999;
    }
  }

  function getScroll (el: HTMLDivElement) {
    return latest.current.direction === 'vertical'
      ? { start: el.scrollTop, end: el.scrollTop + el.clientHeight }
      : { start: el.scrollLeft, end: el.scrollLeft + el.clientWidth };
  }

  function itemsLimitError () {
    const el = scroller.current;
    setTimeout(() => {
      console.error('It seems the scroller element isn\'t scrolling, so it tries to render all the items at once.', 'Scroller:', el);
      console.error('Make sure the scroller has a fixed height (or width) and \'overflow-y\' (or \'overflow-x\') set to \'auto\' so it can scroll correctly and only render the items visible in the scroll viewport.');
    });
    throw new Error('Rendered items limit reached');
  }

  function sortViews () {
    pool.current.sort((viewA, viewB) => viewA.nr.index - viewB.nr.index);
    rerender();
  }

  // Vue's checkPositionDiff compares against `.value` of two plain numbers, so its early return never happens: every
  // update runs. The parameter is kept so callers read as in Vue.
  function updateVisibleItems (checkItem: boolean, _checkPositionDiff = false) {
    // Deferred callers (the sizes watcher, the scroll frame) can fire after the root element unmounts.
    const el = scroller.current;
    if (!el) return;

    const { items, keyField: key, direction, itemSize, buffer, sizes, simpleArray, itemIndexByKey } = latest.current;
    const keyField = simpleArray ? null : key;
    const count = items.length;
    let newStartIndex: number;
    let newEndIndex: number;
    let newTotalSize: number;

    if (!count) {
      newStartIndex = newEndIndex = newTotalSize = 0;
    } else {
      const scroll = getScroll(el);

      scroll.start -= buffer;
      scroll.end += buffer;

      // The leading and trailing slots sit in normal flow inside the viewport, so the item wrapper does not start
      // at offset 0. Widen the window by their measured size.
      const slotSize = direction === 'vertical' ? 'scrollHeight' : 'scrollWidth';
      if (beforeRef.current) scroll.start -= beforeRef.current[slotSize];
      if (afterRef.current) scroll.end += afterRef.current[slotSize];

      if (itemSize === null) {
        // Variable size mode
        let a = 0;
        let b = count - 1;
        let i = ~~(count / 2);
        let oldI: number;

        // Searching for the start index
        do {
          oldI = i;
          const h = sizes[i]?.accumulator;
          if (h !== undefined && h < scroll.start) {
            a = i;
          } else if (i < count - 1 && (sizes[i + 1]?.accumulator ?? NaN) > scroll.start) {
            b = i;
          }
          i = ~~((a + b) / 2);
        } while (i !== oldI);
        if (i < 0) i = 0;
        newStartIndex = i;

        // For container style
        newTotalSize = sizes[count - 1]?.accumulator ?? 0;

        // Searching for the end index
        newEndIndex = i;
        while (newEndIndex < count && (sizes[newEndIndex]?.accumulator ?? NaN) < scroll.end) newEndIndex++;

        if (newEndIndex === -1) {
          newEndIndex = items.length - 1;
        } else {
          newEndIndex++;
          // Bounds
          if (newEndIndex > count) newEndIndex = count;
        }
      } else {
        // Fixed size mode
        newStartIndex = ~~(scroll.start / itemSize);
        newEndIndex = Math.ceil(scroll.end / itemSize);

        // Bounds
        if (newStartIndex < 0) newStartIndex = 0;
        if (newEndIndex > count) newEndIndex = count;

        newTotalSize = count * itemSize;
      }
    }

    // items limit 1000
    if (newEndIndex - newStartIndex > 1000) itemsLimitError();

    totalSize.current = newTotalSize;

    const continuous = newStartIndex <= endIndex.current && newEndIndex >= newStartIndex;

    // Unuse views that are no longer visible
    if (continuous) {
      for (const view of pool.current) {
        if (!view.nr.used) continue;
        if (checkItem) {
          // Update the view's item index. Vue looks it up on the computed ref rather than its value, so every view
          // loses its index and is released, then re-used and counted as newly used, which fired scroll-start and
          // scroll-end again on every later update. Looked up on the value here.
          const index = itemIndexByKey.get(view.nr.key);
          if (index === undefined) {
            unuseView(view);
            continue;
          }
          view.nr.index = index;
        }
        // Check if index is still in visible range
        if (view.nr.index < newStartIndex || view.nr.index >= newEndIndex) unuseView(view);
      }
    }

    const unusedIndex = continuous ? null : new Map<unknown, number>();

    for (let i = newStartIndex; i < newEndIndex; i++) {
      const item = items[i];
      const itemKey = keyField ? field(item, keyField) : item;

      if (itemKey == null) {
        throw new Error(`Key is ${itemKey} on item (keyField is '${keyField}')`);
      }
      let view = views.current.get(itemKey);

      if (!itemSize && !sizes[i]?.size) {
        if (view) unuseView(view);
        continue;
      }

      const type = field(item, 'type');
      let unusedPool = unusedViews.current.get(type);
      let newlyUsedView = false;

      if (!view) {
        // No view assigned to item
        if (unusedIndex === null) {
          // Reuse existing view
          view = unusedPool?.length ? unusedPool.pop()! : addView(i, item, itemKey, type);
        } else {
          // Use existing view. We don't care if they are already used because we are not in continuous scrolling.
          const v = unusedIndex.get(type) || 0;
          if (!unusedPool || v >= unusedPool.length) {
            unuseView(addView(i, item, itemKey, type), true);
            unusedPool = unusedViews.current.get(type)!;
          }
          view = unusedPool[v];
          unusedIndex.set(type, v + 1);
        }

        // Assign view to item
        views.current.delete(view.nr.key);
        view.nr.used = true;
        view.nr.index = i;
        view.nr.key = itemKey;
        view.nr.type = type;
        views.current.set(itemKey, view);

        newlyUsedView = true;
      } else if (!view.nr.used) {
        // View already assigned to item
        view.nr.used = true;
        newlyUsedView = true;
        if (unusedPool) {
          const index = unusedPool.indexOf(view);
          if (index !== -1) unusedPool.splice(index, 1);
        }
      }

      // Always set item in case it's a new object with the same key
      view.item = item;

      if (newlyUsedView) {
        if (i === items.length - 1) latest.current.onScrollEnd?.();
        if (i === 0) latest.current.onScrollStart?.();
      }

      // Update position
      if (itemSize === null) {
        view.position = sizes[i - 1]?.accumulator ?? 0;
        view.offset = 0;
      } else {
        view.position = Math.floor(i) * itemSize;
        view.offset = (i % 1) * itemSize;
      }
    }

    startIndex.current = newStartIndex;
    endIndex.current = newEndIndex;

    // After the user has finished scrolling, sort views so text selection is correct
    clearTimeout(sortTimer.current);
    sortTimer.current = setTimeout(sortViews, 300);

    rerender();
  }

  function scrollToItem (index: number) {
    const { itemSize, sizes, direction } = latest.current;
    const position = itemSize === null
      ? (index > 0 ? sizes[index - 1]?.accumulator ?? 0 : 0)
      : Math.floor(index) * itemSize;
    const el = scroller.current;
    if (!el) return;
    if (direction === 'vertical') el.scrollTop = position;
    else el.scrollLeft = position;
  }

  function handleScroll (event: UIEvent<HTMLDivElement>) {
    const container = event.currentTarget;
    const emit = latest.current.onUserPosition;

    if (userPosition.current !== 'middle') {
      userPosition.current = 'middle';
      emit?.('middle');
    }

    // Check if the scroll is at the block-start (aka top) of the container
    if (container.scrollTop === 0) {
      userPosition.current = 'blockStart';
      emit?.('blockStart');
    }

    // Check if the scroll is at the block-end (aka bottom) of the container
    if (container.scrollTop + container.clientHeight === container.scrollHeight) {
      userPosition.current = 'blockEnd';
      emit?.('blockEnd');
    }

    if (!scrollDirty.current) {
      scrollDirty.current = true;
      requestAnimationFrame(() => {
        scrollDirty.current = false;
        updateVisibleItems(false, true);
      });
    }
    onScroll?.(event);
  }

  useImperativeHandle(ref, () => ({
    get element () {
      return scroller.current;
    },
    scrollToItem,
    updateVisibleItems,
  }));

  // Vue's watcher on `sizes`, which doesn't run on mount.
  const watchedSizes = useRef(sizes);
  useLayoutEffect(() => {
    if (watchedSizes.current === sizes) return;
    watchedSizes.current = sizes;
    updateVisibleItems(false);
  });

  // Vue's onMounted(() => nextTick(…)): render the real number of visible items once the viewport is in the DOM.
  useLayoutEffect(() => {
    updateVisibleItems(true);
    setReady(true);
    return () => clearTimeout(sortTimer.current);
    // Runs once on mount, as Vue's onMounted; updateVisibleItems reads everything it needs from refs.
  }, []);

  const ListTag = listTag as ElementType;
  const ItemTag = itemTag as ElementType;
  const vertical = direction === 'vertical';
  const [main, cross] = vertical ? ['Y', 'X'] : ['X', 'Y'];

  return (
    <div
      {...attrs}
      ref={scroller}
      className={cx('vue-recycle-scroller', { ready, [`direction-${direction}`]: true }, className)}
      onScroll={handleScroll}
    >
      {before !== undefined && (
        <div
          ref={beforeRef}
          data-qa="dt-scroller-before"
          className="vue-recycle-scroller__slot"
        >
          {before}
        </div>
      )}

      <ListTag
        style={{ [vertical ? 'minHeight' : 'minWidth']: `${totalSize.current}px` }}
        data-qa="dt-scroller-item-wrapper"
        className={cx('vue-recycle-scroller__item-wrapper', listClass)}
      >
        {pool.current.map(view => (
          <ItemTag
            key={view.nr.id}
            data-qa="dt-scroller-item"
            style={ready
              ? { transform: `translate${main}(${view.position}px) translate${cross}(${view.offset}px)` }
              : undefined}
            className={cx('vue-recycle-scroller__item-view', itemClass, { hover: enableHover && hoverKey === view.nr.key })}
            onMouseEnter={enableHover ? () => setHoverKey(view.nr.key) : undefined}
            onMouseLeave={enableHover ? () => setHoverKey(null) : undefined}
          >
            {renderSlot(children, { item: view.item, index: view.nr.index, active: view.nr.used })}
          </ItemTag>
        ))}

        {!items.length && empty}
      </ListTag>

      {after !== undefined && (
        <div
          ref={afterRef}
          data-qa="dt-scroller-after"
          className="vue-recycle-scroller__slot"
        >
          {after}
        </div>
      )}
    </div>
  );
}
