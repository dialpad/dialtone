import { createTemplateFromVueFile } from '@/common/storybook_utils';
import DtTooltip from './tooltip';
import DtTooltipFlipTemplate from './tooltip_flip.story.vue';
import DtTooltipDefault from './tooltip_default.story';
import DtTooltipVariantsTemplate from './tooltip_variants';
import { action } from '@storybook/addon-actions';

import { TOOLTIP_DIRECTIONS, TOOLTIP_STICKY_VALUES } from './tooltip_constants';
import DtTooltipMdx from './tooltip.mdx';

// Default Prop Values
export const argsData = {
  message: 'This is a Tooltip',
  anchor: 'Hover over me to see a tooltip',
  default: `This is a simple tooltip. You can set the position of the tooltip using the placement prop!`,
  onShown: action('shown'),
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

  anchor: {
    name: 'anchor',
    control: 'text',
    table: {
      category: 'slots',
      type: {
        summary: 'VNode',
      },
    },
  },

  // Props
  id: {
    table: {
      defaultValue: {
        summary: 'generated unique ID',
      },
    },
  },
  placement: {
    control: {
      type: 'select',
      options: TOOLTIP_DIRECTIONS,
    },
  },
  sticky: {
    defaultValue: false,
    control: {
      type: 'select',
      options: TOOLTIP_STICKY_VALUES,
    },
    table: {
      defaultValue: {
        summary: 'false',
      },
    },
  },

  transition: {
    control: {
      type: 'select',
      options: ['', 'fade', 'pop', 'shake'],
    },
  },
  // Events
  onShown: {
    table: {
      disable: true,
    },
  },
  'update:show': {
    table: {
      disable: true,
    },
  },
  shown: {
    description: `emitted when tooltip is shown or hidden`,
    table: {
      type: {
        summary: 'boolean',
      },
    },
  },
};

// Story Collection
export default {
  title: 'Components/Tooltip',
  component: DtTooltip,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
  parameters: {
    controls: {
      sort: 'requiredFirst',
    },
    options: { showPanel: true },
    docs: {
      page: DtTooltipMdx,
    },
  },
};

// Templates
const TooltipFlipTemplate = (args, { argTypes }) =>
  createTemplateFromVueFile(args, argTypes, DtTooltipFlipTemplate);
const TooltipDefaultTemplate = (args, { argTypes }) => createTemplateFromVueFile(args, argTypes, DtTooltipDefault);
const TooltipVariantsTemplate = (args, { argTypes }) =>
  createTemplateFromVueFile(args, argTypes, DtTooltipVariantsTemplate);
// Stories

export const Default = TooltipDefaultTemplate.bind({});
Default.args = {};

export const Variants = TooltipVariantsTemplate.bind({});
Variants.args = {};
Variants.parameters = { controls: { disable: true }, actions: { disable: true }, options: { showPanel: false } };

export const Flip = TooltipFlipTemplate.bind({});
Flip.args = {
  default: 'Scroll down to see how the tooltip changes based on the available space.',
};
Flip.parameters = { controls: { disable: true }, actions: { disable: true }, options: { showPanel: false } };
