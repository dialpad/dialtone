import { useCallback, useMemo } from 'react';

const focusableAttrs = ':not(:disabled):not([aria-disabled="true"]):not([role="presentation"])';
const tabbableAttrs = `${focusableAttrs}:not([tabindex="-1"])`;
const focusableElementsList = 'button,[href],input,select,textarea,details,[tabindex]';

/** What Vue's `this.$el` can be: an element, or (for a fragment root) a node whose next sibling is one. */
type RootNode = Node | null | undefined;

/** The slice of a keyboard event `focusTrappedTabPress` reads, so a native or a React event both fit. */
export interface TabPressEvent {
  key: string;
  shiftKey: boolean;
  preventDefault: () => void;
}

/** The element itself, or the first element among its next siblings (`this.$el` of a fragment can be a text node). */
function returnFirstEl (el: RootNode): Element | null {
  if (el?.nodeType === Node.ELEMENT_NODE) return el as Element;
  if (!el?.nodeType) return null;
  return returnFirstEl(el.nextSibling);
}

function getFirstFocusElement (focusableElements: HTMLElement[]): HTMLElement | undefined {
  if (!focusableElements.length) return undefined;
  const firstFocusEl = focusableElements[0] as HTMLInputElement;
  // If first element is a radio, put focus on the selected radio of its group, or the first radio if none are selected.
  if (firstFocusEl.matches('[type="radio"]:not(:checked)')) {
    return focusableElements.find(
      (el) => (el as HTMLInputElement).checked && (el as HTMLInputElement).name === firstFocusEl.name,
    ) || firstFocusEl;
  }
  return firstFocusEl;
}

/** Every focusable element within `el`, optionally including `tabindex="-1"` ones. */
function getFocusableElements (el: RootNode, includeNegativeTabIndex = false): HTMLElement[] {
  const rootEl = returnFirstEl(el);
  if (!rootEl) return [];
  const focusableContent = [...rootEl.querySelectorAll<HTMLElement>(focusableElementsList)];
  return focusableContent.filter((fc) => {
    const style = window.getComputedStyle(fc);
    return style.getPropertyValue('display') !== 'none' &&
      style.getPropertyValue('visibility') !== 'hidden' &&
      fc.matches(includeNegativeTabIndex ? focusableAttrs : tabbableAttrs);
  });
}

/** Vue's `$nextTick`: resolves once the render React has queued has been committed to the DOM. */
const nextTick = () => Promise.resolve();

export interface ModalMixin {
  /**
   * The first focusable element in your component, includes tabindex="-1". `el` defaults to the root element.
   */
  getFirstFocusableElement: (el?: RootNode) => Promise<HTMLElement | undefined>;
  /**
   * Sets focus to the first focusable element in your component, includes tabindex="-1". `el` defaults to the root
   * element.
   */
  focusFirstElement: (el?: RootNode) => Promise<void>;
  /** Focuses the element matching the `elementId` selector, or the first element if there is none. */
  focusElementById: (elementId: string) => Promise<void>;
  /**
   * Tabs to the next element contained within your component, does not include tabindex="-1". Call it on every
   * keydown to trap tab within the component. `el` defaults to the root element.
   */
  focusTrappedTabPress: (e: TabPressEvent, el?: RootNode) => void;
}

/**
 * dialtone-vue's ModalMixin as a hook: the methods to trap tab focus within a component, so it isn't possible to tab
 * out of it without dismissing it. Useful for accessibility reasons on things like important actionable alerts.
 *
 * `rootEl` is the component's root element, Vue's `this.$el`: what every method uses when it isn't given an `el`.
 * Keep it in state with a callback ref, so the methods follow the element when it is swapped.
 *
 * Note that `focusFirstElement` WILL focus elements with tabindex="-1", however `focusTrappedTabPress` will not.
 */
export function useModal (rootEl?: RootNode): ModalMixin {
  const getFirstFocusableElement = useCallback(async (el: RootNode = rootEl) => {
    await nextTick();
    return getFirstFocusElement(getFocusableElements(el, true));
  }, [rootEl]);

  const focusFirstElement = useCallback(async (el: RootNode = rootEl) => {
    const elToFocus = await getFirstFocusableElement(returnFirstEl(el));
    elToFocus?.focus({ preventScroll: true });
  }, [rootEl, getFirstFocusableElement]);

  const focusElementById = useCallback(async (elementId: string) => {
    await nextTick();
    const result = returnFirstEl(rootEl)?.querySelector<HTMLElement>(elementId);
    if (result) {
      result.focus();
      return;
    }

    console.warn('Could not find the element specified in dt-modal prop "initialFocusElement". ' +
      'Defaulting to focusing the first element.');
    await focusFirstElement();
  }, [rootEl, focusFirstElement]);

  const focusTrappedTabPress = useCallback((e: TabPressEvent, el: RootNode = rootEl) => {
    const isTabPressed = e.key === 'Tab';

    if (!isTabPressed) return;

    const focusableElements = getFocusableElements(el);
    if (!focusableElements.length) {
      e.preventDefault();
      return;
    }

    const firstFocusableElement = getFirstFocusElement(focusableElements);
    const lastFocusableElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === firstFocusableElement) {
        lastFocusableElement.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastFocusableElement) {
        firstFocusableElement?.focus();
        e.preventDefault();
      }
    }
  }, [rootEl]);

  return useMemo(
    () => ({ getFirstFocusableElement, focusFirstElement, focusElementById, focusTrappedTabPress }),
    [getFirstFocusableElement, focusFirstElement, focusElementById, focusTrappedTabPress],
  );
}
