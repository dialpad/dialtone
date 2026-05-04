/**
 * Get the opposite mode (light <-> dark)
 * @param {string} currentMode - The current mode
 * @returns {string} The opposite mode
 */
export function getOppositeMode (currentMode) {
  return currentMode === 'light' ? 'dark' : 'light';
}

/**
 * Get the mode from the root HTML element
 * @returns {string} The root mode or 'light' as default
 */
export function getRootMode () {
  const rootMode = document.documentElement.getAttribute('data-dt-mode');
  return rootMode || 'light';
}

/**
 * Get the contrast from the root HTML element
 * @returns {string} The root contrast or 'default' as default
 */
export function getRootContrast () {
  const rootContrast = document.documentElement.getAttribute('data-dt-contrast');
  return rootContrast || 'default';
}

/**
 * Find the mode from the nearest parent element with data-dt-mode attribute
 * @param {HTMLElement} el - The starting element
 * @returns {string} The parent mode or root mode
 */
export function findParentMode (el) {
  let parent = el?.parentElement;
  while (parent && parent !== document.documentElement) {
    if (parent.hasAttribute('data-dt-mode')) {
      return parent.getAttribute('data-dt-mode');
    }
    parent = parent.parentElement;
  }
  return getRootMode();
}

export default {
  getOppositeMode,
  getRootMode,
  getRootContrast,
  findParentMode,
};