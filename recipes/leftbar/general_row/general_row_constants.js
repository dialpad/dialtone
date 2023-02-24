export const LEFTBAR_GENERAL_ROW_TYPES = {
  INBOX: 'inbox',
  CONTACTS: 'contacts',
  CHANNELS: 'channels',
  THREADS: 'threads',
  LOCKED_CHANNEL: 'locked channel',
  CONTACT_CENTER: 'contact center',
  DIALBOT: 'dialbot',
};

export const LEFTBAR_GENERAL_ROW_ICON_MAPPING = {
  [LEFTBAR_GENERAL_ROW_TYPES.INBOX]: 'inbox',
  [LEFTBAR_GENERAL_ROW_TYPES.CONTACTS]: 'contacts',
  [LEFTBAR_GENERAL_ROW_TYPES.CHANNELS]: 'hash',
  [LEFTBAR_GENERAL_ROW_TYPES.THREADS]: 'thread',
  [LEFTBAR_GENERAL_ROW_TYPES.LOCKED_CHANNEL]: 'lock',
  'locked channel unread': 'lock-filled',
  'channel unread': 'hash-bold',
};

export const LEFTBAR_GENERAL_ROW_CONTACT_CENTER_COLORS = {
  purple: 'd-bgc-purple-300',
  blue: 'd-bgc-blue-300',
  green: 'd-bgc-green-300',
  red: 'd-bgc-red-300',
  magenta: 'd-bgc-magenta-300',
  gold: 'd-bgc-gold-300',
};

export default {
  LEFTBAR_GENERAL_ROW_TYPES,
  LEFTBAR_GENERAL_ROW_ICON_MAPPING,
  LEFTBAR_GENERAL_ROW_CONTACT_CENTER_COLORS,
};
