// Badges are organized in groups. A group has its own variants and its own emphasis levels.
export const BADGE_GROUPS = {
  // The state of the thing the badge sits next to.
  status: {
    defaultVariant: 'neutral',
    variants: ['neutral', 'info', 'positive', 'warning', 'critical'],
    emphasis: ['base', 'strong'],
  },
  // A number, such as an unread count or a mention count.
  counter: {
    defaultVariant: 'count',
    variants: ['count', 'mention'],
    emphasis: ['base', 'strong'],
  },
  // Who can use a feature and, after launch, how long ago it landed. Variants are
  // named for the stage; the badge text stays the product's word ("Alpha", "Beta", "New").
  // Emphasis here is how important the feature is: subtle (outline), base (light fill), strong (solid fill).
  lifecycle: {
    defaultVariant: 'new',
    variants: ['internal', 'early-access', 'new', 'recent', 'familiar'],
    emphasis: ['subtle', 'base', 'strong'],
  },
};

export const BADGE_VARIANT_MODIFIERS = {
  neutral: 'd-badge--neutral',
  info: 'd-badge--info',
  positive: 'd-badge--positive',
  warning: 'd-badge--warning',
  critical: 'd-badge--critical',
  count: 'd-badge--count',
  mention: 'd-badge--mention',
  internal: 'd-badge--internal',
  'early-access': 'd-badge--early-access',
  new: 'd-badge--new',
  recent: 'd-badge--recent',
  familiar: 'd-badge--familiar',
};

export const BADGE_EMPHASIS_MODIFIERS = {
  base: '',
  strong: 'd-badge--strong',
  // Outline only. Reuses the outlined style.
  subtle: 'd-badge--outlined',
};

// Text shown before the number of a mention badge (an icon can replace it through the start slot).
export const BADGE_MENTION_PREFIX = '@';

// Emphasis used when none is given. Variants not listed here default to base.
export const BADGE_DEFAULT_EMPHASIS = {
  new: 'strong',
  recent: 'strong',
};

export const BADGE_SIZE_MODIFIERS = {
  100: 'd-badge--size-100',
  200: 'd-badge--size-200',
  300: 'd-badge--size-300',
  400: 'd-badge--size-400',
  500: 'd-badge--size-500',
};

export const BADGE_TYPE_MODIFIERS = {
  default: '',
  info: 'd-badge--info',
  positive: 'd-badge--positive',
  warning: 'd-badge--warning',
  critical: 'd-badge--critical',
  bulletin: 'd-badge--bulletin',
  ai: 'd-badge--ai',
};

export const BADGE_TYPE_TO_VARIANT = {
  default: 'neutral',
  info: 'info',
  positive: 'positive',
  warning: 'warning',
  critical: 'critical',
  bulletin: 'new',
  ai: 'ai',
};

export const BADGE_DECORATION_MODIFIERS = {
  'black-400': 'd-badge--decorate-black-400',
  'black-500': 'd-badge--decorate-black-500',
  'black-900': 'd-badge--decorate-black-900',
  'red-200': 'd-badge--decorate-red-200',
  'red-300': 'd-badge--decorate-red-300',
  'red-400': 'd-badge--decorate-red-400',
  'purple-200': 'd-badge--decorate-purple-200',
  'purple-300': 'd-badge--decorate-purple-300',
  'purple-400': 'd-badge--decorate-purple-400',
  'purple-500': 'd-badge--decorate-purple-500',
  'blue-200': 'd-badge--decorate-blue-200',
  'blue-300': 'd-badge--decorate-blue-300',
  'blue-400': 'd-badge--decorate-blue-400',
  'green-300': 'd-badge--decorate-green-300',
  'green-400': 'd-badge--decorate-green-400',
  'green-500': 'd-badge--decorate-green-500',
  'gold-300': 'd-badge--decorate-gold-300',
  'gold-400': 'd-badge--decorate-gold-400',
  'gold-500': 'd-badge--decorate-gold-500',
  'magenta-200': 'd-badge--decorate-magenta-200',
  'magenta-300': 'd-badge--decorate-magenta-300',
  'magenta-400': 'd-badge--decorate-magenta-400',
};

export const FEATURE_AWARENESS_BADGE_DEFAULTS = {
  thresholds: {
    new: 0,
    lifecycle: 3,
    hidden: 10,
  },
  stages: {
    new: {
      variant: 'new',
      emphasis: 'strong',
    },
    lifecycle: {
      variant: 'recent',
      emphasis: 'base',
    },
  },
};

export const FEATURE_AWARENESS_BADGE_DEFAULTS_KEY = Symbol('DtFeatureAwarenessBadgeDefaults');
