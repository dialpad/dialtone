import { createRenderConfig, getIconNames } from '@/common/storybook_utils';
import DtRecipeFeedItemPill from './feed_item_pill.vue';
import DtRecipeFeedItemPillDefaultTemplate from './feed_item_pill_default.story.vue';
import DtRecipeFeedItemPillVariantsTemplate from './feed_item_pill_variants.story.vue';

const iconsList = getIconNames();

// Default Prop Values
const args = {
  leftIcon: 'video',
  title: 'This meeting has ended',
  ariaLabel: 'Click to expand',
  wrapperClass: 'd-w628',
  buttonClass: 'd-bar24',
};

const argTypes = {
  // Slots
  leftIcon: {
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
  subtitle: {
    control: 'text',
    table: {
      type: {
        summary: 'VNode',
      },
    },
  },
  bottom: {
    control: 'text',
    table: {
      type: {
        summary: 'VNode',
      },
    },
  },
  right: {
    control: 'text',
    table: {
      type: {
        summary: 'VNode',
      },
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
// Stories
export const Default = {
  render: (argsData) => createRenderConfig(DtRecipeFeedItemPill, DtRecipeFeedItemPillDefaultTemplate, argsData),
  parameters: {
    a11y: { disable: true },
  },
};

export const Variants = {
  render: (argsData) => createRenderConfig(DtRecipeFeedItemPill, DtRecipeFeedItemPillVariantsTemplate, argsData),
  parameters: {
    options: { showPanel: false },
    a11y: { disable: true },
    controls: { disable: true },
  },
};
