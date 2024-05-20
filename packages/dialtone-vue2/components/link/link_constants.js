export const DANGER = 'danger';
export const WARNING = 'warning';
export const SUCCESS = 'success';
export const MUTED = 'muted';
export const MENTION = 'mention';
export const LINK_VARIANTS = ['', DANGER, WARNING, SUCCESS, MUTED, MENTION];

export const LINK_KIND_MODIFIERS = {
  default: '',
  warning: 'd-link--warning',
  danger: 'd-link--danger',
  success: 'd-link--success',
  muted: 'd-link--muted',
  mention: 'd-link--mention',
};

const LINK_KIND_MODIFIERS_INVERTED = {
  default: 'd-link--inverted',
  warning: 'd-link--inverted-warning',
  danger: 'd-link--inverted-danger',
  success: 'd-link--inverted-success',
  muted: 'd-link--inverted-muted',
  mention: 'd-link--inverted-mention',
};

export const getLinkKindModifier = (kind, inverted) => {
  if (inverted) {
    return LINK_KIND_MODIFIERS_INVERTED[kind || 'default'];
  }
  return LINK_KIND_MODIFIERS[kind];
};

export default {
  LINK_VARIANTS,
  LINK_KIND_MODIFIERS,
  getLinkKindModifier,
};
