import tippy, { sticky, type Instance, type Placement, type Props } from 'tippy.js';
import type { PopoverBoundary } from './PopoverConstants';

export const BASE_TIPPY_DIRECTIONS = [
  'bottom', 'bottom-start', 'bottom-end',
  'right', 'right-start', 'right-end',
  'left', 'left-start', 'left-end',
  'top', 'top-start', 'top-end',
] as const satisfies readonly Placement[];

export const TIPPY_STICKY_VALUES = [true, false, 'reference', 'popper'] as const satisfies readonly Props['sticky'][];

export const createTippyPopover = (
  anchorElement: Element,
  { contentElement, ...options }: Partial<Props> & { contentElement: HTMLElement },
): Instance => {
  return tippy(anchorElement, {
    ...options,
    plugins: [sticky],
    render: () => getContentWrapper(contentElement),
  });
};

export const createTippy = (anchorElement: Element, options: Partial<Props>): Instance => {
  return tippy(anchorElement, {
    ...options,
    plugins: [sticky],
  });
};

export const getPopperOptions = ({
  boundary = 'clippingParents',
  fallbackPlacements = [],
  hasHideModifierEnabled = false,
  // If set to false the dialog will display over top of the anchor when there is insufficient space.
  // if set to true it will never move from its position relative to the anchor and will clip instead.
  tether = true,
}: {
  // Vue's Popover passes 'viewport' and 'document' here too, though popper reads those from rootBoundary.
  boundary?: PopoverBoundary | Element | Element[];
  fallbackPlacements?: Placement[];
  hasHideModifierEnabled?: boolean;
  tether?: boolean;
} = {}): Props['popperOptions'] => {
  return {
    modifiers: [
      {
        name: 'flip',
        options: {
          fallbackPlacements,
          boundary,
        },
      },
      {
        name: 'hide',
        enabled: hasHideModifierEnabled,
      },
      {
        name: 'preventOverflow',
        options: {
          altAxis: !tether,
          tether,
          boundary,
        },
      },
    ],
  };
};

/**
 * The anchor element tippy attaches to: the wrapper's first element child. Vue's version wraps a text-only anchor in a
 * new <span> by mutating the wrapper; in React the component renders that <span> itself, so this only looks it up.
 */
export const getAnchor = (anchorWrapper: Element | null | undefined): Element | undefined => {
  if (!anchorWrapper) {
    console.warn('No anchor wrapper provided. This may cause issues with the popover.');
    return undefined;
  }
  return anchorWrapper.firstElementChild ?? undefined;
};

/**
 * tippy's popper for a popover: a `.tippy-box` that tippy moves into place, holding the content element. The content
 * element isn't React's: DtPopover creates it, and portals its content into it.
 */
export const getContentWrapper = (content: HTMLElement): { popper: HTMLDivElement } => {
  // The recommended structure is to use the popper as an outer wrapper
  const popper = document.createElement('div');
  popper.className = 'tippy-box d-ps-absolute';
  popper.appendChild(content);
  return {
    popper,
  };
};
