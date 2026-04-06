export const CRITICAL = 'critical';
export const POSITIVE = 'positive';
/** @deprecated Use CRITICAL */
export const DANGER = 'danger';
export const WARNING = 'warning';
/** @deprecated Use POSITIVE */
export const SUCCESS = 'success';
export const MUTED = 'muted';
export const MENTION = 'mention';
export const LINK_VARIANTS = ['', CRITICAL, DANGER, WARNING, POSITIVE, SUCCESS, MUTED, MENTION];

export const LINK_KIND_MODIFIERS = {
  default: '',
  critical: 'd-link--critical',
  danger: 'd-link--danger',
  warning: 'd-link--warning',
  positive: 'd-link--positive',
  success: 'd-link--success',
  muted: 'd-link--muted',
  mention: 'd-link--mention',
};

const LINK_KIND_MODIFIERS_INVERTED = {
  default: 'd-link--inverted',
  critical: 'd-link--inverted-critical',
  danger: 'd-link--inverted-danger',
  warning: 'd-link--inverted-warning',
  positive: 'd-link--inverted-positive',
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
