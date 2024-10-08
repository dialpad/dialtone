let UNIQUE_ID_COUNTER = 0;
export function getUniqueString (prefix = 'dt') {
  return `${prefix}${UNIQUE_ID_COUNTER++}`;
}

const scheduler = typeof setImmediate === 'function' ? setImmediate : setTimeout;
export function flushPromises () {
  return new Promise((resolve) => {
    scheduler(resolve);
  });
}

/**
 * Transform a string from kebab-case to PascalCase
 * @param string
 * @returns {string}
 */
export function kebabCaseToPascalCase (string) {
  return string?.toLowerCase()
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

/**
 * checks whether the dt-scrollbar is being used on the root element.
 * @param rootElement {HTMLElement}
 * @returns {boolean}
 */
function isDtScrollbarInUse (rootElement = document.documentElement) {
  if (rootElement.hasAttribute('data-overlayscrollbars')) {
    return true;
  }
  return false;
}

/**
 * This will disable scrolling on the root element regardless of whether you are using dt-scrollbar or not.
 * @param rootElement {HTMLElement}
 */
export function disableRootScrolling (rootElement = document.documentElement) {
  if (isDtScrollbarInUse(rootElement)) {
    rootElement.classList.add('d-scrollbar-disabled');
  } else {
    rootElement.classList.add('d-of-hidden');
  }
}

/**
 * This will enable scrolling on the root element regardless of whether you are using dt-scrollbar or not.
 * @param rootElement {HTMLElement}
 */
export function enableRootScrolling (rootElement = document.documentElement) {
  if (isDtScrollbarInUse(rootElement)) {
    rootElement.classList.remove('d-scrollbar-disabled');
  } else {
    rootElement.classList.remove('d-of-hidden');
  }
}

export default {
  getUniqueString,
  kebabCaseToPascalCase,
  flushPromises,
  disableRootScrolling,
  enableRootScrolling,
};
