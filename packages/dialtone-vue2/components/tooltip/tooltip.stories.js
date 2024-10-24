import { createRenderConfig } from '@/common/storybook_utils';
import DtTooltip from './tooltip.vue';
import DtTooltipFlipTemplate from './tooltip_flip.story.vue';
import DtTooltipDefault from './tooltip_default.story.vue';
import DtTooltipVariantsTemplate from './tooltip_variants.story.vue';
import DtTooltipChangeOnClick from './tooltip_change_on_click.story.vue';
import { action } from '@storybook/addon-actions';

import { TOOLTIP_DIRECTIONS, TOOLTIP_STICKY_VALUES } from './tooltip_constants';

// Default Prop Values
export const argsData = {
  message: 'This is a Tooltip',
  anchor: 'Hover over me to see a tooltip',
  default: `This is a simple tooltip. You can set the position of the tooltip using the placement prop!`,
  onShown: action('shown'),
  showTooltip: null,
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
  },

  appendTo: {
    control: {
      type: null,
    },
  },

  enabled: {
    type: 'boolean',
  },

  show: {
    control: {
      type: 'boolean',
    },
  },

  inverted: {
    type: 'boolean',
  },

  delay: {
    type: 'boolean',
  },

  transition: {
    type: 'boolean',
  },

  // Events
  showTooltip: {
    table: {
      disable: true,
    },
  },
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

export const Default = {
  render: (argsData) => createRenderConfig(DtTooltip, DtTooltipDefault, argsData),
  args: {},
};

export const Variants = {
  render: (argsData) => createRenderConfig(DtTooltip, DtTooltipVariantsTemplate, argsData),
  args: {},
  parameters: {
    options: { showPanel: false },
    controls: { disable: true },
    percy: {
      args: {
        showTooltip: true,
      },
    },
  },
};

export const Flip = {
  render: (argsData) => createRenderConfig(DtTooltip, DtTooltipFlipTemplate, argsData),
  args: {
    default: 'Scroll down to see how the tooltip changes based on the available space.',
  },

  parameters: {
    options: { showPanel: false },
    controls: { disable: true },
  },
};

export const ChangeOnClick = {
  render: (argsData) => createRenderConfig(DtTooltip, DtTooltipChangeOnClick, argsData),
  args: {
    anchor: 'Click to see the tooltip content change',
    sticky: 'popper',
  },
};
