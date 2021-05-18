export const BUTTON_SIZE_MODIFIERS = {
  xs: 'd-btn--xs',
  sm: 'd-btn--sm',
  md: '',
  lg: 'd-btn--lg',
  xl: 'd-btn--xl',
};

export const BUTTON_KIND_MODIFIERS = {
  default: '',
  danger: 'd-btn--danger',
  inverted: 'd-btn--inverted',
};

export const BUTTON_IMPORTANCE_MODIFIERS = {
  clear: '',
  primary: 'd-btn--primary',
  outlined: 'd-btn--outlined',
};

export const BUTTON_TYPES = ['submit', 'reset', 'button'];

export const ICON_POSITION_MODIFIERS = {
  left: 'd-btn__icon--left',
  right: 'd-btn__icon--right',
};

// TODO: Use LINK_KIND_MODIFIERS from the link component
// rather than this one once it gets merged in.
export const LINK_KIND_MODIFIERS = {
  default: 'd-link',
  warning: 'd-link--warning',
  danger: 'd-link--danger',
  success: 'd-link--success',
  muted: 'd-link--muted',
  inverted: 'd-link--inverted',
};

export const INVALID_COMBINATION = [
  {
    circle: true,
    kind: 'default',
    importance: 'primary',
    message: _invalidCombinationMessage(true, 'default', 'primary'),
  },
  {
    circle: true,
    kind: 'danger',
    importance: 'outlined',
    message: _invalidCombinationMessage(true, 'danger', 'outlined'),
  },
];

function _invalidCombinationMessage (circle, kind, importance) {
  return `You cannot not have a ${circle ? 'circle ' : ''}button \
with kind: ${kind} and importance: ${importance} as it \
does not exist in our design system. \
See https://dialpad.design/components/button for a \
list of available button styles`;
}

export default {
  BUTTON_SIZE_MODIFIERS,
  BUTTON_KIND_MODIFIERS,
  BUTTON_IMPORTANCE_MODIFIERS,
  BUTTON_TYPES,
  ICON_POSITION_MODIFIERS,
  LINK_KIND_MODIFIERS,
  INVALID_COMBINATION,
};
