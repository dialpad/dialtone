import { markRaw } from 'vue';
import { VueRenderer } from '@tiptap/vue-3';
import { computePosition, flip, shift, offset } from '@floating-ui/dom';

import SuggestionList from '../suggestion/SuggestionList.vue';

/**
 * Default placement configuration for floating UI.
 */
export const DEFAULT_PLACEMENT = 'top-start';

/**
 * Default z-index for floating elements.
 */
export const DEFAULT_Z_INDEX = '650';

/**
 * Creates a default virtual element with zero dimensions.
 * @returns {Object} Virtual element with getBoundingClientRect method
 */
export function createDefaultVirtualElement () {
  return {
    getBoundingClientRect: () => ({
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    }),
  };
}

/**
 * Creates a virtual element from a clientRect function.
 * @param {Function} clientRect - Function that returns a DOMRect
 * @returns {Object} Virtual element with getBoundingClientRect method
 */
export function createVirtualElement (clientRect) {
  return { getBoundingClientRect: clientRect };
}

/**
 * Calculates and updates the position of a floating element.
 * @param {HTMLElement} floatingEl - The floating element to position
 * @param {Object} virtualEl - Virtual element with getBoundingClientRect
 * @param {Object} options - Positioning options
 * @param {string} options.placement - Placement of the floating element
 * @param {Array} options.middleware - Floating UI middleware array
 */
export async function updateFloatingPosition (floatingEl, virtualEl, options = {}) {
  if (!floatingEl || !virtualEl?.getBoundingClientRect) return;

  const {
    placement = DEFAULT_PLACEMENT,
    middleware = [offset(0), flip(), shift({ padding: 8 })],
  } = options;

  const { x, y } = await computePosition(virtualEl, floatingEl, {
    placement,
    middleware,
  });

  Object.assign(floatingEl.style, {
    left: `${x}px`,
    top: `${y}px`,
  });
}

/**
 * Initializes a floating element with default styles.
 * @param {HTMLElement} element - The element to initialize
 * @param {Object} options - Style options
 * @param {string} options.zIndex - Z-index value
 */
export function initializeFloatingElement (element, options = {}) {
  const { zIndex = DEFAULT_Z_INDEX } = options;
  element.style.position = 'absolute';
  element.style.zIndex = zIndex;
  element.style.display = 'none';
}

/**
 * Shows a floating element.
 * @param {HTMLElement} element - The element to show
 */
export function showFloatingElement (element) {
  if (!element) return;
  element.style.display = 'block';
}

/**
 * Hides a floating element.
 * @param {HTMLElement} element - The element to hide
 */
export function hideFloatingElement (element) {
  if (!element) return;
  element.style.display = 'none';
}

/**
 * Creates an escape key handler.
 * @param {Function} onEscape - Callback to execute when Escape is pressed
 * @param {Function} isActive - Function that returns whether the handler should be active
 * @returns {Function} Event handler function
 */
export function createEscapeHandler (onEscape, isActive) {
  return (e) => {
    if (e.key === 'Escape' && isActive()) {
      onEscape();
    }
  };
}

/**
 * Attaches an escape key handler to the document.
 * @param {Function} handler - The event handler
 */
export function attachEscapeHandler (handler) {
  document.addEventListener('keydown', handler);
}

/**
 * Detaches an escape key handler from the document.
 * @param {Function} handler - The event handler
 */
export function detachEscapeHandler (handler) {
  document.removeEventListener('keydown', handler);
}

/**
 * Creates a Vue component renderer for suggestions.
 * @param {Object} listComponent - The list wrapper component
 * @param {Object} itemComponent - The item component to render
 * @param {string} itemType - The type identifier for the suggestion
 * @param {Object} props - Additional props from the suggestion plugin
 * @returns {VueRenderer} The Vue renderer instance
 */
export function createSuggestionComponent (listComponent, itemComponent, itemType, props) {
  return new VueRenderer(listComponent, {
    props: {
      itemComponent: markRaw(itemComponent),
      itemType,
      ...props,
    },
    editor: props.editor,
  });
}

/**
 * Cleans up a suggestion popup by removing event listeners and DOM elements.
 * @param {Object} state - The state object containing references to clean up
 * @param {Function} state.escHandler - The escape key handler
 * @param {HTMLElement} state.floatingEl - The floating element
 * @param {VueRenderer} state.component - The Vue renderer component
 */
export function cleanupSuggestionPopup (state) {
  if (state.escHandler) {
    detachEscapeHandler(state.escHandler);
  }
  state.floatingEl?.remove();
  state.component?.destroy();
}

/**
 * Creates a render function for suggestion popups using Floating UI.
 * @param {Object} itemComponent - The Vue component to render for each suggestion item
 * @param {string} itemType - The type identifier for the suggestion
 * @param {Object} options - Optional configuration
 * @param {Object} options.listComponent - Custom list component (defaults to SuggestionList)
 * @param {string} options.placement - Floating UI placement
 * @param {string} options.zIndex - Z-index for the floating element
 * @returns {Function} A render function compatible with Tiptap's suggestion plugin
 */
export function createSuggestionRenderer (itemComponent, itemType, options = {}) {
  const {
    listComponent = SuggestionList,
    placement = DEFAULT_PLACEMENT,
    zIndex = DEFAULT_Z_INDEX,
  } = options;

  return () => {
    let component = null;
    let floatingEl = null;
    let popupIsOpen = false;
    let virtualEl = createDefaultVirtualElement();
    let escHandler = null;

    function updatePosition () {
      updateFloatingPosition(floatingEl, virtualEl, { placement });
    }

    function show () {
      if (!floatingEl) return;
      showFloatingElement(floatingEl);
      popupIsOpen = true;
      updatePosition();
    }

    function hide () {
      if (!floatingEl) return;
      hideFloatingElement(floatingEl);
      popupIsOpen = false;
    }

    return {
      onStart: props => {
        component = createSuggestionComponent(listComponent, itemComponent, itemType, props);

        if (!props.clientRect) {
          return;
        }

        floatingEl = component.element;
        initializeFloatingElement(floatingEl, { zIndex });
        document.body.appendChild(floatingEl);

        virtualEl = createVirtualElement(props.clientRect);

        escHandler = createEscapeHandler(hide, () => popupIsOpen);
        attachEscapeHandler(escHandler);

        if (props.items.length > 0) {
          show();
        }
      },

      onUpdate (props) {
        component?.updateProps(props);

        if (props.items.length > 0) {
          show();
        } else {
          hide();
        }

        if (props.clientRect) {
          virtualEl = createVirtualElement(props.clientRect);
          updatePosition();
        }
      },

      onKeyDown (props) {
        if (popupIsOpen) {
          return component?.ref?.onKeyDown(props);
        }
      },

      onExit () {
        cleanupSuggestionPopup({ escHandler, floatingEl, component });
        escHandler = null;
        floatingEl = null;
        component = null;
      },
    };
  };
}
