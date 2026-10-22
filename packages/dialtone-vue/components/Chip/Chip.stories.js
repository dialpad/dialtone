import { action } from 'storybook/actions';
import { createTemplateFromVueFile, getIconNames } from '@/common/storybook_utils';
import DtChip from './Chip.vue';

import DtChipDefaultTemplate from './ChipDefault.story.vue';
import DtChipVariantsTemplate from './ChipVariants.story.vue';
import { CHIP_EMPHASIS_MODIFIERS, CHIP_SIZE_MODIFIERS, CHIP_VARIANT_MODIFIERS } from './ChipConstants';

const iconsList = getIconNames();

export const argsData = {
  onClose: action('close'),
  onClick: action('click'),
  size: 300,
  variant: 'default',
  emphasis: 'base',
  avatarSeed: '',
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

  startIcon: {
    options: iconsList,
    table: {
      type: { summary: 'VNode' },
    },
    control: {
      type: 'select',
      labels: {
        undefined: '(empty)',
      },
    },
  },

  endIcon: {
    options: iconsList,
    table: {
      type: { summary: 'VNode' },
    },
    control: {
      type: 'select',
      labels: {
        undefined: '(empty)',
      },
    },
  },

  icon: {
    table: {
      disable: true,
    },
  },

  avatar: {
    table: {
      disable: true,
    },
  },

  leading: {
    control: false,
    description: 'Freeform content at the start of the chip',
    table: {
      type: { summary: 'VNode' },
    },
  },

  trailing: {
    control: false,
    description: 'Freeform content at the end of the chip',
    table: {
      type: { summary: 'VNode' },
    },
  },

  // Props
  variant: {
    options: Object.keys(CHIP_VARIANT_MODIFIERS),
    control: {
      type: 'select',
    },
  },
  emphasis: {
    options: Object.keys(CHIP_EMPHASIS_MODIFIERS),
    control: {
      type: 'select',
    },
  },
  disabled: {
    control: {
      type: 'boolean',
    },
  },
  showClose: {
    control: 'boolean',
  },
  interactive: {
    control: 'boolean',
  },
  id: {
    table: {
      defaultValue: {
        summary: 'generated unique ID',
      },
    },
  },
  size: {
    options: Object.keys(CHIP_SIZE_MODIFIERS),
    control: {
      type: 'select',
    },
  },
  ariaLabel: {
    control: 'text',
    table: {
      type: {
        summary: 'VNode',
      },
    },
  },

  // Action Event Handlers
  onClick: {
    table: {
      disable: true,
    },
  },
  onClose: {
    table: {
      disable: true,
    },
  },
  keyup: {
    table: {
      disable: true,
    },
  },

  close: {
    description: 'Native chip close button event',
    table: {
      type: { summary: 'event' },
    },
  },

  click: {
    description: 'Native chip click event',
    table: {
      type: { summary: 'event' },
    },
  },
};

// Story Collection
export default {
  title: 'Components/Chip',
  component: DtChip,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
};

// Templates
const DefaultTemplate = (args, { argTypes }) =>
  createTemplateFromVueFile(args, argTypes, DtChipDefaultTemplate);
const VariantsTemplate = (args, { argTypes }) =>
  createTemplateFromVueFile(args, argTypes, DtChipVariantsTemplate);

export const Default = {
  render: DefaultTemplate,
  args: { default: 'Chip' },
};

export const Variants = {
  render: VariantsTemplate,

  parameters: {
    percy: {
      args: {
        avatarSeed: 'seed',
      },
    },
    options: { showPanel: false },
    controls: { disable: true },
  },
};
