export const DANGER = 'danger';
export const WARNING = 'warning';
export const SUCCESS = 'success';
export const MUTED = 'muted';
export const INVERTED = 'inverted';
export const MENTION = 'mention';
export const LINK_VARIANTS = ['', DANGER, WARNING, SUCCESS, MUTED, INVERTED, MENTION];

export const LINK_KIND_MODIFIERS = {
  default: '',
  warning: 'd-link--warning',
  danger: 'd-link--danger',
  success: 'd-link--success',
  muted: 'd-link--muted',
  inverted: 'd-link--inverted',
  mention: 'd-link--mention',
};

export default {
  LINK_VARIANTS,
  LINK_KIND_MODIFIERS,
};
