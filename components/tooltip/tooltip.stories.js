import { createTemplateFromVueFile } from '../storybook_utils';
import DtTooltip from './tooltip';
import DtTooltipMdx from './tooltip.mdx';
import DtTooltipDefaultTemplate from './tooltip_default.story.vue';
import DtTooltipVariantsTemplate from './tooltip_variants.story';
import { TOOLTIP_DIRECTION_MODIFIERS } from './tooltip_constants';

// Default Prop Values
export const argsData = {
  message: 'This is a Tooltip',
  anchor: 'Hover over me to see a tooltip',
  default: `This is a simple tooltip. The tooltip can be positioned in multiple areas too!`,
  show: true,
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
  show: {
    description: 'Used to show tooltip',
    control: 'boolean',
    table: {
      category: 'props',
      type: {
        summary: 'boolean',
      },
    },
  },
  arrowDirection: {
    control: {
      type: 'select',
      options: TOOLTIP_DIRECTION_MODIFIERS,
    },
  },
  id: {
    table: {
      defaultValue: {
        summary: 'generated unique ID',
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
    docs: {
      page: DtTooltipMdx,
    },
  },
};

// Templates
const DefaultTemplate = (args, { argTypes }) => createTemplateFromVueFile(args, argTypes, DtTooltipDefaultTemplate);
const VariantsTemplate = (args, { argTypes }) => createTemplateFromVueFile(args, argTypes, DtTooltipVariantsTemplate);

// Stories
export const Default = DefaultTemplate.bind({});
Default.args = {};

export const Variants = VariantsTemplate.bind({});
Variants.args = {};
