import tippy, { sticky } from 'tippy.js';
import { getArrowDetected } from '../tooltip/modifiers';
import { findFirstFocusableNode } from '@/common/utils';

export const BASE_TIPPY_DIRECTIONS = [
  'bottom', 'bottom-start', 'bottom-end',
  'right', 'right-start', 'right-end',
  'left', 'left-start', 'left-end',
  'top', 'top-start', 'top-end',
];

export const TIPPY_STICKY_VALUES = [true, false, 'reference', 'popper'];

export const createTippy = (anchorElement, options) => {
  const { contentElement } = { ...options };
  delete options.contentElement;
  return tippy(anchorElement, {
    ...options,
    plugins: [sticky],
    render: () => getContentWrapper(contentElement),
  });
};

export const getPopperOptions = ({
  boundary = 'clippingParents',
  fallbackPlacements = [],
  onChangePlacement = () => {},
  hasHideModifierEnabled = false,
  // If set to false the dialog will display over top of the anchor when there is insufficient space.
  // if set to true it will never move from its position relative to the anchor and will clip instead.
  tether = true,
} = {}) => {
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
        },
      },
      getArrowDetected(({ state }) => {
        onChangePlacement(state.placement);
      }),
    ],
  };
};

const createAnchor = (anchorWrapper, tabIndex) => {
  const span = document.createElement('span');
  span.setAttribute('tabindex', tabIndex);
  span.innerText = anchorWrapper.innerText || '';
  anchorWrapper.innerText = '';
  anchorWrapper.appendChild(span);
  return span;
};

export const getAnchor = (anchorWrapper, tabIndex = '0') => {
  const anchor = anchorWrapper?.children[0];
  if (!anchor) return createAnchor(anchorWrapper);
  if (!findFirstFocusableNode(anchor)) {
    anchor.setAttribute('tabindex', tabIndex);
  }
  return anchor;
};

export const getContentWrapper = content => {
  // The recommended structure is to use the popper as an outer wrapper
  const popper = document.createElement('div');
  popper.className = 'tippy-box d-ps-absolute';
  popper.appendChild(content);
  return {
    popper,
  };
};
