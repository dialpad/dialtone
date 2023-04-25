import { action } from '@storybook/addon-actions';
import { createTemplateFromVueFile } from '@/common/storybook_utils';
import DtRecipeUnreadChip from './unread_chip.vue';
import DtRecipeUnreadChipMdx from './unread_chip.mdx';
import DtRecipeUnreadChipDefaultTemplate from './unread_chip_default.story.vue';
import DtRecipeUnreadChipVariantsTemplate from './unread_chip_variants.story.vue';
import { UNREAD_BADGE_DIRECTIONS, UNREAD_BADGE_KINDS } from '@/recipes/leftbar/unread_chip/unread_chip_constants';

// Default Prop Values
export const argsData = {
  onClick: action('click'),
};

export const argTypesData = {
  // Props
  kind: {
    control: {
      type: 'select',
      options: UNREAD_BADGE_KINDS,
    },
  },

  direction: {
    control: {
      type: 'select',
      options: UNREAD_BADGE_DIRECTIONS,
    },
  },

  // Slots
  default: {
    table: {
      type: { summary: 'VNode' },
    },
    control: {
      type: 'text',
    },
  },

  // Action Event Handlers
  onClick: {
    table: {
      disable: true,
    },
  },

  click: {
    table: {
      type: { summary: 'event' },
    },
  },
};

const decorator = () => ({
  template: '<div class="d-w264 d-theme-sidebar-bgc d-p8"><story /></div>',
});

// Story Collection
export default {
  title: 'Recipes/Leftbar/Unread Chip',
  component: DtRecipeUnreadChip,
  args: argsData,
  argTypes: argTypesData,
  decorators: [decorator],
  excludeStories: /.*Data$/,
  parameters: {
    controls: {
      sort: 'requiredFirst',
    },
    docs: {
      page: DtRecipeUnreadChipMdx,
    },
    options: {
      showPanel: true,
    },
  },
};

// Templates
const DefaultTemplate = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
  DtRecipeUnreadChipDefaultTemplate,
);
const VariantsTemplate = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
  DtRecipeUnreadChipVariantsTemplate,
);

// Stories
export const Default = DefaultTemplate.bind({});
Default.args = {
  default: 'Unread mentions',
  kind: 'mentions',
  direction: 'up',
};

export const Variants = VariantsTemplate.bind({});
Variants.args = {};
Variants.parameters = { controls: { disable: true }, actions: { disable: true }, options: { showPanel: false } };
