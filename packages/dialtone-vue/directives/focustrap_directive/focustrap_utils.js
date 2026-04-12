/**
 * Focusable element discovery utilities for the v-dt-focustrap directive.
 *
 * Extracted from common/mixins/modal.js — the selectors and filtering logic
 * are battle-tested across DtModal, DtBanner, DtPopover, and DtImageViewer.
 */

const FOCUSABLE_ATTRS = ':not(:disabled):not([aria-disabled="true"]):not([role="presentation"])';
const TABBABLE_ATTRS = `${FOCUSABLE_ATTRS}:not([tabindex="-1"])`;
const FOCUSABLE_ELEMENTS = 'button,[href],input,select,textarea,details,[tabindex]';

/**
 * Returns all tabbable elements within a container, filtered by visibility and state.
 *
 * "Tabbable" means the element is focusable AND reachable via sequential Tab navigation
 * (excludes tabindex="-1"). Elements hidden via display:none or visibility:hidden are excluded.
 *
 * @param {HTMLElement} container - DOM element to search within
 * @param {object} [options]
 * @param {boolean} [options.includeNegativeTabIndex=false] - Include tabindex="-1" elements
 * @returns {HTMLElement[]}
 */
export function getTabbableElements (container, { includeNegativeTabIndex = false } = {}) {
  if (!container) return [];
  const candidates = [...container.querySelectorAll(FOCUSABLE_ELEMENTS)];
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
 *
 * @param {HTMLElement[]} elements - List of focusable elements
 * @returns {HTMLElement|undefined}
 */
export function getFirstFocusCandidate (elements) {
  if (!elements.length) return undefined;
  const first = elements[0];
  if (first.matches('[type="radio"]:not(:checked)')) {
    return elements.find(el => el.checked && el.name === first.name) || first;
  }
  return first;
}
