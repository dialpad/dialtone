// The parts of dialtone-vue's components/Popover/TippyUtils.js that DtTooltip uses. Popover is its own unit; it ports
// the rest (createTippyPopover, getContentWrapper) when it lands.
import tippy, { sticky, type Instance, type Placement, type Props } from 'tippy.js';

export const BASE_TIPPY_DIRECTIONS = [
  'bottom', 'bottom-start', 'bottom-end',
  'right', 'right-start', 'right-end',
  'left', 'left-start', 'left-end',
  'top', 'top-start', 'top-end',
] as const satisfies readonly Placement[];

export const TIPPY_STICKY_VALUES = [true, false, 'reference', 'popper'] as const satisfies readonly Props['sticky'][];

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
  boundary?: 'clippingParents' | Element | Element[];
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
