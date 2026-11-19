export const LIST_ITEM_ROLES = ['listitem', 'menuitem', 'option', 'menuitemradio'] as const;

export const LIST_ITEM_TYPES = {
  DEFAULT: 'default',
  CUSTOM: 'custom',
} as const;

export const LIST_ITEM_NAVIGATION_TYPES = {
  ARROW_KEYS: 'arrow-keys',
  TAB: 'tab',
  NONE: 'none',
} as const;

export type ListItemRole = typeof LIST_ITEM_ROLES[number];
export type ListItemType = typeof LIST_ITEM_TYPES[keyof typeof LIST_ITEM_TYPES];
export type ListItemNavigationType = typeof LIST_ITEM_NAVIGATION_TYPES[keyof typeof LIST_ITEM_NAVIGATION_TYPES];
