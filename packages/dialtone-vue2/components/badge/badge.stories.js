import { createRenderConfig, getIconNames } from '@/common/storybook_utils';
import DtBadge from './badge.vue';
import DtBadgeDefaultTemplate from './badge_default.story.vue';
import DtBadgeVariantsTemplate from './badge_variants.story.vue';
import DtBadgeExamplesTemplate from './badge_examples.story.vue';
import {
  BADGE_TYPE_MODIFIERS,
  BADGE_KIND_MODIFIERS,
  BADGE_DECORATION_MODIFIERS,
} from './badge_constants';

const iconsList = getIconNames();

export const argsData = {
  type: 'default',
  kind: 'label',
  decoration: undefined,
  leftIcon: undefined,
  rightIcon: undefined,
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
  leftIcon: {
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
  rightIcon: {
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

  // Props
  type: {
    control: {
      type: 'select',
    },
    options: Object.keys(BADGE_TYPE_MODIFIERS),
  },

  kind: {
    control: {
      type: 'select',
    },
    options: Object.keys(BADGE_KIND_MODIFIERS),
    if: { arg: 'type', neq: 'ai' },
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

export const Default = {
  render: (argsData) => createRenderConfig(DtBadge, DtBadgeDefaultTemplate, argsData),
  args: {
    default: 'Badge',
  },
};

export const Count = {
  render: (argsData) => createRenderConfig(DtBadge, DtBadgeDefaultTemplate, argsData),
  args: {
    default: '1',
    kind: 'count',
  },
};

export const Variants = {
  render: (argsData) => createRenderConfig(DtBadge, DtBadgeVariantsTemplate, argsData),
  parameters: { options: { showPanel: false }, controls: { disable: true } },
  args: {},
};

export const Examples = {
  render: (argsData) => createRenderConfig(DtBadge, DtBadgeExamplesTemplate, argsData),
  parameters: { options: { showPanel: false }, controls: { disable: true } },
  args: {},
};
