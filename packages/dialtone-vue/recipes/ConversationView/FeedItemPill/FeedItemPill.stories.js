import { createTemplateFromVueFile, getIconNames } from '@/common/StorybookUtils';
import DtRecipeFeedItemPill from './FeedItemPill.vue';
import DtRecipeFeedItemPillDefaultTemplate from './FeedItemPillDefault.story.vue';
import DtRecipeFeedItemPillVariantsTemplate from './FeedItemPillVariants.story.vue';

const iconsList = getIconNames();

// Default Prop Values
const args = {
  startIcon: 'video',
  title: 'This meeting has ended',
  class: 'd-w628',
  buttonClass: 'd-bar-550',
};

const argTypes = {
  // Slots
  startIcon: {
    table: {
      type: { summary: 'VNode' },
    },
    options: iconsList,
    control: {
      type: 'select',
      labels: {
        undefined: '(empty)',
      },
    },
  },
  leftIcon: {
    table: {
      disable: true,
    },
  },
  subtitle: {
    control: 'text',
    table: {
      type: {
        summary: 'VNode',
      },
    },
  },
  blockEnd: {
    control: 'text',
    table: {
      type: {
        summary: 'VNode',
      },
    },
  },
  bottom: {
    table: {
      disable: true,
    },
  },
  end: {
    control: 'text',
    table: {
      type: {
        summary: 'VNode',
      },
    },
  },
  right: {
    table: {
      disable: true,
    },
  },
  content: {
    control: 'text',
    table: {
      type: {
        summary: 'VNode',
      },
    },
  },
};

// Story Collection
export default {
  title: 'Recipes/Conversation View/Feed Item Pill',
  component: DtRecipeFeedItemPill,
  args,
  argTypes,
  excludeStories: /.*Data$/,
};

// Templates
const DefaultTemplate = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
  DtRecipeFeedItemPillDefaultTemplate,
);

const VariantsTemplate = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
  DtRecipeFeedItemPillVariantsTemplate,
);

// Stories
export const Default = {
  render: DefaultTemplate,
  parameters: {
    a11y: { disable: true },
  },
};

export const Variants = {
  render: VariantsTemplate,
  parameters: {
    options: { showPanel: false },
    a11y: { disable: true },
    controls: { disable: true },
  },
};
