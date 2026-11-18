import { computePosition, flip, shift, offset, type Middleware, type Placement } from '@floating-ui/dom';
import { ReactRenderer } from '@tiptap/react';
import type { SuggestionKeyDownProps, SuggestionOptions, SuggestionProps } from '@tiptap/suggestion';
import type { ComponentType } from 'react';

import {
  SuggestionList,
  type SuggestionItem,
  type SuggestionItemType,
  type SuggestionListHandle,
  type SuggestionListProps,
} from '../Suggestion/SuggestionList';

/**
 * Default placement configuration for floating UI.
 */
export const DEFAULT_PLACEMENT: Placement = 'top-start';

/**
 * Default z-index for floating elements.
 */
export const DEFAULT_Z_INDEX = '650';

/**
 * The classes of the suggestion popup's root, which Vue's SuggestionList renders itself. Here the renderer's element
 * takes them, so the popup's DOM is Vue's.
 */
export const SUGGESTION_CONTAINER_CLASS = 'd-popover__dialog d-suggestion-list__container';

export interface VirtualElement {
  getBoundingClientRect: () => DOMRect | Record<string, number>;
}

export type SuggestionItemComponent = ComponentType<{ item: SuggestionItem }>;
export type SuggestionListComponent = ComponentType<SuggestionListProps>;
export type SuggestionRenderer = ReactRenderer<SuggestionListHandle, SuggestionListProps>;

/**
 * Creates a default virtual element with zero dimensions.
 */
export function createDefaultVirtualElement (): VirtualElement {
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
 */
export function createVirtualElement (clientRect: VirtualElement['getBoundingClientRect']): VirtualElement {
  return { getBoundingClientRect: clientRect };
}

/**
 * Calculates and updates the position of a floating element.
 */
export async function updateFloatingPosition (
  floatingEl: HTMLElement | null | undefined,
  virtualEl: Partial<VirtualElement> | null | undefined,
  options: { placement?: Placement; middleware?: Middleware[] } = {},
): Promise<void> {
  if (!floatingEl || !virtualEl?.getBoundingClientRect) return;

  const {
    placement = DEFAULT_PLACEMENT,
    middleware = [offset(0), flip(), shift({ padding: 8 })],
  } = options;

  const { x, y } = await computePosition(virtualEl as { getBoundingClientRect: () => DOMRect }, floatingEl, {
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
 */
export function initializeFloatingElement (element: HTMLElement, options: { zIndex?: string } = {}): void {
  const { zIndex = DEFAULT_Z_INDEX } = options;
  element.style.position = 'absolute';
  element.style.zIndex = zIndex;
  element.style.display = 'none';
}

/**
 * Shows a floating element.
 */
export function showFloatingElement (element: HTMLElement | null | undefined): void {
  if (!element) return;
  element.style.display = 'block';
}

/**
 * Hides a floating element.
 */
export function hideFloatingElement (element: HTMLElement | null | undefined): void {
  if (!element) return;
  element.style.display = 'none';
}

/**
 * Creates an escape key handler.
 */
export function createEscapeHandler (onEscape: () => void, isActive: () => boolean): (e: Pick<KeyboardEvent, 'key'>) => void {
  return (e) => {
    if (e.key === 'Escape' && isActive()) {
      onEscape();
    }
  };
}

/**
 * Attaches an escape key handler to the document.
 */
export function attachEscapeHandler (handler: (e: KeyboardEvent) => void): void {
  document.addEventListener('keydown', handler);
}

/**
 * Detaches an escape key handler from the document.
 */
export function detachEscapeHandler (handler: (e: KeyboardEvent) => void): void {
  document.removeEventListener('keydown', handler);
}

/**
 * Creates a React renderer for suggestions. tiptap renders it through the editor's EditorContent, so it keeps the
 * editor's React context; its element is the popup's root.
 */
export function createSuggestionComponent (
  listComponent: SuggestionListComponent,
  itemComponent: SuggestionItemComponent,
  itemType: SuggestionItemType,
  props: Pick<SuggestionProps, 'editor'> & Partial<SuggestionProps>,
): SuggestionRenderer {
  const renderer = new ReactRenderer<SuggestionListHandle, SuggestionListProps>(listComponent, {
    props: {
      itemComponent,
      itemType,
      ...props,
    },
    editor: props.editor,
    className: SUGGESTION_CONTAINER_CLASS,
  });
  // ReactRenderer tags its element; Vue's popup root has only its own classes.
  renderer.element.classList.remove('react-renderer');
  return renderer;
}

interface SuggestionPopupState {
  escHandler: ((e: KeyboardEvent) => void) | null;
  floatingEl: HTMLElement | null;
  component: Pick<SuggestionRenderer, 'destroy'> | null;
}

/**
 * Cleans up a suggestion popup by removing event listeners and DOM elements.
 */
export function cleanupSuggestionPopup (state: SuggestionPopupState): void {
  if (state.escHandler) {
    detachEscapeHandler(state.escHandler);
  }
  state.floatingEl?.remove();
  state.component?.destroy();
}

/**
 * Creates a render function for suggestion popups using Floating UI.
 */
export function createSuggestionRenderer (
  itemComponent: SuggestionItemComponent,
  itemType: SuggestionItemType,
  options: { listComponent?: SuggestionListComponent; placement?: Placement; zIndex?: string } = {},
): NonNullable<SuggestionOptions['render']> {
  const {
    listComponent = SuggestionList,
    placement = DEFAULT_PLACEMENT,
    zIndex = DEFAULT_Z_INDEX,
  } = options;

  return () => {
    let component: SuggestionRenderer | null = null;
    let floatingEl: HTMLElement | null = null;
    let popupIsOpen = false;
    let virtualEl = createDefaultVirtualElement();
    let escHandler: ((e: KeyboardEvent) => void) | null = null;

    function updatePosition () {
      updateFloatingPosition(floatingEl, virtualEl, { placement }).catch(() => {
        // clientRect can return null when the decoration node is gone: the popup keeps its last position.
      });
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
      onStart: (props: SuggestionProps) => {
        component = createSuggestionComponent(listComponent, itemComponent, itemType, props);

        if (!props.clientRect) {
          return;
        }

        floatingEl = component.element;
        initializeFloatingElement(floatingEl, { zIndex });
        document.body.appendChild(floatingEl);

        virtualEl = createVirtualElement(props.clientRect as VirtualElement['getBoundingClientRect']);

        escHandler = createEscapeHandler(hide, () => popupIsOpen);
        attachEscapeHandler(escHandler);

        if (props.items.length > 0) {
          show();
        }
      },

      onUpdate (props: SuggestionProps) {
        component?.updateProps(props);

        if (props.items.length > 0) {
          show();
        } else {
          hide();
        }

        if (props.clientRect) {
          virtualEl = createVirtualElement(props.clientRect as VirtualElement['getBoundingClientRect']);
          updatePosition();
        }
      },

      onKeyDown (props: SuggestionKeyDownProps) {
        if (popupIsOpen) {
          return component?.ref?.onKeyDown(props) ?? false;
        }
        return false;
      },

      onExit () {
        cleanupSuggestionPopup({ escHandler, floatingEl, component });
        escHandler = null;
        floatingEl = null;
        component = null;
        popupIsOpen = false;
      },
    };
  };
}
