export const AVATAR_SIZE_MODIFIERS = {
  // 11-size system: 100-500 support presence, 600-900 do not
  100: 'd-avatar--size-100',
  150: 'd-avatar--size-150',
  200: 'd-avatar--size-200',
  250: 'd-avatar--size-250',
  300: 'd-avatar--size-300',
  400: 'd-avatar--size-400',
  500: 'd-avatar--size-500',
  600: 'd-avatar--size-600',
  700: 'd-avatar--size-700',
  800: 'd-avatar--size-800',
  900: 'd-avatar--size-900',
  // T-shirt sizes (deprecated aliases)
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
  // 11-size system icon mappings
  100: '100',
  150: '100',
  200: '200',
  250: '200',
  300: '300',
  400: '500',
  500: '600',
  600: '600',
  700: '700',
  800: '800',
  900: '800',
  // T-shirt sizes (deprecated aliases)
  xs: '100',
  sm: '200',
  md: '300',
  lg: '500',
  xl: '600',
};

export const AVATAR_COLORS = [
  '000',
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

// We do not use the color '000' (grey) in the randomized avatar colors, but it can still be set manually.
export const AVATAR_RANDOM_COLORS = AVATAR_COLORS.slice(1);

export const AVATAR_GROUP_VALIDATOR = (group) => group > 1;

export default {
  AVATAR_SIZE_MODIFIERS,
  AVATAR_KIND_MODIFIERS,
  AVATAR_PRESENCE_SIZE_MODIFIERS,
  AVATAR_PRESENCE_STATES,
  AVATAR_ICON_SIZES,
  AVATAR_COLORS,
  AVATAR_RANDOM_COLORS,
  AVATAR_GROUP_VALIDATOR,
};
