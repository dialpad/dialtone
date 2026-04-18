export const CRITICAL = 'critical';
export const POSITIVE = 'positive';
export const WARNING = 'warning';
export const INFO = 'info';
export const MUTED = 'muted';
export const MENTION = 'mention';
export const LINK_VARIANTS = ['', CRITICAL, WARNING, POSITIVE, INFO, MUTED, MENTION];

export const LINK_KIND_MODIFIERS = {
  default: '',
  critical: 'd-link--critical',
  warning: 'd-link--warning',
  positive: 'd-link--positive',
  info: 'd-link--info',
  muted: 'd-link--muted',
  mention: 'd-link--mention',
};

const LINK_KIND_MODIFIERS_INVERTED = {
  default: 'd-link--inverted',
  critical: 'd-link--inverted-critical',
  warning: 'd-link--inverted-warning',
  positive: 'd-link--inverted-positive',
  info: 'd-link--inverted-info',
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
