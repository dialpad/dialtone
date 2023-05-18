export const AVATAR_SIZE_MODIFIERS = {
  xs: 'd-avatar--xs',
  sm: 'd-avatar--sm',
  md: 'd-avatar--md',
  lg: 'd-avatar--lg',
  xl: 'd-avatar--xl',
};

export const AVATAR_KIND_MODIFIERS = {
  default: '',
  icon: 'd-avatar__icon',
  initials: 'd-avatar__initials',
};

export const AVATAR_PRESENCE_SIZE_MODIFIERS = {
  md: 'd-avatar__presence--md',
  lg: 'd-avatar__presence--lg',
};

export const AVATAR_PRESENCE_STATES = {
  NONE: '',
  BUSY: 'busy',
  AWAY: 'away',
  OFFLINE: 'offline',
  ACTIVE: 'active',
};

export const AVATAR_ICON_SIZES = {
  xs: undefined,
  sm: '200',
  md: '300',
  lg: '500',
  xl: '600',
};

export const AVATAR_COLORS = [
  undefined,
  '100',
  '200',
  '300',
  '400',
  '500',
  '600',
  '700',
  '800',
  '900',
  '1000',
  '1100',
  '1200',
  '1300',
  '1400',
  '1500',
  '1600',
  '1700',
  '1800',
];

export const AVATAR_GROUP_VALIDATOR = (group) => group > 1;

export default {
  AVATAR_SIZE_MODIFIERS,
  AVATAR_KIND_MODIFIERS,
  AVATAR_PRESENCE_SIZE_MODIFIERS,
  AVATAR_PRESENCE_STATES,
  AVATAR_ICON_SIZES,
  AVATAR_COLORS,
  AVATAR_GROUP_VALIDATOR,
};
