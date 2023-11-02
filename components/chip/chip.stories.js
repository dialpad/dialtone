import { action } from '@storybook/addon-actions';
import { createTemplateFromVueFile, getIconNames } from '@/common/storybook_utils';
import DtChip from './chip.vue';

import DtChipDefaultTemplate from './chip_default.story.vue';
import DtChipVariantsTemplate from './chip_variants.story.vue';
import { CHIP_SIZE_MODIFIERS } from './chip_constants';

const iconsList = getIconNames();

export const argsData = {
  onClose: action('close'),
  onClick: action('click'),
  size: 'md',
  closeButtonProps: { ariaLabel: 'close' },
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

  icon: {
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

  avatar: {
    control: 'text',
    table: {
      type: {
        summary: 'VNode',
      },
    },
  },

  // Props
  hideClose: {
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
const DefaultTemplate = (args, { argTypes }) => createTemplateFromVueFile(args, argTypes, DtChipDefaultTemplate);

const VariantsTemplate = (args, { argTypes }) => createTemplateFromVueFile(args, argTypes, DtChipVariantsTemplate);

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
