import { createTemplateFromVueFile } from '@/common/storybook_utils';

import DtFilterPill from './filter_pill.vue';
import DtFilterPillDefaultTemplate from './filter_pill_default.story.vue';
import DtFilterPillVariantsTemplate from './filter_pill_variants.story.vue';
import { action } from '@storybook/addon-actions';
import { BUTTON_SIZE_MODIFIERS } from '@/components/button';
import { POPOVER_DIRECTIONS, POPOVER_PADDING_CLASSES } from '@/components/popover/index.js';

// Set default values at the story level here.
export const argsData = {
  label: 'Users or groups',
  content: 'This is a named slot with it\'s default set at the story level.',
  onOpen: action('open'),
  onClear: action('clear'),
};

export const argTypesData = {
  // Slots
  content: {
    control: 'text',
    table: {
      type: {
        summary: 'VNode',
      },
    },
  },

  // Props
  size: {
    control: 'select',
    options: Object.keys(BUTTON_SIZE_MODIFIERS),
  },
  active: {
    control: {
      type: 'boolean',
    },
  },
  padding: {
    table: {
      defaultValue: { summary: 'large' },
    },
    options: Object.keys(POPOVER_PADDING_CLASSES),
    control: {
      type: 'select',
    },
  },
  placement: {
    options: POPOVER_DIRECTIONS,
    control: {
      type: 'select',
    },
  },

  // Events: Exclude this from the table as event names will automatically be added from the component itself.
  onClear: {
    action: 'clear',
    table: {
      disable: true,
    },
  },

  onOpen: {
    action: 'open',
    table: {
      disable: true,
    },
  },
};

// Story Collection
export default {
  title: 'Components/Filter Pill',
  component: DtFilterPill,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
};

const DefaultTemplate = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
  DtFilterPillDefaultTemplate,
);

const VariantsTemplate = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
  DtFilterPillVariantsTemplate,
);

// Stories
export const Default = {
  render: DefaultTemplate,
  decorators: [
    () => ({
      template: `<div class="d-p64"><story /></div>`,
    }),
  ],
};

export const Variants = {
  render: VariantsTemplate,
  parameters: { options: { showPanel: false }, controls: { disable: true } },
};
