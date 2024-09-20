import { createRenderConfig } from '@/common/storybook_utils';

import DtFilterPill from './filter_pill.vue';
import DtFilterPillDefaultTemplate from './filter_pill_default.story.vue';
import DtFilterPillVariantsTemplate from './filter_pill_variants.story.vue';
import { action } from '@storybook/addon-actions';
import { BUTTON_SIZE_MODIFIERS } from '@/components/button';

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

  // Events: Exclude this from the table as event names will automatically be added from the component itself.
  onReset: {
    action: 'reset',
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

// Set default values at the story level here.
export const argsData = {
  label: 'Users or groups',
  content: 'This is a named slot with it\'s default set at the story level.',
  onOpen: action('open'),
  onReset: action('reset'),
  size: 'md',
};

// Story Collection
export default {
  title: 'Components/Filter Pill',
  component: DtFilterPill,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
};

// Stories
export const Default = {
  render: (argsData) => createRenderConfig(DtFilterPill, DtFilterPillDefaultTemplate, argsData),
};

export const Variants = {
  render: (argsData) => createRenderConfig(DtFilterPill, DtFilterPillVariantsTemplate, argsData),
  parameters: { options: { showPanel: false }, controls: { disable: true } },
};
