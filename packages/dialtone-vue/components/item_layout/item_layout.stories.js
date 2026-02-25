import { createTemplateFromVueFile } from '@/common/storybook_utils';
import DtItemLayout from './item_layout.vue';
import DtItemLayoutDefaultTemplate from './item_layout_default.story.vue';

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
  bottom: {
    control: 'text',
    table: {
      type: {
        summary: 'VNode',
      },
    },
  },
  start: {
    control: 'text',
    table: {
      type: {
        summary: 'VNode',
      },
    },
  },
  left: {
    table: {
      disable: true,
    },
  },
  end: {
    control: 'text',
    table: {
      type: {
        summary: 'VNode',
      },
    },
  },
  right: {
    table: {
      disable: true,
    },
  },
  selected: {
    control: 'text',
    table: {
      type: {
        summary: 'VNode',
      },
    },
  },
  subtitle: {
    control: 'text',
    table: {
      type: {
        summary: 'VNode',
      },
    },
  },

  unstyled: {
    control: { type: 'boolean' },
  },

  startClass: {
    control: 'text',
  },
  leftClass: {
    table: {
      disable: true,
    },
  },
  endClass: {
    control: 'text',
  },
  rightClass: {
    table: {
      disable: true,
    },
  },
};

// Set default values at the story level here.
export const argsData = {
  start: 'Start slot',
  end: 'End slot',
  default: 'Default slot',
  subtitle: 'Subtitle slot',
  bottom: 'Bottom slot',
  selected: 'Selected slot',
};

// Story Collection
export default {
  title: 'Components/Item Layout',
  component: DtItemLayout,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
};

// Templates
const DefaultTemplate = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
  DtItemLayoutDefaultTemplate,
);

// Stories
export const Default = {
  render: DefaultTemplate,
  args: {},
};
