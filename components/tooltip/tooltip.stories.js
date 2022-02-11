import { createTemplateFromVueFile } from '@/common/storybook_utils';
import DtTooltip from './tooltip';
import DtTooltipFlipTemplate from './tooltip_flip.story.vue';
import DtTooltipDefault from './tooltip_default.story';
import DtTooltipVariantsTemplate from './tooltip_variants';
import { action } from '@storybook/addon-actions';

import { TOOLTIP_DIRECTIONS, TOOLTIP_HIDE_ON_CLICK_VARIANTS } from './tooltip_constants';
import DtTooltipMdx from './tooltip.mdx';

// Default Prop Values
export const argsData = {
  show: false,
  message: 'This is a Tooltip',
  anchor: 'Hover over me to see a tooltip',
  default: `This is a simple tooltip. The tooltip can be positioned in multiple areas too!`,
  onClose: action('update:show'),
};

export const argTypesData = {
  id: {
    table: {
      defaultValue: {
        summary: 'generated unique ID',
      },
    },
  },
  arrowDirection: {
    control: {
      type: 'select',
      options: TOOLTIP_DIRECTIONS,
    },
  },

  flip: {
    defaultValue: ['right', 'bottom'],
  },

  offset: {
    defaultValue: [0, 0],
  },

  hideOnClick: {
    type: 'select',
    options: TOOLTIP_HIDE_ON_CLICK_VARIANTS,
  },

  flipBoundary: {
    defaultValue: 'clippingParents',
  },
  transition: {
    control: {
      type: 'select',
      options: ['', 'fade', 'slide-down', 'pop', 'shake'],
    },
  },
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
  // Events
  'update:show': {
    description: `The tooltip will emit a "false" boolean value for this event when the \
user performs a tooltip-closing action. Parent components can sync on this value to create \
a 2-way binding to control tooltip visibility.`,
    table: {
      type: {
        summary: 'boolean',
      },
    },
  },
  onClose: {
    table: {
      disable: true,
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

export const Flip = TooltipFlipTemplate.bind({});
Flip.args = {};
