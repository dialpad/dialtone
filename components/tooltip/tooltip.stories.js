import { createTemplateFromVueFile } from '@/common/storybook_utils';
import DtTooltip from './tooltip.vue';
import DtTooltipFlipTemplate from './tooltip_flip.story.vue';
import DtTooltipDefault from './tooltip_default.story.vue';
import DtTooltipVariantsTemplate from './tooltip_variants.vue';
import { action } from '@storybook/addon-actions';

import { TOOLTIP_DIRECTIONS, TOOLTIP_STICKY_VALUES } from './tooltip_constants';

// Default Prop Values
export const argsData = {
  message: 'This is a Tooltip',
  anchor: 'Hover over me to see a tooltip',
  default: `This is a simple tooltip. You can set the position of the tooltip using the placement prop!`,
  sticky: false,
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
    options: TOOLTIP_DIRECTIONS,
    control: {
      type: 'select',
    },
  },
  sticky: {
    options: TOOLTIP_STICKY_VALUES,
    control: {
      type: 'select',
    },
    table: {
      defaultValue: {
        summary: 'false',
      },
    },
  },

  transition: {
    options: ['', 'fade', 'pop', 'shake'],
    control: {
      type: 'select',
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
};

// Templates
const TooltipFlipTemplate = (args, { argTypes }) =>
  createTemplateFromVueFile(args, argTypes, DtTooltipFlipTemplate);
const TooltipDefaultTemplate = (args, { argTypes }) =>
  createTemplateFromVueFile(args, argTypes, DtTooltipDefault);
const TooltipVariantsTemplate = (args, { argTypes }) =>
  createTemplateFromVueFile(args, argTypes, DtTooltipVariantsTemplate);

export const Default = {
  render: TooltipDefaultTemplate,
  args: {},
};

export const Variants = {
  render: TooltipVariantsTemplate,
  args: {},
  parameters: { options: { showPanel: false }, controls: { disable: true } },
};

export const Flip = {
  render: TooltipFlipTemplate,

  args: {
    default: 'Scroll down to see how the tooltip changes based on the available space.',
  },

  parameters: { options: { showPanel: false }, controls: { disable: true } },
};
