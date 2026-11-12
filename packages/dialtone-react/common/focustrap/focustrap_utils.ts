/**
 * Focusable element discovery utilities for the focus trap.
 *
 * Extracted from common/mixins/modal.js in dialtone-vue — the selectors and filtering logic
 * are battle-tested across DtModal, DtBanner, DtPopover, and DtImageViewer.
 */

const FOCUSABLE_ATTRS = ':not(:disabled):not([aria-disabled="true"]):not([role="presentation"])';
const TABBABLE_ATTRS = `${FOCUSABLE_ATTRS}:not([tabindex="-1"])`;
const FOCUSABLE_ELEMENTS = 'button,[href],input,select,textarea,details,[tabindex]';

export interface TabbableOptions {
  /** Include tabindex="-1" elements. */
  includeNegativeTabIndex?: boolean;
}

/**
 * Returns all tabbable elements within a container, filtered by visibility and state.
 *
 * "Tabbable" means the element is focusable AND reachable via sequential Tab navigation
 * (excludes tabindex="-1"). Elements hidden via display:none or visibility:hidden are excluded.
 */
export function getTabbableElements (
  container: HTMLElement | null | undefined,
  { includeNegativeTabIndex = false }: TabbableOptions = {},
): HTMLElement[] {
  if (!container) return [];
  const candidates = [...container.querySelectorAll<HTMLElement>(FOCUSABLE_ELEMENTS)];
  const attrs = includeNegativeTabIndex ? FOCUSABLE_ATTRS : TABBABLE_ATTRS;
  return candidates.filter((el) => {
    const style = window.getComputedStyle(el);
    return style.getPropertyValue('display') !== 'none' &&
      style.getPropertyValue('visibility') !== 'hidden' &&
      el.matches(attrs);
  });
}

/**
 * Returns the best candidate for initial focus within a list of focusable elements.
 *
 * For radio buttons: if the first element is an unchecked radio, prefers
 * the checked radio with the same name (if one exists).
 */
export function getFirstFocusCandidate (elements: HTMLElement[]): HTMLElement | undefined {
  if (!elements.length) return undefined;
  const first = elements[0] as HTMLInputElement;
  if (first.matches('[type="radio"]:not(:checked)') && first.name) {
    return (elements as HTMLInputElement[]).find(el => el.checked && el.name === first.name) || first;
  }
  return first;
}
