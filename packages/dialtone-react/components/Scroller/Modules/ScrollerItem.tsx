/*
Ported from dialtone-vue's ScrollerItem.vue, itself code from an external library
(https://github.com/Akryum/vue-virtual-scroller/blob/master/packages/vue-virtual-scroller/src/components/DynamicScrollerItem.vue)
modified for Dialtone's use.
*/
import {
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import deepEqual from 'deep-equal';
import { type ScrollerContextValue, type ScrollerItemId, useScrollerContext } from './ScrollerContext';

export interface DtScrollerItemProps<T> extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  item: T;
  watchData?: boolean;
  /** Indicates if the view is actively used to display an item. */
  active: boolean;
  index?: number;
  sizeDependencies?: unknown[] | Record<string, unknown> | null;
  tag?: string;
  children?: ReactNode;
}

function itemId ({ simpleArray, keyField }: ScrollerContextValue['vscrollData'], item: unknown, index?: number) {
  if (simpleArray) return index;
  if (item !== null && typeof item === 'object' && keyField in item) {
    return (item as Record<string, ScrollerItemId>)[keyField];
  }
  throw new Error(`keyField '${keyField}' not found in your item. You should set a valid keyField prop on your Scroller`);
}

export function DtScrollerItem<T> ({
  item,
  watchData = false,
  active,
  index,
  sizeDependencies = null,
  tag = 'div',
  children,
  ...attrs
}: DtScrollerItemProps<T>) {
  const { vscrollData, vscrollParent, vscrollResizeObserver, resizeTargets } = useScrollerContext();
  const [el, setEl] = useState<HTMLElement | null>(null);

  const id = itemId(vscrollData, item, index);
  const finalActive = active && vscrollData.active;

  // Vue's non-reactive instance state.
  const pendingSizeUpdate = useRef<ScrollerItemId | undefined | null>(null);
  const forceNextVScrollUpdate = useRef<ScrollerItemId | undefined | null>(null);
  const pendingVScrollUpdate = useRef<ScrollerItemId | undefined | null>(null);
  const sizeObserved = useRef(false);

  // Declared before the effects below, so they and the ResizeObserver's callback read this render's values.
  const direction = vscrollParent.direction;
  const latest = useRef({ id, finalActive, direction });
  useLayoutEffect(() => {
    latest.current = { id, finalActive, direction };
  });

  const size = (itemKey: ScrollerItemId | undefined) => vscrollParent.getSize(itemKey) || 0;

  function applySize (newSize: number) {
    const key = String(latest.current.id);
    if (vscrollParent.undefinedMap[key]) {
      vscrollParent.undefinedSizes.current--;
      vscrollParent.undefinedMap[key] = undefined;
    }
    vscrollParent.setSize(latest.current.id, newSize);
  }

  function applyWidthHeight (width: number, height: number) {
    // Vue reads the parent's direction live; the ResizeObserver's registered callback must too, not the render's.
    const newSize = ~~(latest.current.direction === 'vertical' ? height : width);
    if (newSize && size(latest.current.id) !== newSize) applySize(newSize);
  }

  // Vue measures on the next tick, once the DOM shows the item; effects run once it does.
  function computeSize (element: HTMLElement, sizeId: ScrollerItemId | undefined) {
    if (latest.current.id === sizeId) applyWidthHeight(element.offsetWidth, element.offsetHeight);
    pendingSizeUpdate.current = null;
  }

  function updateSize (element: HTMLElement) {
    const { id: currentId, finalActive: isActive } = latest.current;
    if (isActive) {
      if (pendingSizeUpdate.current !== currentId) {
        pendingSizeUpdate.current = currentId;
        forceNextVScrollUpdate.current = null;
        pendingVScrollUpdate.current = null;
        computeSize(element, currentId);
      }
    } else {
      forceNextVScrollUpdate.current = currentId;
    }
  }

  function onResize (resizedId: ScrollerItemId | undefined, width: number, height: number) {
    if (latest.current.id === resizedId) applyWidthHeight(width, height);
  }

  function observeSize (element: HTMLElement) {
    if (!vscrollResizeObserver || sizeObserved.current) return;
    vscrollResizeObserver.observe(element);
    resizeTargets.set(element, { id: latest.current.id, onResize });
    sizeObserved.current = true;
  }

  function unobserveSize (element: HTMLElement) {
    if (!vscrollResizeObserver || !sizeObserved.current) return;
    vscrollResizeObserver.unobserve(element);
    resizeTargets.delete(element);
    sizeObserved.current = false;
  }

  // Vue's mounted and beforeUnmount.
  useLayoutEffect(() => {
    if (!el) return;
    if (latest.current.finalActive) {
      updateSize(el);
      observeSize(el);
    }
    return () => unobserveSize(el);
    // Follows the element only: the other values are read from refs and the context, which keep the latest.
  }, [el]);

  // Vue's `id` watcher, which doesn't run on mount.
  const watchedId = useRef(id);
  useLayoutEffect(() => {
    const oldId = watchedId.current;
    if (Object.is(oldId, id)) return;
    watchedId.current = id;
    if (!el) return;
    const target = resizeTargets.get(el);
    if (target) target.id = id;
    if (!size(id)) updateSize(el);

    if (sizeObserved.current) {
      // In case the old item had the same size, it won't trigger the ResizeObserver since we are reusing the same
      // DOM node.
      const oldSize = vscrollParent.getSize(oldId);
      if (oldSize != null && oldSize !== vscrollParent.getSize(id)) applySize(oldSize);
    }
  });

  // Vue's `finalActive` watcher, which doesn't run on mount.
  const watchedActive = useRef(finalActive);
  useLayoutEffect(() => {
    if (watchedActive.current === finalActive) return;
    watchedActive.current = finalActive;
    const key = String(id);
    if (!size(id)) {
      if (finalActive) {
        if (!vscrollParent.undefinedMap[key]) {
          vscrollParent.undefinedSizes.current++;
          vscrollParent.undefinedMap[key] = true;
        }
      } else if (vscrollParent.undefinedMap[key]) {
        vscrollParent.undefinedSizes.current--;
        vscrollParent.undefinedMap[key] = false;
      }
    }
    if (!el) return;
    if (vscrollResizeObserver) {
      if (finalActive) observeSize(el);
      else unobserveSize(el);
    } else if (finalActive && pendingVScrollUpdate.current === id) {
      updateSize(el);
    }
  });

  // Without a ResizeObserver, Vue watches each of the sizeDependencies, and with `watchData` the whole item (deeply):
  // a change to any of them measures the item again.
  const watchedData = useRef({ sizeDependencies, item });
  useLayoutEffect(() => {
    const previous = watchedData.current;
    watchedData.current = { sizeDependencies, item };
    if (vscrollResizeObserver || !el) return;
    const deps = (previous.sizeDependencies ?? {}) as Record<string, unknown>;
    const next = (sizeDependencies ?? {}) as Record<string, unknown>;
    const depChanged = Object.keys(deps).some(k => !Object.is(deps[k], next[k]));
    const dataChanged = watchData && !deepEqual(previous.item, item, { strict: true });
    if (depChanged || dataChanged) updateSize(el);
  });

  const Tag = tag as ElementType;
  return <Tag {...attrs} ref={setEl}>{children}</Tag>;
}
