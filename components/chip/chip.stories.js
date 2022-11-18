import { action } from '@storybook/addon-actions';
import { createTemplateFromVueFile, getIconNames } from '@/common/storybook_utils';
import DtChip from './chip';
import DtChipMdx from './chip.mdx';
import DtChipDefaultTemplate from './chip_default.story.vue';
import { CHIP_SIZE_MODIFIERS } from './chip_constants';

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
    control: {
      type: 'select',
      options: getIconNames(),
    },
    table: {
      type: { summary: 'VNode' },
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
    defaultValue: 'md',
    control: {
      type: 'select',
      options: Object.keys(CHIP_SIZE_MODIFIERS),
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

// Default Props for all variations
export const argsData = {
  onClose: action('close'),
  onClick: action('click'),
};

// Story Collection
export default {
  title: 'Components/Chip',
  component: DtChip,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
  parameters: {
    controls: {
      sort: 'requiredFirst',
    },
    docs: {
      page: DtChipMdx,
    },
    options: {
      showPanel: true,
    },
  },
};

// Templates
const Template = (args) => createTemplateFromVueFile(args, DtChipDefaultTemplate);

// Stories
export const Default = Template.bind({});
Default.args = {
  default: 'Chip',
  closeButtonProps: {
    ariaLabel: 'close',
  },
};

export const WithIcon = Template.bind({});
WithIcon.args = {
  ...Default.args,
  icon: 'lock-filled',
};

export const WithAvatar = Template.bind({});
WithAvatar.args = {
  ...Default.args,
  avatar: 'DP',
};

export const NonInteractive = Template.bind({});
NonInteractive.args = {
  ...Default.args,
  interactive: false,
  hideClose: true,
};
