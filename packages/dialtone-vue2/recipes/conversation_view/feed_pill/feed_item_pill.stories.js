import { createTemplateFromVueFile } from '@/common/storybook_utils';
import DtRecipeFeedItemPill from './feed_item_pill.vue';
import DtRecipeFeedItemPillDefaultTemplate from './feed_item_pill_default.story.vue';
import DtRecipeFeedItemPillVariantsTemplate from './feed_item_pill_variants.story.vue';

// Default Prop Values
const args = {
  iconName: 'video',
  title: 'This meeting has ended',
  ariaLabel: 'Click to expand',
  wrapperClass: 'd-w628',
  buttonClass: 'd-bar24',
};

const argTypes = {
  // Slots
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
