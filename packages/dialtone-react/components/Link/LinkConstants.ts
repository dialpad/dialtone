export const CRITICAL = 'critical';
export const POSITIVE = 'positive';
export const WARNING = 'warning';
export const INFO = 'info';
export const MUTED = 'muted';
export const MENTION = 'mention';
export const UNSTYLED = 'unstyled';
export const LINK_UNSTYLED_CLASS = 'd-link--unstyled';
export const LINK_VARIANTS = ['', CRITICAL, WARNING, POSITIVE, INFO, MUTED, MENTION, UNSTYLED] as const;

export type LinkTone = typeof LINK_VARIANTS[number];

export const LINK_KIND_MODIFIERS = {
  default: '',
  critical: 'd-link--critical',
  warning: 'd-link--warning',
  positive: 'd-link--positive',
  info: 'd-link--info',
  muted: 'd-link--muted',
  mention: 'd-link--mention',
} as const;

const LINK_KIND_MODIFIERS_INVERTED = {
  default: 'd-link--inverted',
  critical: 'd-link--inverted-critical',
  warning: 'd-link--inverted-warning',
  positive: 'd-link--inverted-positive',
  info: 'd-link--inverted-info',
  muted: 'd-link--inverted-muted',
  mention: 'd-link--inverted-mention',
} as const;

type ModifierMap = Readonly<Record<string, string>>;

export const getLinkKindModifier = (kind: string | null | undefined, inverted?: boolean): string | undefined => {
  if (inverted) {
    return (LINK_KIND_MODIFIERS_INVERTED as ModifierMap)[kind || 'default'];
  }
  return (LINK_KIND_MODIFIERS as ModifierMap)[kind as string];
};

export default {
  LINK_VARIANTS,
  LINK_KIND_MODIFIERS,
  LINK_UNSTYLED_CLASS,
  getLinkKindModifier,
};
