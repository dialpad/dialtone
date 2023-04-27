import { createTemplateFromVueFile, getIconNames } from '@/common/storybook_utils';
import DtBadge from './badge.vue';
import DtBadgeDefaultTemplate from './badge_default.story.vue';
import DtBadgeVariantsTemplate from './badge_variants.story.vue';
import DtBadgeExamplesTemplate from './badge_examples.story.vue';
import { BADGE_TYPE_MODIFIERS, BADGE_KIND_MODIFIERS, BADGE_DECORATION_MODIFIERS } from './badge_constants';

const iconsList = getIconNames();

export const argsData = {
  type: 'default',
  kind: 'label',
  decoration: undefined,
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
  iconLeft: {
    options: iconsList,
    control: {
      type: 'select',
      labels: {
        undefined: '(empty)',
      },
    },
  },
  iconRight: {
    options: iconsList,
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
const DefaultTemplate = (args, { argTypes }) => createTemplateFromVueFile(args, argTypes, DtBadgeDefaultTemplate);
const VariantsTemplate = (args, { argTypes }) => createTemplateFromVueFile(args, argTypes, DtBadgeVariantsTemplate);
const ExamplesTemplate = (args, { argTypes }) => createTemplateFromVueFile(args, argTypes, DtBadgeExamplesTemplate);

// Stories
export const Default = DefaultTemplate.bind({});
Default.args = {
  default: 'Badge',
};

export const Count = DefaultTemplate.bind({});
Count.args = {
  default: '1',
  kind: 'count',
};

export const Variants = VariantsTemplate.bind({});
Variants.parameters = { options: { showPanel: false }, controls: { disable: true } };
Variants.args = {};

export const Examples = ExamplesTemplate.bind({});
Examples.parameters = { options: { showPanel: false }, controls: { disable: true } };
Examples.args = {};
