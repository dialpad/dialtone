export const LEFTBAR_GENERAL_ROW_TYPES = {
  INBOX: 'inbox',
  CONTACTS: 'contacts',
  CHANNELS: 'channels',
  THREADS: 'threads',
  LAUNCHPAD: 'launchpad',
  LOCKED_CHANNEL: 'locked channel',
  CONTACT_CENTER: 'contact center',
  QUICK_START: 'quick start',
  COACHING_GROUP: 'coaching group',
  COACHING_CENTER: 'coaching center',
  DIALBOT: 'dialbot',
  ASSIGNED: 'assigned',
  DIGITAL: 'digital',
  SCHEDULED: 'scheduled',
};

export const LEFTBAR_GENERAL_ROW_CONTACT_CENTER_COLORS = {
  'magenta-100': 'd-recipe-leftbar-general-row__contact-center--magenta-100',
  'magenta-200': 'd-recipe-leftbar-general-row__contact-center--magenta-200',
  'magenta-300': 'd-recipe-leftbar-general-row__contact-center--magenta-300',
  'magenta-400': 'd-recipe-leftbar-general-row__contact-center--magenta-400',
  'green-200': 'd-recipe-leftbar-general-row__contact-center--green-200',
  'green-500': 'd-recipe-leftbar-general-row__contact-center--green-500',
  'gold-300': 'd-recipe-leftbar-general-row__contact-center--gold-300',
  'purple-100': 'd-recipe-leftbar-general-row__contact-center--purple-100',
  'purple-300': 'd-recipe-leftbar-general-row__contact-center--purple-300',
  'purple-600': 'd-recipe-leftbar-general-row__contact-center--purple-600',
  'black-300': 'd-recipe-leftbar-general-row__contact-center--black-300',
};

export const LEFTBAR_GENERAL_ROW_CONTACT_CENTER_VALIDATION_ERROR = 'If type is contact center, color must be one' +
    'of the following:' + Object.keys(LEFTBAR_GENERAL_ROW_CONTACT_CENTER_COLORS).join(', ');

export const LEFTBAR_GENERAL_ROW_ICON_SIZES = [
  '300',
  '200',
];

export default {
  LEFTBAR_GENERAL_ROW_TYPES,
  LEFTBAR_GENERAL_ROW_CONTACT_CENTER_COLORS,
  LEFTBAR_GENERAL_ROW_CONTACT_CENTER_VALIDATION_ERROR,
  LEFTBAR_GENERAL_ROW_ICON_SIZES,
};
