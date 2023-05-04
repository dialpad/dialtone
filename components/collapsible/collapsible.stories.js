import { DtCollapsible } from './';
import { createTemplateFromVueFile } from '@/common/storybook_utils';

import DtCollapsibleDefaultStory from './collapsible_default.story.vue';

export const argsData = {
  anchorText: 'Click me to toggle Content',
};

const argTypesData = {
  // Slots
  anchor: {
    control: 'text',
    table: {
      type: {
        summary: 'VNode',
      },
    },
  },
  content: {
    control: 'text',
    table: {
      type: {
        summary: 'VNode',
      },
    },
  },

  // Props
  anchorText: {
    description: 'Text on the anchor if slot is unused.',
    table: {
      type: { summary: 'string' },
    },
    control: {
      type: 'text',
    },
  },

  id: {
    table: {
      defaultValue: { summary: 'generated unique ID' },
    },
  },

  // Action Event Handlers
  opened: {
    description: 'Emitted whenever the content is collapsed or expanded.',
    table: {
      type: { summary: 'event' },
    },
  },
  'update:open': {
    table: {
      disable: true,
    },
  },
};

export default {
  title: 'Components/Collapsible',
  component: DtCollapsible,
  argTypes: argTypesData,
  args: argsData,
  excludeStories: /.Data$/,
};

// Templates
const DefaultTemplate = (args, { argTypes }) =>
  createTemplateFromVueFile(args, argTypes, DtCollapsibleDefaultStory);

export const Default = {
  render: DefaultTemplate,

  args: {
    maxWidth: '512px',
  },
};
