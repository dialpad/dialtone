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
  left: {
    control: 'text',
    table: {
      type: {
        summary: 'VNode',
      },
    },
  },
  right: {
    control: 'text',
    table: {
      type: {
        summary: 'VNode',
      },
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
};

// Set default values at the story level here.
export const argsData = {
  left: 'Left slot',
  right: 'Right slot',
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
const DefaultTemplate = (args) => createTemplateFromVueFile(
  args,
  DtItemLayoutDefaultTemplate,
);

// Stories
export const Default = {
  render: DefaultTemplate,
  args: {},
};
