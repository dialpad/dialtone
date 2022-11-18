export const BUTTON_SIZE_MODIFIERS = {
  xs: 'd-btn--xs',
  sm: 'd-btn--sm',
  md: '',
  lg: 'd-btn--lg',
  xl: 'd-btn--xl',
};

export const BUTTON_KIND_MODIFIERS = {
  default: '',
  muted: 'd-btn--muted',
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
  top: 'd-btn__icon--top',
  bottom: 'd-btn__icon--bottom',
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
  {
    circle: true,
    kind: 'muted',
    importance: 'primary',
    message: _invalidCombinationMessage(true, 'muted', 'primary'),
  },
  {
    circle: false,
    kind: 'muted',
    importance: 'primary',
    message: _invalidCombinationMessage(false, 'muted', 'primary'),
  },
];

export const BUTTON_ICON_SIZES = {
  xs: '200',
  sm: '200',
  md: '300',
  lg: '400',
  xl: '500',
};

function _invalidCombinationMessage (circle, kind, importance) {
  return `You cannot have a ${circle ? 'circle ' : ''}button \
with kind: ${kind} and importance: ${importance} as it \
does not exist in our design system. \
See https://dialpad.design/components/button.html for a \
list of available button styles`;
}

export default {
  BUTTON_SIZE_MODIFIERS,
  BUTTON_KIND_MODIFIERS,
  BUTTON_IMPORTANCE_MODIFIERS,
  BUTTON_TYPES,
  ICON_POSITION_MODIFIERS,
  INVALID_COMBINATION,
  BUTTON_ICON_SIZES,
};
