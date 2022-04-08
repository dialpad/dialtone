import tippy from 'tippy.js';
import { getArrowDetected } from '../tooltip/modifiers';
import { findFirstFocusableNode } from '@/common/utils';

export const BASE_TIPPY_DIRECTIONS = [
  'bottom', 'bottom-start', 'bottom-end',
  'right', 'right-start', 'right-end',
  'left', 'left-start', 'left-end',
  'top', 'top-start', 'top-end',
];

export const createTippy = (anchorElement, options) => {
  const { contentElement } = { ...options };
  delete options.contentElement;
  return tippy(anchorElement, {
    ...options,
    render: () => getContentWrapper(contentElement),
  });
};

export const getPopperOptions = ({
  boundary = 'clippingParents',
  fallbackPlacements = [],
  onChangePlacement = () => {},
  hasHideModifierEnabled = false,
} = {}) => {
  return {
    modifiers: [
      {
        name: 'flip',
        options: {
          fallbackPlacements: fallbackPlacements,
          boundary,
        },
      },
      {
        name: 'hide',
        enabled: hasHideModifierEnabled,
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
