import { createTemplateFromVueFile, getIconNames } from '@/common/storybook_utils';
import DtBadge from './Badge.vue';
import DtBadgeDefaultTemplate from './BadgeDefault.story.vue';
import DtBadgeVariantsTemplate from './BadgeVariants.story.vue';
import DtBadgeExamplesTemplate from './BadgeExamples.story.vue';
import {
  BADGE_VARIANT_MODIFIERS,
  BADGE_EMPHASIS_MODIFIERS,
  BADGE_SIZE_MODIFIERS,
  BADGE_DECORATION_MODIFIERS,
  BADGE_GROUPS,
} from './BadgeConstants';
import { ICON_SIZE_MODIFIERS } from '@/components/Icon';

const iconsList = getIconNames();

export const argsData = {
  kind: 'status',
  variant: 'neutral',
  emphasis: undefined,
  size: 200,
  decoration: undefined,
  startIcon: undefined,
  endIcon: undefined,
};

export const argTypesData = {
  // Slots
  default: {
    control: 'text',
    table: {
      type: {
        summary: 'VNode',
      },
    },
  },
  startIcon: {
    options: iconsList,
    table: {
      type: { summary: 'VNode' },
    },
    control: {
      type: 'select',
      labels: {
        undefined: '(empty)',
      },
    },
  },
  endIcon: {
    options: iconsList,
    table: {
      type: { summary: 'VNode' },
    },
    control: {
      type: 'select',
      labels: {
        undefined: '(empty)',
      },
    },
  },
  leading: {
    control: false,
    description: 'Freeform content at the start of the badge, such as another badge',
    table: {
      type: { summary: 'VNode' },
    },
  },
  trailing: {
    control: false,
    description: 'Freeform content at the end of the badge, such as a nested badge',
    table: {
      type: { summary: 'VNode' },
    },
  },
  leftIcon: {
    table: {
      disable: true,
    },
  },
  rightIcon: {
    table: {
      disable: true,
    },
  },

  // Props
  variant: {
    control: {
      type: 'select',
    },
    options: Object.keys(BADGE_VARIANT_MODIFIERS),
  },

  emphasis: {
    control: {
      type: 'select',
      labels: {
        undefined: '(empty)',
      },
    },
    options: [undefined, ...Object.keys(BADGE_EMPHASIS_MODIFIERS)],
  },

  size: {
    control: {
      type: 'select',
    },
    options: Object.keys(BADGE_SIZE_MODIFIERS),
  },

  type: {
    table: {
      disable: true,
    },
  },

  kind: {
    control: {
      type: 'select',
      labels: {
        undefined: '(from variant)',
      },
    },
    options: [undefined, ...Object.keys(BADGE_GROUPS)],
  },

  decoration: {
    control: {
      type: 'select',
      labels: {
        undefined: '(empty)',
      },
    },
    options: [undefined, ...Object.keys(BADGE_DECORATION_MODIFIERS)],
    // TODO: Find a way to add conditions on more than one argument
  },

  iconSize: {
    options: Object.keys(ICON_SIZE_MODIFIERS),
    control: {
      type: 'select',
    },
  },

  text: {
    control: { type: 'text' },
  },

  startIconClass: {
    description: 'Pass through classes. Used to customize the start icon container',
  },

  endIconClass: {
    description: 'Pass through classes. Used to customize the end icon container',
  },

  leadingClass: {
    description: 'Pass through classes. Used to customize the leading container',
  },

  trailingClass: {
    description: 'Pass through classes. Used to customize the trailing container',
  },

  subtle: {
    control: {
      type: 'boolean',
    },
  },

  outlined: {
    control: {
      type: 'boolean',
    },
  },

  labelClass: {
    description: 'Pass through classes. Used to customize the label container',
  },
};

// Story Collection
export default {
  title: 'Components/Badge',
  component: DtBadge,
  excludeStories: /.*Data$/,
  args: argsData,
  argTypes: argTypesData,
};

// Templates
const DefaultTemplate = (args, { argTypes }) =>
  createTemplateFromVueFile(args, argTypes, DtBadgeDefaultTemplate);
const VariantsTemplate = (args, { argTypes }) =>
  createTemplateFromVueFile(args, argTypes, DtBadgeVariantsTemplate);
const ExamplesTemplate = (args, { argTypes }) =>
  createTemplateFromVueFile(args, argTypes, DtBadgeExamplesTemplate);

export const Default = {
  render: DefaultTemplate,

  args: {
    default: 'Badge',
  },
};

export const Count = {
  render: DefaultTemplate,

  args: {
    default: '1',
    kind: 'counter',
    variant: 'count',
  },
};

export const Mention = {
  render: DefaultTemplate,

  args: {
    default: '2',
    kind: 'counter',
    variant: 'mention',
  },
};

export const Variants = {
  render: VariantsTemplate,
  parameters: { options: { showPanel: false }, controls: { disable: true } },
  args: {},
};

export const Examples = {
  render: ExamplesTemplate,
  parameters: { options: { showPanel: false }, controls: { disable: true } },
  args: {},
};
