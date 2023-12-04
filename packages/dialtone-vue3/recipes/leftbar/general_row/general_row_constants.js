export const LEFTBAR_GENERAL_ROW_TYPES = {
  INBOX: 'inbox',
  CONTACTS: 'contacts',
  CHANNELS: 'channels',
  THREADS: 'threads',
  LOCKED_CHANNEL: 'locked channel',
  CONTACT_CENTER: 'contact center',
  QUICK_START: 'quick start',
  COACHING_GROUP: 'coaching group',
  COACHING_CENTER: 'coaching center',
  DIALBOT: 'dialbot',
  ASSIGNED: 'assigned',
  DIGITAL: 'digital',
};

export const LEFTBAR_GENERAL_ROW_ICON_MAPPING = {
  [LEFTBAR_GENERAL_ROW_TYPES.INBOX]: 'inbox',
  [LEFTBAR_GENERAL_ROW_TYPES.CONTACTS]: 'contacts',
  [LEFTBAR_GENERAL_ROW_TYPES.CHANNELS]: 'hash',
  [LEFTBAR_GENERAL_ROW_TYPES.THREADS]: 'thread',
  [LEFTBAR_GENERAL_ROW_TYPES.LOCKED_CHANNEL]: 'lock',
  [LEFTBAR_GENERAL_ROW_TYPES.QUICK_START]: 'sparkle',
  [LEFTBAR_GENERAL_ROW_TYPES.COACHING_GROUP]: 'users',
  [LEFTBAR_GENERAL_ROW_TYPES.COACHING_CENTER]: 'external-link',
  'locked channel unread': 'lock-filled',
  'channel unread': 'hash-bold',
  [LEFTBAR_GENERAL_ROW_TYPES.ASSIGNED]: 'at-sign',
  [LEFTBAR_GENERAL_ROW_TYPES.DIGITAL]: 'message',
};

export const LEFTBAR_GENERAL_ROW_CONTACT_CENTER_COLORS = {
  'magenta-200': 'd-bgc-magenta-200',
  'green-200': 'd-bgc-green-200',
  'gold-300': 'd-bgc-gold-300',
  'purple-600': 'd-bgc-purple-600',
  'magenta-300': 'd-bgc-magenta-300',
  'purple-300': 'd-bgc-purple-300',
  'green-500': 'd-bgc-green-500',
  'purple-100': 'd-bgc-purple-100',
  'magenta-400': 'd-bgc-magenta-400',
  'magenta-100': 'd-bgc-magenta-100',
  'black-300': 'd-bgc-black-300',
};

export const LEFTBAR_GENERAL_ROW_CONTACT_CENTER_VALIDATION_ERROR = 'If type is contact center, color must be one' +
    'of the following:' + Object.keys(LEFTBAR_GENERAL_ROW_CONTACT_CENTER_COLORS).join(', ');

export const LEFTBAR_GENERAL_ROW_ICON_SIZES = [
  '300',
  '200',
];

export default {
  LEFTBAR_GENERAL_ROW_TYPES,
  LEFTBAR_GENERAL_ROW_ICON_MAPPING,
  LEFTBAR_GENERAL_ROW_CONTACT_CENTER_COLORS,
  LEFTBAR_GENERAL_ROW_CONTACT_CENTER_VALIDATION_ERROR,
  LEFTBAR_GENERAL_ROW_ICON_SIZES,
};
