import {
  useEffect,
  useMemo,
  useState,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
} from 'react';
import { cx, type ClassValue } from '../../common/cx';
import { useModal } from '../../common/modal';
import { useTabGroupContext } from './TabGroupContext';

interface DtTabPanelOwnProps {
  /** Id of the panel */
  id: string;

  /** Id of the associated tab */
  tabId: string;

  /**
   * If true, hides the tab content
   * @values true, false
   */
  hidden?: boolean;

  /** Used to customize the tab element */
  tabPanelClass?: ClassValue;

  /** Default slot for Tab Panel */
  children?: ReactNode;

  /** The panel's root `<div>`. */
  ref?: Ref<HTMLDivElement>;
}

export type DtTabPanelProps = DtTabPanelOwnProps & Omit<HTMLAttributes<HTMLDivElement>, keyof DtTabPanelOwnProps>;

// React 19 calls a ref callback's returned cleanup on detach instead of calling it with null, so the merged callback
// returns one: each ref gets its own cleanup if it returned one, and null otherwise, as React would do itself.
function mergeRefs<T> (...refs: (Ref<T> | undefined)[]) {
  return (node: T | null) => {
    const cleanups = refs.map((ref) => {
      if (typeof ref === 'function') return ref(node);
      if (ref) ref.current = node;
      return undefined;
    });
    return () => {
      refs.forEach((ref, i) => {
        const cleanup = cleanups[i];
        if (typeof cleanup === 'function') cleanup();
        else if (typeof ref === 'function') ref(null);
        else if (ref) ref.current = null;
      });
    };
  };
}

/** Whether `element` is the first element at every level between it and the panel. */
function isFirstElementOfPanel (element: Element, panel: Element) {
  let current: Node | null = element;
  while (current) {
    if ((current as Element).previousElementSibling !== null) return false;
    current = current.parentNode !== panel ? current.parentNode : null;
  }
  return true;
}

/**
 * Tabs allow users to navigation between grouped content in different views while within the same page context.
 * @see https://dialtone.dialpad.com/components/tabs.html
 */
export function DtTabPanel ({
  id,
  tabId,
  hidden = false,
  tabPanelClass = '',
  children,
  className,
  style,
  ref,
  ...attrs
}: DtTabPanelProps) {
  const { groupContext } = useTabGroupContext();
  const [el, setEl] = useState<HTMLDivElement | null>(null);
  const { getFirstFocusableElement } = useModal(el);
  const [isFirstElementFocusable, setIsFirstElementFocusable] = useState(false);
  const rootRef = useMemo(() => mergeRefs<HTMLDivElement>(setEl, ref), [ref]);

  const hidePanel = groupContext.selected !== id || hidden;

  // Vue's async mounted(): if the panel's first focusable element isn't its first element, the panel itself takes a
  // tab stop (tabindex 0). See notes in https://www.w3.org/WAI/ARIA/apg/patterns/tabpanel/
  useEffect(() => {
    if (!el) return undefined;
    let active = true;
    getFirstFocusableElement(el).then((firstFocusableElement) => {
      if (!active) return;
      setIsFirstElementFocusable(firstFocusableElement ? isFirstElementOfPanel(firstFocusableElement, el) : false);
    });
    return () => { active = false; };
  }, [el, getFirstFocusableElement]);

  return (
    <div
      id={`dt-panel-${id}`}
      role="tabpanel"
      tabIndex={isFirstElementFocusable ? -1 : 0}
      aria-labelledby={`dt-tab-${tabId}`}
      aria-hidden={`${hidePanel}`}
      className={cx(tabPanelClass, className)}
      data-qa="dt-tab-panel"
      {...attrs}
      // Vue's v-show, which adds display: none to whatever style the panel has.
      style={hidePanel ? { ...style, display: 'none' } : style}
      ref={rootRef}
    >
      {children}
    </div>
  );
}
